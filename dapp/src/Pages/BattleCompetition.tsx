

import BnbPriceContext from '../Pages/BnbPriceContext'; // //


import HeaderWithDropdown from './Components/HeaderWithDropdown/HeaderWithDropdown';
// <HeaderWithDropdown />

import Leaderboard from './Comp1/Leaderboard/UserLeaderboard';
// <Leaderboard />

import YourComplatedBattles from './Comp1/YourActiveBattles/YourCompletedBattles';
// <YourComplatedBattles />

import YourActiveBattles from './Comp1/YourActiveBattles/YourActiveBattles';
// // <YourActiveBattles />

import AllActiveBattles from './Comp1/YourActiveBattles/AllActiveBattles';
// // <AllActiveBattles />

import BattleNowMainComponent from './Comp1/QuickBattleComponent/BattleNowMainComponent';
// // <BattleNowMainComponent />

import UserBattleStats from './Comp1/UserProfile/UserBattleStats';
// <UserBattleStats />


import Footer from './Components/Footer/Footer';

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


import mainbackgroundImage from "./competition1.png";
import tokenGif from "./token.gif";
import a7Logo from "./headerlogo.png";
import dawgImage from "./token.gif";
import MainTextLogo from "./headerlogo.png";



import { ethers } from 'ethers';


const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";
// ________________________________________________________________________________ //

const REFERRAL_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
import referralAbi from './tokenAbi.json';

const REFERRER_WALLET_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

// ________________________________________________________________________________ //


const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';





const HomePage: React.FC = () => {

    const bnbPrice = useContext(BnbPriceContext);
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
    fetchBnbPrice();
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

      const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
      const liquidityValue = reserveValue * 2;
      setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
    }
  }, [totalReserveInUSD]);

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

  const [amountToSend, setAmountToSend] = useState('');

  const sendEther = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const transactionResponse = await signer.sendTransaction({
          to: "0x88CE0d545cF2eE28d622535724B4A06E59a766F0",
          value: ethers.utils.parseEther(amountToSend || "0")
        });
        await transactionResponse.wait();
        alert('Ether sent successfully');
      } else {
        alert('Ethereum wallet is not connected');
      }
    } catch (error) {
      console.error('Error sending Ether:', error);
      alert('Error sending Ether');
    }
  };

  const calculateTokensReceived = () => {
  const numericTokenPriceUSD = parseFloat(tokenPriceUSD);

    if (!amountToSend || isNaN(bnbPrice ?? 0) || isNaN(numericTokenPriceUSD) || bnbPrice === 0 || numericTokenPriceUSD === 0) {
    return 0;
  }

  const bnbValueUSD = parseFloat(amountToSend) * (bnbPrice ?? 0);
  const tokensBeforeFee = bnbValueUSD / numericTokenPriceUSD;
  const feeDeduction = tokensBeforeFee * 0.060465;
  const tokensAfterFee = tokensBeforeFee - feeDeduction;

  return isNaN(tokensAfterFee) ? 0 : tokensAfterFee;
};



  const logoSize = '28.5px';


  return (

    <Box>
      <HeaderWithDropdown />
         <Box
           flex={1}
           p={0}
           m={0}
           display="flex"
           flexDirection="column"
           bg="rgba(0, 0, 0, 1)"
           bgImage={`url(${mainbackgroundImage})`}
           bgPosition="center"
           bgRepeat="no-repeat"
           bgSize="cover"
         >

         <Flex
              direction={{ base: 'row', md: 'row' }}
              gap="4"
              p={4}
              minH="60px"
            >

          </Flex>
          {/* New Flex Row with 3 Columns */}


          <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap="4"
                    p={4}
                    minH="100px"
                  >
                    {/* First Column */}
                    <Box
                    justifyContent="center"
                  alignItems="center"
                      flex={1}
                      display="flex"

                    >
                      {/* Content for the first column */}
                      <BattleNowMainComponent />
                    </Box>

                    {/* Second Column */}
                    <Box
                    justifyContent="center"
                  alignItems="center"
                      flex={1}
                      display="flex"

                    >
                      {/* Content for the second column */}
                          <UserBattleStats />
                    </Box>
                  </Flex>



                  <Flex
                       direction={{ base: 'row', md: 'row' }}
                       gap="4"
                       p={4}
                       minH="150px"
                     >
                     <Box


                       flex={{ base: 1, md: 4 }}
                       minW={{ base: 'auto', md: '360px' }}
                     > <AllActiveBattles />
                           </Box>
                   </Flex>




         <Flex
      direction={{ base: 'column', md: 'row' }}
      gap="4"
      p={4}
      minH="40px"
    >

      {/* First Column */}
      <Box

      marginTop="120px"
        flex={{ base: 1, md: 6 }}
        minW="0"
      >

      <YourActiveBattles />
      </Box>


      <Box
      marginTop="120px"

        flex={{ base: 1, md: 4 }}
        minW={{ base: 'auto', md: '360px' }}
      >
<YourComplatedBattles />
      {/*
      <YourComplatedBattles /> */}
            </Box>
    </Flex>







         </Box>
         <Leaderboard />
         <Footer />
       </Box>
     );
};

export default HomePage;