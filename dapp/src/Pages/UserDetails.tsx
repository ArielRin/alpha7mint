
//
//
//
//
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary
//
// const UserPage = () => {
//   return (
//     <Box>
//       <Text>User Page</Text>
//         <Text>User Page</Text>
//           <Text>User Page</Text>
//             <Text>User Page</Text>
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary
//       {/* Display connected wallet details here */}
//     </Box>
//   );
// };
//
// export default UserPage;
//
//
//
//
// // UserStats.tsx
// UserStats.tsx


import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Text } from '@chakra-ui/react';
import tokenAbi from './tokenAbi.json';

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

const UserStats: React.FC = () => {
  const [userAddress, setUserAddress] = useState('');
  const [alpha7TokenBalance, setAlpha7TokenBalance] = useState('0.0000');

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        // Fetch Alpha7 token balance
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
        const balance = await tokenContract.balanceOf(address);
        // Format the balance for a token with 9 decimals and then to 4 decimal places
        const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, 9)).toFixed(4);
        setAlpha7TokenBalance(formattedBalance);
      }
    };

    fetchWalletDetails();
  }, []);

  return (
    <Box>
      <Text fontSize="xl" mb="4">User Stats</Text>
      <Text mb="2">Connected Wallet Address: {userAddress}</Text>
      <Text mb="2">Alpha7 Token Balance: {alpha7TokenBalance}</Text>
 <YourActiveBattles /> 
    </Box>
  );
};

export default UserStats;
