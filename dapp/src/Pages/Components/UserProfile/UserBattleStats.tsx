// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { Box, Image, Text, Button, Flex, Spacer, Collapse, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';




// const BATTLE_CONTRACT_ADDRESS = 'x0e96F3C42d594EBbfD0835d92FDab28014233182';
const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';
import dawgBattleAbi from './dawgBattleAbi.json';


interface BattleDetails {
  id: number;
  initiatorTokenId: number;
  secondaryTokenId: number;  // Ensure this line is added
  initiator: string;
  secondaryEntrant: string;
  startTime: string;
  battleValue: string;
  endTime: Date;
  countdown: string;
}



const UserBattleStats: React.FC = () => {
  const [activeBattles, setActiveBattles] = useState<BattleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [expandedBattleIds, setExpandedBattleIds] = useState<Record<number, boolean>>({});

  const calculateTimeLeft = (endTime: Date) => {
    const now = new Date();
    const difference = endTime.getTime() - now.getTime();
    if (difference > 0) {
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${minutes}m ${seconds}s`;
    }
    return 'Battle Ended';
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (window.ethereum) {
const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        setUserAddress(await signer.getAddress());
      }
    };

    fetchUserAddress();
  }, []);


  useEffect(() => {
  const fetchActiveBattleIds = async () => {
    if (userAddress && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      try {
        const roundDurationSeconds = (await contract.roundDuration()).toNumber() * 1000; // Convert to milliseconds
        const battleIds = await contract.getActiveBattleIds();

        const battlesPromises = battleIds.map(async (id: BigNumber) => {
          const details = await contract.getBattleDetails(id);
          const endTime = new Date(details.startTime.toNumber() * 1000 + roundDurationSeconds);

          return {
            id: id.toNumber(),
            initiatorTokenId: details.initiatorTokenId.toNumber(),
            secondaryTokenId: details.secondaryTokenId.toNumber(),
            initiator: details.initiator,
            secondaryEntrant: details.secondaryEntrant,
            startTime: new Date(details.startTime.toNumber() * 1000).toLocaleString(),
            battleValue: ethers.utils.formatEther(details.totalValueInBattle),
            endTime,
            countdown: calculateTimeLeft(endTime)
          };
        });

        const allBattles = await Promise.all(battlesPromises);
        // Filter the battles to show only those involving the user
        const userBattles = allBattles.filter(battle => battle.initiator === userAddress || battle.secondaryEntrant === userAddress);
        setActiveBattles(userBattles);
      } catch (error) {
        console.error("Failed to fetch active battles:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (userAddress) {
    fetchActiveBattleIds();
  }
}, [userAddress, calculateTimeLeft]);


   //-------------------//-----------------------//------------------------//
      //-------------------//-----------------------//------------------------//
         //-------------------//-----------------------//------------------------//
            //-------------------//-----------------------//------------------------//
               //-------------------//-----------------------//------------------------//
                  //-------------------//-----------------------//------------------------//


  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveBattles((currentBattles) => currentBattles.map((battle) => ({
        ...battle,
        countdown: calculateTimeLeft(battle.endTime)
      })));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTimeLeft]);



     //-------------------//-----------------------//------------------------//


  const toggleExpandedBattle = (battleId: number) => {
  setExpandedBattleIds(prevState => ({
    ...prevState,
    [battleId]: !prevState[battleId]
  }));
};



   //-------------------//-----------------------//------------------------//
   const [stats, setStats] = useState({
     totalBattles: 0,
     totalValueSpent: 0,
     totalValueWon: 0,
     totalValueLost: 0,
     totalWins: 0,
     totalLosses: 0
   });

   const fetchStats = async () => {
  if (userAddress && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

    try {
      const fetchedStats = await contract.getCombinedUserStats(userAddress);
      setStats({
        totalBattles: fetchedStats.totalBattles.toNumber(),
        totalValueSpent: parseFloat(ethers.utils.formatUnits(fetchedStats.totalValueSpent, 'ether')),
        totalValueWon: parseFloat(ethers.utils.formatUnits(fetchedStats.totalValueWon, 'ether')),
        totalValueLost: parseFloat(ethers.utils.formatUnits(fetchedStats.totalValueLost, 'ether')),
        totalWins: fetchedStats.totalWins.toNumber(),
        totalLosses: fetchedStats.totalLosses.toNumber()
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }
};


   useEffect(() => {
     fetchStats();

     const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
     return () => clearInterval(interval);
   }, [userAddress]);

        //-------------------//-----------------------//------------------------//
        const backgroundStyle = {
          backgroundImage: `url(https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/Pages/Components/YourActiveBattles/redBkg.png)`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        };

        return (
            <Box  color="white" bg="rgba(0, 0, 0, 0.1)" minH="300px" p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>Your User Battle Stats</Text>
              <Text textAlign="right">Number of Battles: {stats.totalBattles}</Text>
              <Text textAlign="right">Total Value Spent (BNB): {Number(stats.totalValueSpent).toFixed(4)} </Text>
              <Text textAlign="right">Total Value Won (BNB): {Number(stats.totalValueLost).toFixed(4)} </Text>

            </Box>
          );
        };

        export default UserBattleStats;
