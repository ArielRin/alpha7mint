// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import dawgBattleAbi from './dawgBattleAbi.json'; // Adjust the import path as necessary
import { Box, Text } from '@chakra-ui/react';

const BATTLE_CONTRACT_ADDRESS = '0x0e96F3C42d594EBbfD0835d92FDab28014233182';

interface LeaderboardEntry {
  tokenId: number;
  timesWon: number;
  valueEarned: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchAllTokenStats = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
        let statsArray: LeaderboardEntry[] = [];

        for (let tokenId = 1; tokenId <= 70; tokenId++) {
          try {
            const stats = await contract.tokenStats(tokenId);
            statsArray.push({
              tokenId: tokenId,
              timesWon: stats.timesWon.toNumber(),
              valueEarned: ethers.utils.formatEther(stats.valueEarned),
            });
          } catch (error) {
            console.error(`Failed to fetch stats for tokenId ${tokenId}:`, error);
          }
        }

        statsArray.sort((a, b) => b.timesWon - a.timesWon);
        setLeaderboardData(statsArray.slice(0, 7)); // Top 7
      }
    };

    fetchAllTokenStats();
  }, []);

  return (
    <div className="leaderboard">
    <h2 style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '0px' }}></h2>

      {leaderboardData.map((data, index) => (
        <div className="leaderboard-entry" key={index}>
          <span style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold',  color: 'white', marginBottom: '0px' }} className="rank"> {index + 1}</span>

          <span className="token-id">Dawg #{data.tokenId}</span>
          <span className="times-won">Wins: {data.timesWon}</span>
          <span className="value-earned"> {data.valueEarned}BNB</span>
        </div>
      ))}
    </div>

  );
};

export default Leaderboard;
