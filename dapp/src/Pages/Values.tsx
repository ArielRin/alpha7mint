import HeaderWithDropdown from './Components/HeaderWithDropdown/HeaderWithDropdown';
// <HeaderWithDropdown />

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";// import NFTPage from './Pages/NfPage';
// import NftMint0 from './Components/NftMint0/NftMint0';

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
  VStack,
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
import { ethers, providers} from 'ethers';
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
const BATTLE_CONTRACT_ADDRESS = '0x0e96F3C42d594EBbfD0835d92FDab28014233182'; // v7_2_1_2

// #################################################################################################
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

// #################################################################################################


function UserDetails() {

  const [userAddress, setUserAddress] = useState('');
  const [alpha7TokenBalance, setAlpha7TokenBalance] = useState('0.0000');
  const [bnbBalance, setBnbBalance] = useState('0.0000');
  const [developerTokenBalance, setDeveloperTokenBalance] = useState('0.0000');
  const [treasuryTokenBalance, setTreasuryTokenBalance] = useState('0.0000');
  const [developerBNBBalance, setDeveloperBNBBalance] = useState('0.0000');
  const [treasuryBNBBalance, setTreasuryBNBBalance] = useState('0.0000');
  const [alpha7LPTokenSupply, setAlpha7LPTokenSupply] = useState('0.0000');
    const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');

    const [connectedWalletLPTokenBalance, setConnectedWalletLPTokenBalance] = useState('0.0000');
const [developerWalletLPTokenBalance, setDeveloperWalletLPTokenBalance] = useState('0.0000');
const [nftTreasuryWalletLPTokenBalance, setNftTreasuryWalletLPTokenBalance] = useState('0.0000');



  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

          const fetchBNBBalance = async (walletAddress: string) => {
          const balanceWei = await provider.getBalance(walletAddress);
          return parseFloat(ethers.utils.formatEther(balanceWei)).toFixed(4);
        };


        setBnbBalance(await fetchBNBBalance(address));
        setDeveloperBNBBalance(await fetchBNBBalance(DEVELOPER_WALLET_ADDRESS));
        setTreasuryBNBBalance(await fetchBNBBalance(TREASURY_WALLET_ADDRESS));

        // Fetch Alpha7 token balance
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
        const balance = await tokenContract.balanceOf(address);
        setAlpha7TokenBalance(parseFloat(ethers.utils.formatUnits(balance, 9)).toFixed(0));

        // Fetch developer and treasury token balances
        const developerBalance = await tokenContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        const treasuryBalance = await tokenContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setDeveloperTokenBalance(parseFloat(ethers.utils.formatUnits(developerBalance, 9)).toFixed(0));
        setTreasuryTokenBalance(parseFloat(ethers.utils.formatUnits(treasuryBalance, 9)).toFixed(0));

        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, provider);
        const lpTokenSupply = await alpha7LPContract.totalSupply();
        // Correctly format the supply for a token with 9 decimal places
        const formattedLPSupply = parseFloat(ethers.utils.formatUnits(lpTokenSupply, 18)).toFixed(6);
        setAlpha7LPTokenSupply(formattedLPSupply);

      }
    };

    fetchWalletDetails();
  }, []);

  const [bnbPriceInUSD, setBnbPriceInUSD] = useState('');

  useEffect(() => {
    const fetchWalletDetails = async () => {
      // Existing wallet detail fetches
    };

    const fetchBnbPrice = async () => {
      const apiUrl = 'https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // Replace this with the actual URL
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const bnbPrice = data.data.attributes.token_prices['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'];
        setBnbPriceInUSD(bnbPrice);
      } catch (error) {
        console.error('Failed to fetch BNB price:', error);
      }
    };

    fetchWalletDetails();
    fetchBnbPrice(); // Call the function to fetch BNB price
  }, []);


  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0x88CE0d545cF2eE28d622535724B4A06E59a766F0`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          const { fdv_usd, total_reserve_in_usd, price_usd } = attributes;

          setMarketCap(fdv_usd ? `$${parseFloat(fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(total_reserve_in_usd ? `${parseFloat(total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          // Directly using the price_usd string to avoid conversion issues
          setTokenPriceUSD(price_usd ? `${price_usd}` : 'Price not available');
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
      });
  }, []);


      // ##############################################################
      // ##############################################################

  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');
    const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');
      const [marketCap, setMarketCap] = useState('Loading...');

  useEffect(() => {
    if (totalReserveInUSD !== 'Loading...' && totalReserveInUSD !== 'Total Reserve not available' && totalReserveInUSD !== 'Error fetching data') {
      // Extract the number from the formatted currency string
      const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
      const liquidityValue = reserveValue * 2;
      setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
    }
  }, [totalReserveInUSD]); // Dependency on totalReserveInUSD

  const [lpTokenValue, setLpTokenValue] = useState('Loading...');
  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${TOKEN_CONTRACT_ADDRESS}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          setMarketCap(attributes.fdv_usd ? `$${parseFloat(attributes.fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(attributes.total_reserve_in_usd ? `${parseFloat(attributes.total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          setTokenPriceUSD(attributes.price_usd ? `${attributes.price_usd}` : 'Price not available');

          // Calculate and set LP Token Value
          const reserveNumeric = parseFloat(attributes.total_reserve_in_usd);
          const supplyNumeric = parseFloat(alpha7LPTokenSupply);
          if (!isNaN(reserveNumeric) && !isNaN(supplyNumeric) && supplyNumeric > 0) {
            setLpTokenValue((reserveNumeric / supplyNumeric).toFixed(8));
          } else {
            setLpTokenValue('Calculation error');
          }
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
          setLpTokenValue('Data not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
        setLpTokenValue('Error fetching data');
      });
  }, [alpha7LPTokenSupply]);

  useEffect(() => {
    const fetchLPTokenBalances = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, signer);

        // Fetch LP token balance for the connected wallet
        const connectedWalletAddress = await signer.getAddress();
        const connectedWalletLPBalance = await alpha7LPContract.balanceOf(connectedWalletAddress);
        setConnectedWalletLPTokenBalance(ethers.utils.formatUnits(connectedWalletLPBalance, 18)); // Adjusted for 18 decimal places

        // Fetch LP token balance for the developer wallet
        const developerWalletLPBalance = await alpha7LPContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        setDeveloperWalletLPTokenBalance(ethers.utils.formatUnits(developerWalletLPBalance, 18)); // Adjusted for 18 decimal places

        // Fetch LP token balance for the NFT Treasury wallet
        const nftTreasuryWalletLPBalance = await alpha7LPContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setNftTreasuryWalletLPTokenBalance(ethers.utils.formatUnits(nftTreasuryWalletLPBalance, 18)); // Adjusted for 18 decimal places
      }
    };

    fetchLPTokenBalances();
  }, []);





  // #################################################################################################
  const [formattedSwapTokensAtAmount, setFormattedSwapTokensAtAmount] = useState('');

   useEffect(() => {
     const fetchSwapTokensAtAmount = async () => {
       if (typeof window.ethereum !== 'undefined') {
         const provider = new ethers.providers.Web3Provider(
  window.ethereum as providers.ExternalProvider
);
         const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, provider);

         try {
           // Fetch the swapTokensAtAmount in wei
           const swapTokensAtAmount = await tokenContract.swapTokensAtAmount();
           // Convert from wei to tokens considering the token's 9 decimal places
           const tokens = ethers.utils.formatUnits(swapTokensAtAmount, 9);
           // Fix to 1 decimal place for display
           const formattedAmount = Number(tokens).toFixed(1);
           setFormattedSwapTokensAtAmount(formattedAmount);
         } catch (error) {
           console.error('Error fetching swapTokensAtAmount:', error);
         }
       }
     };

     fetchSwapTokensAtAmount();
   }, []);



    // #################################################################################################
    const [contractTokenBalance, setContractTokenBalance] = useState('');

      useEffect(() => {
        const fetchContractTokenBalance = async () => {
          if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(
  window.ethereum as providers.ExternalProvider
);
            const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, provider);

            try {
              // Fetch the token balance of the contract itself
              const balance = await tokenContract.balanceOf(TOKEN_CONTRACT_ADDRESS);
              // Convert the balance to a human-readable format, assuming the token uses 9 decimals
              const formattedBalance = ethers.utils.formatUnits(balance, 9);
              setContractTokenBalance(Number(formattedBalance).toFixed(0)); // Adjust decimal places as needed
            } catch (error) {
              console.error('Error fetching contract token balance:', error);
            }
          }
        };

        fetchContractTokenBalance();
      }, []);
      // #################################################################################################
       const [percentage, setPercentage] = useState(0); // Calculated from the above values


     useEffect(() => {
       const fetchLiveData = async () => {
         if (typeof window.ethereum !== 'undefined') {
           const provider = new ethers.providers.Web3Provider(
  window.ethereum as providers.ExternalProvider
);
           const contract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, provider);

           try {
             // Assuming 'balanceOf' and 'swapTokensAtAmount' are the methods in your contract
             // For contractTokenBalance, you might need to specify the contract's address or another address
             const balance = await contract.balanceOf(TOKEN_CONTRACT_ADDRESS); // Adjust according to your contract's method
             const swapAmount = await contract.swapTokensAtAmount(); // Adjust according to your contract's method

             // Update state with fetched data
             const balanceInTokens = ethers.utils.formatUnits(balance, 9); // Adjust the '18' based on your token's decimals
             const swapAmountInTokens = ethers.utils.formatUnits(swapAmount, 9); // Adjust the '18' based on your token's decimals

             setContractTokenBalance(balanceInTokens);
             setFormattedSwapTokensAtAmount(swapAmountInTokens);

             // Calculate and set percentage
             const percentageCalculated = (parseFloat(balanceInTokens) / parseFloat(swapAmountInTokens)) * 100;
             setPercentage(parseFloat(percentageCalculated.toFixed(2)));
            } catch (error) {
             console.error('Error fetching data from the blockchain:', error);
           }
         }
       };

       fetchLiveData();
     }, []);

     // SVG Cup Fill Calculation
     const validPercentage = Math.max(0, Math.min(100, percentage)); // Ensure percentage is between 0 and 100


       const tankHeight = 100; // Height of the water tank
         const tankWidth = 200; // Width of the water tank for a broader appearance
         const fillHeight = tankHeight * (percentage / 100); // Calculate fill height
         const fillYPosition = tankHeight - fillHeight + 10; // Y position for the fill

        // #################################################################################################

          // #################################################################################################

            // #################################################################################################


            return (

              <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    minH="100vh"
                    w="100%"
                    bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/master/Images/Bkg/goldenbackground4%231.png')"
                    bgPos="center"
                    bgSize="cover"
                    padding="20px"
                  >
                  <HeaderWithDropdown />
                    {/* Apply dark grey transparent background to each Box */}
                    {/* Each Box now has a bgColor with an rgba value for dark grey with transparency */}
                    {/* Text color set to white */}

                    {/* First Row */}
                    <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
                      <VStack spacing={4}>
                      </VStack>
                    </Box>
                    <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.85)" color="white">
                      <VStack spacing={4}>
                        <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />

                        <Text fontSize="lg" fontWeight="bold">Administration Balance of Accounts</Text>
                        <Text mb="2">0x88CE0d545cF2eE28d622535724B4A06E59a766F0</Text>



                      </VStack>
                    </Box>

                    {/* first#2 Row */}
                    <Box w="100%" minH="125px" paddingY="20px" bgColor="rgba(0, 0, 0, 0.85)" color="white" marginTop="10px">
                      <VStack spacing={4}>
                      <Text fontSize="lg" >Current Alpha7 Price: {tokenPriceUSD} USD</Text>
                      <Text fontSize="md">Projects Total Liquidity: ${(parseFloat(alpha7LPTokenSupply) * parseFloat(lpTokenValue) * 2).toFixed(2)} USD</Text>
                      <Text fontSize="md">Market Cap: ${(parseFloat(tokenPriceUSD) * 7000000000).toFixed(2)} USD</Text>
                      </VStack>
                    </Box>

                    {/* first#3 Row */}
                    <Box w="100%" minH="50px" paddingY="20px" bgColor="rgba(0, 0, 0, 0.85)" color="white"marginTop="10px">
                      <VStack spacing={4}>
                        <Text fontSize="lg" fontWeight="bold">Projects Current Goal</Text>
                        <Text mb="2">Pair All Unreleased</Text>
                        <Text mb="2">Cost to LP All Unreleased Tokens </Text>
                        <Text mb="2"fontWeight="bold">  ${(parseFloat(tokenPriceUSD) * 2000000000).toFixed(2)} USD ({((parseFloat(tokenPriceUSD) * 2000000000) / parseFloat(bnbPriceInUSD)).toFixed(2)} BNB)</Text>
                        <Text mb="2">Unreleased Token Supply (Locked): 2,000,000,000</Text>

                      </VStack>
                    </Box>

                    {/* Second Row */}
                    <Flex direction={{ base: "column", md: "row" }} w="100%" minH="150px" justify="space-between" paddingY="20px" bgColor="rgba(0, 0, 0, 0.0)" color="white" >
                        <Flex flex="1" paddingX="10px" minH="150px" justify="space-between" paddingY="10px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
                        <Box flex="1" paddingX="10px" minH="150px"  paddingY="10px" bgColor="rgba(0, 0, 0, 0.855)" color="white">

                      <VStack spacing={4}>
                        <Text fontSize="xl" fontWeight="bold">Marketing and Development Wallet</Text>

                        <Text mb="2">0x57103b1909fB4D295241d1D5EFD553a7629736A9</Text>

                        <Text mb="2"> {developerTokenBalance} ALPHA7 Tokens (${(parseFloat(developerTokenBalance) * parseFloat(tokenPriceUSD)).toFixed(2)} USD)</Text>
                        <Text mb="2">LP Token Balance: {developerWalletLPTokenBalance}</Text>
                        <Text mb="2" fontWeight="bold"> ${(parseFloat(developerWalletLPTokenBalance) * parseFloat(lpTokenValue) * 2).toFixed(2)} USD</Text>
                        <Text mb="2">BNB Balance: {developerBNBBalance} BNB ${(parseFloat(developerBNBBalance) * parseFloat(bnbPriceInUSD)).toFixed(2)} USD</Text>
                        </VStack>
                      </Box>
                      </Flex>

                      <Flex flex="1" paddingX="10px" minH="150px" justify="space-between" paddingY="10px" bgColor="rgba(0, 0, 0, 0.0)" color="white"  >
                      <Box flex="1" paddingX="10px" minH="150px"  paddingY="10px" bgColor="rgba(0, 0, 0, 0.85)" color="white">

                      <VStack spacing={4}>
                      <Text fontSize="xl" fontWeight="bold">NFT Treasury Wallet</Text>

                                              <Text mb="2">0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7</Text>
                      <Text mb="2">Alpha7 Rewards to Dispurse</Text>
                      <Text mb="2"fontWeight="bold"> {treasuryTokenBalance} ALPHA7 Tokens ${(parseFloat(treasuryTokenBalance) * parseFloat(tokenPriceUSD)).toFixed(2)} USD</Text>
                      <Text mb="2">LP Token Balance: {nftTreasuryWalletLPTokenBalance}</Text>
                      <Text mb="2"fontWeight="bold"> ${(parseFloat(nftTreasuryWalletLPTokenBalance) * parseFloat(lpTokenValue) * 2).toFixed(2)} USD</Text>
                      <Text mb="2">BNB Balance: {treasuryBNBBalance} BNB ${(parseFloat(treasuryBNBBalance) * parseFloat(bnbPriceInUSD)).toFixed(2)} USD</Text>
                      </VStack>
                    </Box>
                      </Flex>

                    </Flex>

                    {/* Third Row */}
                    <Box w="100%" minH="200px" paddingY="20px" bgColor="rgba(0, 0, 0, 0.85)" color="white" marginTop="10px">
                      <VStack spacing={4}>
                      <Text fontSize="xl" fontWeight="bold">Additional Liquidity Details</Text>
                      <Text mb="2">Projects Total Liquidity Valuation</Text>
                      <Text mb="2"fontWeight="bold"> ${(parseFloat(alpha7LPTokenSupply) * parseFloat(lpTokenValue) * 2).toFixed(2)}  USD</Text>
                      <Text mb="2">Project Locked LP: 4.99999 Alpha7-BNB (CakeLP)</Text>
                      <Text mb="2" fontWeight="bold"> ${((parseFloat(lpTokenValue) * 4.99999)*2).toFixed(2)} USD</Text>

                      <Text mb="2">CAKE-LP Tokens Total Supply</Text>
                      <Text mb="2"> {alpha7LPTokenSupply} Alpha7-BNB (CakeLP) Tokens </Text>
                      <Text mb="2"fontWeight="bold">Each lp token worth ${(parseFloat(lpTokenValue) * 2).toFixed(2)} USD</Text>
                      <Text mb="2">Raw BNB Valuation of Entire CAKE-LP Token Supply</Text>
                      <Text mb="2" fontWeight="bold"> {totalReserveInUSD} </Text>


                      <Text mb="2" fontWeight="bold">------------------------</Text>

                      <Flex direction="column" align="center" minH="300px">
                       <Box textAlign="center" mb="20px">
                                 <Text mb="2" fontWeight="bold">Swap Tokens At Amount: {formattedSwapTokensAtAmount} Tokens</Text>
    <Text mb="2" fontWeight="bold">Alpha7 Tokens awaiting swapNliquify: {contractTokenBalance} Tokens</Text>
    <Box textAlign="center" mb="20px">
       <Text mb="2" fontWeight="bold">Swap and Liquify Fill Level</Text>
          <Text mb="2" fontWeight="normal">will pay Reflections, send Marketing/Dev Fees and add to Liquidity on 100% </Text>

<Box textAlign="center" mb="20px">


<Flex direction="column" align="center" justify="center" w="100%">
  <Box textAlign="center" mb="20px">
  <svg width="220" height="150" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
  {/* Tank outline */}
  <rect x="10" y="10" rx="15" ry="15" width={tankWidth} height={tankHeight} stroke="black" strokeWidth="3" fill="grey" />
  {/* Water fill */}
  <rect x="13" y={fillYPosition} rx="12" ry="12" width={tankWidth - 6} height={fillHeight} fill="blue" />
  {/* Additional details for the cartoon effect */}
  <circle cx="105" cy="40" r="10" fill="yellow" stroke="black" strokeWidth="2" /> {/* Sun */}
  <line x1="105" y1="10" x2="105" y2="30" stroke="black" strokeWidth="2" /> {/* Sun rays */}
  <line x1="85" y1="40" x2="105" y2="40" stroke="black" strokeWidth="2" />
  <line x1="125" y1="40" x2="105" y2="40" stroke="black" strokeWidth="2" />
  {/* Text for percentage */}
  <text x="50%" y="65" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white">{`${percentage}% Full`}</text>
  </svg>
    <svg width="220" height="150" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      {/* SVG content */}
    </svg>
  </Box>
</Flex>


   </Box>
</Box>

</Box>
  </Flex>




                      </VStack>
                 </Box>
                    {/* SVG Visualization of the Cup Fill Level */}


                    {/* Fourth Row */}
                    <Box w="100%" minH="100px" paddingY="20px" bgColor="rgba(0, 0, 0, 0.85)" color="white">
                      <VStack spacing={4}>
                      </VStack>
                    </Box>
                  </Flex>
  );
};


          export default UserDetails;// future ideas https://plays.org/game/nature-cat-hals-big-dig/
