// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import dawgBattleAbi from './dawgBattleAbi.json'; // Adjust the import path as necessary
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // ABI for Dawg registration contract

import { Flex, Box, Text, Image } from '@chakra-ui/react';

const BATTLE_CONTRACT_ADDRESS = '0x0460eCB4cf623C83Ac066347de9F4Bf5A0A6495c';
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
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
    <div className="leaderboardtop">
      <h2 style={{ width: '100%', textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '0px' }}>
        Current AlphaDawg!
      </h2>

      {leaderboardData.length > 0 && (
        <Flex className="leaderboard-entry" align="center" justify="space-between" p="2" borderWidth="1px" borderRadius="md" mb="2">

          <Box w="55%" textAlign="center">
            <Image
              src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/NFTDATA/Image/${leaderboardData[0].tokenId}.png`}
              alt={`#${leaderboardData[0].tokenId}`}
              boxSize="100%"
              borderRadius="md"
            />
          </Box>
          <Box w="45%" textAlign="center">
            <Text fontSize="20px" fontWeight="bold" color="white">
              {`#${leaderboardData[0].tokenId}`}  {leaderboardData[0].dawgzName ? leaderboardData[0].dawgzName : 'Stray Dawg'}
            </Text>
          </Box>
        </Flex>
      )}
    </div>
  );
};

export default Leaderboard;
