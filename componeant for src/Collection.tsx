import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";


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
const BATTLE_CONTRACT_ADDRESS = "0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D"; // v7_2_1_2
// #################################################################################################
// #################################################################################################

function Collection() {
  return (
    <>
      <ToastContainer />
      <header className="header">
        <div>AlphaDawgz Battle System</div>

        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/user">User Page</RouterLink>
        <RouterLink to="/collection">Collection</RouterLink>
        {/* Add more navigation links as needed */}

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

        <div
          className="row row-1"
          style={{
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Your content here */}
          <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
        </div>

        <div className="row row-4" style={{ minHeight: "600px" }}>
          this is the oneeeeeee
        </div>

        <Flex direction={{ base: "column", md: "row" }} gap={0}></Flex>
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
    </>
  );
}

export default Collection;

// future ideas https://plays.org/game/nature-cat-hals-big-dig/
