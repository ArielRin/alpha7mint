
import DawgRegistration from '../Components/DawgRegistration/DawgRegistration'; // //
// <DawgRegistration />
// import DawgRegistration from './DawgCard'; // //



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
// Contract ABIs and Addresses
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // ABI for Dawg registration contract
import userRegistryAbi from './userRegistryAbi.json';

const USER_REGISTRY_CONTRACT_ADDRESS = "0x889aD5c66Bd0402EF1b672ca7E80b1caA7Ed5d62";
const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7"; // Contract address

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
    isRegistered: boolean;
    dawgName?: string; // Optional property to store the Dawg's name from the contract
}



    const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

    useEffect(() => {
  const fetchNfts = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);
      const dawgRegistrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);

      const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);
      const ownedTokenIdsArray = ownedTokenIds.map((tokenId: BigNumber) => tokenId.toNumber());

      const ownedNftsData = await Promise.all(
        ownedTokenIdsArray.map(async (tokenId: number) => {
          const metadata = await fetchNftData(tokenId);
          const isRegistered = await dawgRegistrationContract.isNFTRegistered(tokenId);

          let dawgName = null;
          let dawgTaunt = null; // Initialize variable for Dawg Taunt

          if (isRegistered) {
            dawgName = await dawgRegistrationContract.dawgzNames(tokenId);
            dawgTaunt = await dawgRegistrationContract.dawgzDefaultTaunts(tokenId); // Fetch Dawg Taunt
          }

          return { ...metadata, tokenId, isRegistered, dawgName, dawgTaunt }; // Include dawgTaunt in the return object
        })
      );

      setNfts({ owned: ownedNftsData });
    } catch (error) {
      console.error("Failed to fetch owned NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchNfts();
}, [currentPage]);

    // Function to fetch individual NFT data
    const fetchNftData = async (tokenId: number) => {


        const metadataUrl = `/NFTDATA/metadata/${tokenId}.json`;
        const imageUrl = `/NFTDATA/Image/${tokenId}.png`;

        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        return {
            tokenId,
            imageUrl,
            name: metadata.name
        };
    };

    const handleRegisterDawg = (nft: NFT) => {
        setSelectedNFT(nft);
    };

    const handleCloseModal = () => {
        setSelectedNFT(null);
    };



  const tabBackground = 'gray.800'; // The tab background color
  const activeTabColor = 'white'; // The color of the active tab indicator and text


    const bnbPrice = useContext(BnbPriceContext); // Use the context
    const tokenPriceUSD = useContext(TokenPriceContext);

// ------------------------------------------------------------------------------ //






return (
  <Flex
      direction="column"
      align="center"
      minH="100vh"
      bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/greenbkg.png')"
      bgPosition="center"
      bgSize="cover"
  >
      <HeaderWithDropdown />

      <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
          <VStack spacing={4}>
              {/* Additional components */}
          </VStack>
      </Box>

      <Box width="90%" minH="800px" mx="auto" shadow="md" borderRadius="md" overflow="hidden" borderWidth="0px" borderColor="red.650" bgColor="rgba(0, 0, 0, 0.8)" color="gray.600">
          <Tabs variant="enclosed-colored" size="lg" colorScheme="gray">
              <TabList mb="1em" bg={tabBackground}>
                  <Tab _selected={{ color: activeTabColor }} _focus={{ boxShadow: 'none' }}>Your Dawgz</Tab>
              </TabList>

              <TabPanels>
                  <TabPanel>
                  <SimpleGrid columns={[1, 2, 4]} spacing="20px">
    {nfts.owned.length > 0 ? (
        nfts.owned.map((nft) => (
            <Box key={nft.tokenId} p="5" minW="250px" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white" position="relative">
                <Text position="absolute" top="2" left="2" fontSize="md" fontWeight="semibold">
                    AlphaDawg# {nft.tokenId}
                </Text>
                <Image src={nft.imageUrl} marginTop="20px" alt={`NFT ${nft.name}`} borderRadius="md" />
                <Flex justifyContent="space-between" alignItems="center" mt="2">
      <Text fontSize="xl" fontWeight="semibold" color="green.500"> {nft.dawgName}</Text>
      <Flex>
        {nft.isRegistered && (
          <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/dog-tag.png" alt="Registered" boxSize="40px" mr="2" />
        )}
        {nft.tokenId < 101 && (
          <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/1001.png" alt="First 100" boxSize="40px" />
        )}
      </Flex>
    </Flex>
                    <Text mt="2" fontSize="md" fontStyle="italic">"{nft.dawgTaunt}"</Text>

                <Button mt="4" as={RouterLink} to={`/nftdetails/${nft.tokenId}`} colorScheme="green">Detail</Button>
                {!nft.isRegistered && (
                    <Button mt="4" ml="2" colorScheme="pink" onClick={() => handleRegisterDawg(nft)}>
                        Register Dawg
                    </Button>
                )}
            </Box>
        ))
    ) : (
        <Text>No owned Dawgz found.</Text>
    )}
</SimpleGrid>

                  </TabPanel>
              </TabPanels>
          </Tabs>
      </Box>

      <Modal isOpen={selectedNFT !== null} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
              <ModalHeader>Register Dawg</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                  {selectedNFT && <DawgRegistration tokenId={selectedNFT.tokenId} />}
              </ModalBody>
          </ModalContent>
      </Modal>
  </Flex>
);

};

export default TheDawgz;
