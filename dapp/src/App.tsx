
import './styles.css';


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

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xeaD4A1507C4cEE75fc3691FA57b7f2774753482C';

const getExplorerLink = () => `https://scan.maxxchain.org/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;


function App() {






  const headerTextStyle = {
    fontSize: '28px', // Increased font size
    fontWeight: 'bold', // Make the text bolder
    color: '#f8f8ff', // Off-white color
  };

  return (
    <>
      <header className="header">
          <div style={headerTextStyle}>Alpha 7</div>
          <div className="connect-button">
            <ConnectButton />
        </div>
      </header>



      <div className="container">
      <div textColor="white" className="row row-1_0"></div>

        <div className="row row-1">
                  {/* Apply the logobody class to the image */}
                  <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
                  {/* Rest of your first row content */}
                </div>
      <div textColor="white" className="row row-1_0"></div>
       <div textColor="white" className="row row-1_1">
         <div>
          <p>Welcome to the forefront of innovation with Alpha 7, the pioneering token in the System 7 ecosystem, uniquely designed for our elite Alpha members. As the inaugural offering in our suite, Alpha 7 sets the stage for an exclusive whitelisted launch phase.</p>
         </div>
       </div>
        <div className="row row-2">
          <div  textColor="white" className="column column-left">Left Column (Min Height: 400px)</div>
          <div className="column column-right">
            <div textColor="white" className="sub-row">Right Top Row (Min Height: 200px)

            </div>
            <div textColor="white" className="sub-row">Right Bottom Row (Min Height: 200px)</div>
          </div>
        </div>
        <div textColor="white" className="row row-3">
                  {/* Add your desired content here */}
                  <div>
                    <p>Members can reap substantial rewards and enjoy enhanced reflections through a cutting-edge NFT-based system. This dynamic platform not only enables token reflections for NFT holders but also amplifies rewards based on the number of NFTs owned. We're thrilled to announce that all proceeds from NFT sales will be strategically allocated to bolster our liquidity pool, with a significant 70% dedicated to ensuring a robust launch. In a gesture of appreciation and commitment to our community, we're also redistributing 30% of these proceeds back to our NFT holders in the first month as a special bonus. Step into the Alpha 7 experience, where your journey with us is not just about investment but a path to exclusive rewards and a flourishing community."</p>
                  </div>
                </div>
        <div className="row row-4">Fourth Row (Min Height: 75px)</div>
      </div>
    </>
  );
}

export default App;
