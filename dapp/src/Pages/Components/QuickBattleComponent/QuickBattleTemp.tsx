

// import DawgRegistration from '../Components/DawgRegistration/DawgRegistration'; // //
// <DawgRegistration />
// import DawgRegistration from './DawgCard'; // //

import QRCode from 'qrcode.react';

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

import BnbPriceContext from '../../BnbPriceContext'; // Import the context
import TokenPriceContext from '../../TokenPriceContext';


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
const BATTLE_CONTRACT_ADDRESS = '0xb816222825Fd38B715904B301044C7D767389Aa2';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";

const ITEMS_PER_PAGE = 50;


const provider = new ethers.providers.Web3Provider(window.ethereum as any);
const signer = provider.getSigner();



const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);













// Other imports you might need




const QuickBattle = () => {

  interface NFT {
    tokenId: number;
    imageUrl: string;
    name: string;
    isRegistered: boolean;
    dawgName?: string;
    dawgTaunt?: string;
    isInBattle: boolean; // Add this line
  }



  const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNFTDetails, setSelectedNFTDetails] = useState<NFT | null>(null);
  const [nftList, setNftList] = useState([]);





  useEffect(() => {
  const fetchNfts = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);
      const dawgRegistrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);
      const battleContractInstance = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);

      const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);
      const ownedTokenIdsArray = ownedTokenIds.map((tokenId: BigNumber) => tokenId.toNumber());

      const ownedNftsData = await Promise.all(
        ownedTokenIdsArray.map(async (tokenId: number) => {
          const metadata = await fetchNftData(tokenId);
          const imageUrl = `https://alpha7.live/NFTDATA/Image/${tokenId}.png`;
          const isRegistered = await dawgRegistrationContract.isNFTRegistered(tokenId);
          const isInBattle = await battleContractInstance.tokenInBattle(tokenId);

          let dawgName = null;
          let dawgTaunt = null;
          if (isRegistered) {
            dawgName = await dawgRegistrationContract.dawgzNames(tokenId);
            dawgTaunt = await dawgRegistrationContract.dawgzDefaultTaunts(tokenId);
          }

          return { ...metadata, tokenId, isRegistered, dawgName, dawgTaunt, imageUrl, isInBattle };
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
    setSelectedNFTDetails(nft);

  };

  const handleCloseModal = () => {
    setSelectedNFTDetails(null);
  };



const tabBackground = 'gray.800'; // The tab background color
const activeTabColor = 'white'; // The color of the active tab indicator and text


  const bnbPrice = useContext(BnbPriceContext); // Use the context
  const tokenPriceUSD = useContext(TokenPriceContext);

// ------------------------------------------------------------------------------ //

const addNftToWallet = async (tokenId: number) => {
  try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider.send('wallet_watchAsset', {
          type: 'ERC721',
          options: {
              address: NFT_CONTRACT_ADDRESS,
              tokenId: tokenId.toString(), // Convert tokenId to string
              // You can add more token details if necessary (image, name, etc.)
          },
      } as any); // Bypass TypeScript's type checking
  } catch (error) {
      console.error('Error adding NFT to wallet', error);
  }
};




// ------------------------------------------------------------------------------ //
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);


// ------------------------------------------------------------------------------ //
// ------------------------------------------------------------------------------ //
// ------------------------------------------------------------------------------ //
// ------------------------------------------------------------------------------ //


const handleSelectNFT = (nft: NFT) => {
  setSelectedNFTDetails(nft);
};



const fetchEntryFee = async () => {
  try {
      const entryFee = await battleContract.entryFee();
      return entryFee;
  } catch (error) {
      console.error('Error fetching entry fee:', error);
  }
};

const [entryFee, setEntryFee] = useState(null);

useEffect(() => {
  const fetchEntryFeeAndSet = async () => {
      try {
          const fee = await fetchEntryFee();
          setEntryFee(fee);
      } catch (error) {
          console.error('Error fetching entry fee:', error);
      }
  };

  fetchEntryFeeAndSet();
}, []);


const enterBattle = async (tokenId: number, dawgTaunt: string) => {
   try {
     setIsTransactionLoading(true); // Start loading
     const entryFee = await fetchEntryFee();
     const transaction = await battleContract.enterBattle(tokenId, dawgTaunt, { value: entryFee });
     await transaction.wait();
     console.log('Battle entered successfully');
   } catch (error) {
     console.error('Error entering battle:', error);
   } finally {
     setIsTransactionLoading(false); // Stop loading irrespective of result
   }
 };

 const [customTaunt, setCustomTaunt] = useState<string | null>(null);

  // ... other functions ...

  const enterBattleWithTaunt = () => {
    if (selectedNFTDetails) {
      const taunt = customTaunt || selectedNFTDetails.dawgTaunt || "Default taunt";
      enterBattle(selectedNFTDetails.tokenId, taunt);
    }
  };




  return (
    <Flex direction="column" align="center" minH="300px"  bgPosition="center" bgColor="rgba(0, 0, 0, 0.0)">




    <Box width="330px" height="270px" bg="white" p={4} borderRadius="md">
    <Menu>
    <MenuButton bg="blue.500" as={Button} rightIcon={<ChevronDownIcon />}>
    Select Dawg!
    </MenuButton>
    <MenuList>
  {nfts.owned.length > 0 && nfts.owned.some(nft => !nft.isInBattle) ? (
    nfts.owned.filter(nft => !nft.isInBattle).map((nft, index) => (
      <MenuItem key={index} minH="48px" onClick={() => handleSelectNFT(nft)}>
        <Image
            src={nft.imageUrl}
            width="60px"
            borderRadius="100%"
            alt={`NFT ${nft.tokenId}`}
        />
        <Box ml="12px">
            <Text  fontSize="sm" color="gray.500">{`NFT #${nft.tokenId}`}</Text>
            <Text color="gray.500" fontSize="sm" >{nft.dawgName || 'No Name'}</Text>

        </Box>
        </MenuItem>
       ))
     ) : (
       <MenuItem minH="48px">
         <Text fontSize="sm" color="gray.500">All Dawgz in Battles</Text>
       </MenuItem>
     )}
   </MenuList>
    </Menu>
    {selectedNFTDetails && (
    <Box mt="20px">
    <Image
      src={selectedNFTDetails.imageUrl}
      width="80px"
      alt={`NFT ${selectedNFTDetails.tokenId}`}
    />
    <Text fontSize="lg" fontWeight="bold" color="black">
      {selectedNFTDetails.dawgName || 'No Name'}
    </Text>
    <Text fontSize="md" fontStyle="italic" color="black">
      {selectedNFTDetails.dawgTaunt || 'No Taunt'}
    </Text>
    <Box mt="20px">
    <Input
      placeholder="Enter your custom taunt..."
      value={customTaunt || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTaunt(e.target.value)}
      mb="4"
    />




    <Button
  bg="red"
  onClick={enterBattleWithTaunt}
  disabled={isTransactionLoading}
>
  {isTransactionLoading
    ? 'Entering Battle...'
    : `Enter ${entryFee ? ethers.utils.formatEther(entryFee) : '0'} BNB Battle Arena`}
</Button>
       </Box>

    </Box>
        )}
      </Box>
    </Flex>
  );
};

export default QuickBattle;
