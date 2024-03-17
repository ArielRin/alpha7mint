import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NFTPage from './NFTPage';
import HomePage from './HomePage';

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
  Link,
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
} from '@chakra-ui/react';

import Web3 from 'web3';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import mainbackgroundImage from './bkg.png';
import tokenGif from './token.gif';
import a7Logo from './headerlogo.png';
import dawgImage from './token.gif';

import battleAnimationGif from './battleAnimation.gif'; // Path to your animation GIF

import prisonBars from './prisonBars.png';
import redBkg from './redBkg.png';




import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xca695feb6b1b603ca9fec66aaa98be164db4e660';
const TOKEN_ADDRESS = '0x88CE0d545cF2eE28d622535724B4A06E59a766F0';

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://opensea.io/collection/aplha-dawgz-nft-collection`;
const getTofuNftURL = () => `https://tofunft.com/discover/items?contracts=98523`;


// #################################################################################################

  // Assuming the token's contract address and ABI are known
  const TOKEN_CONTRACT_ADDRESS = '0x88CE0d545cF2eE28d622535724B4A06E59a766F0'; // The address of the BEP20 token
  import tokenAbi from './tokenAbi.json'; // Import the token's ABI
// #################################################################################################
// #################################################################################################
// #################################################################################################
// deposit 14

import stake14Abi from './stake14Abi.json';
const STAKING_CONTRACT_ADDRESS = '0x5Bc7905f75244C67E2d8FfEcE4D33052682B4d68';


// #################################################################################################
// #################################################################################################
// #################################################################################################
// #################################################################################################

// TheDawgPound

import dawgPoundAbi from './dawgPoundAbi.json';
const POUND_CONTRACT_ADDRESS = '0x3cf4d5ef3cB24F061dEe1E75e4E0b47f99cb4a6E';


import dawgBattleAbi from './dawgBattleAbi.json';
const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D'; // v7_2_1_2

// #################################################################################################
// #################################################################################################
import NftMint0 from './Components/NftMint0/NftMint0';



