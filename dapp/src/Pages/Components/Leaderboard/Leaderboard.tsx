// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import dawgBattleAbi from './dawgBattleAbi.json'; // Adjust the import path as necessary
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // ABI for Dawg registration contract

import { Flex, Box, Text, Image } from '@chakra-ui/react';

const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';
const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7"; // Contract address

interface LeaderboardEntry {
  tokenId: number;
  timesWon: number;
  valueEarned: string;
  dawgzName: string | null;
  dawgzTaunt: string | null;
  imageUrl: string;
}


const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
  const fetchAllTokenStats = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
      const registrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);

      try {
        const promises = Array.from({ length: 200 }, async (_, i) => {
          const tokenId = i + 1;
          const stats = await battleContract.tokenStats(tokenId);
          const metadataUrl = `/NFTDATA/metadata/${tokenId}.json`;
          const response = await fetch(metadataUrl);
          const metadata = await response.json();

          const isRegistered = await registrationContract.isNFTRegistered(tokenId);
          let dawgzName = null;
          let dawgzTaunt = null;
          if (isRegistered) {
            dawgzName = await registrationContract.dawgzNames(tokenId);
            dawgzTaunt = await registrationContract.dawgzDefaultTaunts(tokenId);
          }

          return {
            tokenId,
            timesWon: stats.timesWon.toNumber(),
            valueEarned: ethers.utils.formatEther(stats.valueEarned),
            dawgzName,
            dawgzTaunt,
            imageUrl: metadata.imageUrl
          };
        });

        const statsArray = await Promise.all(promises);
        statsArray.sort((a, b) => b.timesWon - a.timesWon);
        setLeaderboardData(statsArray.slice(0, 7)); // Top 7
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
  };

  fetchAllTokenStats();
}, []);


    // Function to fetch individual NFT data
    const fetchNftData = async (tokenId: number) => {


        const metadataUrl = `/NFTDATA/metadata/${tokenId}.json`;
        const imageUrl = `/NFTDATA/Image/${tokenId}.png`;

        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        return {
            tokenId,
            imageUrl,
            name: metadata.name
        };
    };


  return (
    <div className="leaderboard">
    <h2 style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '0px' }}>
      Leaderboard
    </h2>

    {leaderboardData.map((data, index) => (
      <Flex className="leaderboard-entry" key={index} align="center" justify="space-between" p="2" borderWidth="1px" borderRadius="md" mb="2">
        <Box w="5%">
          <Text fontSize="20px" fontWeight="bold" color="white">
            {index + 1}
          </Text>
        </Box>
        <Box w="15%" textAlign="center">
          <Image
            src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/NFTDATA/Image/${data.tokenId}.png`}
            alt={`#${data.tokenId}`}
            boxSize="80px"
            borderRadius="md"
          />
        </Box>
        <Box w="30%" textAlign="left">
          <Text fontSize="20px" fontWeight="bold" color="white">
            {data.dawgzName ? data.dawgzName : 'Stray Dawg'}
          </Text>
        </Box>
        <Box w="20%" textAlign="right">
          <Text fontSize="20px" fontWeight="bold" color="white">
            Wins: {data.timesWon}
          </Text>
        </Box>
        <Box w="30%" textAlign="right">
          <Text fontSize="20px" fontWeight="bold" color="white">
            {parseFloat(data.valueEarned).toFixed(4)} BNB
          </Text>
        </Box>
      </Flex>
    ))}
  </div>

  );
};

export default Leaderboard;
