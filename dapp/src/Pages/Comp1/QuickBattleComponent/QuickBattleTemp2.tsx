

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

import { Web3Provider } from '@ethersproject/providers'; // Import Web3Provider


import tokenAbi from './tokenAbi.json';

import abiFile from './abiFile.json';
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
const BATTLE_CONTRACT_ADDRESS = '0x0460eCB4cf623C83Ac066347de9F4Bf5A0A6495c';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";

const ITEMS_PER_PAGE = 50;













// Other imports you might need



interface QuickBattleProps {
  tokenId: number;
}

const QuickBattle: React.FC<QuickBattleProps> = ({ tokenId }) => {





  const fallbackRpcUrl = "https://bsc-dataseed1.ninicoin.io";
    let web3Provider: Web3Provider | null = null;

    if ((window as any).ethereum) {
      web3Provider = new Web3Provider((window as any).ethereum);
    }
    const provider = web3Provider ?? new ethers.providers.JsonRpcProvider(fallbackRpcUrl);
    const signer = web3Provider ? web3Provider.getSigner() : null;


  const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer || provider);



  interface NFT {
    tokenId: number;
    imageUrl: string;
    isRegistered: boolean;
    isInBattle: boolean;
  }



  const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNFTDetails, setSelectedNFTDetails] = useState<NFT | null>(null);
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
     const fetchDetails = async () => {
       const details = await fetchNftData(tokenId);
       setSelectedNFTDetails(details);
     };

     if (tokenId) {
       fetchDetails();
     }
   }, [tokenId]);

   useEffect(() => {
    const fetchNfts = async () => {
      if (!signer) {
        console.error("Signer not available");
        return;
      }

      setIsLoading(true);
      try {
        const walletAddress = await signer.getAddress();
        const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, signer);
        const dawgRegistrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, signer);
        const battleContractInstance = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

        const ownedTokenIds: BigNumber[] = await userRegistryContract.listNFTs(walletAddress);
        const ownedTokenIdsArray: number[] = ownedTokenIds.map((tokenId) => tokenId.toNumber());

        const ownedNftsData = await Promise.all(ownedTokenIdsArray.map(async (tokenId: number) => {
          const metadata = await fetchNftData(tokenId);
          const isRegistered = await dawgRegistrationContract.isNFTRegistered(tokenId);
          const isInBattle = await battleContractInstance.tokenInBattle(tokenId);

          return {
            ...metadata,
            isRegistered,
            isInBattle
          };
        }));

        setNfts({ owned: ownedNftsData });
      } catch (error) {
        console.error("Failed to fetch owned NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNfts();
  }, [currentPage, signer]);




  const fetchNftData = async (tokenId: number) => {
      const imageUrl = `/NFTDATA/Image/${tokenId}.png`;

      // You might need to fetch or calculate these values based on your application's logic
      const isRegistered = false; // default value
      const isInBattle = false; // default value

      return {
          tokenId,
          imageUrl,
          isRegistered,
          isInBattle
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

const [battleEntrySuccess, setBattleEntrySuccess] = useState({ success: false, tokenId: 0 });

const enterBattle = async (tokenId: number, dawgTaunt: string) => {
  try {
    setIsTransactionLoading(true);
    const entryFee = await fetchEntryFee();
    const transaction = await battleContract.enterBattle(tokenId, dawgTaunt, { value: entryFee });
    await transaction.wait();
    setBattleEntrySuccess({ success: true, tokenId }); // Update success state
    console.log('Battle entered successfully');
  } catch (error) {
    console.error('Error entering battle:', error);
  } finally {
    setIsTransactionLoading(false);
  }
};


 const [customTaunt, setCustomTaunt] = useState<string | null>(null);

  // ... other functions ...
  const enterBattleWithTaunt = () => {
    if (selectedNFTDetails) {
      // Use customTaunt if available, otherwise default to "Default taunt"
      const taunt = customTaunt || "Default taunt";
      enterBattle(selectedNFTDetails.tokenId, taunt);
    }
  };





  return (
    <Flex direction="column" align="center" minH="300px"  bgPosition="center" bgColor="rgba(0, 0, 0, 0.0)">




    <Box width="330px" minH="290px" bg="white" p={4} borderRadius="md">

    {selectedNFTDetails && (
    <Box mt="20px" >
    <Text  fontSize="lg" fontWeight="bold" textAlign="center" color="black">
    Battle This Dawg Now!
    </Text>
    <Box display="flex" justifyContent="center" alignItems="center" mt="20px">
    <Image
      src={selectedNFTDetails.imageUrl}
      width="150px" // Adjust this value for the desired size
      alt={`NFT ${selectedNFTDetails.tokenId}`}
    />
  </Box>

  <Box mt="20px">
    <Input
      placeholder="Enter your custom taunt..."
      value={customTaunt || ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTaunt(e.target.value)}
      my="5px" // Margin top and bottom
    />
    {battleEntrySuccess.success && battleEntrySuccess.tokenId !== 0 && (
      <Box color="green.500" fontSize="md" my={4}>
        Successfully entered Dawg #{battleEntrySuccess.tokenId} in battle!
      </Box>
    )}



  <Box display="flex" justifyContent="center" alignItems="center" mt="20px">


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

    </Box>
        )}

      </Box>

    </Flex>
  );
};

export default QuickBattle;
//
// <Text fontSize="lg" fontWeight="bold" color="black">
//   {selectedNFTDetails.dawgName || 'No Name'}
// </Text>
// <Text fontSize="md" fontStyle="italic" color="black">
//   {selectedNFTDetails.dawgTaunt || 'No Taunt'}
// </Text>
