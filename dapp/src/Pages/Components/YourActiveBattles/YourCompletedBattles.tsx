// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Box, Image, Text, Button, Flex, Spacer, Collapse, IconButton } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// const BATTLE_CONTRACT_ADDRESS = 'x0e96F3C42d594EBbfD0835d92FDab28014233182';
const BATTLE_CONTRACT_ADDRESS = '0xb816222825Fd38B715904B301044C7D767389Aa2';
import userRegistryAbi from './userRegistryAbi.json';

const USER_REGISTRY_CONTRACT_ADDRESS = "0x889aD5c66Bd0402EF1b672ca7E80b1caA7Ed5d62";



interface BattleDetails {
  id: number;
  initiatorTokenId: number;
  opponentTokenId: number;
  initiator: string;
  secondaryEntrant: string;
  startTime: string;
  battleValue: string;
  endTime: Date;
  countdown: string;
}

const YourComplatedBattles: React.FC = () => {
  const [activeBattles, setActiveBattles] = useState<BattleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [expandedBattleIds, setExpandedBattleIds] = useState<Record<number, boolean>>({});
  const [completedBattles, setCompletedBattles] = useState<BattleDetails[]>([]);
    const [ownedNFTs, setOwnedNFTs] = useState<number[]>([]);




    const fetchOwnedNFTs = async () => {
     if (userAddress && window.ethereum) {
       const provider = new ethers.providers.Web3Provider(window.ethereum);
       const contract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);

       try {
         const ownedTokenIds = await contract.listNFTs(userAddress);
         setOwnedNFTs(ownedTokenIds.map(id => id.toNumber()));
       } catch (error) {
         console.error("Failed to fetch owned NFTs:", error);
       }
     }
   };

   useEffect(() => {
     fetchOwnedNFTs();
   }, [userAddress]);

