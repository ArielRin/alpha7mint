// add this to main app.tsx cheyne not here in app
//
// import AddLiquidity from './Components/LPButton/LpButton';
//

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Input, Box } from '@chakra-ui/react';

// Replace './lpButtonABI.json' with the actual path to your ABI file
import lpButtonABI from './lpButtonABI.json';

function SwapAndAddLiquidity() {
  const [ethAmount, setEthAmount] = useState('');
  const contractAddress = '0x9c9808249401E2db1211ee775656217f442362BB';

  async function handleSwapAndAddLiquidity() {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, lpButtonABI, signer);

    try {
      const tx = await contract.swapAndAddLiquidity({ value: ethers.utils.parseEther(ethAmount) });
      await tx.wait();
      alert('Liquidity added successfully!');
    } catch (error) {
      console.error('Error adding liquidity:', error);
      alert('Failed to add liquidity.');
    }
  }

  return (
    <Box p={4}>
      <Input
        placeholder="ETH Amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        type="number"
      />
      <Button
     marginTop='1'
     textColor='white'
     bg='#094da7'
      _hover={{
        bg: '#0b6be8'
        }}
       onClick={handleSwapAndAddLiquidity} mt={2}>
        Swap and Add Liquidity
      </Button>
    </Box>
  );
}

export default SwapAndAddLiquidity;
