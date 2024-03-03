
import DawgRegistration from '../Components/DawgRegistration/DawgRegistration'; // //
// <DawgRegistration />


import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { ethers, providers, BigNumber } from 'ethers';
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
  Box,
  Link as ChakraLink,
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
import { Link as RouterLink, useParams } from 'react-router-dom';


import { ConnectButton } from '@rainbow-me/rainbowkit';

import BnbPriceContext from '../BnbPriceContext'; // Import the context
import TokenPriceContext from '../TokenPriceContext';

import HeaderWithDropdown from '../Components/HeaderWithDropdown/HeaderWithDropdown';

import A7Logo from './Alpha7token.png';
const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';




import tokenAbi from './tokenAbi.json';

import abiFile from './abiFile.json';
import dawgBattleAbi from './dawgBattleOldAbi.json';
import userRegistryAbi from './userRegistryAbi.json';
// import BnbPrice from '../Components/BnbPrice';
const USER_REGISTRY_CONTRACT_ADDRESS = "0x889aD5c66Bd0402EF1b672ca7E80b1caA7Ed5d62";

const NFT_CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";
const BATTLE_CONTRACT_ADDRESS = '0x0e96F3C42d594EBbfD0835d92FDab28014233182';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";

const ITEMS_PER_PAGE = 50;


const TheDawgz: React.FC = () => {
    interface NFT {
        tokenId: number;
        imageUrl: string;
        name: string;
    }

    const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

    useEffect(() => {
        const fetchNfts = async () => {
            // Fetch owned NFTs and update state
        };

        fetchNfts();
    }, []);

    const handleRegisterDawg = (nft: NFT) => {
        setSelectedNFT(nft);
    };

    const handleCloseModal = () => {
        setSelectedNFT(null);
    };

    return (
        <Flex direction="column" align="center" minH="100vh">
            {/* Dawgz Section */}
            <Box width="90%" minH="800px" mx="auto" shadow="md" borderRadius="md" overflow="hidden" borderWidth="0px" borderColor="red.650" bgColor="rgba(0, 0, 0, 0.8)" color="gray.600">
                <Tabs variant="enclosed-colored" size="lg" colorScheme="gray">
                    <Box borderColor="red.650" borderWidth="0px">
                        <TabList mb="1em" bg="gray.800">
                            <Tab>Your Dawgz</Tab>
                        </TabList>
                    </Box>

                    <TabPanels>
                        <TabPanel>
                            <Flex justify="center">
                                {nfts.owned.map((nft) => (
                                    <DawgCard key={nft.tokenId} nft={nft} onRegisterDawg={handleRegisterDawg} />
                                ))}
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            {/* Modal for Dawg Registration */}
            <Modal isOpen={selectedNFT !== null} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Register Dawg</ModalHeader>
                    <ModalFooter>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                    <ModalBody>
                        {selectedNFT && <DawgRegistration tokenId={selectedNFT.tokenId} />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

const DawgCard: React.FC<{ nft: NFT, onRegisterDawg: (nft: NFT) => void }> = ({ nft, onRegisterDawg }) => {
    return (
        <Box key={nft.tokenId} p="5" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white" m="2">
            {/* Render NFT information */}
            <Button mt="4" ml="2" colorScheme="pink" onClick={() => onRegisterDawg(nft)}>Register Dawg</Button>
        </Box>
    );
};

export default TheDawgz;
