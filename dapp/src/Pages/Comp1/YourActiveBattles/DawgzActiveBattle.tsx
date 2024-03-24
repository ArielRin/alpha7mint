import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Image, Text, Flex, Button } from '@chakra-ui/react';

import a7Logo from './headerlogo.png';
import dawgBattleAbi from './dawgBattleAbi.json';

const BATTLE_CONTRACT_ADDRESS = '0x0460eCB4cf623C83Ac066347de9F4Bf5A0A6495c';

interface BattleDetails {
  id: number;
  initiatorTokenId: number;
  secondaryTokenId: number;
  battleValue: string;
}

const ActiveBattles: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [battle, setBattle] = useState<BattleDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBattleForToken = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
      setIsLoading(true);

      try {
        const tokenIdNum = parseInt(tokenId || '0', 10);
        const activeBattleIds = await contract.getActiveBattleIds();

        for (let id of activeBattleIds) {
          const details = await contract.getBattleDetails(id);
          if (details.initiatorTokenId.toNumber() === tokenIdNum || details.secondaryTokenId.toNumber() === tokenIdNum) {
            setBattle({
              id: details.id.toNumber(),
              initiatorTokenId: details.initiatorTokenId.toNumber(),
              secondaryTokenId: details.secondaryTokenId.toNumber(),
              battleValue: ethers.utils.formatEther(details.totalValueInBattle)
            });
            break;
          }
        }
      } catch (error) {
        console.error("Failed to fetch battle details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBattleForToken();
  }, [tokenId]);


  const backgroundStyle = {
    backgroundImage: `url(https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/Pages/Components/YourActiveBattles/bwBkg.png)`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Set the background color to fully transparent
  };



  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!battle) {
    return <Text>No active battle found for token ID {tokenId}.</Text>;
  }

  return (
    <Box >
      <Text fontSize="2xl" fontWeight="bold" mb="4" color="white" textAlign="center">
        Your Active Battle
      </Text>
      <Box style={backgroundStyle} p="5" borderWidth="1px" borderRadius="lg" mb="5">
        <img src={a7Logo} alt="Token Logo" style={{ width: "180px", margin: "0 auto", display: "block" }} />
        <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">
          Battle Dawgz #{battle.id}
        </Text>
        <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
          {/* Left contestant */}
          <Box minH="270px" width="40%">
            <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="160px" mx="auto" />
            <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">
              Dawg #{battle.initiatorTokenId}
            </Text>
          </Box>

          {/* VS */}
          <Box width="10%" textAlign="center">
            <Text style={{ fontSize: '48px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
          </Box>

          {/* Right contestant */}
          <Box minH="270px" width="40%">
            <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.secondaryTokenId}.png`} alt="Secondary NFT" boxSize="160px" mx="auto" />
            <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">
              Dawg #{battle.secondaryTokenId}
            </Text>
          </Box>
        </Flex>

        <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">
          Winner of the battle will receive 93% of the battle value with 7% battle fees.
        </Text>

        <Button colorScheme="green">Finalise Battle</Button>
      </Box>
    </Box>
  );
};

export default ActiveBattles;
