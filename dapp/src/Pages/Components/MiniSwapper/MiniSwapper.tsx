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
import metamaskLogo from "./metamask.png";
import bscscanLogo from "./bscscan.png";
import supportLogo from "./support.png";



import { ethers } from 'ethers';

// import NftDetails from './Nft/NftDetails'; // Adjust the import path as needed

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


const contractOptions = {



"Choose a Referral to Support": "0x8F48161234E345336D014c6e050341Acc93Af433",
  "Referral 2": "0x2E6f4827dbBa6A00789b5A0244b7623f3557810c",
  "Referral 3": "0x5C2491F1d2dDC595359ab81BeC44EA3f603AbfCb",
  "Referral 4": "0x5858D802a2a3aDdcd0A8431ECc7526A9Dd298A18",
  // Add as many contracts as needed
};


//
// Referal ca2: 0x2E6f4827dbBa6A00789b5A0244b7623f3557810c
// Referal ca3: 0x5C2491F1d2dDC595359ab81BeC44EA3f603AbfCb
// Referal ca4: 0x5858D802a2a3aDdcd0A8431ECc7526A9Dd298A18




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
      const [selectedContract, setSelectedContract] = useState(contractOptions["Choose a Referral to Support"]);

const [selectedReferrer, setselectedReferrer] = useState(contractOptions["Choose a Referral to Support"]);

      const [connectedWalletLPTokenBalance, setConnectedWalletLPTokenBalance] = useState('0.0000');
  const [developerWalletLPTokenBalance, setDeveloperWalletLPTokenBalance] = useState('0.0000');
  const [nftTreasuryWalletLPTokenBalance, setNftTreasuryWalletLPTokenBalance] = useState('0.0000');


  const addTokenToWallet = async () => {
      try {
        if (window.ethereum) {
          const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: '0x88ce0d545cf2ee28d622535724b4a06e59a766f0', // Token Contract Address
                symbol: 'ALPHA7', // Token Symbol
                decimals: 9, // Token Decimals
                image: 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png', // Token Image URL
              },
            },
          });

          if (wasAdded) {
            console.log('Token was added to wallet!');
          } else {
            console.log('Token was not added to wallet.');
          }
        } else {
          console.log('Ethereum provider (e.g., MetaMask) not found');
        }
      } catch (error) {
        console.error(error);
      }
    };





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
        to: selectedContract, // Use the selected contract address here
        value: ethers.utils.parseEther(amountToSend || "0")
      });
      await transactionResponse.wait();
      alert('BNB sent successfully');
    } else {
      alert('BSC wallet is not connected');
    }
  } catch (error) {
    console.error('Error sending BNB:', error);
    alert('Error sending BNB');
  }
};


    const calculateTokensReceived = () => {
    const numericAmountToSend = parseFloat(amountToSend) || 0;
    const numericBnbPrice = bnbPrice ?? 0;
    const bnbValueUSD = (numericAmountToSend * numericBnbPrice).toFixed(2);
    const numericTokenPriceUSD = parseFloat(tokenPriceUSD) || 0;
      if (numericAmountToSend === 0 || numericBnbPrice === 0 || numericTokenPriceUSD === 0) {
        return 0;
      }

    const tokensBeforeFee = parseFloat(bnbValueUSD) / numericTokenPriceUSD;
    const feeDeduction = tokensBeforeFee * 0.056; // Assume 7% fee as an example
    const tokensAfterFee = tokensBeforeFee - feeDeduction;

  return isNaN(tokensAfterFee) ? 0 : tokensAfterFee;
  };





  const calculateUSDValueOfTokens = () => {
      const tokens = calculateTokensReceived();
      return (tokens * parseFloat(tokenPriceUSD)).toFixed(2);
    };

    const handleContractChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const key = event.target.value as keyof typeof contractOptions;
  setSelectedContract(contractOptions[key]);
};



    const handleContractChangeName = (event: React.ChangeEvent<HTMLSelectElement>) => {

const key = event.target.value as keyof typeof contractOptions;

// Now, TypeScript knows that key is a valid key of contractOptions.
setselectedReferrer(contractOptions[key]);
};

    const logoSize = '27px';



  return (

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
     <div style={{ width: '330px', backgroundColor: '#1c3967', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>



       <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px', color: 'white' }}>
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
       BNB value USD: ${isNaN(parseFloat(amountToSend) * (bnbPrice ?? 0)) ? "0.00" : (parseFloat(amountToSend) * (bnbPrice ?? 0)).toFixed(2)}

       </small>
       <div style={{ width: '330px', backgroundColor: '#1c3967', borderRadius: '24px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.0)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

       <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1px', color: 'white' }}>
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
         <small style={{ alignSelf: 'flex-start', color: '#fff', marginBottom: '0px' }}>
              Token value USD: ${isNaN(calculateTokensReceived() * parseFloat(tokenPriceUSD)) ? "0.00" : (calculateTokensReceived() * parseFloat(tokenPriceUSD)).toFixed(2)}
         </small>
       </div>

       <button onClick={sendEther} style={{ width: '100%', padding: '10px 20px', marginTop: '0px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '12px' }}>
         Buy ALPHA7
       </button>

       <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'start', fontSize: '12px', color: 'white' }}>


    </div>






     </div>


    </div>


  );
};

export default FastSwapComponent;
