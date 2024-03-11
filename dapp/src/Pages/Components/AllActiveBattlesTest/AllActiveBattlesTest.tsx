// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Text, Flex } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json'; // Ensure this path is correct
import mainbackgroundImage from "./redbkg.png";


const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';

// Updated BattleDetails interface to include initiator and secondaryEntrant addresses
interface BattleDetails {
  id: number;
  initiatorTokenId: number;
  opponentTokenId: number;
  initiator: string; // Add initiator address
  secondaryEntrant: string; // Add secondary entrant address
  startTime: string;
  battleValue: string;
  initiatorComment: string;
  opponentComment: string;
}

const ActiveBattles: React.FC = () => {
  const [activeBattles, setActiveBattles] = useState<BattleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBattleIds = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

        try {
          const battleIds: ethers.BigNumber[] = await contract.getActiveBattleIds();
          const battlesPromises = battleIds.map(async (id: ethers.BigNumber) => {
            const battleDetails = await contract.getBattleDetails(id);
            return {
              id: id.toNumber(),
              initiatorTokenId: battleDetails.initiatorTokenId.toNumber(),
              opponentTokenId: battleDetails.secondaryTokenId.toNumber(),
              initiator: battleDetails.initiator, // Capture initiator address
              secondaryEntrant: battleDetails.secondaryEntrant, // Capture secondary entrant address
              startTime: new Date(battleDetails.startTime * 1000).toLocaleString(),
              battleValue: ethers.utils.formatEther(battleDetails.totalValueInBattle),
              initiatorComment: battleDetails.initiatorComment,
              opponentComment: battleDetails.secondaryEntrantComment
            };
          });
          const battles: BattleDetails[] = await Promise.all(battlesPromises);
          setActiveBattles(battles);
        } catch (error) {
          console.error("Failed to fetch active battles:", error);
        }

        setIsLoading(false);
      } else {
        console.error("Ethereum provider not found. Make sure you have MetaMask installed.");
        setIsLoading(false);
      }
    };

    fetchActiveBattleIds();
  }, []);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="4" textAlign="center">
        Active Battles
      </Text>
      {isLoading ? (
        <Text textAlign="center">Loading...</Text>
      ) : activeBattles.length > 0 ? (
        <Flex direction="column" gap="4">
          {activeBattles.map((battle, index) => (
            <Box key={index} p="4" borderWidth="1px" borderRadius="lg">
              <Text>Battle ID: {battle.id}</Text>
              <Text>Initiator: {battle.initiator}</Text>
              <Text>Initiator Token ID: {battle.initiatorTokenId}</Text>
              <Text>Secondary Entrant: {battle.secondaryEntrant}</Text>
              <Text>Opponent Token ID: {battle.opponentTokenId}</Text>
              <Text>Start Time: {battle.startTime}</Text>
              <Text>Battle Value: {battle.battleValue} ETH</Text>
              <Text>Initiator Comment: {battle.initiatorComment}</Text>
              <Text>Opponent Comment: {battle.opponentComment}</Text>
            </Box>
          ))}
        </Flex>
      ) : (
        <Text>No active battles found.</Text>
      )}
    </Box>
  );
};

export default ActiveBattles;
//
// <Box
//   flex={1}
//   p={0}
//
//   minH="650px"
//   display="flex"
//   flexDirection="column"
//   borderRadius="lg"
//   bg="rgba(31, 31, 31, 0.0)"
//   bgPosition="center"
//   bgRepeat="no-repeat"
//   bgSize="cover"
// >
//
//
// <Box
// >
//     {battleDetails.map((battle, index) => (
//       <Box
//
//       bgImage={`url(${redBkg})`}
//       bgPosition="center"
//       bgRepeat="no-repeat"
//       bgSize="cover"key={index} p="5" borderWidth="1px" borderRadius="lg" mb="5">
//         {/* First row: Battle ID */}
//         <img src={a7Logo} alt="Token Logo" style={{ width: "100px", margin: "0 auto", display: "block" }} />
//         <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Dawgz</Text>
//
//         <Text style={{ textAlign: 'center', fontSize: '26px', color: 'white', fontWeight: 'bold' }} mb="4">BattleID #{battle.battleId} </Text>
//
//
//         {/* Second row: Contestants and VS */}
//         <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
//           {/* Left contestant */}
//           <Box minH="270px" width="40%">
//             <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="160px" mx="auto" />
//             <Text style={{  textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.initiatorTokenId}</Text>
//             <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.initiatorComment}</Text>
//           </Box>
//
//           {/* VS */}
//           <Box width="10%" textAlign="center">
//             <Text style={{  fontSize: '48px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
//           </Box>
//
//           {/* Right contestant */}
//           <Box minH="270px" width="40%">
//             <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.secondaryTokenId}.png`} alt="Secondary NFT" boxSize="160px" mx="auto" />
//             <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.secondaryTokenId}</Text>
//             <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.secondaryEntrantComment}</Text>
//           </Box>
//         </Flex>
//
//         {/* Third to 6th row: Battle details */} {/* Check if timeRemaining is less than 1000 milliseconds (1 second) */}
//   {battle.timeRemaining < 1000 ? (
//     <p>Battle Now</p>
//   ) : (
//     <Text style={{ textAlign: 'center', fontSize: '18px', color: 'white', fontWeight: 'bold' }} mb="4"></Text>
//   )}
//         <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Prizes: {battle.totalValueInBattle} BNB</Text>
//         <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Winner of the battle will receive 93% of the battle value with 7% battle fees.</Text>
//
//         {/* 7th row: Buttons */}
//           <Flex mt="4" justifyContent="center"> {/* Adjusted justifyContent to "center" */}
//       {/*       <Button colorScheme="orange" onClick={() => handleMarkReady(battle.battleId)}>Mark Ready</Button>    */}
//         <Button colorScheme="green" onClick={() => handleStartBattleManually(battle.battleId)}>Finalise Battle</Button>
//
//       </Flex>
//       <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Who will become the AlphaDawg!</Text>
//
//       </Box>
//     ))}
//   </Box>
