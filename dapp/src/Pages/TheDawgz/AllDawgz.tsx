
import QuickBattle from '../Components/QuickBattleComponent/QuickBattleTemp2';

import Footer from '../Components/Footer/Footer';
// <Footer />
import DawgRegistration from '../Components/DawgRegistration/DawgRegistration'; // //
// <DawgRegistration />
// import DawgRegistration from './DawgCard'; // //

import QRCode from 'qrcode.react';

import { Web3Provider } from '@ethersproject/providers';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { ethers, providers, BigNumber } from 'ethers';
import {
   Menu, MenuButton, MenuList, MenuItem,
  Modal,
  Select,
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
  Center,
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
import { ExternalLinkIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import BnbPriceContext from '../BnbPriceContext'; // Import the context
import TokenPriceContext from '../TokenPriceContext';

import HeaderWithDropdown from '../Components/HeaderWithDropdown/HeaderWithDropdown';

import A7Logo from './Alpha7token.png';
const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';




import tokenAbi from './tokenAbi.json';

import nftAbi from './abiFile.json';
import dawgBattleAbi from './dawgBattleOldAbi.json';
// Contract ABIs and Addresses
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // ABI for Dawg registration contract
import userRegistryAbi from './userRegistryAbi.json';

const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";
const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7"; // Contract address

const NFT_CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";
const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";
// xb816222825Fd38B715904B301044C7D767389Aa2
const ITEMS_PER_PAGE = 50;

const fallbackRpcUrl = "https://bsc-dataseed1.ninicoin.io";



interface NFTItem {
  tokenId: number;
  imageUrl: string;
  name: string;
  dawgName?: string;
  dawgTaunt?: string;
}

const FetchAllDawgz: React.FC = () => {
  const [allNFTs, setAllNFTs] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNFTData = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error("Ethereum object not found, you need a web3 browser like MetaMask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftAbi, signer);
    const dawgRegContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, signer);

    try {
      const totalSupply = await nftContract.totalSupply();
      const promises = Array.from({ length: totalSupply.toNumber() }, async (_, i) => {
        const tokenId = i + 1;
        const metadataUrl = `/NFTDATA/metadata/${tokenId}.json`;
        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        const dawgName = await dawgRegContract.dawgzNames(tokenId);
        const dawgTaunt = await dawgRegContract.dawgzDefaultTaunts(tokenId);

        return {
          tokenId,
          imageUrl: metadata.imageUrl,
          name: metadata.name,
          dawgName: dawgName || 'Stray Dawg',
          dawgTaunt: dawgTaunt || 'No taunt'
        };
      });

      const fetchedNFTs = await Promise.all(promises);
      setAllNFTs(fetchedNFTs);
    } catch (error) {
      console.error("Failed to fetch NFTs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, []);



    return (
        <SimpleGrid columns={[1, 1, 2, 3]} spacing="20px">
            {isLoading ? (
                <Text>Loading All Dawgz... This may take up to a minute</Text>
            ) : allNFTs.length > 0 ? (
                allNFTs.map((nft) => (
                <VStack key={nft.tokenId} p="5" minW="250px" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white" alignItems="flex-start">
                  <Box position="relative">
                    <Text position="absolute" top="0" left="2" fontSize="md" fontWeight="semibold">
                      AlphaDawg# {nft.tokenId}
                    </Text>
                    <Image
                    src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/NFTDATA/Image/${nft.tokenId}.png`}
                     marginTop="38px" alt={`NFT ${nft.name}`} borderRadius="md" />
                    <Flex justifyContent="space-between" alignItems="center" mt="2">

                        <Text fontSize="32px" fontWeight="bold" color="green.500"> {nft.dawgName}</Text>

                      <Flex>

                        {nft.tokenId < 101 && (
                          <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/1001.png" alt="First 100" boxSize="40px" />
                        )}
                      </Flex>
                    </Flex>
                      <Text mt="2" fontSize="md" fontStyle="italic">"{nft.dawgTaunt}"</Text>
                  </Box>

                  <Flex w="100%" minH="68px" >
                  <Flex direction="column" w="65%" justifyContent="flex-start" alignItems="flex-start">
                    <Button as={RouterLink} to={`/nftdetails/${nft.tokenId}`} colorScheme="green">Details</Button>

                    <ChakraLink
          href={`https://bscscan.com/nft/0xca695feb6b1b603ca9fec66aaa98be164db4e660/${nft.tokenId}`}
          color="blue.500"
          cursor="pointer"
          marginTop="12px"
          display="flex"
          alignItems="center"
          isExternal
        >
          <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/bscscan.png" boxSize="20px" mr="2" />
          <Text ml="5px">View Contract</Text>
        </ChakraLink>



                  </Flex>







                  <Box width="35%" marginTop="20px" border="1px" borderColor="white" p="4">
                   {/* QR code centered horizontally */}
                   {/* Assuming QRCode is a component that takes a URL and generates a QR code */}
                   <ChakraLink
                     href={`https://element.market/assets/bsc/0xca695feb6b1b603ca9fec66aaa98be164db4e660/${nft.tokenId}`}
                     isExternal
                     display="block"
                     position="relative"
                     width="100%"
                     height="100%"
                   >
                     <Center>
                     <Box width="80%" marginTop="5px" border="1px" borderColor="white" p="2" bg="white" display="flex" justifyContent="center" alignItems="center">

                       <QRCode value={`https://element.market/assets/bsc/0xca695feb6b1b603ca9fec66aaa98be164db4e660/${nft.tokenId}`} size={72} />

                       </Box>
                     </Center>
                     <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/element.png" alt="Element" mt="3" alignSelf="center" />
                   </ChakraLink>
                 </Box>
               </Flex>
             </VStack>
                ))
            ) : (
                <Text>No Dawgz found.</Text>
            )}
        </SimpleGrid>
    );
};

export default FetchAllDawgz;
