

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { ethers, providers } from 'ethers';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
    SimpleGrid,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
   IconButton,
  Box,
  Link as ChakraLink,
  VStack,
  Flex,
  Container,
  Tabs,
  TabList,
  Stack,
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
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { Link as RouterLink, useParams } from 'react-router-dom';


import { ConnectButton } from '@rainbow-me/rainbowkit';

import BnbPriceContext from '../BnbPriceContext'; // Import the context
import TokenPriceContext from '../TokenPriceContext';

import A7Logo from './Alpha7token.png';
const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';



import tokenAbi from './tokenAbi.json';

import abiFile from './abiFile.json';
// import BnbPrice from '../Components/BnbPrice';

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";

const TheDawgz: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();


    const bnbPrice = useContext(BnbPriceContext); // Use the context
    const tokenPriceUSD = useContext(TokenPriceContext);

return (

      <Flex
        as="header"
        width="full"
        align="center"
        height="80px"
        justifyContent="space-between"
        padding="4"
        bg="rgba(0, 0, 0, 0.8)"
        color="white"
        wrap="wrap"
      >


        <Flex align="center" mr={5}>
          <RouterLink to="/">
            <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/headerlogo.png" w="100px" />
          </RouterLink>
        </Flex>
        <IconButton
  aria-label="Open Menu"
  size="lg"
  icon={<HamburgerIcon />}
  onClick={onToggle}
  display={{ base: "inline-flex", md: "none" }}
  bg="rgba(0, 0, 0, 0.5)" // Dark, transparent background
  color="white" // Icon color
  _hover={{ bg: "rgba(0, 0, 0, 0.7)" }} // Darker on hover for feedback
  />


        {/* Desktop Links */}
        <Stack
          direction="row"
          display={{ base: 'none', md: 'flex' }}
          width="auto"
          alignItems="center"
          flexGrow={1}
          ml={{ md: 5 }}
        >
          <RouterLink to="/thedawgz">Buy</RouterLink>
          <RouterLink to="/thedawgz">Collection</RouterLink>
          <RouterLink to="/thedawgz">Battle</RouterLink>
          <RouterLink to="/values">Financials</RouterLink>
          <RouterLink to="/values">More</RouterLink>
        </Stack>

        {/* Mobile Links and Wallet Info */}
        <Collapse in={isOpen} animateOpacity display={{ base: 'flex', md: 'none' }} flexDirection="column" alignItems="center">
    <VStack as="nav" bg="rgba(0, 0, 0, 0.8)" p="4" rounded="md" shadow="md" align="center" w="full">
    {/* Token and BNB Prices Beside Logos */}

        <ConnectButton />
    <Flex direction="column" align="center" w="full">
      <Flex marginTop="30px"  justify="center" align="center">
        <Image src={tokenLogoUrl} h="20px" mr="2" />
        <Text fontSize="md" fontWeight="bold">${tokenPriceUSD}</Text>
      </Flex>
      <Flex marginTop="10px" justify="center" align="center">
        <Image src={bnbLogoUrl} h="20px" mr="2" />
        <Text fontSize="md" fontWeight="bold">${bnbPrice}</Text>
      </Flex>
    </Flex>


      {/* Page Links Centered */}
      <RouterLink to="/thedawgz" style={{ textAlign: 'center', width: '100%', marginTop: '25px' }}>Buy</RouterLink>
      <RouterLink to="/thedawgz" style={{ textAlign: 'center', width: '100%' }}>Collection</RouterLink>
      <RouterLink to="/thedawgz" style={{ textAlign: 'center', width: '100%' }}>Battle</RouterLink>
      <RouterLink to="/values" style={{ textAlign: 'center', width: '100%' }}>Financials</RouterLink>
      <RouterLink to="/values" style={{ textAlign: 'center', width: '100%' }}>More</RouterLink>


    </VStack>
  </Collapse>
        <Flex justifyContent="flex-end" alignItems="center" display={{ base: 'none', md: 'flex' }} flexGrow={1}>
                  <Flex align="center">
                    <Image src={tokenLogoUrl} h="20px" mr="2" />
                    <Text fontSize="md" fontWeight="bold" marginRight="12px">
                      ${tokenPriceUSD}
                    </Text>
                    <Image src={bnbLogoUrl} h="20px" mr="2" />
                    <Text fontSize="md" fontWeight="bold" mr="4">
                      ${bnbPrice}
                    </Text>
                  </Flex>
                  <ConnectButton />
                </Flex>
      </Flex>
  );
};

export default TheDawgz;
