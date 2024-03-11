
import DawgRegistration from '../Components/DawgRegistration/DawgRegistration'; // //
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

const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";
const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7"; // Contract address

const NFT_CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366";
const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';
const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";

const ITEMS_PER_PAGE = 50;

const TheDawgz: React.FC = () => {
  interface NFT {
    tokenId: number;
    imageUrl: string;
    name: string;
    isRegistered: boolean;
    dawgName?: string;
    dawgTaunt?: string;
}



    const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    const [nftList, setNftList] = useState([]);





    useEffect(() => {
    const fetchNfts = async () => {
        setIsLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const walletAddress = await signer.getAddress();

            const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);
            const dawgRegistrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);

            const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);
            const ownedTokenIdsArray = ownedTokenIds.map((tokenId) => tokenId.toNumber());

            // Update the nftList state with the fetched token IDs
            setNftList(ownedTokenIdsArray);

            const ownedNftsData = await Promise.all(
                ownedTokenIdsArray.map(async (tokenId) => {
          const metadata = await fetchNftData(tokenId);
          const imageUrl = `https://alpha7.live/NFTDATA/Image/${tokenId}.png`;
          const isRegistered = await dawgRegistrationContract.isNFTRegistered(tokenId);

          let dawgName = null;
          let dawgTaunt = null; // Initialize variable for Dawg Taunt

          if (isRegistered) {
            dawgName = await dawgRegistrationContract.dawgzNames(tokenId);
            dawgTaunt = await dawgRegistrationContract.dawgzDefaultTaunts(tokenId); // Fetch Dawg Taunt
          }

          return { ...metadata, tokenId, isRegistered, dawgName, dawgTaunt, imageUrl }; // Include dawgTaunt in the return object
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

const [selectedNFTDetails, setSelectedNFTDetails] = useState(null);

const handleSelectNFT = (nft) => {
    setSelectedNFTDetails(nft);
};






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
            <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
                <VStack spacing={4}>
                <Box width="330px" height="400px" bg="white" p={4} borderRadius="md">
    <Menu>
        <MenuButton bg="blue.500" as={Button} rightIcon={<ChevronDownIcon />}>
            Select NFT
        </MenuButton>
        <MenuList>
            {nfts.owned.map((nft, index) => (
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
            ))}
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
    </Box>
)}

</Box>

                                            </VStack>
            </Box>

      <Box width="90%" minH="800px" mx="auto" shadow="md" borderRadius="md" overflow="hidden" borderWidth="0px" borderColor="red.650" bgColor="rgba(0, 0, 0, 0.8)" color="gray.600">
          <Tabs variant="enclosed-colored" size="lg" colorScheme="gray">
              <TabList mb="1em" bg={tabBackground}>
                  <Tab _selected={{ color: activeTabColor }} _focus={{ boxShadow: 'none' }}>Your Dawgz</Tab>
              </TabList>

              <TabPanels>
                  <TabPanel>
                  <SimpleGrid columns={[1, 2, 2, 3]} spacing="20px">
    {nfts.owned.length > 0 ? (
      nfts.owned.map((nft) => (
        <VStack key={nft.tokenId} p="5" minW="250px" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white" alignItems="flex-start">
          <Box position="relative">
            <Text position="absolute" top="0" left="2" fontSize="md" fontWeight="semibold">
              AlphaDawg# {nft.tokenId}
            </Text>
            <Image src={nft.imageUrl} marginTop="38px" alt={`NFT ${nft.name}`} borderRadius="md" />
            <Flex justifyContent="space-between" alignItems="center" mt="2">
              {nft.isRegistered ? (
                <Text fontSize="32px" fontWeight="semibold" color="green.500"> {nft.dawgName}</Text>
              ) : (
                <Button colorScheme="pink" onClick={() => handleRegisterDawg(nft)}>
                  Register Dawg
                </Button>
              )}
              <Flex>
                {nft.isRegistered && (
                  <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/dog-tag.png" alt="Registered" boxSize="40px" mr="2" />
                )}
                {nft.tokenId < 101 && (
                  <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/1001.png" alt="First 100" boxSize="40px" />
                )}
              </Flex>
            </Flex>
            {nft.isRegistered && (
              <Text mt="2" fontSize="md" fontStyle="italic">"{nft.dawgTaunt}"</Text>
            )}
          </Box>

          <Flex w="100%" minH="68px" >
          <Flex direction="column" w="65%" justifyContent="flex-start" alignItems="flex-start">
            <Button as={RouterLink} to={`/nftdetails/${nft.tokenId}`} colorScheme="green">Details</Button>
            {nft.isRegistered && (
              <Button
                as="a"
                href={`https://bscscan.com/address/${nft.tokenId}`}
                target="_blank"
                bg="red"
              >
                Battle your Dawg!
              </Button>
            )}
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

            <ChakraLink
  onClick={() => addNftToWallet(nft.tokenId)}
  color="blue.500"
  cursor="pointer"
  marginTop="12px"
  display="flex"
  alignItems="center"
>
  <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/dog.png" boxSize="20px" mr="2" />
  <Text ml="5px">Add your NFT to Wallet</Text>
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
               <QRCode value={`https://element.market/assets/bsc/0xca695feb6b1b603ca9fec66aaa98be164db4e660/${nft.tokenId}`} size={72} />
             </Center>
             <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/public/element.png" alt="Element" mt="3" alignSelf="center" />
           </ChakraLink>
         </Box>
       </Flex>
     </VStack>
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
