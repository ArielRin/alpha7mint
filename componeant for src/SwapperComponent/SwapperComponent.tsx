import React, { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";


import BnbPriceContext from '../../../Pages/BnbPriceContext';


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

import NftDetails from './Nft/NftDetails'; // Adjust the import path as needed

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

// ________________________________________________________________________________ //

const REFERRAL_CONTRACT_ADDRESS = "0x8F48161234E345336D014c6e050341Acc93Af433";
import referralAbi from './referralSwapperAbi.json';

const REFERRER_WALLET_ADDRESS = "0xA004979423149b043f1acB63f7852C9D3343c40a";

// ________________________________________________________________________________ //


const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';










const FastSwapComponent = () => {

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
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const transactionResponse = await signer.sendTransaction({
            to: "0x8F48161234E345336D014c6e050341Acc93Af433", // Your contract address
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
    if (!amountToSend || isNaN(bnbPrice) || isNaN(tokenPriceUSD) || bnbPrice === 0 || tokenPriceUSD === 0) {
      return 0;
    }
    const bnbValueUSD = parseFloat(amountToSend) * bnbPrice;
    const tokensBeforeFee = bnbValueUSD / tokenPriceUSD;
    const feeDeduction = tokensBeforeFee * 0.060465; // 7% fee
    const tokensAfterFee = tokensBeforeFee - feeDeduction;
    return isNaN(tokensAfterFee) ? 0 : tokensAfterFee;
  };

  const calculateUSDValueOfTokens = () => {
      const tokens = calculateTokensReceived();
      return (tokens * parseFloat(tokenPriceUSD)).toFixed(2);
    };

    const logoSize = '27px';



  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     <div style={{ width: '350px', backgroundColor: '#1c3967', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
     {/* Heading */}
     <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/headerlogo.png" w="163px" />
     <h2 style={{
    color: 'white',
    textAlign: 'center',
    fontSize: '24px', // Example font size, adjust as needed
    fontWeight: 'bold',
    marginBottom: '10px' // Space below the heading
    }}>Fast Swap</h2>
             {/* Descriptive text */}
             <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
               Exchange your BNB for ALPHA7 tokens quickly and securely.
             </p>
             <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>

             </p>

       <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px' }}>
         <img src={bnbLogoUrl} alt="BNB Logo" style={{ width: logoSize, height: logoSize }} />
         <span style={{ marginLeft: '10px' }}>BNB</span>
         <div style={{ marginLeft: 'auto' }}>
           <span>Balance: {bnbBalance}</span>
         </div>
       </div>
       <input
         type="text"
         value={amountToSend}
         onChange={(e) => setAmountToSend(e.target.value)}
         placeholder="Enter amount to send (BNB)"
         style={{ width: '100%', margin: '5px 0', padding: '10px', color: 'black', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
       />
       <small style={{ alignSelf: 'flex-start', color: '#fff', marginBottom: '20px'}}>
       BNB value USD: ${isNaN(parseFloat(amountToSend) * bnbPrice) ? "0.00" : (parseFloat(amountToSend) * bnbPrice).toFixed(2)}
       </small>
       <div style={{ width: '350px', backgroundColor: '#1c3967', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.0)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

       <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px' }}>
         <img src={tokenLogoUrl} alt="ALPHA7 Logo" style={{ width: logoSize, height: logoSize }} />
         <span style={{ marginLeft: '10px' }}>ALPHA7</span>
         <div style={{ marginLeft: 'auto' }}>
            <span>Balance: {alpha7TokenBalance}</span>
         </div>
         </div>


         <input
           readOnly
           value={calculateTokensReceived().toFixed(2) + ' '}
           placeholder="Enter amount to send (BNB)"
           style={{ width: '100%', margin: '5px 0', padding: '10px', color: 'black', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}

         />
         <small style={{ alignSelf: 'flex-start', color: '#fff', marginBottom: '20px' }}>
              Token value USD: ${isNaN(calculateTokensReceived() * parseFloat(tokenPriceUSD)) ? "0.00" : (calculateTokensReceived() * parseFloat(tokenPriceUSD)).toFixed(2)}
         </small>
       </div>
       <button onClick={sendEther} style={{ width: '100%', padding: '10px 20px', marginTop: '20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
         Send BNB
       </button>
       <a
           href="https://pancakeswap.finance/swap?outputCurrency=0x88CE0d545cF2eE28d622535724B4A06E59a766F0"
           target="_blank"
           rel="noopener noreferrer"
           style={{
             marginTop: '20px',
             color: 'white',
           }}
         >Alternativly PancakeSwap Here
         </a>
     </div>


    </div>


  );
};

export default FastSwapComponent;
