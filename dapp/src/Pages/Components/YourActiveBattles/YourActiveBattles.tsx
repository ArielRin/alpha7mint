// ActiveBattles.tsx

import React, { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { Box, Image, Text, Button, Flex, Spacer, Collapse, IconButton } from '@chakra-ui/react';
import dawgBattleAbi from './dawgBattleAbi.json';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import DawgRegistration from '../../Components/DawgRegistration/DawgRegistration'; // //


import a7Logo from './headerlogo.png';

// const BATTLE_CONTRACT_ADDRESS = 'x0e96F3C42d594EBbfD0835d92FDab28014233182';
const BATTLE_CONTRACT_ADDRESS = '0xb816222825Fd38B715904B301044C7D767389Aa2';


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



const ActiveBattles: React.FC = () => {
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


        //-------------------//-----------------------//------------------------//
        const backgroundStyle = {
          backgroundImage: `url(https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/Pages/Components/YourActiveBattles/redBkg.png)`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        };



        return (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb="4" color="white" textAlign="center">
              Your Active Battles
            </Text>
            {isLoading ? (
              <Text textAlign="center">Loading...</Text>
            ) : activeBattles.length > 0 ? (
              <Flex direction="column" gap="4">
                {activeBattles.map((battle) => (
                  <Box key={battle.id} borderWidth="1px" borderRadius="lg" p="2" bg="gray.100" _hover={{ bg: "gray.200" }}>
                    <Flex align="center">
                      <Text flex="1" textAlign="left">Battle: {battle.id}</Text>
                      <Image src={`/NFTDATA/Image/${battle.initiatorTokenId}.png`} width="55px" />
                      <Text flex="1" textAlign="left"># {battle.initiatorTokenId}</Text>
                      <Text flex="1" textAlign="left">VS</Text>

                      <Image src={`/NFTDATA/Image/${battle.secondaryTokenId}.png`} width="55px" />
                      <Text flex="1" textAlign="left"># {battle.secondaryTokenId}</Text>

                      <Text flex="1" textAlign="right">
                        Remaining: {battle.countdown}
                      </Text>
                      <IconButton
                        aria-label="Expand battle details"
                        icon={expandedBattleIds[battle.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        onClick={() => toggleExpandedBattle(battle.id)}
                      />
                    </Flex>
                    <Collapse in={expandedBattleIds[battle.id]}>

                    <Box
                    style={backgroundStyle}
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    bgSize="cover"p="5" borderWidth="1px" borderRadius="lg" mb="5">
                    <img src={a7Logo} alt="Token Logo" style={{ width: "100px", margin: "0 auto", display: "block" }} />
                    <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Dawgz</Text>

                    <Text style={{ textAlign: 'center', fontSize: '26px', color: 'white', fontWeight: 'bold' }} mb="4">Battle #{battle.id} </Text>


                    {/* Second row: Contestants and VS */}
                    <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
                      {/* Left contestant */}
                      <Box minH="270px" width="40%">
                        <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="160px" mx="auto" />
                        <Text style={{  textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.initiatorTokenId}</Text>
                      </Box>

                      {/* VS */}
                      <Box width="10%" textAlign="center">
                        <Text style={{  fontSize: '48px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
                      </Box>

                      {/* Right contestant */}
                      <Box minH="270px" width="40%">
                        <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.secondaryTokenId}.png`} alt="Secondary NFT" boxSize="160px" mx="auto" />
                        <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.secondaryTokenId}</Text>
                      </Box>
                    </Flex>

                    <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Winner of the battle will receive 93% of the battle value with 7% battle fees.</Text>

                    {/* 7th row: Buttons */}
                    <Text style={{ textAlign: 'center', fontSize: '26px', color: 'white', fontWeight: 'bold' }} flex="1" textAlign="center">
                      Remaining: {battle.countdown}
                    </Text>
                      <Flex mt="4" justifyContent="center"> {/* Adjusted justifyContent to "center" */}

                  {/*       <Button colorScheme="orange" onClick={() => handleMarkReady(battle.battleId)}>Mark Ready</Button>    */}
                    <Button colorScheme="green" >Finalise Battle</Button>

                  </Flex>
                  <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Who will become the AlphaDawg!</Text>




                  {/*     <Box p="4">
                        <Text>Initiator: #{battle.initiatorTokenId}</Text>
                        <Text>Opponent: #{battle.secondaryTokenId}</Text>
                        <Text>Value: {battle.battleValue} ETH</Text>
                        <Button
    colorScheme={new Date() > new Date(battle.endTime) ? "green" : "gray.500"}
    onClick={() => startBattleManually(battle.id)}
    isDisabled={new Date() <= new Date(battle.endTime)}
    color="white"
  >
    {new Date() > new Date(battle.endTime) ? "Finalize Battle" : "Battle Ongoing"}
  </Button>

                      </Box>
                        Additional details can be added here */}

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

export default ActiveBattles;

//
// <Box
// >
//     {battleDetails.map((battle, index) => (
//       <Box
//
//       bgImage={`url(${redBkg})`}
//       bgPosition="center"
//       bgRepeat="no-repeat"
//       bgSize="cover"key={index} p="5" borderWidth="1px" borderRadius="lg" mb="5">
//         {/* First row: Battle ID */}
//         <img src={a7Logo} alt="Token Logo" style={{ width: "100px", margin: "0 auto", display: "block" }} />
//         <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Dawgz</Text>
//
//         <Text style={{ textAlign: 'center', fontSize: '26px', color: 'white', fontWeight: 'bold' }} mb="4">BattleID #{battle.id} </Text>
//
//
//         {/* Second row: Contestants and VS */}
//         <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
//           {/* Left contestant */}
//           <Box minH="270px" width="40%">
//             <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="160px" mx="auto" />
//             <Text style={{  textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.initiatorTokenId}</Text>
//             <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.initiatorComment}</Text>
//           </Box>
//
//           {/* VS */}
//           <Box width="10%" textAlign="center">
//             <Text style={{  fontSize: '48px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
//           </Box>
//
//           {/* Right contestant */}
//           <Box minH="270px" width="40%">
//             <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.opponentTokenId}.png`} alt="Secondary NFT" boxSize="160px" mx="auto" />
//             <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.opponentTokenId}</Text>
//             <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.secondaryEntrantComment}</Text>
//           </Box>
//         </Flex>
//
//         {/* Third to 6th row: Battle details */} {/* Check if timeRemaining is less than 1000 milliseconds (1 second) */}
//   {battle.timeRemaining < 1000 ? (
//     <p>Battle Now</p>
//   ) : (
//     <Text style={{ textAlign: 'center', fontSize: '18px', color: 'white', fontWeight: 'bold' }} mb="4"></Text>
//   )}
//         <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Prizes: {battle.totalValueInBattle} BNB</Text>
//         <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Winner of the battle will receive 93% of the battle value with 7% battle fees.</Text>
//
//         {/* 7th row: Buttons */}
//           <Flex mt="4" justifyContent="center"> {/* Adjusted justifyContent to "center" */}
//       {/*       <Button colorScheme="orange" onClick={() => handleMarkReady(battle.battleId)}>Mark Ready</Button>    */}
//         <Button colorScheme="green" onClick={() => handleStartBattleManually(battle.battleId)}>Finalise Battle</Button>
//
//       </Flex>
//       <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Who will become the AlphaDawg!</Text>
//
//       </Box>
//     ))}
//   </Box>
//



//
//   return (
//     <Box>
//       <Text fontSize="2xl" fontWeight="bold" mb="4" textAlign="center">
//         Your Active Battles
//       </Text>
//       {isLoading ? (
//         <Text textAlign="center">Loading...</Text>
//       ) : activeBattles.length > 0 ? (
//         <Flex direction="column" gap="4">
//           {activeBattles.map((battle, index) => (
//             <Flex key={index} align="center" borderWidth="1px" borderRadius="lg" p="2" bg="gray.100" _hover={{ bg: "gray.200" }}>
//               <Text flex="1" textAlign="left">Battle ID: {battle.id}</Text>
//               <Spacer />
//               <Text flex="1" textAlign="center">Initiator: #{battle.initiatorTokenId}</Text>
//               <Spacer />
//               <Text flex="1" textAlign="center">Opponent: #{battle.opponentTokenId}</Text>
//               <Spacer />
//               <Text flex="1" textAlign="right">Value: {battle.battleValue} ETH</Text>
//             </Flex>
//           ))}
//         </Flex>
//       ) : (
//         <Text>No active battles found.</Text>
//       )}
//
//     </Box>
//   );
// };
//
// export default ActiveBattles;
