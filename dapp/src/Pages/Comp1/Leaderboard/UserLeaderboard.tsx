// Leaderboard.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Flex, Text } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json'; // Ensure this path is correct

const BATTLE_CONTRACT_ADDRESS = '0x6b9f10c6B8fA69EbA3d870B2e5002067244950f1';

interface LeaderboardEntry {
  address: string;
  wins: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchLeaderboardData = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

    setIsLoading(true);

    try {
      const completedBattleIds = await battleContract.getCompletedBattleIds();

      // Fetch details of all battles in parallel
      const battleDetailsPromises = completedBattleIds.map((id: string) => battleContract.battles(id));
      const battles = await Promise.all(battleDetailsPromises);

      const winsMap = new Map<string, number>();

      battles.forEach(battle => {
        const winnerAddress = battle.winnerAddress;
        if (winnerAddress && winnerAddress !== ethers.constants.AddressZero) {
          winsMap.set(winnerAddress, (winsMap.get(winnerAddress) || 0) + 1);
        }
      });

      const sortedLeaderboardData = Array.from(winsMap, ([address, wins]) => ({ address, wins }))
        .sort((a, b) => b.wins - a.wins);

      setLeaderboardData(sortedLeaderboardData);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchLeaderboardData();
}, []);


  return (
  <Box w="full"  p={0}  bg="black">
    <Text fontSize="2xl" pb={4} textAlign="center" fontWeight="bold" color="gray.200">User Leaderboard Tournament</Text>
    {isLoading ? (
      <Flex justify="center" alignItems="center" height="200px">
        <Text fontSize="lg" color="gray.500">Loading...</Text>
      </Flex>
    ) : (
      <>
        {leaderboardData.length > 0 ? (
          <Flex direction="column" gap="4">
            {leaderboardData.map((entry, index) => (
              <Box key={index} p={1} borderWidth="1px" borderRadius="md" borderColor="gray.100" bg="gray.800" shadow="sm">
                <Flex justify="space-between" align="center">
                <Box w="6%" textAlign="left">
                  <Text color="white" fontWeight="bold" fontSize="md">{index + 1}.</Text>
               </Box>
               <Box w="60%" textAlign="center">
                  <Text color="white" fontWeight="bold" fontSize="md">
                    {`${entry.address.substring(0, 2)}.....${entry.address.substring(entry.address.length - 6)}`}
                  </Text>
              </Box>
              <Box w="34%" p={2} textAlign="right">

                    <Text  fontWeight="bold" color="gray.100">Wins: {entry.wins}</Text>
              </Box>
                </Flex>
              </Box>
            ))}
          </Flex>
        ) : (
          <Flex justify="center" alignItems="center" height="200px">
            <Text fontSize="lg" color="gray.500">No battles completed yet.</Text>
          </Flex>
        )}
      </>
    )}
  </Box>
  );
};

export default Leaderboard;
