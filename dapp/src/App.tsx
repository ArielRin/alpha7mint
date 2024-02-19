import React, { useEffect, useState } from 'react';

import {
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
  useToast,
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
import tokenLogo from './token.png';
import dawgImage from './token.gif';



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
const BATTLE_CONTRACT_ADDRESS = '0x0cD4426c012261b1dD53611DfC1F8db70e60d5c3';

// #################################################################################################



import NftMint0 from './Components/NftMint0/NftMint0';



function App() {


const [web3, setWeb3] = useState(null);

  const [stakeAmount, setStakeAmount] = useState('');
  const toast = useToast();

  // Approve Function
  const [isApprovalPending, setIsApprovalPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

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
        const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
        const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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
  const [isEmergencyWithdrawing, setIsEmergencyWithdrawing] = useState(false);

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
  const [userStakedBalance, setUserStakedBalance] = useState(0);

  const fetchUserStakedBalance = async () => {
  try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
const [userAddress, setUserAddress] = useState('');
 const [userTokenBalance, setUserTokenBalance] = useState('0');
 const [unlockDate, setUnlockDate] = useState('');

 // Fetch user's Ethereum address
 useEffect(() => {
   const fetchUserAddress = async () => {
     if (window.ethereum) {
         const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
     const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
       const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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


  const [isClaiming, setIsClaiming] = useState(false);

   // Function to claim rewards
   const claimRewards = async () => {
     if (window.ethereum) {
       try {
         setIsClaiming(true); // Disable the button

           const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const [newCost, setNewCost] = useState('');

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

  const [contractBalance, setContractBalance] = useState(0);

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

  const [cost, setCost] = useState('0');

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

  const [isPaused, setIsPaused] = useState(false);

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

  const [isRevealed, setIsRevealed] = useState(false);

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

const [apy, setApy] = useState(0);
const [totalStaked, setTotalStaked] = useState(0);
const [rewardsRemaining, setRewardsRemaining] = useState(0);
const [lockedTokens, setLockedTokens] = useState(0);
const [pendingRewards, setPendingRewards] = useState(0);


useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
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
  const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');

  const [marketCap, setMarketCap] = useState('Loading...');
  const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');

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

  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');

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
  const [nfts, setNfts] = useState([]);

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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [loadingNFTs, setLoadingNFTs] = useState(true);

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

  return (
    <>
    <ToastContainer />
      <header className="header">
          <div style={headerTextStyle}>Mint AlphaDawgz</div>
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

1
                     <div className="row row-1" style={{ minHeight: '200px' }}>
div1
                    </div>

                    <img
                      src={dawgImage}

                      alt="Main Text Logo"
                      className="logobody"

                    />
                    {/* Third Row: Your Collected AlphaDawgz */}




                    {/* Fourth Row: Links */}


                     <Flex direction={{ base: "column", md: "row"  }} gap={0}>


                     <Box
                       flex={1}
                       p={0}

                       minH="700px"
                       display="flex"
                       flexDirection="column"
                       borderRadius="lg"
                       bg="rgba(31, 31, 31, 0.0)"
                       bgPosition="center"
                       bgRepeat="no-repeat"
                       bgSize="cover"
                     >

                     <div className="row row-4" style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' }}>
                   <h2 style={{ width: '100%', textAlign: 'center' }}>Good Dawgs</h2>
                   {nfts.filter(nft => !nft.isInPound).length > 0 ? (
                   nfts.filter(nft => !nft.isInPound).map((nft, index) => (
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
                   {nft.metadata.image && (
                   <img src={nft.metadata.image} alt={`NFT ${nft.tokenId}`} style={{ width: '100px', height: '100px', borderRadius: '10px', marginBottom: '10px' }} />
                   )}
                   <p>Name: {nft.metadata.name}</p>
                   </div>
                   ))
                   ) : (
                   <p style={{ width: '100%', textAlign: 'center' }}>No NFTs found that are not in Pound</p>
                   )}
                   </div>



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

3

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
                     <div className="row row-3"  style={{ marginTop: '0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px' }}>
                   <h2 style={{ width: '100%', textAlign: 'center' }}>NFTs In Pound (Days Until Unlock)</h2>
                   {nfts.filter(nft => nft.isInPound).length > 0 ? (
                     nfts.filter(nft => nft.isInPound).map((nft, index) => {
                       // Calculate days remaining until unlock
                       const unlockTime = new Date(nft.unlockTime * 1000); // Convert Unix timestamp to milliseconds
                       const currentTime = new Date();
                       const differenceInTime = unlockTime - currentTime; // Difference in milliseconds
                       const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)); // Convert to days

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
                           {nft.metadata.image && (
                             <img src={nft.metadata.image} alt={`NFT ${nft.tokenId}`} style={{ width: '100px', height: '100px', borderRadius: '10px', marginBottom: '10px' }} />
                           )}
                           <p>Name: {nft.metadata.name}</p>
                           {/* Only display if NFT is in pound */}
                           {nft.isInPound && differenceInDays > 0 && (
                             <p>Days Until Unlock: {differenceInDays}</p>
                           )}
                           {/* Handle case where NFT is unlocked but still marked as in pound */}
                           {nft.isInPound && differenceInDays <= 0 && (
                             <p>Unlocking...</p>
                           )}
                         </div>
                       );
                     })
                   ) : (
                     <p style={{ width: '100%', textAlign: 'center' }}>No NFTs found that are in Pound</p>
                   )}
                 </div>
                     </Box>
                     </Box>
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


        <div className="row row-1" style={{ minHeight: '200px' }}>

       </div>
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
          flex={1}
          p={0}
          m={2}
          minH="500px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
        <img
          src={dawgImage}

          alt="Main Text Logo"
          className="logobody"

        />


        </Box>
        <Box
          flex={1}
          p={0}
          m={2}

          minH="250px"
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

          minH="400px"
          display="flex"
          flexDirection="row"
          borderRadius="lg"
          bg="rgba(31, 31, 31, 0.8)"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >

                                                  <div className="row row-1" style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',  }}>
                                                    {/* Your content here */}
                                                    <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
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
        <div className="row row-3" style={{ minHeight: '200px' }}>
        <div style={{
             display: 'flex',
             flexWrap: 'wrap',
             justifyContent: 'center',
             alignItems: 'center',
             gap: '20px',
           }}>
             {nfts.map((nft, index) => (
               <div key={index} style={{
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 width: '100%', // Full width on smaller screens
                 maxWidth: '200px', // Maximum width on larger screens
                 margin: '10px',
                 padding: '10px',
                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                 borderRadius: '10px',
               }}>
                 <h3 style={{ textAlign: 'center' }}>Token ID: {nft.tokenId}</h3>
                 <img src={nft.metadata.image} alt={nft.metadata.name} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                 <p style={{ textAlign: 'center' }}>{nft.metadata.name}</p>
               </div>
             ))}
           </div>
        </div>

        {/* Fourth Row: Links */}
        <div className="row row-4" style={{ minHeight: '100px' }}>
          {/* Your content here */}
        </div>
   </Box>



    </>
  );
}

export default App;