function App() {

  const account = useAccount();
  const toast = useToast();
  const { address } = useAccount();
  const isConnected = !!address;
   const [web3, setWeb3] = useState(null);
   const [stakeAmount, setStakeAmount] = useState('');
   const [isApprovalPending, setIsApprovalPending] = useState(false);
   const [isApproved, setIsApproved] = useState(false);
   const [isWithdrawing, setIsWithdrawing] = useState(false);
   const [isEmergencyWithdrawing, setIsEmergencyWithdrawing] = useState(false);
   const [userStakedBalance, setUserStakedBalance] = useState(0);
   const [isClaiming, setIsClaiming] = useState(false);
   const [userAddress, setUserAddress] = useState('');
   const [userTokenBalance, setUserTokenBalance] = useState('0');
   const [unlockDate, setUnlockDate] = useState('');
   const [contractName, setContractName] = useState('');
   const [totalSupply, setTotalSupply] = useState(0);
   const [loading, setLoading] = useState(true);
   const [imgURL, setImgURL] = useState('');
   const [mintLoading, setMintLoading] = useState(false);
   const [mintedTokenId, setMintedTokenId] = useState(null);
   const [mintAmount, setMintQuantity] = useState(1);
   const [contractBalance, setContractBalance] = useState(0);

   const [newCost, setNewCost] = useState('');
   const [cost, setCost] = useState('0');
   const [isPaused, setIsPaused] = useState(false);
   const [isRevealed, setIsRevealed] = useState(false);
   const [apy, setApy] = useState(0);
   const [totalStaked, setTotalStaked] = useState(0);
   const [rewardsRemaining, setRewardsRemaining] = useState(0);
   const [lockedTokens, setLockedTokens] = useState(0);
   const [pendingRewards, setPendingRewards] = useState(0);
   const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');

   const [marketCap, setMarketCap] = useState('Loading...');
   const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');
   const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');
   const [nfts, setNfts] = useState([]);
   const [ownedNFTs, setOwnedNFTs] = useState([]);
   const [loadingNFTs, setLoadingNFTs] = useState(true);
   const [activeBattles, setActiveBattles] = useState<number[]>([]);
   const [battleDetails, setBattleDetails] = useState([]);
   const [currentUser, setCurrentUser] = useState("");
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [hoveredNft, setHoveredNft] = useState(null); // To track which NFT is being hovered
   const [comment, setComment] = useState(""); // To capture the taunt comment
   const [battlePrice, setBattlePrice] = useState(""); // To display current battle price
   const [leaderboardData, setLeaderboardData] = useState([]);
   const [showDetails, setShowDetails] = useState(false);
   const [revealedBattles, setRevealedBattles] = useState({});
   const [completedBattles, setCompletedBattles] = useState([]);
   const [roundDuration, setRoundDuration] = useState(0);




  // Approve Function

  const handleApprove = async () => {
    if (!stakeAmount) {
      toast({
        title: 'Error',
        description: 'Please enter an amount to approve.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsApprovalPending(true); // Set approval pending status to true

    try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);

      const amountToApprove = ethers.utils.parseUnits(stakeAmount, 9);
      const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amountToApprove);
      await tx.wait();

      setIsApproved(true); // Set approved status to true
      setIsApprovalPending(false); // Reset approval pending status

      toast({
        title: 'Approval Successful',
        description: `You've approved ${stakeAmount} tokens for staking.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setIsApprovalPending(false); // Reset approval pending status on error
      console.error('Approval failed:', error);
      toast({
        title: 'Approval Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Deposit Function
  const handleDeposit = async () => {
    if (!stakeAmount) {
      toast({
        title: 'Error',
        description: 'Please enter an amount to deposit.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stake14Abi, signer);

      const amountToDeposit = ethers.utils.parseUnits(stakeAmount, 9); // Adjusting for token's 9 decimal places
      const tx = await stakingContract.deposit(amountToDeposit);
      await tx.wait();

      toast({
        title: 'Deposit Successful',
        description: `You've successfully staked ${stakeAmount} tokens.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setStakeAmount(''); // Optionally reset stake amount
    } catch (error) {
      console.error('Deposit failed:', error);
      toast({
        title: 'Deposit Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // #################################################################################################
  // withdraw and emergency withdraw
  const { writeAsync: withdrawTokens } = useContractWrite({
    addressOrName: STAKING_CONTRACT_ADDRESS,
    contractInterface: stake14Abi,
    functionName: 'withdraw',
  });

  const { writeAsync: emergencyWithdrawTokens } = useContractWrite({
    addressOrName: STAKING_CONTRACT_ADDRESS,
    contractInterface: stake14Abi,
    functionName: 'emergencyWithdraw',
  });

  // withdraw 14


  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      const tx = await withdrawTokens();
      await tx.wait();
      toast.success('Withdrawal successful!');
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal unsuccessful. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // emergencyWithdraw


  const handleEmergencyWithdraw = async () => {
    try {
      setIsEmergencyWithdrawing(true);
      const tx = await emergencyWithdrawTokens();
      await tx.wait();
      toast.success('Emergency withdrawal successful!');
    } catch (error) {
      console.error('Emergency withdrawal failed:', error);
      toast.error('Emergency withdrawal unsuccessful. Please try again.');
    } finally {
      setIsEmergencyWithdrawing(false);
    }
  };

  // #################################################################################################
  const headerTextStyle = {
    fontSize: '28px', // Increased font size
    fontWeight: 'bold', // Make the text bolder
    color: '#f8f8ff', // Off-white color
  };


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// fetchUserStakedBalance


  const fetchUserStakedBalance = async () => {
  try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stake14Abi, provider);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const userInfo = await stakingContract.userInfo(userAddress);
    const userStakedAmount = ethers.utils.formatUnits(userInfo.amount, 9); // Adjust for your token's decimals
    setUserStakedBalance(parseFloat(userStakedAmount));
  } catch (error) {
    console.error('Failed to fetch user staked balance:', error);
  }
};

// _____________-----------______------__--_-_-_-_--_-_-_------__---_--_-_---___----_--_--_-_--_--
// _____________-----------______------__--_-_-_-_--_-_-_------__---_--_-_---___----_--_--_-_--_--
// _____________-----------______------__--_-_-_-_--_-_-_------__---_--_-_---___----_--_--_-_--_--
// _____________-----------______------__--_-_-_-_--_-_-_------__---_--_-_---___----_--_--_-_--_--
// _____________-----------______------__--_-_-_-_--_-_-_------__---_--_-_---___----_--_--_-_--_--


 // Fetch user's Ethereum address
 useEffect(() => {
   const fetchUserAddress = async () => {
     if (window.ethereum) {
         const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
       try {
         await provider.send('eth_requestAccounts', []);
         const signer = provider.getSigner();
         const address = await signer.getAddress();
         setUserAddress(address);
         fetchUserTokenBalance(address); // Fetch token balance as soon as we have the user's address
       } catch (error) {
         console.error('Error fetching user address:', error);
       }
     }
   };

   fetchUserAddress();
 }, []);

 // Fetch user's token balance
 const fetchUserTokenBalance = async (address) => {
   if (!address) return;
     const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
   const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
   try {
     const balance = await tokenContract.balanceOf(address);
     const formattedBalance = ethers.utils.formatUnits(balance, 9); // Token has 9 decimals
     setUserTokenBalance(formattedBalance);
   } catch (error) {
     console.error('Error fetching token balance:', error);
   }
 };

 // Fetch unlock date for staking
 useEffect(() => {
   const fetchUnlockDate = async () => {
     if (!userAddress) return;
       const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
     const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stake14Abi, provider);
     try {
       const unlockTime = await stakingContract.holderUnlockTime(userAddress);
       const date = new Date(unlockTime.toNumber() * 1000).toLocaleString();
       setUnlockDate(date);
     } catch (error) {
       console.error('Error fetching unlock date:', error);
       setUnlockDate('Error fetching date');
     }
   };

   fetchUnlockDate();
 }, [userAddress]); // Depend on userAddress to refetch when it changes


  // #################################################################################################
    // #################################################################################################
      // #################################################################################################




   // Function to claim rewards
   const claimRewards = async () => {
     if (window.ethereum) {
       try {
         setIsClaiming(true); // Disable the button

           const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
         await provider.send('eth_requestAccounts', []); // Request account access
         const signer = provider.getSigner();
         const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stake14Abi, signer);

         const claimTx = await stakingContract.claimReward(); // No arguments assuming claimReward() does not require them
         await claimTx.wait(); // Wait for the transaction to be mined

         alert('Rewards claimed successfully!');
       } catch (error) {
         console.error('Error claiming rewards:', error);
         alert('Failed to claim rewards. See console for more details.');
       } finally {
         setIsClaiming(false); // Re-enable the button
       }
     } else {
       alert('Ethereum wallet is not connected. Please install MetaMask or connect your wallet.');
     }
   };


     // #################################################################################################
       // #################################################################################################
         // #################################################################################################


  //mint section functions


  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });


  const { writeAsync: pauseContract, error: pauseError } = useContractWrite({
    ...contractConfig,
    functionName: 'pause',
  });


    const calculateTotalPrice = () => {
      const pricePerToken = parseFloat(cost);
      return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
    };


    const maxSupply = 777;
    const remainingSupply = maxSupply - totalSupply;
// ########################################################################
// ########################################################################
// ########################################################################
// ########################################################################

  const { writeAsync: setNewCostFn, error: setNewCostError } = useContractWrite({
  ...contractConfig,
  functionName: 'setCost',
  });

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 100));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait();
      toast.success('Mint successful! You can view your NFT soon.');
    } catch (error) {
      console.error(error);
      toast.error('Mint unsuccessful! Please try again.');
    } finally {
      setMintLoading(false);
    }
  };



  const onSetCostClick = async () => {
    try {
      // Convert the new cost value to Wei
      const newCostValueInWei = ethers.utils.parseUnits(newCost.toString(), 'wei');

      // Call the setCost function in the contract
      const tx = await setNewCostFn({
        args: [newCostValueInWei],
      });

      await tx.wait();
      toast.success('Cost updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update cost. Please try again.');
    }
  };

  const onTogglePauseClick = async () => {
    try {
      // Toggle the pause state
      const newState = !isPaused;

      // Call the pause function in the contract
      const tx = await pauseContract({
        args: [newState],
      });

      await tx.wait();
      toast.success(`Contract is now ${newState ? 'paused' : 'resumed'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle pause state. Please try again.');
    }
  };










  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
        const name = await contract.name();
        const supply = await contract.totalSupply();
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, []);


  useEffect(() => {
    async function fetchContractBalance() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the balance directly from the contract address
        const balance = await provider.getBalance(CONTRACT_ADDRESS);

        // Convert BigNumber to number before setting the state
        setContractBalance(balance.toNumber());
      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    }

    fetchContractBalance();
  }, []);


  useEffect(() => {
  async function fetchCost() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the cost value directly from the contract
      const costValue = await contract.cost();

      // Convert Wei to Ether and set the state
      setCost(ethers.utils.formatEther(costValue));
    } catch (error) {
      console.error('Error fetching cost:', error);
    }
  }

  fetchCost();
  }, []);


  useEffect(() => {
  async function fetchPauseStatus() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the paused status directly from the contract
      const pausedStatus = await contract.paused();

      setIsPaused(pausedStatus);
    } catch (error) {
      console.error('Error fetching paused status:', error);
    }
  }

  fetchPauseStatus();
  }, []);


  useEffect(() => {
    async function fetchRevealStatus() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the revealed status directly from the contract
        const revealedStatus = await contract.revealed();

        setIsRevealed(revealedStatus);
      } catch (error) {
        console.error('Error fetching revealed status:', error);
      }
    }

    fetchRevealStatus();
  }, []);



  const { writeAsync: revealCollection, error: revealError } = useContractWrite({
    ...contractConfig,
    functionName: 'reveal',
  });

  const onRevealClick = async () => {
    try {
      // Check if the collection is already revealed
      if (isRevealed) {
        toast.info('Collection is already revealed!');
        return;
      }

      // Call the reveal function in the contract
      const tx = await revealCollection();

      await tx.wait();
      toast.success('Collection revealed successfully!');
      setIsRevealed(true); // Update the local state to reflect that the collection is revealed
    } catch (error) {
      console.error(error);
      toast.error('Failed to reveal collection. Please try again.');
    }
  };




  //
  // Function to handle adding token to MetaMask
  const handleAddToken = async () => {
  if (window.ethereum) {
    try {
      // MetaMask request to watch the asset
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Use 'ERC721' for NFTs
          options: {
            address: TOKEN_ADDRESS, // The address that the token is at
            symbol: 'ALPHA7', // A ticker symbol or shorthand, up to 5 characters
            decimals: 9, // The number of decimals in the token
            image: tokenLogo, // A string url of the token logo
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('MetaMask is not installed!');
  }
  };



    // #################################################################################################
    // #################################################################################################
// 14 day staking reads




useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stake14Abi, provider);
    const userAddress = (await provider.listAccounts())[0]; // Assumes the user's wallet is connected

    const apyValue = await stakingContract.apy();
    const totalStakedValue = await stakingContract.totalStaked();
    const rewardsRemainingValue = await stakingContract.rewardsRemaining();
    const userInfoValue = await stakingContract.userInfo(userAddress);

    // Formatting values with 9 decimals and then converting to Number to use toFixed for 2 decimal places
    setApy(apyValue.toString());
    setTotalStaked(Number(ethers.utils.formatUnits(totalStakedValue, 9)).toFixed(2));
    setRewardsRemaining(Number(ethers.utils.formatUnits(rewardsRemainingValue, 9)).toFixed(2));
    setLockedTokens(Number(ethers.utils.formatUnits(userInfoValue.amount, 9)).toFixed(2));
    setPendingRewards(Number(ethers.utils.formatUnits(userInfoValue.rewardDebt, 9)).toFixed(2));

    // Assuming unlock date is calculated from APY or another contract call
    // This is a placeholder for actual calculation/logic
    setUnlockDate('No Locks Found ');
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};




  // #################################################################################################


  // ... (existing useEffect hooks)

  // Fetch Market Cap and Total Reserve data
  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${TOKEN_ADDRESS}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.attributes) {
          if (data.data.attributes.fdv_usd) {
            const fdvUsd = data.data.attributes.fdv_usd;
            setMarketCap(`${parseFloat(fdvUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
          } else {
            setMarketCap('Market Cap not available');
          }

          if (data.data.attributes.total_reserve_in_usd) {
            const reserveUsd = data.data.attributes.total_reserve_in_usd;
            setTotalReserveInUSD(`${parseFloat(reserveUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
          } else {
            setTotalReserveInUSD('Total Reserve not available');
          }
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
      });
  }, []);
    // ##############################################################
// token price
useEffect(() => {
  const fetchTokenPriceUSD = async () => {
    const tokenAddress = '0x88ce0d545cf2ee28d622535724b4a06e59a766f0'; // Token address
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${tokenAddress}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const priceUSD = data.data.attributes.price_usd;
      if (priceUSD) {
        setTokenPriceUSD(`${parseFloat(priceUSD).toFixed(9)} USD`); // Format the price to 6 decimal places and add USD suffix
      } else {
        setTokenPriceUSD('Price not available');
      }
    } catch (error) {
      console.error('Error fetching token price:', error);
      setTokenPriceUSD('Error fetching price');
    }
  };

  fetchTokenPriceUSD();
}, []); // Empty dependency array ensures this runs once on component mount

    // ##############################################################


      // ##############################################################
      // ##############################################################


  useEffect(() => {
    if (totalReserveInUSD !== 'Loading...' && totalReserveInUSD !== 'Total Reserve not available' && totalReserveInUSD !== 'Error fetching data') {
      // Extract the number from the formatted currency string
      const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
      const liquidityValue = reserveValue * 2;
      setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
    }
  }, [totalReserveInUSD]); // Dependency on totalReserveInUSD




  // #################################################################################################
  // Assuming tokenPriceUSD is a string like "0.123456 USD"
  const pricePer100kTokens = () => {
    // Remove " USD" and convert to number
    const pricePerToken = parseFloat(tokenPriceUSD.replace(' USD', ''));

    if (!isNaN(pricePerToken)) {
      const totalCost = pricePerToken * 100000000; // Calculate total cost for 100,000 tokens
      return totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Format as USD currency
    } else {
      return tokenPriceUSD; // Return original string if conversion is not possible
    }
  };



  // #################################################################################################
  const calculateTVL = () => {
  const pricePerToken = parseFloat(tokenPriceUSD.replace(' USD', ''));
  const totalStakedTokens = parseFloat(totalStaked); // Assuming totalStaked is a string that can be converted to a number

  if (!isNaN(pricePerToken) && !isNaN(totalStakedTokens)) {
    const tvl = pricePerToken * totalStakedTokens; // Calculate TVL
    return tvl.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Format as USD currency
  } else {
    return 'Calculating...'; // Return this string if conversion is not possible or data is still loading
  }
};

const formatTokenPrice = (price) => {
  const priceNum = parseFloat(price);
  if (!isNaN(priceNum)) {
    // Separate the integer part and the fractional part
    const parts = price.split('.');
    const integerPart = parts[0];
    const fractionalPart = parts[1].substring(0, 1); // Take only the first digit
    const remainingFraction = parts[1].substring(1); // Take the remaining fraction

    return (
      <span className="token-price">
        {integerPart}.
        <span className="token-price-fraction">{fractionalPart}</span>
        <sub className="token-price-exponent">{remainingFraction}</sub>
      </span>
    );
  } else {
    return 'Invalid Price';
  }
};







const calculateTokenValueInUSD = () => {
  // Remove any non-numeric characters (like " USD") and parse to float
  const balance = parseFloat(userTokenBalance);
  const pricePerToken = parseFloat(tokenPriceUSD.replace(' USD', ''));

  if (!isNaN(balance) && !isNaN(pricePerToken)) {
    // Calculate total value
    const totalValue = balance * pricePerToken;
    // Format as USD currency
    return totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  } else {
    return 'Calculating...'; // Return this string if conversion is not possible or data is still loading
  }
};


  // #################################################################################################

  useEffect(() => {
   async function fetchNFTs() {
     if (!address) return;

     const web3 = new Web3(window.ethereum);
     const nftContract = new web3.eth.Contract(abiFile, CONTRACT_ADDRESS);
     const poundContract = new web3.eth.Contract(dawgPoundAbi, POUND_CONTRACT_ADDRESS);

     try {
       const tokenIds = await nftContract.methods.walletOfOwner(address).call();
       const nftsData = await Promise.all(tokenIds.map(async (tokenId) => {
         try {
           const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
           const response = await fetch(tokenURI);
           const metadata = await response.json();
           const isInPound = await poundContract.methods.poundStatus(tokenId).call();
           return { tokenId, metadata, isInPound: isInPound.isInPound }; // Adjusted to access the specific property

         } catch (error) {
           console.error(`Failed to fetch data for tokenId ${tokenId}:`, error);
           return null;
         }
       }));

       // Filter out any null values
       setNfts(nftsData.filter(nft => nft !== null));
     } catch (error) {
       console.error('Failed to fetch NFTs:', error);
     }
   }

   fetchNFTs();
 }, [address]);



  useEffect(() => {
    // Initialize provider and signer
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const signer = provider.getSigner();

    // Initialize the poundContract with signer to perform transactions
    const poundContract = new ethers.Contract(POUND_CONTRACT_ADDRESS, dawgPoundAbi, signer);

    async function fetchPoundStatus(tokenId) {
      try {
        // Now poundContract is accessible here
        const { isInPound } = await poundContract.poundStatus(tokenId);
        console.log(`Token ID: ${tokenId}, isInPound: ${isInPound}`);
      } catch (error) {
        console.error(`Error fetching pound status for tokenId ${tokenId}:`, error);
      }
    }

    // Call fetchPoundStatus for a specific tokenId
    fetchPoundStatus(1); // Example usage
  }, []); // Dependency array is empty, meaning this effect runs once on component mount

  // #################################################################################################


  const fetchOwnedNFTs = async () => {
    // Simplified logic to check basic functionality
    console.log("Fetching NFTs...");
    // Your simplified fetch logic here
  };


  // Right before your return statement in the component
  console.log('Rendering NFTs:', ownedNFTs);

  useEffect(() => {
    console.log('Updated NFTs:', ownedNFTs);
  }, [ownedNFTs]);





  // #################################################################################################
  // #################################################################################################
  // #################################################################################################
    //BATTLE

    useEffect(() => {
      const fetchActiveBattles = async () => {
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
  const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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

  const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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

    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
    const duration = await contract.roundDuration();
    setRoundDuration(duration.toNumber());
  };

  fetchRoundDuration();
}, []);

useEffect(() => {
  const fetchCompletedBattles = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
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


    const handleToggle = () => setShowDetails(!showDetails);

    // function App() {
    //   return (
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<HomePage />} />
    //         <Route path="/nft/:tokenId" element={<NFTPage />} />
    //       </Routes>
    //     </Router>
    //   );
    // }
    //
    // export default App;


  return (
    <>
    <ToastContainer />
      <header className="header">
          <div style={headerTextStyle}>AlphaDawgz Battle System</div>
          <div className="connect-button">
            <ConnectButton />
        </div>
      </header>

                             <Box
                               flex={1}
                               p={0}
                               m={0}
                               display="flex"
                               flexDirection="column"
                               borderRadius="lg"
                               bg="rgba(213, 143, 45, 0.7)"
                               bgImage={`url(${mainbackgroundImage})`}
                               bgPosition="center"
                               bgRepeat="no-repeat"
                               bgSize="cover"
                             >
                    <div className="row row-1" style={{ minHeight: '100px' }}>


                    </div>


                                                              <div className="row row-1" style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',  }}>
                                                                {/* Your content here */}
                                                                <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
                                                              </div>

                                                              <div className="row row-4" style={{ minHeight: '100px' }}>

                                                                    </div>

                                                                {/* Fourth Row: Links */}
                                                                <div className="leaderboard">
                                                                <h2 style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '20px' }}>Top 7 True AlphaDawgz (#TopDawgz)</h2>

                                                                  {leaderboardData.map((data, index) => (
                                                                    <div className="leaderboard-entry" key={index}>
                                                                      <span className="rank">{index + 1}</span>

                                                                      <span className="token-id">DawgTag #{data.tokenId}</span>
                                                                      <span className="times-won">Wins: {data.timesWon}</span>
                                                                      <span className="value-earned">Battle Value: {data.valueEarned}BNB</span>
                                                                    </div>
                                                                  ))}
                                                                </div>

                                                                {/* ... other component code ... */}
                                                                <div className="completed-battles-section">
       <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '20px' }}>Completed Battles</h2>
       {completedBattles.length > 0 ? (
         <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
           {completedBattles.map((battle) => (
             <div key={battle.battleId} style={{
               padding: '20px',
               border: '1px solid #ccc',
               borderRadius: '10px',
               background: 'rgba(0,0,0,0.5)',
               color: 'white',
               maxWidth: '300px',
               textAlign: 'center'
             }}>
               <h3>Battle ID: {battle.battleId}</h3>
               <p>Initiator Token ID: {battle.initiatorTokenId}</p>
               <p>Secondary Token ID: {battle.secondaryTokenId}</p>
               <p> Time: {battle.startTime}</p>
               <p>Total Value in Battle: {battle.totalValueInBattle} BNB</p>
               <p>Round Duration: {battle.roundDuration} seconds</p>
               {revealedBattles[battle.battleId] ? (
                 <p>Winner: Token ID {battle.winner}</p>
               ) : (
                 <button
   onClick={() => handleRevealClick(battle.battleId)}
   style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
 >
   Reveal Winner
 </button>
               )}
             </div>
           ))}
         </div>
       ) : (
         <p style={{ textAlign: 'center', color: 'white' }}>No completed battles to display</p>
       )}
     </div>

                     <Flex direction={{ base: "column", md: "row"  }} gap={0}>




                     </Flex>

                </Box>
                <Box
                  flex={1}
                  p={0}
                  m={0}
                  display="flex"
                  flexDirection="column"
                  borderRadius="lg"
                  bg="rgba(213, 143, 45, 0.7)"
                  bgImage={`url(${mainbackgroundImage})`}
                  bgPosition="center"
                  bgRepeat="no-repeat"
                  bgSize="cover"
                >
        <Flex direction={{ base: "column", md: "row"  }} gap={0}>


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

        <Box
          flex={1}
          p={0}
          minH="550px"
          display="flex"
          flexDirection="column"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.0)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >


        <Box
          flex={1}
          p={0}
          m={2}

          minH="900px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >


        </Box>
        <Box
          flex={1}
          p={0}
          m={2}

          minH="100px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >

        <div className="row row-3" style={{ minHeight: '500px', marginTop: '0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' }}>
        <h2 style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: 'bold',  color: 'white', marginBottom: '20px' }}>Bad Dawgz (Visiting the Pound)</h2>
          {nfts.filter(nft => nft.isInPound).length > 0 ? (
            nfts.filter(nft => nft.isInPound).map((nft, index) => {
              const unlockTime = new Date(nft.unlockTime * 1000);
              const currentTime = new Date();
              const differenceInTime = unlockTime - currentTime;
              const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

              return (
                <div key={index} style={{
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
                  {/* Container for NFT image and prison bars overlay */}
                  <div className="nft-image-container">
                    <img src={nft.metadata.image} alt={`NFT ${nft.tokenId}`} style={{ width: '100%', height: '100%', display: 'block' }} />
                    <img src={prisonBars} alt="Prison Bars" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }} />
                  </div>
                  <p style={{ color: 'white', marginTop: '10px' }}>Name: {nft.metadata.name}</p>
                  <p style={{ color: 'white' }}>Days Until Unlock: {differenceInDays > 0 ? differenceInDays : "Unlocking..."}</p>
                </div>
              );
            })
          ) : (
            <p style={{ width: '100%', textAlign: 'center', color: 'white' }}>No NFTs found that are in Pound</p>
          )}
        </div>
                </Box>
        <Box
          flex={1}
          p={0}
          m={2}

          minH="100px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
        </Box>
        </Box>
        </Flex>
        {/* Third Row: Your Collected AlphaDawgz */}



   </Box>



    </>
  );
}

export default App;


// future ideas https://plays.org/game/nature-cat-hals-big-dig/
