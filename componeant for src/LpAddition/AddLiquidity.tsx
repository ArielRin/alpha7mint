import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Input, VStack, Box, Text, useToast } from '@chakra-ui/react';
import LiquidityManagerABI from './LiquidityManagerABI.json';
import tokenAbi from './tokenAbi.json';

function AddLiquidity() {
  const [tokenAmount, setTokenAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const contractAddress = '0xFFA5f15737Ed9C300a04e9356A0C9c2b693DBb27';
  const tokenAddress = '0x88CE0d545cF2eE28d622535724B4A06E59a766F0';
  const toast = useToast();

const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const signer = provider.getSigner();

  async function approveTokens() {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask is not detected.',
        description: 'Please install MetaMask to use this feature.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amountToApprove = ethers.utils.parseUnits(tokenAmount, 9); // Assuming the token has 9 decimals
      const tx = await tokenContract.approve(contractAddress, amountToApprove);
      await tx.wait();
      setIsApproved(true);
      toast({
        title: 'Token Approval',
        description: 'Tokens successfully approved for liquidity addition.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error approving tokens:', error);
      toast({
        title: 'Token Approval Failed',
        description: 'There was an error approving the tokens.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function addLiquidity() {
    try {
      const liquidityManager = new ethers.Contract(contractAddress, LiquidityManagerABI, signer);
      const overrides = {
        value: ethers.utils.parseUnits(ethAmount, 'ether'), // ETH amount for the transaction
        gasLimit: ethers.utils.hexlify(1000000), // Manually set gas limit to 1,000,000
      };
      const tx = await liquidityManager.addLiquidityETHAndSendBackLP(
        tokenAddress,
        ethers.utils.parseUnits(tokenAmount, 9),
        ethers.utils.parseUnits((Number(tokenAmount) * 0.8).toString(), 9),
        ethers.utils.parseUnits(ethAmount, 'ether'),
        overrides
      );
      await tx.wait();
      // Success handling here
    } catch (error) {
      // Error handling here
    }
  }


  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Add Liquidity</Text>
        <Input
          placeholder="Token Amount"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
        />
        <Input
          placeholder="ETH Amount"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
        <Button colorScheme="blue" onClick={approveTokens}>
          Approve Tokens
        </Button>
        <Button
          colorScheme="teal"
          onClick={addLiquidity}
          isDisabled={!isApproved}
        >
          Add shit
        </Button>
      </VStack>
    </Box>
  );
}

export default AddLiquidity;
