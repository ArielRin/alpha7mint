import React, { useEffect, useState } from 'react';

import {
  Box,
  Link,
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
import backgroundGif from './gold.gif';
import tokenGif from './token.gif';
import tokenLogo from './token.png';

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
// #################################################################################################





function App() {



  // #################################################################################################
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
const [userTokenBalance, setUserTokenBalance] = useState('0');

useEffect(() => {
  const fetchTokenBalance = async () => {
    // Check if window.ethereum is available
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create a provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get signer
        const signer = provider.getSigner();

        // Get the user's address
        const userAddress = await signer.getAddress();

        // Create a contract instance
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, provider);

        // Fetch the balance
        const balance = await tokenContract.balanceOf(userAddress);

        // Convert the balance to a human-readable format for a token with 9 decimals
        const formattedBalance = ethers.utils.formatUnits(balance, 9); // Specify 9 for the decimal places

        // Update state with the balance
        setUserTokenBalance(formattedBalance);
      } catch (error) {
        console.error('Error fetching token balance:', error);
      }
    }
  };

  fetchTokenBalance();
}, []);

  // #################################################################################################
    // #################################################################################################
      // #################################################################################################


  const [isClaiming, setIsClaiming] = useState(false);

   // Function to claim rewards
   const claimRewards = async () => {
     if (window.ethereum) {
       try {
         setIsClaiming(true); // Disable the button

         const provider = new ethers.providers.Web3Provider(window.ethereum);
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
const [unlockDate, setUnlockDate] = useState('');


useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
  // #################################################################################################









  // #################################################################################################
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



      <div className="container">
      <div className="row row-1_0"></div>

        <div className="row row-1">
                  {/* Apply the logobody class to the image */}
                  <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
                  {/* Rest of your first row content */}
                </div>
        <div className="row row-3">



          <Box padding="4">
              <Text fontSize="55px" fontWeight="bold">14 Day Staking</Text>
              <Text fontSize="md" fontWeight="normal">Estimated Return: {apy}% P.A</Text>

                                          <Text fontSize="12px" fontWeight="normal" marginTop="22px">
                                        Your Alpha7 Balance: {userTokenBalance}}
                                          </Text>

              <Input
        placeholder="Amount to Stake"
        value={stakeAmount}
        onChange={(e) => setStakeAmount(e.target.value)}
        type="number"
        marginTop="3"
        />
                   <Box padding="" marginTop="14px">

                   {/* Conditional rendering based on approval status */}
                {!isApproved ? (
                  <Button colorScheme="blue" onClick={handleApprove} mb={4} disabled={isApprovalPending}>
                    {isApprovalPending ? 'Allowing...' : 'Enter Staking'}
                  </Button>
                ) : (
                  <Button colorScheme="blue" onClick={handleDeposit} mb={4}>
                    Stake Now!
                  </Button>
                )}


                                                    </Box>

                                                                                            <Button
                                                                                              onClick={handleWithdraw}
                                                                                              isLoading={isWithdrawing}
                                                                                              loadingText="Withdrawing..."
                                                                                              colorScheme="teal"
                                                                                            >
                                                                                              Unstake
                                                                                            </Button>



              <Text fontSize="md" fontWeight="normal"marginTop="22px">
              Rewards to Harvest: {pendingRewards}
              </Text>

              <Button

              colorScheme="teal"
              marginTop="3"
               onClick={claimRewards} disabled={isClaiming} >
                      {isClaiming ? 'Claiming...' : 'Claim Rewards'}
                    </Button>


                    <Text fontSize="md" fontWeight="normal" marginTop="40px">
                    Its possible to remove your staked positions although you will incure a 21% early withdrawal tax. Please do this as a last resort.
                    </Text>

                                   {/* Emergency Withdraw Button */}
                                   <Button
                                     onClick={handleEmergencyWithdraw}
                                     isLoading={isEmergencyWithdrawing}
                                     loadingText="Emergency Withdrawing..."
                                     colorScheme="red"
                                     marginTop="3"
                                   >
                                     Withdraw with Penalty
                                   </Button>

            </Box>


              <Box padding="4">
            <div>
  <p>Tokens in Pool: {totalStaked}</p>

  <p>Pool Value: $12,345.67</p>
  <p>Rewards Remaining In Pool: {rewardsRemaining}</p>
  <p>Your Locked Position: {lockedTokens}</p>
  <p>Your Staking Unlock Date: {unlockDate}</p>






</div>

            </Box>

                                                                  </div>

                                                                  <div className="row row-1_0"></div>
                                                                  <div className="row row-3">

                                                                                                              <div>
                                                                                                              <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                                                                                                                Mint your AlphaDawgz for {cost} BNB Each!
                                                                                                              </Text>
                                                                                                              <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                                                                                                                <Button
                                                                                                                  marginTop='1'
                                                                                                                  textColor='white'
                                                                                                                  bg='#094da7'
                                                                                                                  _hover={{
                                                                                                                    bg: '#0b6be8',
                                                                                                                  }}
                                                                                                                  onClick={handleDecrement}
                                                                                                                  disabled={!isConnected || mintLoading || mintAmount === 1}
                                                                                                                >
                                                                                                                  -
                                                                                                                </Button>
                                                                                                                <Text marginX='3' textAlign='center' fontSize='lg'>
                                                                                                                  {mintAmount}
                                                                                                                </Text>
                                                                                                                <Button
                                                                                                                  marginTop='1'
                                                                                                                  textColor='white'
                                                                                                                  bg='#094da7'
                                                                                                                  _hover={{
                                                                                                                    bg: '#0b6be8',
                                                                                                                  }}
                                                                                                                  onClick={handleIncrement}
                                                                                                                  disabled={!isConnected || mintLoading || mintAmount === 200}
                                                                                                                >
                                                                                                                  +
                                                                                                                </Button>
                                                                                                              </Box>

                                                                                                              <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                                                                                                                <Button
                                                                                                                  disabled={!isConnected || mintLoading}
                                                                                                                  marginTop='6'
                                                                                                                  onClick={onMintClick}
                                                                                                                  textColor='white'
                                                                                                                  bg='#094da7'
                                                                                                                  _hover={{
                                                                                                                    bg: '#0b6be8',
                                                                                                                  }}
                                                                                                                >
                                                                                                                  {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                                                                                                                </Button>
                                                                                                              </Box>
                                                                                                              <Button
                                                                                                                      marginTop='6'
                                                                                                                      onClick={handleAddToken}
                                                                                                                      textColor='white'
                                                                                                                      bg='#094da7'
                                                                                                                      _hover={{
                                                                                                                        bg: '#0b6be8',
                                                                                                                      }}
                                                                                                                    >
                                                                                                                      Add Alpha7 Token to MetaMask
                                                                                                                    </Button>

                                                                                                      </div>
                                                                          </div>
      </div>
    </>
  );
}

export default App;
