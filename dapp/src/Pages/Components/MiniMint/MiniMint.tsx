import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Link, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import nftMintAbi from './nftMintAbi.json';
import './mintNftStyles.css';

const NFTMINT_CONTRACT_ADDRESS = '0xca695feb6b1b603ca9fec66aaa98be164db4e660';

function NftMint() {
    const { address } = useAccount();
    const isConnected = !!address;
    const toast = useToast();
    const [totalSupply, setTotalSupply] = useState(0);
    const [loading, setLoading] = useState(true);
    const [mintAmount, setMintQuantity] = useState(1);
    const [mintLoading, setMintLoading] = useState(false);
    const [tokenId, setTokenId] = useState(null);

    const contractConfig = {
        addressOrName: NFTMINT_CONTRACT_ADDRESS,
        contractInterface: nftMintAbi,
    };
    const { writeAsync: mint, error: mintError } = useContractWrite({
        ...contractConfig,
        functionName: 'mint',
    });

    const refreshInterval = 30000;

    useEffect(() => {
        const interval = setInterval(() => {
            fetchContractData();
        }, refreshInterval);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchContractData();
    }, []);

    async function fetchContractData() {
        try {
            const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.ninicoin.io/');
            const contract = new ethers.Contract(NFTMINT_CONTRACT_ADDRESS, nftMintAbi, provider);
            const supply = await contract.totalSupply();
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

    const onMintClick = async () => {
        try {
            setMintLoading(true);
            const totalPrice = ethers.utils.parseEther((mintAmount * 0.08).toString());
            const tx = await mint({ args: [mintAmount, { value: totalPrice }] });
            const receipt = await tx.wait();

            // Process receipt here to extract the tokenId
            // The logic will depend on your contract's event details

            toast({
                title: 'Mint Successful',
                description: `Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right'
            });
        } finally {
            setMintLoading(false);
        }
    };

    const addNftToWallet = async () => {
    if (!tokenId) return;

    try {
        if (window.ethereum && window.ethereum.isMetaMask) {
            // Use 'any' type to bypass TypeScript type checking for custom MetaMask method
            const ethereum = window.ethereum as any;
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC721',
                    options: {
                        address: NFTMINT_CONTRACT_ADDRESS,
                        symbol: "ALPHADAWGZ", // Replace with your token symbol
                        tokenId: tokenId, // Token ID to watch

                    },
                },
            });

            if (wasAdded) {
                toast({
                    title: 'NFT Added',
                    description: 'NFT added to your wallet!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right'
                });
            }
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to add NFT to wallet.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
        });
    }
};


    const maxSupply = 777;
    const remainingSupply = maxSupply - totalSupply;

  return (

      <div style={{ width: '330px', height: '360px',  backgroundColor: 'rgba(33, 33, 33, 0.7)', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div>
          <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
            {loading ? 'Loading...' : `Supply : ${totalSupply} / ${maxSupply}`}
          </Text>
          <Link isExternal href={`https://bscscan.com/token/${NFTMINT_CONTRACT_ADDRESS}`} className="contractaddr" style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginTop: '10px', color: 'white' }}>
            {NFTMINT_CONTRACT_ADDRESS}
          </Link>
        </div>
        {remainingSupply > 0 ? (
          <>
            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', color: 'white' }}>
              Priced at 0.08 BNB Each
            </Text>
            <Box marginTop='0' display='flex' alignItems='center' justifyContent='center'>
              <Button
                onClick={onMintClick}
                disabled={!isConnected || mintLoading || remainingSupply === 0}
                textColor='white'
                bg='#4656a3'
                _hover={{ bg: '#260c3f' }}
                marginTop='0'>
                Mint an AlphaDawg
              </Button>
            </Box>
          </>
        ) : (
          <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '20px', color: 'white' }}>
            Minting has Completed!
          </Text>
        )}
        {mintError && <Text color="white" mt="4">Error: {mintError.message}</Text>}

        {/* Add NFT to Wallet Button */}
        {tokenId && (
          <Button
            onClick={addNftToWallet}
            style={{ marginTop: '10px', color: 'white', backgroundColor: '#4656a3' }}>
            Add NFT to Wallet
          </Button>
        )}

      </div>
  );
}

export default NftMint;
