import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";// import NFTPage from './Pages/NfPage';
import HomePage from './Pages/HomePage';
// import NftMint0 from './Components/NftMint0/NftMint0';
import UserPage from './Pages/UserDetails';
import Collection from './Pages/Collection';

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
const BATTLE_CONTRACT_ADDRESS = '0x565F7e642989F3C3dAC7b34FF442D14fa0B92cB9'; // v7_2_1_2

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

    // #################################################################################################

      // #################################################################################################

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
                  <header h='100px' className="header">


                <RouterLink to="/" style={{ color: 'white', marginRight: '15px' }}>
                <div>
                  <Image src="https://prismatic-semifreddo-aec57e.netlify.app/assets/headerlogo.90cb497a.png" w="163px" />
                </div>
                </RouterLink>
                <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Token</RouterLink>
                <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Mint</RouterLink>
                <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Collection</RouterLink>
                <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Battle</RouterLink>
                <RouterLink to="/values" style={{ color: 'white', marginRight: '6px' }}>Financials</RouterLink>
                <div className="connect-button">
                  <ConnectButton />
                </div>
                </header>
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
                      <Text mb="2"fontWeight="bold"> ${(parseFloat(lpTokenValue) * 2).toFixed(2)} USD</Text>
                      <Text mb="2">Raw BNB Valuation of Entire CAKE-LP Token Supply</Text>
                      <Text mb="2" fontWeight="bold"> {totalReserveInUSD} </Text>

                      </VStack>
                    </Box>

                    {/* Fourth Row */}
                    <Box w="100%" minH="100px" paddingY="20px" bgColor="rgba(0, 0, 0, 0.85)" color="white">
                      <VStack spacing={4}>
                      </VStack>
                    </Box>
                  </Flex>
  );
};


          export default UserDetails;// future ideas https://plays.org/game/nature-cat-hals-big-dig/