// ------------------------------------ //

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
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        setUserAddress(await signer.getAddress());
      }
    };

    fetchUserAddress();
  }, []);


  useEffect(() => {
  const fetchActiveBattleIds = async () => {
    if (userAddress && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      try {
        const roundDurationSeconds = (await contract.roundDuration()).toNumber() * 1000; // Convert to milliseconds
        const battleIds = await contract.getActiveBattleIds();

        const battlesPromises = battleIds.map(async (id) => {
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
   const getOverlayColor = (battle) => {
      if (!revealState[battle.id]?.isRevealed) {
        return "transparent"; // No color before reveal
      }
      return ownedNFTs.includes(battle.winnerTokenId) ? "rgba(0, 128, 0, 0.3)" : "rgba(255, 105, 180, 0.3)"; // Green for win, Pink for loss
    };
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

   const startBattleManually = async (battleId) => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

        try {
          const transaction = await contract.startBattleManually(battleId);
          await transaction.wait();
          console.log(`Battle ${battleId} finalized successfully`);
          // Refresh battles list or show a success message
        } catch (error) {
          console.error(`Error finalizing battle ${battleId}:`, error);
          // Show an error message
        }
      }
    };
        //-------------------//-----------------------//------------------------//
        const fetchCompletedBattlesByParticipant = async () => {
    if (userAddress && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      try {
        const completedBattleIds = await contract.getCompletedBattlesByParticipant(userAddress);
        const battleDetailsPromises = completedBattleIds.map(async (id) => {
          const details = await contract.getBattleDetails(id);

          return {
            id: details.id.toNumber(),
            initiatorTokenId: details.initiatorTokenId.toNumber(),
            opponentTokenId: details.secondaryTokenId.toNumber(),
            initiator: details.initiator,
            secondaryEntrant: details.secondaryEntrant,
            startTime: new Date(details.startTime.toNumber() * 1000).toLocaleString(),
            battleValue: ethers.utils.formatEther(details.totalValueInBattle),
            winnerTokenId: details.winnerTokenId.toNumber(), // Added winnerTokenId
            // Additional details can be added here if necessary
          };
        });

        const allCompletedBattles = await Promise.all(battleDetailsPromises);
        allCompletedBattles.sort((a, b) => b.id - a.id);
        setCompletedBattles(allCompletedBattles);
      } catch (error) {
        console.error("Failed to fetch completed battles:", error);
      }
    }
  };



          //-------------------//-----------------------//------------------------//
    const [revealState, setRevealState] = useState<Record<number, { isRevealed: boolean, countdown: number }>>(
      {} // This object will track the reveal state and countdown for each battle
    );


            //-------------------//-----------------------//------------------------//
            const handleRevealWinner = async (battleId, battleValue) => {
           setRevealState(prevState => ({
             ...prevState,
             [battleId]: { isRevealed: false, countdown: 3 } // Start countdown from 3 seconds
           }));

           // Countdown logic
           const intervalId = setInterval(() => {
             setRevealState(prevState => {
               if (prevState[battleId].countdown > 1) {
                 return { ...prevState, [battleId]: { ...prevState[battleId], countdown: prevState[battleId].countdown - 1 } };
               } else {
                 clearInterval(intervalId);
                 return { ...prevState, [battleId]: { ...prevState[battleId], isRevealed: true, countdown: 0 } }; // Reveal the winner
               }
             });
           }, 1000);
         };
                //-------------------//-----------------------//------------------------//
                    //-------------------//-----------------------//------------------------//
        useEffect(() => {
          if (userAddress) {
            fetchCompletedBattlesByParticipant();
          }
        }, [userAddress]);

            //-------------------//-----------------------//------------------------//
            //
            // <Box>
            //   <Text fontSize="2xl" fontWeight="bold" mb="4" color="white" textAlign="center">
            //     Your Completed Battles
            //   </Text>
            //   {completedBattles.length > 0 ? (
            //     <Flex direction="column" gap="4">
            //       {completedBattles.map((battle) => (
            //         <Box key={battle.id} borderWidth="1px" borderRadius="lg" p="2" bg="gray.100" _hover={{ bg: "gray.200" }}>
            //           {/* Render battle details similarly to active battles */}
            //         </Box>
            //       ))}
            //     </Flex>
            //   ) : (
            //     <Text>No completed battles found.</Text>
            //   )}
            // </Box>
            //
            //
            //
        return (
          <Box>
       <Text fontSize="2xl" fontWeight="bold" mb="4" color="white" textAlign="center">
         Your Completed Battles
       </Text>
       {completedBattles.length > 0 ? (
       <Flex direction="column" gap="4">
         {completedBattles.map((battle) => (
           <Box key={battle.id} borderWidth="1px" borderRadius="lg" p="2" bg="gray.100" position="relative">
             {/* Overlay Box */}
             {revealState[battle.id]?.isRevealed && (
               <Box
                 position="absolute"
                 top="0"
                 right="0"
                 bottom="0"
                 left="0"
                 bg={ownedNFTs.includes(battle.winnerTokenId) ? "rgba(0, 128, 0, 0.3)" : "rgba(255, 105, 180, 0.3)"}
                 borderRadius="lg"
                 pointerEvents="none"
               />
             )}
                    <Flex align="center">
                      <Text flex="1" textAlign="left">Battle: {battle.id}</Text>
                      <Image src={`/NFTDATA/Image/${battle.initiatorTokenId}.png`} width="55px" />
                      <Text flex="1" textAlign="left"># {battle.initiatorTokenId}</Text>
                      <Text flex="1" textAlign="left">VS</Text>

                      <Image src={`/NFTDATA/Image/${battle.opponentTokenId}.png`} width="55px" />
                      <Text flex="1" textAlign="left"># {battle.opponentTokenId}</Text>
                      <Text flex="1" textAlign="right">
                        Expand to revel Winner
                      </Text>
                      <IconButton
                        aria-label="Expand battle details"
                        icon={expandedBattleIds[battle.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        onClick={() => toggleExpandedBattle(battle.id)}
                      />
                    </Flex>
                    <Collapse in={expandedBattleIds[battle.id]}>
                      <Box p="4">
                        <Text>Initiator: #{battle.initiatorTokenId}</Text>
                        <Text>Opponent: #{battle.secondaryTokenId}</Text>
                        <Text>Value: {battle.battleValue} ETH</Text>
                        {!revealState[battle.id]?.isRevealed ? (
             <Button onClick={() => handleRevealWinner(battle.id, battle.battleValue)}>
               {revealState[battle.id]?.countdown > 0 ? `Revealing in ${revealState[battle.id].countdown}` : "Reveal Winner"}
             </Button>
            ) : (
              <>
                {ownedNFTs.includes(battle.winnerTokenId) ? (
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="green.500">Winner! You won the battle!</Text>
                ) : (
                  <Text fontSize="xl" fontWeight="bold" textAlign="center" color="red.500">Sorry, you lost. Better luck next time.</Text>
                )}
                <Text>Winning Token ID: #{battle.winnerTokenId}</Text>
              </>
            )}
          </Box>
                    </Collapse>
                    </Box>
              ))}
            </Flex>
          ) : (
            <Text>No active battles found.</Text>
          )}
        </Box>
        );

};

export default YourComplatedBattles;
