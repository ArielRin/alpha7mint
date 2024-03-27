// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { Box, Image, Text, Button, Flex, Spacer, Collapse, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import DawgRegistration from '../../Components/DawgRegistration/DawgRegistration'; // //


import a7Logo from './headerlogo.png';

// const BATTLE_CONTRACT_ADDRESS = 'x0e96F3C42d594EBbfD0835d92FDab28014233182';
const BATTLE_CONTRACT_ADDRESS = '0x6b9f10c6B8fA69EbA3d870B2e5002067244950f1';
import dawgBattleAbi from './dawgBattleAbi.json';

const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7"; // Contract address
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // ABI for Dawg registration contract



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
  isAwaitingChallenger: boolean;
  dawgzNameInitiator: string | null;
  dawgzTauntInitiator: string | null;
  dawgzNameSecondary: string | null;
  dawgzTauntSecondary: string | null;
  }



const AllActiveBattles: React.FC = () => {
  const [activeBattles, setActiveBattles] = useState<BattleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [expandedBattleIds, setExpandedBattleIds] = useState<Record<number, boolean>>({});



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


const calculateTimeLeft = (endTime: Date) => {
    if (!endTime) {
      return 'Time data unavailable';
    }

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
    const fetchActiveBattleIds = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
        const registrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);

        try {
          const roundDurationSeconds = (await battleContract.roundDuration()).toNumber() * 1000;
          const battleIds = await battleContract.getActiveBattleIds();

          const battlesPromises = battleIds.map(async (id: BigNumber) => {
            const details = await battleContract.getBattleDetails(id);
            const endTime = new Date(details.startTime.toNumber() * 1000 + roundDurationSeconds);

            // Fetch dawgzName and dawgzTaunt for both the initiator and secondary entrant
            const initiatorNamePromise = registrationContract.dawgzNames(details.initiatorTokenId);
            const initiatorTauntPromise = registrationContract.dawgzDefaultTaunts(details.initiatorTokenId);
            const secondaryNamePromise = registrationContract.dawgzNames(details.secondaryTokenId);
            const secondaryTauntPromise = registrationContract.dawgzDefaultTaunts(details.secondaryTokenId);

            // Determine if the battle is awaiting a second challenger
            const isAwaitingChallenger = details.secondaryTokenId.eq(0); // Assuming 0 means no second challenger

            // Await all promises simultaneously for efficiency
            const [initiatorName, initiatorTaunt, secondaryName, secondaryTaunt] = await Promise.all([
              initiatorNamePromise,
              initiatorTauntPromise,
              secondaryNamePromise,
              secondaryTauntPromise,
            ]);

            return {
              id: id.toNumber(),
              initiatorTokenId: details.initiatorTokenId.toNumber(),
              secondaryTokenId: details.secondaryTokenId.toNumber(),
              dawgzNameInitiator: initiatorName,
              dawgzTauntInitiator: initiatorTaunt,
              dawgzNameSecondary: secondaryName,
              dawgzTauntSecondary: secondaryTaunt,
              endTime,
              countdown: calculateTimeLeft(endTime),
              isAwaitingChallenger,
            };
          });

          const allBattles = await Promise.all(battlesPromises);
          setActiveBattles(allBattles);
        } catch (error) {
          console.error("Failed to fetch active battles:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchActiveBattleIds();
  }, [setActiveBattles, setIsLoading]);

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
const startBattleManually = async (battleId: number) => {
       if (window.ethereum) {
       try {
         setIsLoading(true);
         const provider = new ethers.providers.Web3Provider(window.ethereum as any);
         const signer = provider.getSigner();
         const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

         const tx = await battleContract.startBattleManually(battleId);
         await tx.wait();
       } catch (error) {
         console.error("Error starting battle manually:", error);
       } finally {
         setIsLoading(false);
       }
     }
   };


        //-------------------//-----------------------//------------------------//
        const backgroundStyle = {
          backgroundImage: `url(https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/Pages/Components/YourActiveBattles/redBkg.png)`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        };

        const backgroundImages = [
          'url(https://alpha7.live/Background/goldenbackground1.png)',
          'url(https://alpha7.live/Background/bluebackground.png)',
          'url(https://alpha7.live/Background/goldenbackground3.png)',
          'url(https://alpha7.live/Background/redbackground.png)',
          'url(https://alpha7.live/Background/greenbackground.png)',
        ];




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
          <Box>

            <Text fontSize="2xl" fontWeight="bold" mb="4" color="white" textAlign="center">
              All Active Battles
            </Text>
    {isLoading ? (
      <Text color="white" textAlign="center">Loading...</Text>
    ) : activeBattles.length > 0 ? (
      <Flex direction="row" wrap="wrap" justifyContent="space-around" marginTop="5px">
        {activeBattles.map((battle, index) => (
          <Box
             key={battle.id}
             minW="360px" // Set width to fit 3 cards in a row
             borderWidth="1px"
             borderRadius="lg"
             bg="rgba(83, 33, 36, 0.3)"
             _hover={{ bg: "rgba(117, 47, 47, 0.9)" }}
             m="2" // Margin for spacing between cards
             // Dynamically set the background image from the array
             style={{
               ...backgroundStyle, // Keep your existing styles
               backgroundImage: backgroundImages[index % backgroundImages.length], // Cycle through backgrounds
               backgroundSize: 'cover', // Ensure background covers the box
               backgroundPosition: 'center',
             }}
           >
             <Box
             p="5"

           bg="rgba(0, 0, 0, 0.6)"
           >
                    <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Dawgz #{battle.id}</Text>



                    {/* Second row: Contestants and VS */}
                    <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
                      {/* Left contestant */}
                      <Box minH="220px" width="45%">
                        <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="100px" mx="auto" />
                        <Text style={{ textAlign: 'center', fontSize: '20px', color: 'white', fontWeight: 'bold' }} mb="4">{battle.initiatorTokenId} {battle.dawgzNameInitiator}</Text>
                        <Text style={{ textAlign: 'center', fontSize: '18px', color: 'white', fontWeight: 'normal' }} mb="4">{battle.dawgzTauntInitiator}</Text>

                      </Box>

                      {/* VS */}
                      <Box width="10%" textAlign="center">
                        <Text style={{  fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
                      </Box>

                      {/* Right contestant */}
                      <Box minH="220px" width="45%">
                        <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.secondaryTokenId}.png`} alt="Secondary NFT" boxSize="100px" mx="auto" />
                        <Text style={{ textAlign: 'center', fontSize: '20px', color: 'white', fontWeight: 'bold' }} mb="4">{battle.secondaryTokenId} {battle.dawgzNameSecondary}</Text>
                        <Text style={{ textAlign: 'center', fontSize: '18px', color: 'white', fontWeight: 'normal' }} mb="4">{battle.dawgzTauntSecondary}</Text>

                      </Box>
                    </Flex>


                    {/* 7th row: Buttons */}
                    <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">
               Remaining: {
                 battle.isAwaitingChallenger ? "Awaiting Start" : // Check if awaiting challenger
                 new Date() > battle.endTime ? "Battle Ended" : // Check if the battle has ended
                 calculateTimeLeft(battle.endTime) // Otherwise, show countdown
               }
             </Text>





                               </Box>
                  </Box>
                ))}
              </Flex>
            ) : (
              <Text>No active battles found.</Text>
            )}
          </Box>
        );

};

export default AllActiveBattles;
