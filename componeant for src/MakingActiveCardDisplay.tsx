

import redBkg from './redBkg.png';
import a7Logo from './headerlogo.png';

// Your Active Battles Detailed


import React, { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";


import Web3 from "web3";
import tokenAbi from './tokenAbi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Link as ChakraLink,
  Flex,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Spacer,
  Tab,
  TabPanel,
  Input,
  Button,
  Text,
  Image,
  useToast,
  Collapse,
} from "@chakra-ui/react";


import redbkg from "./redBkg.png";
import mainbackgroundImage from "./bkg.png";
import tokenGif from "./token.gif";
import a7Logo from "./headerlogo.png";
import dawgImage from "./token.gif";
import MainTextLogo from "./headerlogo.png";



import { ethers } from 'ethers';

// import NftDetails from './Nft/NftDetails'; // Adjust the import path as needed

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // //

// ________________________________________________________________________________ //

const REFERRAL_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
import referralAbi from './tokenAbi.json';

const REFERRER_WALLET_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

// ________________________________________________________________________________ //


const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';
import a7Logo from './headerlogo.png';

const ActiveBattles: React.FC = () => {



  // #################################################################################################
  // #################################################################################################
  // #################################################################################################
    //BATTLE

    useEffect(() => {
      const fetchActiveBattles = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

        try {
          const activeBattleIds = await contract.getActiveBattleIds();
          const roundDurationSeconds = (await contract.roundDuration()).toNumber(); // Assuming roundDuration is returned in seconds
          const now = Date.now();

          const battlesPromises = activeBattleIds.map(async (id) => {
            const battleDetails = await contract.getBattleDetails(id);
            const startTimeMs = battleDetails.startTime.toNumber() * 1000; // Convert startTime to milliseconds
            const endTimeMs = startTimeMs + roundDurationSeconds * 1000; // Calculate endTime in milliseconds
            let timeRemaining = endTimeMs - now; // Calculate time remaining in milliseconds

            // Correcting for "NaN" and ensuring it displays "0" when timeRemaining is less than 1 second
            timeRemaining = isNaN(timeRemaining) ? 0 : Math.max(timeRemaining, 0);

            return {
              ...battleDetails,
              timeRemaining, // Add timeRemaining to the battle details
              displayTime: timeRemaining <= 1000 ? "Battle Now" : `${Math.floor(timeRemaining / 1000)} seconds`,
            };
          });

          const battles = await Promise.all(battlesPromises);
          setActiveBattles(battles);
        } catch (error) {
          console.error('Error fetching active battles:', error);
        }
      };

      fetchActiveBattles();
    }, []);


      // Update countdown every second
      useEffect(() => {
        const intervalId = setInterval(() => {
          setActiveBattles((currentBattles) =>
            currentBattles.map((battle) => ({
              ...battle,
              timeRemaining: Math.max(battle.timeRemaining - 1000, 0), // Decrement by 1000ms
            }))
          );
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
      }, []);





  // #################################################################################################


  // #################################################################################################
  // #################################################################################################

  useEffect(() => {
    const fetchActiveBattles = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      try {
        const activeBattles = await contract.getActiveBattleIds();
        const battlesDetailsPromises = activeBattles.map(async (battleId) => {
          const details = await contract.getBattleDetails(battleId);
          return {
            battleId: details.id.toNumber(),
            initiatorTokenId: details.initiatorTokenId.toNumber(),
            secondaryTokenId: details.secondaryTokenId.toNumber(),
            startTime: new Date(details.startTime.toNumber() * 1000).toLocaleString(),
            initiatorReady: details.initiatorReady,
            completed: details.completed,
            totalValueInBattle: ethers.utils.formatEther(details.totalValueInBattle),
            initiatorComment: details.initiatorComment, // Added initiator comment
            secondaryEntrantComment: details.secondaryEntrantComment, // Added secondary entrant comment
          };
        });
        const battlesDetails = await Promise.all(battlesDetailsPromises);
        setBattleDetails(battlesDetails);
      } catch (error) {
        console.error("Error fetching battle details:", error);
      }
    };

    fetchActiveBattles();
  }, []);
  // #################################################################################################


useEffect(() => {
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const getUserAddress = async () => {
    const accounts = await provider.listAccounts();
    if (accounts) setCurrentUser(accounts[0]);
  };

  getUserAddress();
}, []);

  // #################################################################################################


  // #################################################################################################
  // Function to mark the initiator as ready for a battle
  const handleMarkReady = async (battleId) => {
    try {
      // Ensure that there's an Ethereum provider (e.g., MetaMask) available
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        await provider.send("eth_requestAccounts", []); // Request account access if needed
        const signer = provider.getSigner(); // Get the signer to sign transactions

        // Create a new instance of the contract with a signer, which allows update methods
        const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

        // Call the markReady function from the contract
        const tx = await battleContract.markReady(battleId);
        await tx.wait(); // Wait for the transaction to be mined

        console.log("Transaction successful:", tx.hash);
        // Optionally, refresh the data on the page to reflect the change
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.error("Failed to mark ready:", error);
    }
  };

  // #################################################################################################
  const handleStartBattleManually = async (battleId) => {
  try {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider.send("eth_requestAccounts", []); // Request account access if needed
      const signer = provider.getSigner(); // Get the signer to sign transactions

      // Assuming you have your contract ABI and address
      const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

      // Call the startBattleManually function from the contract
      const tx = await battleContract.startBattleManually(battleId);
      await tx.wait(); // Wait for the transaction to be mined

      console.log("Battle started manually:", tx.hash);
      // Optionally, refresh the data on the page to reflect the change
    } else {
      console.error("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.error("Failed to start battle manually:", error);
  }
};

  // #################################################################################################


  // Assume you have a function to fetch the current battle price
  // This should be called where appropriate, possibly on component mount or modal open
  const fetchBattlePrice = async () => {
  if (!window.ethereum) return alert('Please install MetaMask.');

  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

  try {
    const price = await contract.entryFee();
    const priceInEther = ethers.utils.formatEther(price);
    setBattlePrice(priceInEther); // Update state with fetched price
  } catch (error) {
    console.error("Failed to fetch battle price:", error);
    alert('Failed to fetch battle price');
  }
};

  // #################################################################################################


  // #################################################################################################
  const enterBattle = async (tokenId, comment, battlePrice) => {
    if (!window.ethereum) return alert('Please install MetaMask.');

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

    try {
      // Convert battlePrice to the correct unit if necessary. Here it's assumed to be already in Wei.
      const tx = await contract.enterBattle(tokenId, comment, { value: battlePrice });
      await tx.wait();
      onClose(); // Close the modal upon successful transaction
      alert('Successfully entered the battle');
    } catch (error) {
      console.error("Failed to enter battle:", error);
      alert('Failed to enter battle. See console for details.');
    }
  };



  // #################################################################################################
  const onModalOpen = () => {
  fetchBattlePrice(); // Fetch current battle price
  onOpen(); // Open the modal
};

  // #################################################################################################


  useEffect(() => {
    const fetchAllTokenStats = async () => {
      // Create a provider and contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      // Fetch stats for each token
      let statsArray = [];
      for (let tokenId = 1; tokenId <= 70; tokenId++) {
        try {
          const stats = await contract.tokenStats(tokenId);
          statsArray.push({
            tokenId: tokenId,
            timesWon: stats.timesWon.toNumber(),
            valueEarned: ethers.utils.formatEther(stats.valueEarned)
          });
        } catch (error) {
          console.error(`Failed to fetch stats for tokenId ${tokenId}:`, error);
        }
      }

      // Sort and set the leaderboard state
      statsArray.sort((a, b) => b.timesWon - a.timesWon);
      setLeaderboardData(statsArray.slice(0, 7)); // Top 5
    };

    if (window.ethereum) {
      fetchAllTokenStats();
    }
  }, []); // The useEffect hook ends here



  // #################################################################################################



useEffect(() => {
  const fetchRoundDuration = async () => {
    // Fetch the round duration from the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
    const duration = await contract.roundDuration();
    setRoundDuration(duration.toNumber());
  };

  fetchRoundDuration();
}, []);

useEffect(() => {
  const fetchCompletedBattles = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

    // Fetch the array of completed battle IDs
    const completedBattleIds = await contract.getCompletedBattleIds();

    // Fetch details for each completed battle and construct an array of battle details
    const completedBattleDetailsPromises = completedBattleIds.map(async (battleId) => {
      const details = await contract.getBattleDetails(battleId);
      return {
        battleId: details.id.toNumber(),
        initiatorTokenId: details.initiatorTokenId.toNumber(),
        secondaryTokenId: details.secondaryTokenId.toNumber(),
        winner: details.initiatorTokenId.toNumber(), // You need to fetch the winner from the contract if it's available
        startTime: new Date(details.startTime.toNumber() * 1000).toLocaleString(),
        totalValueInBattle: ethers.utils.formatEther(details.totalValueInBattle),
        roundDuration: roundDuration, // Include the round duration
      };
    });
    const completedBattlesDetails = await Promise.all(completedBattleDetailsPromises);
    setCompletedBattles(completedBattlesDetails);
  };

  fetchCompletedBattles();
}, [roundDuration]);

// Now you can map over `completedBattles` to display them in your component



// Function to handle the reveal click
const handleRevealClick = (battleId) => {
  const updatedRevealedBattles = {...revealedBattles, [battleId]: true};
  setRevealedBattles(updatedRevealedBattles);

  // Update localStorage
  localStorage.setItem('revealedBattles', JSON.stringify(updatedRevealedBattles));
};

  // #################################################################################################

  // #################################################################################################







//Return i want to display


  return (



        <Box
          flex={1}
          p={0}

          minH="650px"
          display="flex"
          flexDirection="column"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.0)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >


        <Box
        >
            {battleDetails.map((battle, index) => (
              <Box

              bgImage={`url(${redBkg})`}
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"key={index} p="5" borderWidth="1px" borderRadius="lg" mb="5">
                {/* First row: Battle ID */}
                <img src={a7Logo} alt="Token Logo" style={{ width: "100px", margin: "0 auto", display: "block" }} />
                <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Dawgz</Text>

                <Text style={{ textAlign: 'center', fontSize: '26px', color: 'white', fontWeight: 'bold' }} mb="4">BattleID #{battle.battleId} </Text>


                {/* Second row: Contestants and VS */}
                <Flex direction="row" alignItems="center" justifyContent="space-between" mb="4">
                  {/* Left contestant */}
                  <Box minH="270px" width="40%">
                    <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.initiatorTokenId}.png`} alt="Initiator NFT" boxSize="160px" mx="auto" />
                    <Text style={{  textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.initiatorTokenId}</Text>
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.initiatorComment}</Text>
                  </Box>

                  {/* VS */}
                  <Box width="10%" textAlign="center">
                    <Text style={{  fontSize: '48px', color: 'white', fontWeight: 'bold' }} mb="4">VS</Text>
                  </Box>

                  {/* Right contestant */}
                  <Box minH="270px" width="40%">
                    <Image borderRadius="lg" src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/${battle.secondaryTokenId}.png`} alt="Secondary NFT" boxSize="160px" mx="auto" />
                    <Text style={{ textAlign: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' }} mb="4">Dawg #{battle.secondaryTokenId}</Text>
                    <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }} mb="4">{battle.secondaryEntrantComment}</Text>
                  </Box>
                </Flex>

                {/* Third to 6th row: Battle details */} {/* Check if timeRemaining is less than 1000 milliseconds (1 second) */}
          {battle.timeRemaining < 1000 ? (
            <p>Battle Now</p>
          ) : (
            <Text style={{ textAlign: 'center', fontSize: '18px', color: 'white', fontWeight: 'bold' }} mb="4"></Text>
          )}
                <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Battle Prizes: {battle.totalValueInBattle} BNB</Text>
                <Text style={{ textAlign: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }} mb="4">Winner of the battle will receive 93% of the battle value with 7% battle fees.</Text>

                {/* 7th row: Buttons */}
                  <Flex mt="4" justifyContent="center"> {/* Adjusted justifyContent to "center" */}
              {/*       <Button colorScheme="orange" onClick={() => handleMarkReady(battle.battleId)}>Mark Ready</Button>    */}
                <Button colorScheme="green" onClick={() => handleStartBattleManually(battle.battleId)}>Finalise Battle</Button>

              </Flex>
              <Text style={{ textAlign: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }} mb="4">Who will become the AlphaDawg!</Text>

              </Box>
            ))}
          </Box>

        <Box
          flex={1}
          p={0}
          m={2}
          minH="800px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
        <div className="good-dawgs-section" style={{ minHeight: '500px', marginTop: '0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' }}>

        <h2 style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '20px' }}>Good Dawgs</h2>
        {nfts.filter(nft => !nft.isInPound).map((nft, index) => (
          <div key={index} className="good-dawg-item" style={{
            padding: '20px',
            margin: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '15px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '200px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <img src={nft.metadata.image} alt={`NFT ${nft.tokenId}`} className="good-dawg-image" style={{ width: '100px', height: '100px', borderRadius: '10px', marginBottom: '10px' }} />
            <p className="good-dawg-name" style={{ color: 'white' }}>Name: {nft.metadata.name}</p>
            <Input
              className="good-dawg-comment-input"
              placeholder="Enter your taunt"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              size="sm"
              style={{ marginBottom: '10px', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            />
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => enterBattle(nft.tokenId, comment, "10000000000000")}
              style={{ background: 'blue', color: 'white', fontWeight: 'bold' }}
            >
              Enter Battle
            </Button>
          </div>
        ))}
      </div>

        </Box>

        </Box>
