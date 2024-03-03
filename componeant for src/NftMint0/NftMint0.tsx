import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  Link,
  Container,
  useToast,
} from '@chakra-ui/react';

import { ethers } from 'ethers';

import Web3 from 'web3';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import nftMintAbi from './nftMintAbi.json';


const NFTMINT_CONTRACT_ADDRESS = '0xca695feb6b1b603ca9fec66aaa98be164db4e660';

const getExplorerLink = () => `https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`;

import './mintNftStyles.css';



function NftMint() {
  const account = useAccount();
  const toast = useToast();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mintAmount, setMintQuantity] = useState(1);
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const contractConfig = {
    addressOrName: NFTMINT_CONTRACT_ADDRESS,
    contractInterface: nftMintAbi,
  };
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const refreshInterval = 30000; // Refresh every 30 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      fetchContractData();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  const calculateTotalPrice = () => {
    const pricePerToken = 0.08;
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 80));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();
      const tx = await mint({ args: [mintAmount, { value: totalPrice }] });
      await tx.wait();
      toast({
        title: 'Mint Successful',
        description: `Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setMintLoading(false);
    }
  };

  async function fetchContractData() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc/');
      const contract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftMintAbi, provider);
      const name = await contract.name();
      const supply = await contract.totalSupply();
      setContractName(name);
      setTotalSupply(supply.toNumber());
    } catch (error) {
      console.error('Error fetching contract data:', error);
      toast({
        title: 'Data Fetch Error',
        description: 'There was an error fetching contract data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

  const maxSupply = 777;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <div className="wrapper" style={{
      color: 'white',
      backgroundSize: 'cover',

    }}>
      <div className="mainboxwrapper">
        <Container className="container" paddingY="0">
          <div>
            <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}`}
            </Text>
            <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
            </Text>
            <Link isExternal href={`https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              {NFTMINT_CONTRACT_ADDRESS}
            </Link>
            <Link isExternal href={`https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              View on Explorer
            </Link>
          </div>
          {remainingSupply > 0 ? (
            <>
              <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Mint at 0.08 BNB Each
              </Text>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                <Button
                  onClick={() => setMintQuantity(mintAmount - 1)}
                  disabled={mintAmount <= 1 || mintLoading || remainingSupply === 0}
                  textColor='white'
                  bg='#4656a3'
                  _hover={{ bg: '#260c3f' }}>
                  -
                </Button>
                <Text mx='4'>{mintAmount}</Text>
                <Button
                  onClick={() => setMintQuantity(mintAmount + 1)}
                  disabled={mintAmount >= remainingSupply || mintLoading}
                  textColor='white'
                  bg='#4656a3'
                  _hover={{ bg: '#260c3f' }}>
                  +
                </Button>
              </Box>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                onClick={onMintClick}
                disabled={!isConnected || mintLoading || remainingSupply === 0}
                textColor='white'
                bg='#4656a3'
                _hover={{ bg: '#260c3f' }}
                marginTop='4'>
                Mint Now
              </Button>
            </Box>
            </>
          ) : (
            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '20px' }}>
              Minting has Completed!
            </Text>
          )}
          {mintError && <Text color="red.500" mt="4">Error: {mintError.message}</Text>}
        </Container>
      </div>
    </div>
  );
}

export default NftMint;
