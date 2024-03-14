import HomePage from './Pages/HomePage';
import Buy from './Pages/Buy';
import Staking from './Pages/Staking';
import MintPage from './Pages/MintPage';
import Battle from './Pages/Battle';
import Values from './Pages/Values';
import TheDawgz from './Pages/TheDawgz/TheDawgz';
import NftDetails from './Pages/Nft/NftDetails';



import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import BnbPriceContext from './Pages/BnbPriceContext'; // Import the context
import TokenPriceContext from './Pages/TokenPriceContext'; // Import the new context
import { NFTProvider } from './Pages/NFTContext'; // Import the new context



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


function App() {

  const [bnbPrice, setBnbPrice] = useState(0);

   useEffect(() => {
     const fetchBnbPrice = async () => {
       try {
         const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
         setBnbPrice(response.data.binancecoin.usd);
       } catch (error) {
         console.error("Failed to fetch BNB price:", error);
       }
     };

     fetchBnbPrice();
   }, []);


  // #################################################################################################
  const [tokenPriceUSD, setTokenPriceUSD] = useState<null | string>(null);

useEffect(() => {
  const fetchTokenPrice = async () => {
    try {
      const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${TOKEN_CONTRACT_ADDRESS}`;
      const response = await axios.get(url);
      const attributes = response.data?.data?.attributes;
      if (attributes) {
        setTokenPriceUSD(attributes.price_usd);
      } else {
        setTokenPriceUSD('Price not available'); // This is now valid
      }
    } catch (error) {
      console.error('Error fetching token price:', error);
      setTokenPriceUSD('Error fetching price'); // This is also valid
    }
  };

  fetchTokenPrice();
}, []);
    // #################################################################################################

      // #################################################################################################

        // #################################################################################################

          // #################################################################################################

            // #################################################################################################


      return (
  <NFTProvider>
    <BnbPriceContext.Provider value={bnbPrice}>
      <TokenPriceContext.Provider value={tokenPriceUSD}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/buy" element={<Buy />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/mint" element={<MintPage />} />
                <Route path="/battle" element={<Battle />} />
              <Route path="/thedawgz" element={<TheDawgz />} /> // New route for TheDawgz page
                <Route path="/values" element={<Values />} />
                  <Route path="/nftdetails/:tokenId" element={<NftDetails />} />
Staking
            </Routes>
        </Router>
      </TokenPriceContext.Provider>
    </BnbPriceContext.Provider>
  </NFTProvider>



      );
    }

    export default App;
//           <Route path="/nftdetails/:tokenId" element={<NftDetails />} />

// future ideas https://plays.org/game/nature-cat-hals-big-dig/
