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
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mintAmount, setMintQuantity] = useState(1);
  const [mintLoading, setMintLoading] = useState(false);

  const contractConfig = {
    addressOrName: NFTMINT_CONTRACT_ADDRESS,
    contractInterface: nftMintAbi,
  };

  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
    args: [mintAmount],
    overrides: {
      value: ethers.utils.parseEther((0.08 * mintAmount).toString()), // Assuming 0.08 BNB per NFT
    },
  });

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchContractData = async () => {
    if (!window.ethereum) {
      toast({
        title: 'Error',
        description: 'Ethereum object not found, make sure you have MetaMask!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftMintAbi, provider);
      const supply = await contract.totalSupply();
      setTotalSupply(supply.toNumber());
    } catch (error) {
      toast({
        title: 'Error Fetching Data',
        description: 'There was an issue fetching data from the contract.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  };


  interface ContractError extends Error {
  data?: {
    message: string;
  };
}


  const onMintClick = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setMintLoading(true);
  try {
    const tx = await mint();
    await tx.wait();
    // ... [handle the successful mint case] ...
    fetchContractData(); // Refresh data after mint
  } catch (error: unknown) {
    console.error('Minting error:', error);
    // Use type assertion to treat the error as a ContractError
    const contractError = error as ContractError;
    const errorMessage = contractError.data ? contractError.data.message : 'An unknown error occurred.';
    toast({
      title: 'Minting Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setMintLoading(false);
  }
};

  const handleIncrement = () => {
    setMintQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setMintQuantity((prev) => Math.max(prev - 1, 1));
  };

  const maxSupply = 777;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <div >
      <div >
          <div>
            <Text className="pricecosthead" style={{color: 'white', textAlign: 'center', fontWeight: 'bolder' }}>
              AlphaDawgz NFTs Minting
            </Text>
            <Text className="totalSupply" style={{color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}`}
            </Text>
            <Text className="remainingSupply" style={{color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
            </Text>
            <Link isExternal href={`https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{color: 'white', display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              {NFTMINT_CONTRACT_ADDRESS}
            </Link>
            <Link isExternal href={`https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{color: 'white', display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>
              View on Explorer
            </Link>
          </div>
          {remainingSupply > 0 ? (
            <>
              <Text className="pricecost" style={{color: 'white', textAlign: 'center', fontWeight: 'bolder' }}>
                Mint at 0.08 BNB Each
              </Text>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                <Button
                  onClick={() => setMintQuantity(mintAmount - 1)}
                  disabled={mintAmount <= 1 || mintLoading || remainingSupply === 0}
                  textColor='white'
                  bg='#015f88'
                  _hover={{ bg: '#4656a3' }}>
                  -
                </Button>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bolder', marginTop: '20px' }} mx='4'>{mintAmount}</Text>
                <Button
                  onClick={() => setMintQuantity(mintAmount + 1)}
                  disabled={mintAmount >= remainingSupply || mintLoading}
                  textColor='white'
                  bg='#015f88'
                  _hover={{ bg: '#4656a3' }}>
                  +
                </Button>
              </Box>
              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                onClick={onMintClick}
                disabled={!isConnected || mintLoading || remainingSupply === 0}
                textColor='white'
                bg='#015f88'
                _hover={{ bg: '#4656a3' }}
                marginTop='4'>
                Mint Now
              </Button>
            </Box>
            </>
          ) : (
            <Text className="pricecost" style={{ color: 'white', textAlign: 'center', fontWeight: 'bolder', marginTop: '20px' }}>
              Minting has Completed!
            </Text>
          )}
          {mintError && <Text color="red.500" mt="4">Error: {mintError.message}</Text>}
      </div>
    </div>
  );
}

export default NftMint;
