// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Text, Flex } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json'; // Ensure this path is correct

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
