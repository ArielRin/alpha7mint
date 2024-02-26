import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { ethers } from 'ethers';
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
import BnbPriceContext from '../BnbPriceContext'; // Import the context
import tokenAbi from './tokenAbi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import abiFile from './abiFile.json';
import dawgBattleAbi from './dawgBattleOldAbi.json';
// import BnbPrice from '../Components/BnbPrice';

const NFT_CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";
const BATTLE_CONTRACT_ADDRESS = '0x0e96F3C42d594EBbfD0835d92FDab28014233182';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";

const TheDawgz: React.FC = () => {
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchNfts = async () => {
        setIsLoading(true);
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abiFile, provider);
          const totalSupply = await contract.totalSupply();
          const tokenIds = Array.from({ length: totalSupply.toNumber() }, (_, i) => i + 1);
          const nftData = await Promise.all(tokenIds.map(async (tokenId) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            return {
              tokenId,
              imageUrl: metadata.image,
              name: metadata.name,
            };
          }));
          setNfts(nftData);
        } catch (error) {
          console.error("Failed to fetch NFTs:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchNfts();
    }, []); // The empty array means this effect runs once on mount

    if (isLoading) return <Box>Loading...</Box>;
    if (!nfts.length) return <Box>No NFTs found.</Box>;



return (

  <Flex
    direction="column"
    align="cover"
    minH="100vh"
    bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/greenbkg.png')"
    bgPosition="center"
    bgSize="cover"
  >  <header h='100px' className="header">


<RouterLink to="/" style={{ color: 'white', marginRight: '15px' }}>
<div>
  <Image src="https://prismatic-semifreddo-aec57e.netlify.app/assets/headerlogo.90cb497a.png" w="163px" />
</div>
</RouterLink>
<RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Token</RouterLink>
<RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Mint</RouterLink>
<RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Collection</RouterLink>
<RouterLink to="/thedawgz" style={{ color: 'white', marginRight: '6px' }}>Battle</RouterLink>
<RouterLink to="/values" style={{ color: 'white', marginRight: '6px' }}>Financials</RouterLink>
<div className="connect-button">
  <ConnectButton />
</div>
</header>
{/* First Row */}
<Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
  <VStack spacing={4}>
  </VStack>
</Box>
    <SimpleGrid columns={[ 1, 3, 4, 5, 6, 7]} bgColor="rgba(0, 0, 0, 0.0)" color="white" spacing="20px" p="10">
      {nfts.map((nft) => (
        <Box key={nft.tokenId} p="5" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white">
          <Image src={nft.imageUrl} alt={`NFT ${nft.name}`} borderRadius="md" />
          <Text mt="2" fontSize="xl" fontWeight="semibold" lineHeight="short">
            Token ID: {nft.tokenId}
          </Text>
          <Button mt="4" as={RouterLink} to={`/nftdetails/${nft.tokenId}`} colorScheme="green">
            Detail
          </Button>
          <Button mt="4" ml="2" colorScheme="pink">
            Battle
          </Button>
        </Box>
      ))}
    </SimpleGrid>
    </Flex>
  );
};

export default TheDawgz;
