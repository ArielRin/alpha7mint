import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

import BnbPriceContext from '../BnbPriceContext'; // Import the context
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState , useContext} from 'react';
import { Pie } from 'react-chartjs-2';
import { ethers } from 'ethers';
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

import tokenAbi from './tokenAbi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NFT_CONTRACT_ADDRESS = "0xca695feb6b1b603ca9fec66aaa98be164db4e660";
import abiFile from './abiFile.json';

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';
import dawgBattleAbi from './dawgBattleOldAbi.json';

import BnbPrice from '../Components/BnbPrice';
import TokenPriceContext from '../TokenPriceContext';

const metadataBaseUrl = "https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Metadata/";


interface Attribute {
  trait_type: string;
  value: string | number; // Adjust based on the actual types of your values
}

// Define the NftMetadata interface
interface NftMetadata {
  attributes: Attribute[];
  // Include other properties of nftMetadata here
}


const NftDetails: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  console.log("Token ID:", tokenId);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This will take the user back to the previous page
  };


  const bnbPrice = useContext(BnbPriceContext); // Use the context
  const tokenPriceUSD = useContext(TokenPriceContext);

  // State for NFT and battle details
  const [nftDetails, setNftDetails] = useState({
    name: '',
    symbol: '',
    tokenURI: '',
    totalSupply: '',
    maxSupply: '',
    ownerAddress: '',
  });
  const [valueEarned, setValueEarned] = useState('');
  const [timesWon, setTimesWon] = useState(0);
  const [timesLost, setTimesLost] = useState(0);
  const [totalBattles, setTotalBattles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenStats, setTokenStats] = useState({ totalWon: 0, totalLose: 0, valueEarned: 0 });


  useEffect(() => {
    const fetchNftData = async () => {
      if (!window.ethereum) {
        setError('Please ensure MetaMask is installed.');
        setIsLoading(false);
        return;
      }

      if (!tokenId) {
        setError('No token ID provided.');
        setIsLoading(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abiFile, signer);

        const [name, symbol, tokenURI, totalSupply, maxSupply, ownerAddress] = await Promise.all([
          nftContract.name(),
          nftContract.symbol(),
          nftContract.tokenURI(tokenId),
          nftContract.totalSupply(),
          nftContract.maxSupply(),
          nftContract.ownerOf(tokenId),
        ]);

        setNftDetails({
          name,
          symbol,
          tokenURI,
          totalSupply: totalSupply.toString(),
          maxSupply: maxSupply.toString(),
          ownerAddress,
        });
      } catch (err) {
        console.error("Failed to fetch NFT data:", err);
        setError('Failed to fetch NFT data. Please check the network and token ID.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNftData();
  }, [tokenId]);


  useEffect(() => {
    const fetchTokenStats = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, provider);
        const stats = await contract.tokenStats(tokenId);

        setTokenStats({
          totalWon: stats.timesWon.toNumber(),
          totalLose: stats.timesLost.toNumber(),
          valueEarned: +(stats.valueEarned ? ethers.utils.formatEther(stats.valueEarned) : 0), // Handle null valueEarned
        });
      } catch (error) {
        console.error("Failed to fetch token stats:", error);
        setError('Failed to fetch token stats.');
      }
    };

    fetchTokenStats();
  }, [tokenId]);


      const [nftMetadata, setNftMetadata] = useState<NftMetadata | undefined>(undefined);

        useEffect(() => {
            const fetchNftMetadata = async () => {
                try {
                    const response = await fetch(`${metadataBaseUrl}${tokenId}.json`);
                    if (!response.ok) throw new Error('Network response was not ok.');
                    const metadata = await response.json();
                    setNftMetadata(metadata);
                } catch (error) {
                    console.error('Failed to fetch NFT metadata:', error);
                    setError('Failed to fetch NFT metadata.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchNftMetadata();
        }, [tokenId]);

        if (isLoading) return <Box>Loading...</Box>;
        if (error) return <Box>Error: {error}</Box>;
        if (!nftMetadata) return <Box>No data found.</Box>;




    const data = {
        labels: ['Wins', 'Losses'],
        datasets: [
            {
                label: 'Win/Lose Ratio',
                data: [tokenStats.totalWon, tokenStats.totalLose],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // This will hide the legend
    },
  },
  // Include other options here as needed
};

const valueEarnedParsed: number = parseFloat(tokenStats.valueEarned ?? "0");

// ##############################################################
  const imageUrl = `https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Image/${tokenId}.png`;
// ##############################################################


  // nft data fetch from url token // IDEA:


//         bg="rgba(0, 0, 0, 0.0)"
//         bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/ArtEngine/layers/Background/greenbackground%236.png')"

  return (

      <Flex
        direction="column"
        align="stretch"
        minH="100vh"
        bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/greenbkg.png')"
        bgPosition="center"
        bgSize="cover"
      >
  {/* ----------------------------------------------------------------------------------------- */}
        {/* Header */}
        <Flex
          bg="rgba(0, 0, 0, 0.75)"
          w="100%"
          p="3px"
          pl="7px"
          minH="70px"
          align="center"
          justify="space-between"
        >
          <Flex align="center">

            <Image src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/headerlogo.png" w="163px" />
            <ChakraLink as={RouterLink} to="/" color="white" ml="3"></ChakraLink>
          </Flex>
          <Box p="5px">
            <ConnectButton />
          </Box>
        </Flex>


{/* ----------------------------------------------------------------------------------------- */}

        {/* Row 2 with 2 main columns, responsive */}
        <Flex
          bg="rgba(0, 0, 0, 0.0)"
          w="100%"
          p="3px"
          minH="40px"
          marginTop="10px"
          gap="5px"
          align="stretch"
          flexDirection={{ base: "column", md: "row" }} // Stacks on smaller screens
        >
          {/* Column 1 with 3 nested columns, responsive */}
          <Flex
            flex="1"
            bg="rgba(0, 0, 0, 0.0)"
            gap="5px"
            minH="100%"
            flexDirection={{ base: "column", md: "row" }} // Stacks nested columns on smaller screens
          >
            {/* Nested Column 1 */}
            <Box
      w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 33.3% on medium and up
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="100%"
      onClick={handleBackClick} // Adding the click event handler to the Box
      cursor="pointer" // Change cursor to pointer on hover to indicate clickable
    >
      <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">Back</Text>
    </Box>

            {/* Nested Column 2 */}
            <Box
              w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 40% on medium and up
              bg="rgba(0, 0, 0, 0.75)"
              p="5px"
              minH="100%"
            >

                          <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">Dawgz Tag: #{tokenId} / {nftDetails.maxSupply}</Text>
            </Box>

            {/* Nested Column 3 */}
            <Box
              w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 40% on medium and up
              bg="rgba(0, 0, 0, 0.75)"
              p="5px"
              minH="100%"
              display="flex" // Use flexbox to align children
              flexDirection="column" // Stack children vertically
              justifyContent="center" // Center children vertically
              alignItems="center" // Center children horizontally
              >

                          <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">Dawgz Details Page Header</Text>

            </Box>

          </Flex>

          {/* Column 2 */}

        <Box
          flex="1"
          bg="rgba(0, 0, 0, 0.7)"
          p="3px"
          minH="100%"
          w={{ base: "100%", md: "auto" }} // Full width on small screens
          display="flex" // Use flexbox to align children
          flexDirection="column" // Stack children vertically
          justifyContent="center" // Center children vertically
          alignItems="center" // Center children horizontally
          >
            <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">
            Owner: {nftDetails.ownerAddress}
            </Text>
          </Box>
        </Flex>

  {/* ----------------------------------------------------------------------------------------- */}

    {/* OK this bits the dred (for now )  */}

  {/* Row 3 with 2 main columns adjusting to 1 column first, then inner columns adjust */}
<Flex
bg="rgba(0, 0, 0, 0.0)"
w="100%"
p="3px"
minH="320px"
marginTop="10px"
gap="5px"
flexDirection={{ base: "column", lg: "row" }} // Main columns stack on base to large, then flex to row on larger screens
>
{/* Main Column 1 */}
<Flex
flex="1"
bg="rgba(0, 0, 0, 0.0)"
gap="5px"
flexDirection="column" // Stays as column until a specific larger breakpoint if needed
>
{/* Column 1 Left & Right together adjusting to row on a larger screen */}
<Flex
flexDirection={{ base: "column", md: "row" }} // Adjusts from column to row on medium screens
w="100%"
gap="5px"

minH="100%"
>{/* Square Box Left */}
<Box
  flex="1"
  bg="rgba(0, 0, 0, 0.75)"
  p="5px"
  w={{ base: "100%", md: "40%" }}
  display="flex" // Use flex to center the content
  flexDirection="column" // Stack children vertically
  alignItems="center" // Center content horizontally
  justifyContent="center" // Center content vertically
>
<Image
src={`https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/Image/${tokenId}.png`}
w="80%" // Set the image width to 80% of its parent
objectFit="contain" // Ensure the aspect ratio is maintained
m="auto" // Margin auto for additional centering if needed
borderRadius="40px" // Apply rounded edges
/>
</Box>


{/* Remaining Width Right */}
<Flex
flexDirection="column"
flex="1"
bg="rgba(0, 0, 0, 0.0)"
>
<Box
 flex="1"
 bg="rgba(0, 0, 0, 0.75)"
 p="5px"
 minH="50%" // Ensures the Box takes up the minimum height of its container
   w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
   display="flex" // Use Flexbox to arrange children
   flexDirection="column" // Align children vertically
   justifyContent="center" // Center children vertically
   alignItems="center" // Center children horizontally
   >
  <Text color="white">Dawgz Name</Text>
  <Box>

        {nftMetadata.attributes.map((attr: Attribute) => {
        if (["Dawgz Name"].includes(attr.trait_type)) {

              return (
                  <Text color="white" fontSize="32px" fontWeight="bolder" textAlign="center"  key={attr.trait_type}>
                      {`${attr.value}`}
                  </Text>
              );
          }
          return null;
      })}
  </Box>
</Box>
<Box
 flex="1"
 bg="rgba(0, 0, 0, 0.75)"
 p="5px"
 minH="50%" // Ensures the Box takes up the minimum height of its container
   w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
   display="flex" // Use Flexbox to arrange children
   flexDirection="column" // Align children vertically
   justifyContent="center" // Center children vertically
   alignItems="center" // Center children horizontally
   >
   <Text color="white">Dawgz Taunt Phrase</Text>
   <Box>
     {nftMetadata.attributes.map((attr: Attribute) => {
         if (["Taunt"].includes(attr.trait_type)) {

               return (
                   <Text color="white" fontSize="20px" fontWeight="bold" textAlign="center"  key={attr.trait_type}>
                       {`${attr.value}`}
                   </Text>
               );
           }
           return null;
       })}
   </Box>
</Box>
</Flex>
</Flex>

</Flex>

{/* Main Column 2 */}
<Flex
flex="1"
bg="rgba(0, 0, 0, 0.0)"
flexDirection={{ base: "column", md: "row" }} // This now flexes the entire Column 2 to row on medium screens
gap="5px"
>

{/* Column 2 Left with Rows */}
<Flex
flexDirection="column"
flex="1"
bg="rgba(0, 0, 0, 0.0)"

>
<Box  flex="1"
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="50%" // Ensures the Box takes up the minimum height of its container
        w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
        display="flex" // Use Flexbox to arrange children
        flexDirection="column" // Align children vertically
        justifyContent="center" // Center children vertically
        alignItems="center" // Center children horizontally
       >

<Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">
Dawgz Total Battle Value</Text>
  <Text color="white" fontSize="28px" fontWeight="bolder" textAlign="center">
    {tokenStats.valueEarned} BNB
  </Text>
  <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">
  ${((parseFloat(tokenStats.valueEarned ?? "0") ?? 0) * bnbPrice).toFixed(2)} USD
  </Text>
</Box>
{/* Box split into 2 columns for win/lose ratio and battle count */}
<Flex
bg="rgba(0, 0, 0, 0.0)"
p="0px"
marginTop="5px"
gap="5px"
minH="140px"
flexDirection={{ base: "column", md: "row" }}
>
    {/* Win/Lose Ratio Column */}

    <Box
    flex="1" // Allow to grow and shrink equally
    minWidth="40%" // Minimum width to prevent the box from getting too small
    bg="rgba(0, 0, 0, 0.75)"
    p='25px'
    display="flex"
      w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
      flexDirection="column" // Align children vertically
      justifyContent="center" // Center children vertically
      alignItems="center" // Center children horizontally

  >
      <Pie data={data} options={{...options, maintainAspectRatio: true }} />
  </Box>

    {/* Battle Count Column */}
    <Box
    flex="1" // Allow to grow and shrink equally
    minWidth="50%" // Adjust based on your layout needs
    bg="rgba(0, 0, 0, 0.75)"
    display="flex"
    flexDirection="column"
    alignItems="center" // Centers content horizontally<Box
     p="5px"
       w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
       justifyContent="center" // Center children vertically

      >

    {/* Subtitle */}
    <Text color="white" fontSize="12px" fontWeight="bold" textAlign="center" mt="4">
      Battles Won
    </Text>

    {/* Value */}
    <Text color="white" fontSize="22px" fontWeight="bolder" textAlign="center">
      {tokenStats.totalWon}
    </Text>

    {/* Subtitle */}
    <Text color="white" fontSize="12px" fontWeight="bold" textAlign="center" mt="4">
      Battles Lost
    </Text>

    {/* Value */}
    <Text color="white" fontSize="22px" fontWeight="bolder" textAlign="center">
      {tokenStats.totalLose}
    </Text>
    </Box>
  </Flex>
</Flex>

{/* Column 2 Right with Rows */}
<Flex
flexDirection="column"
flex="1"
gap="5px"
bg="rgba(0, 0, 0, 0.0)"
>
<Box
minWidth="60%" // Adjust based on your layout needs
bg="rgba(0, 0, 0, 0.75)"
display="flex"
 flex="1"
 p="5px"
 minH="50%" // Ensures the Box takes up the minimum height of its container
   w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
   flexDirection="column" // Align children vertically
   justifyContent="center" // Center children vertically
   alignItems="center" // Center children horizontally
  >
  <Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">
  Battle Count</Text>
  <Text color="white" fontSize="28px" fontWeight="bolder" textAlign="center">
  {(parseFloat(tokenStats.totalWon) + parseFloat(tokenStats.totalLose)).toFixed(0)}</Text>
</Box>
<Box
minWidth="60%" // Adjust based on your layout needs
bg="rgba(0, 0, 0, 0.75)"
display="flex"
 flex="1"
 p="5px"
 minH="50%" // Ensures the Box takes up the minimum height of its container
   w={{ base: "100%", md: "auto" }} // Full width on small screens, auto width on medium screens and up
   flexDirection="column" // Align children vertically
   justifyContent="center" // Center children vertically
   alignItems="center" // Center children horizontally
  >
<Text color="white" fontSize="14px" fontWeight="bolder" textAlign="center">
  Total Battles this Dawg Has Entered</Text>
  <Text color="white" fontSize="32px" fontWeight="bolder" textAlign="center">
  {(parseFloat(tokenStats.totalWon) + parseFloat(tokenStats.totalLose)).toFixed(0)}</Text>
</Box>
</Flex>
</Flex>
</Flex>


  {/* ----------------------------------------------------------------------------------------- */}

        {/* Row 4 */}
        {/* New Row with 2 Columns, Each with 2 Rows */}
<Flex
  w="100%"
  p="3px"
  gap="5px"
  flexDirection={{ base: "column", md: "row" }} // Adjusts layout based on screen size
>
  {/* Column 1 */}
  <Flex
    flex="1"
    flexDirection="column"
    gap="5px"
  >
    {/* Row 1 in Column 1 */}
    <Box
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
      <Box>
        {nftMetadata.attributes.map((attr: Attribute) => {
            if (["Dawg"].includes(attr.trait_type)) {

                  return (
                    <Text color="white" fontSize="22px" fontWeight="bold" textAlign="center" key={attr.trait_type}>
                          {`Dawg Breed: ${attr.value}`}
                      </Text>
                  );
              }
              return null;
          })}
      </Box>
    </Box>

    {/* Row 2 in Column 1 */}
    <Box
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="120px" // Adjust the height as needed
    >
    <Text color="white" fontSize="22px" fontWeight="bold" textAlign="center" >
      Dawg Bio
      </Text>
    </Box>
  </Flex>

  {/* Column 2 */}
  <Flex
    flex="1"
    flexDirection="column"
    gap="5px"
  >
    {/* Row 1 in Column 2 */}
    <Box
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
    <Text color="white" fontSize="22px" fontWeight="bold" textAlign="center" >
    View on Element NFT Marketplace
    </Text>
    </Box>

    {/* Row 2 in Column 2 */}
    <Box
      bg="rgba(0, 0, 0, 0.75)"
      p="5px"
      minH="120px" // Adjust the height as needed
    >
    <Text color="white" fontSize="22px" fontWeight="bold" textAlign="center" >
      View on BSCSCAN
      </Text>
    </Box>
  </Flex>
</Flex>


  {/* ----------------------------------------------------------------------------------------- */}
  {/* Blank Row
  <Flex
    w="100%"
    p="3px"
    bg="rgba(0, 0, 0, 0.0)"
    gap="5px"
    minH="40px" // Adjust the height as needed
    flexDirection={{ base: "column", md: "row" }} // Adjusts layout based on screen size
  >
  </Flex>
  ----------------------------------------------------------------------------------------- */}


        {/* Row 5 */}
        <Flex
          w="100%"
          p="3px"
          gap="5px"
          flexDirection={{ base: "column", md: "row" }} // Adjusts layout based on screen size
        >
          {/* Column 1 */}
          <Flex
            flex="1"
            flexDirection="column"
            gap="5px"
          >
          {/* Column 1 Left with 2 Rows */}
          <Flex
          flexDirection="column"
          flex="1"
          gap="5px"
          bg="rgba(0, 0, 0, 0.0)"
          >
          <Box flex="1" bg="rgba(0, 0, 0, 0.75)"  minH="150px">
            <Text color="white">Active Battle Cards View</Text>
          </Box>
          <Box flex="1" bg="rgba(0, 0, 0, 0.75)"  marginTop='5px' minH="200px">
            <Text color="white">Recent Battles List View</Text>
          </Box>
          </Flex>

          </Flex>

          {/* Column 2 */}
          <Flex
            flex="1"
            flexDirection="column"
            gap="5px"
          >
            {/* Row 1 in Column 2 */}
            <Box
              bg="rgba(0, 0, 0, 0.75)"
              p="5px"

              minH="400px" // Adjust the height as needed
            >
              <Text color="white">NFT MetaData and Traits</Text>
              <Flex direction="column" align="stretch" minH="100vh">
          {/* Ensure nftMetadata is not null before attempting to access its properties */}
          {nftMetadata && (
              <Box>
                  {/* Display specific attributes */}


                  {/* Display specific attributes */}
                  <Box>
                  </Box>
              </Box>
          )}
      </Flex>


            </Box>

          </Flex>
        </Flex>


  {/* ----------------------------------------------------------------------------------------- */}

        {/* Row 6 */}
        <Flex
          w="100%"
          p="3px"
          gap="5px"
          flexDirection={{ base: "column", md: "row" }} // Adjusts layout based on screen size
        >
          {/* Column 1 */}
          <Flex
            flex="1"
            flexDirection="column"
            gap="5px"
          >
            {/* Row 1 in Column 1 */}
            <Box
              bg="rgba(0, 0, 0, 0.75)"
              p="5px"
              minH="40px" // Adjust the height as needed
            >
              <Text color="white">Owner History</Text>
            </Box>

          </Flex>

          {/* Column 2 */}
          <Flex
            flex="1"
            flexDirection="column"
            gap="5px"
          >
            {/* Row 1 in Column 2 */}
            <Box
              bg="rgba(0, 0, 0, 0.75)"
              p="5px"
              minH="40px" // Adjust the height as needed
            >
              <Text color="white">Prize Claim and Points System (todo)</Text>
            </Box>

          </Flex>

        </Flex>



  {/* ----------------------------------------------------------------------------------------- */}

        {/* Footer */}
        <Box bg="rgba(0, 0, 0, 0.9)" w="100%" p="3px" minH="150px" mt="auto" >
          <Text color="white">Footer</Text>

          <Text color="white">Symbol: {nftDetails.symbol} {tokenId}</Text>
        </Box>
      </Flex>
    );
  };

export default NftDetails;

      //   <YourActiveBattles />






      // <Text>Token URI: {nftDetails.tokenURI}</Text>

      //        <Text mb="2">------------------------------------------------------</Text>
      // <Text mb="2">Connected Accounts Address: {userAddress}</Text>
      // <Text mb="2">Connected Accounts BNB Balance: {bnbBalance} BNB (${(parseFloat(bnbBalance) * parseFloat(bnbPriceInUSD)).toFixed(2)} USD)</Text>
      // <Text mb="2">Connected Accounts Alpha7 Token Balance: {alpha7TokenBalance} ALPHA7 Tokens (${(parseFloat(alpha7TokenBalance) * parseFloat(tokenPriceUSD)).toFixed(2)} USD)</Text>
      // <Text mb="2">Connected Wallet LP Token Balance: {connectedWalletLPTokenBalance} Tokens (${(parseFloat(connectedWalletLPTokenBalance) * parseFloat(lpTokenValue) * 2).toFixed(2)} USD)</Text>
      //       <Text mb="2">------------------------------------------------------</Text>
      //             <Text mb="2">------------------------------------------------------</Text>
      //
