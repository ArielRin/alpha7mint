import React, { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";

import BnbPriceContext from '../Pages/BnbPriceContext'; // Adjust the path as necessary
import FastSwapComponent from './Components/ReferralSawpper/ReferralSwapper'; // Adjust the import path as necessary

// import NftMint0 from './Components/NftMint0/NftMint0'; // Adjust the import path as necessary

import ZapToLP from './Components/ZapToLP/ZapToLP'; // Adjust the import path as necessary

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
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

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

  const [amountToSend, setAmountToSend] = useState('');

  const sendEther = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const transactionResponse = await signer.sendTransaction({
          to: "0x88CE0d545cF2eE28d622535724B4A06E59a766F0", // Your contract address
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
  // Ensure tokenPriceUSD is treated as a number for comparison and calculation
  const numericTokenPriceUSD = parseFloat(tokenPriceUSD);

    if (!amountToSend || isNaN(bnbPrice ?? 0) || isNaN(numericTokenPriceUSD) || bnbPrice === 0 || numericTokenPriceUSD === 0) {
    return 0;
  }

  // Use the parsed numeric value for tokenPriceUSD in calculations
  const bnbValueUSD = parseFloat(amountToSend) * (bnbPrice ?? 0);
  const tokensBeforeFee = bnbValueUSD / numericTokenPriceUSD;
  const feeDeduction = tokensBeforeFee * 0.060465; // Assume 7% fee as an example
  const tokensAfterFee = tokensBeforeFee - feeDeduction;

  return isNaN(tokensAfterFee) ? 0 : tokensAfterFee;
};



  const logoSize = '28.5px';


  return (

        <Box>
        <header style={{ height: '100px' }} className="header">


      <RouterLink to="/" style={{ color: 'white', marginRight: '15px' }}>
      <div>
        <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/headerlogo.png" w="163px" />
      </div>
      </RouterLink>
      <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Buy</RouterLink>
      <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Collection</RouterLink>
      <RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Battle</RouterLink>
      <RouterLink to="/values" style={{ color: 'white', marginRight: '6px' }}>Financials</RouterLink>
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
          <div className="row row-1" style={{ minHeight: "100px" }}></div>

          <Box>
      {/* ...header and other content above... */}

      <Flex
        direction={{ base: 'column', md: 'row' }} // Stack on mobile, horizontal on medium devices and above
        gap={4} // Adjust the gap as needed
        p={4} // Adjust the padding as needed
      >
        {/* NftMint0 component with 70% width on medium devices and above */}
        <Box flex={{ base: 1, md: 7 }}>
          <NftMint0 />
        </Box>

        {/* FastSwapComponent with 30% width on medium devices and above */}
        <Box flex={{ base: 1, md: 3 }}>
          <FastSwapComponent />
        </Box>
      </Flex>

      {/* ...rest of your content... */}
    </Box>

          <Flex direction={{ base: "column", md: "row" }} gap={0}>


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
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={0}></Flex>

          <Flex direction={{ base: "column", md: "row" }} gap={0}>
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
              <Box></Box>
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
                Left main column
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
              ></Box>
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
              ></Box>
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
                <Box width="100%"></Box>



              </Box>
            </Box>
          </Flex>
          {/* Third Row: Your Collected AlphaDawgz */}
        </Box>
    </Box>
  );
};

export default HomePage;
