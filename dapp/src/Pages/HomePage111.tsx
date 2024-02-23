import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";

import HomePage from "./HomePage";
import Collection from "./Collection";
import NftMint0 from "./Components/NftMint0/NftMint0";
// import AllActiveBattles from './Components/AllActiveBattles/AllActiveBattles'; // Adjust the import path as necessary

import Leaderboard from './Components/Leaderboard/Leaderboard'; // Adjust the import path as necessary

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

import Web3 from "web3";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useAccount, useContractWrite } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abiFile from "./abiFile.json";
import "./styles.css";
import mainbackgroundImage from "./bkg.png";
import tokenGif from "./token.gif";
import a7Logo from "./headerlogo.png";
import dawgImage from "./token.gif";

import battleAnimationGif from "./battleAnimation.gif"; // Path to your animation GIF

import prisonBars from "./prisonBars.png";
import redBkg from "./redBkg.png";

import MainTextLogo from "./headerlogo.png";

const CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
const TOKEN_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () =>
  `https://opensea.io/collection/aplha-dawgz-nft-collection`;
const getTofuNftURL = () =>
  `https://tofunft.com/discover/items?contracts=98523`;

// #################################################################################################

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
import tokenAbi from "./tokenAbi.json";
// #################################################################################################
// #################################################################################################
// #################################################################################################
import stake14Abi from "./stake14Abi.json";
const STAKING_CONTRACT_ADDRESS = "0x5Bc7905f75244C67E2d8FfEcE4D33052682B4d68";
// #################################################################################################
// #################################################################################################
// #################################################################################################
import dawgPoundAbi from "./dawgPoundAbi.json";
const POUND_CONTRACT_ADDRESS = "0x3cf4d5ef3cB24F061dEe1E75e4E0b47f99cb4a6E";
// #################################################################################################
// #################################################################################################
// #################################################################################################
import dawgBattleAbi from "./dawgBattleAbi.json";
const BATTLE_CONTRACT_ADDRESS = "0x565F7e642989F3C3dAC7b34FF442D14fa0B92cB9"; // v7_2_1_2
// #################################################################################################
// #################################################################################################

function App() {
  return (
    <>
      <ToastContainer />



        <div className="row row-4" style={{ minHeight: "100%" }}>




              <Box width="100%" height="100vh" bg="black">                                <Leaderboard />
                </Box>

        </div>

    </>
  );
}

export default App;

// future ideas https://plays.org/game/nature-cat-hals-big-dig/     <AllActiveBattles />
