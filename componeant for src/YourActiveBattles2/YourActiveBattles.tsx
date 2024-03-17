// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Text, Flex, Spacer } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json';

const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';

interface BattleDetails {
  id: number;
  initiatorTokenId: number;
  opponentTokenId: number;
  initiator: string;
  secondaryEntrant: string;
  startTime: string;
  battleValue: string;
}

const ActiveBattles: React.FC = () => {
  const [activeBattles, setActiveBattles] = useState<BattleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [battleDetails, setBattleDetails] = useState([]);


  useEffect(() => {
    const fetchUserAddress = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Cast window.ethereum to the expected type for Web3Provider
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      }
    };

    fetchUserAddress();
  }, []);

  useEffect(() => {
    const fetchActiveBattleIds = async () => {
      if (userAddress && typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

        try {
          const battleIds = await contract.getActiveBattleIds();
          const battlesPromises = battleIds.map(async (id: ethers.BigNumber) => {
            const battleDetails = await contract.getBattleDetails(id);
            return {
              id: id.toNumber(),
              initiatorTokenId: battleDetails.initiatorTokenId.toNumber(),
              opponentTokenId: battleDetails.secondaryTokenId.toNumber(),
              initiator: battleDetails.initiator,
              secondaryEntrant: battleDetails.secondaryEntrant,
              startTime: new Date(battleDetails.startTime * 1000).toLocaleString(),
              battleValue: ethers.utils.formatEther(battleDetails.totalValueInBattle),
            };
          });
          const battles = (await Promise.all(battlesPromises)).filter(battle => battle.initiator === userAddress || battle.secondaryEntrant === userAddress);
          setActiveBattles(battles);
        } catch (error) {
          console.error("Failed to fetch active battles:", error);
        }

        setIsLoading(false);
      }
    };

    if (userAddress) {
      fetchActiveBattleIds();
    }
  }, [userAddress]);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="4" textAlign="center">
        Your Active Battles
      </Text>
      {isLoading ? (
        <Text textAlign="center">Loading...</Text>
      ) : activeBattles.length > 0 ? (
        <Flex direction="column" gap="4">
          {activeBattles.map((battle, index) => (
            <Flex key={index} align="center" borderWidth="1px" borderRadius="lg" p="2" bg="gray.100" _hover={{ bg: "gray.200" }}>
              <Text flex="1" textAlign="left">Battle ID: {battle.id}</Text>
              <Spacer />
              <Text flex="1" textAlign="center">Initiator: #{battle.initiatorTokenId}</Text>
              <Spacer />
              <Text flex="1" textAlign="center">Opponent: #{battle.opponentTokenId}</Text>
              <Spacer />
              <Text flex="1" textAlign="right">Value: {battle.battleValue} ETH</Text>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Text>No active battles found.</Text>
      )}

    </Box>
  );
};

export default ActiveBattles;
