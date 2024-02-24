import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // Adjust the import path as necessary

const NftDetails: React.FC = () => {
  const [userAddress, setUserAddress] = useState('');
  const [alpha7TokenBalance, setAlpha7TokenBalance] = useState('0.0000');
  const [bnbBalance, setBnbBalance] = useState('0.0000');
  const [developerTokenBalance, setDeveloperTokenBalance] = useState('0.0000');
  const [treasuryTokenBalance, setTreasuryTokenBalance] = useState('0.0000');
  const [developerBNBBalance, setDeveloperBNBBalance] = useState('0.0000');
  const [treasuryBNBBalance, setTreasuryBNBBalance] = useState('0.0000');
  const [alpha7LPTokenSupply, setAlpha7LPTokenSupply] = useState('0.0000');
    const [tokenPriceUSD, setTokenPriceUSD] = useState('Loading...');

    const [connectedWalletLPTokenBalance, setConnectedWalletLPTokenBalance] = useState('0.0000');
const [developerWalletLPTokenBalance, setDeveloperWalletLPTokenBalance] = useState('0.0000');
const [nftTreasuryWalletLPTokenBalance, setNftTreasuryWalletLPTokenBalance] = useState('0.0000');



  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

          const fetchBNBBalance = async (walletAddress: string) => {
          const balanceWei = await provider.getBalance(walletAddress);
          return parseFloat(ethers.utils.formatEther(balanceWei)).toFixed(4);
        };


        setBnbBalance(await fetchBNBBalance(address));
        setDeveloperBNBBalance(await fetchBNBBalance(DEVELOPER_WALLET_ADDRESS));
        setTreasuryBNBBalance(await fetchBNBBalance(TREASURY_WALLET_ADDRESS));

        // Fetch Alpha7 token balance
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, tokenAbi, signer);
        const balance = await tokenContract.balanceOf(address);
        setAlpha7TokenBalance(parseFloat(ethers.utils.formatUnits(balance, 9)).toFixed(0));

        // Fetch developer and treasury token balances
        const developerBalance = await tokenContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        const treasuryBalance = await tokenContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setDeveloperTokenBalance(parseFloat(ethers.utils.formatUnits(developerBalance, 9)).toFixed(0));
        setTreasuryTokenBalance(parseFloat(ethers.utils.formatUnits(treasuryBalance, 9)).toFixed(0));

        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, provider);
        const lpTokenSupply = await alpha7LPContract.totalSupply();
        // Correctly format the supply for a token with 9 decimal places
        const formattedLPSupply = parseFloat(ethers.utils.formatUnits(lpTokenSupply, 18)).toFixed(6);
        setAlpha7LPTokenSupply(formattedLPSupply);

      }
    };

    fetchWalletDetails();
  }, []);

  const [bnbPriceInUSD, setBnbPriceInUSD] = useState('');

  useEffect(() => {
    const fetchWalletDetails = async () => {
      // Existing wallet detail fetches
    };

    const fetchBnbPrice = async () => {
      const apiUrl = 'https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'; // Replace this with the actual URL
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const bnbPrice = data.data.attributes.token_prices['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'];
        setBnbPriceInUSD(bnbPrice);
      } catch (error) {
        console.error('Failed to fetch BNB price:', error);
      }
    };

    fetchWalletDetails();
    fetchBnbPrice(); // Call the function to fetch BNB price
  }, []);


  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/0x88CE0d545cF2eE28d622535724B4A06E59a766F0`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          const { fdv_usd, total_reserve_in_usd, price_usd } = attributes;

          setMarketCap(fdv_usd ? `$${parseFloat(fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(total_reserve_in_usd ? `${parseFloat(total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          // Directly using the price_usd string to avoid conversion issues
          setTokenPriceUSD(price_usd ? `${price_usd}` : 'Price not available');
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
      });
  }, []);


      // ##############################################################
      // ##############################################################

  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('Loading...');
    const [totalReserveInUSD, setTotalReserveInUSD] = useState('Loading...');
      const [marketCap, setMarketCap] = useState('Loading...');

  useEffect(() => {
    if (totalReserveInUSD !== 'Loading...' && totalReserveInUSD !== 'Total Reserve not available' && totalReserveInUSD !== 'Error fetching data') {
      // Extract the number from the formatted currency string
      const reserveValue = Number(totalReserveInUSD.replace(/[^0-9.-]+/g, ""));
      const liquidityValue = reserveValue * 2;
      setTotalLiquidityUSD(`${liquidityValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`); // Format as currency
    }
  }, [totalReserveInUSD]); // Dependency on totalReserveInUSD

  const [lpTokenValue, setLpTokenValue] = useState('Loading...');
  useEffect(() => {
    const url = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${TOKEN_CONTRACT_ADDRESS}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const attributes = data?.data?.attributes;

        if (attributes) {
          setMarketCap(attributes.fdv_usd ? `$${parseFloat(attributes.fdv_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Market Cap not available');
          setTotalReserveInUSD(attributes.total_reserve_in_usd ? `${parseFloat(attributes.total_reserve_in_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : 'Total Reserve not available');
          setTokenPriceUSD(attributes.price_usd ? `${attributes.price_usd}` : 'Price not available');

          // Calculate and set LP Token Value
          const reserveNumeric = parseFloat(attributes.total_reserve_in_usd);
          const supplyNumeric = parseFloat(alpha7LPTokenSupply);
          if (!isNaN(reserveNumeric) && !isNaN(supplyNumeric) && supplyNumeric > 0) {
            setLpTokenValue((reserveNumeric / supplyNumeric).toFixed(8));
          } else {
            setLpTokenValue('Calculation error');
          }
        } else {
          setMarketCap('Data not available');
          setTotalReserveInUSD('Data not available');
          setTokenPriceUSD('Price not available');
          setLpTokenValue('Data not available');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMarketCap('Error fetching data');
        setTotalReserveInUSD('Error fetching data');
        setTokenPriceUSD('Error fetching price');
        setLpTokenValue('Error fetching data');
      });
  }, [alpha7LPTokenSupply]);

  useEffect(() => {
    const fetchLPTokenBalances = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const alpha7LPContract = new ethers.Contract(ALPHA7_LP_TOKEN_ADDRESS, tokenAbi, signer);

        // Fetch LP token balance for the connected wallet
        const connectedWalletAddress = await signer.getAddress();
        const connectedWalletLPBalance = await alpha7LPContract.balanceOf(connectedWalletAddress);
        setConnectedWalletLPTokenBalance(ethers.utils.formatUnits(connectedWalletLPBalance, 18)); // Adjusted for 18 decimal places

        // Fetch LP token balance for the developer wallet
        const developerWalletLPBalance = await alpha7LPContract.balanceOf(DEVELOPER_WALLET_ADDRESS);
        setDeveloperWalletLPTokenBalance(ethers.utils.formatUnits(developerWalletLPBalance, 18)); // Adjusted for 18 decimal places

        // Fetch LP token balance for the NFT Treasury wallet
        const nftTreasuryWalletLPBalance = await alpha7LPContract.balanceOf(TREASURY_WALLET_ADDRESS);
        setNftTreasuryWalletLPTokenBalance(ethers.utils.formatUnits(nftTreasuryWalletLPBalance, 18)); // Adjusted for 18 decimal places
      }
    };

    fetchLPTokenBalances();
  }, []);

//         bg="rgba(0, 0, 0, 0.0)"
//         bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/master/ArtEngine/layers/Background/greenbackground%236.png')"

  return (

      <Flex
        direction="column"
        align="stretch"
        minH="100vh"
        bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/master/ArtEngine/layers/Background/greenbackground%236.png')"
        bgPosition="center"
        bgSize="cover"
      >
  {/* ----------------------------------------------------------------------------------------- */}
        {/* Header */}
        <Flex
          bg="rgba(0, 0, 0, 0.85)"
          w="100%"
          p="3px"
          pl="7px"
          minH="70px"
          align="center"
          justify="space-between"
        >
          <Flex align="center">
            <Image src="https://prismatic-semifreddo-aec57e.netlify.app/assets/headerlogo.90cb497a.png" w="163px" />
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
              w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 20% on medium and up
              bg="rgba(0, 0, 0, 0.85)"
              p="5px"
              minH="100%"
            >
              <Text color="white">Back</Text>
            </Box>

            {/* Nested Column 2 */}
            <Box
              w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 40% on medium and up
              bg="rgba(0, 0, 0, 0.85)"
              p="5px"
              minH="100%"
            >
              <Text color="white">TokenID</Text>
            </Box>

            {/* Nested Column 3 */}
            <Box
              w={{ base: "100%", md: "33.3%" }} // Full width on small screens, 40% on medium and up
              bg="rgba(0, 0, 0, 0.85)"
              p="5px"
              minH="100%"
            >
              <Text color="white">Dawgz Details Page Header</Text>
            </Box>
          </Flex>

          {/* Column 2 */}

          <Box
            flex="1"
            bg="rgba(0, 0, 0, 0.7)"
            p="3px"
            minH="100%"
            w={{ base: "100%", md: "auto" }} // Full width on small screens
          >
            <Text color="white">Connected Wallet address</Text>
          </Box>
        </Flex>

  {/* ----------------------------------------------------------------------------------------- */}

    {/* OK this bits the dred (for now )  */}

  {/* Row 3 with 2 main columns adjusting to 1 column first, then inner columns adjust */}
<Flex
bg="rgba(0, 0, 0, 0.0)"
w="100%"
p="3px"
minH="150px"
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
  bg="rgba(0, 0, 0, 0.85)"
  p="5px"
  w={{ base: "100%", md: "40%" }}
  display="flex" // Use flex to center the content
  flexDirection="column" // Stack children vertically
  alignItems="center" // Center content horizontally
  justifyContent="center" // Center content vertically
>
<Image
src="https://raw.githubusercontent.com/ArielRin/alpha7mint/master/NFTDATA/Image/43.png"
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
<Box flex="1" bg="rgba(0, 0, 0, 0.85)" p="5px">
  <Text color="white">Dawgz Name</Text>
</Box>
<Box flex="1" bg="rgba(0, 0, 0, 0.85)" p="5px" marginTop='5px'>
  <Text color="white">Dawgz Taunt Phrase</Text>
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
<Box flex="1"
minH="150px" bg="rgba(0, 0, 0, 0.85)" p="5px">
  <Text color="white">Total Battle Prize Value</Text>
</Box>
{/* Box split into 2 columns for win/lose ratio and battle count */}
  <Flex
    bg="rgba(0, 0, 0, 0.0)"
    p="0px"
    marginTop='5px'
    gap="5px"
    minH="200px"
    flex="1" // Ensure it takes full height of its parent flex division
    flexDirection={{ base: "column", md: "row" }} // Adjusts layout based on screen size
  >
    {/* Win/Lose Ratio Column */}
    <Box
      flex="1" // Takes up half the space
        bg="rgba(0, 0, 0, 0.85)"
      display="flex"
      flexDirection="column"
    >
      <Text color="white">Win/Lose Ratio Pie Chart </Text>
    </Box>

    {/* Battle Count Column */}
    <Box
      flex="1" // Takes up half the space
        bg="rgba(0, 0, 0, 0.85)"
      display="flex"
      flexDirection="column"
    >
      <Text color="white">Battle Count</Text>
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
<Box flex="1" bg="rgba(0, 0, 0, 0.85)"  minH="150px">
  <Text color="white">Win Count</Text>
</Box>
<Box flex="1" bg="rgba(0, 0, 0, 0.85)"  marginTop='5px' minH="200px">
  <Text color="white">Lose Count</Text>
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
      bg="rgba(0, 0, 0, 0.85)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
      <Text color="white">Dawg Breed</Text>
    </Box>

    {/* Row 2 in Column 1 */}
    <Box
      bg="rgba(0, 0, 0, 0.85)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
      <Text color="white">Dawg Bio</Text>
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
      bg="rgba(0, 0, 0, 0.85)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
      <Text color="white">View on Element Marketplace</Text>
    </Box>

    {/* Row 2 in Column 2 */}
    <Box
      bg="rgba(0, 0, 0, 0.85)"
      p="5px"
      minH="40px" // Adjust the height as needed
    >
      <Text color="white">View on BSCSCAN</Text>
    </Box>
  </Flex>
</Flex>


  {/* ----------------------------------------------------------------------------------------- */}

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
          <Box flex="1" bg="rgba(0, 0, 0, 0.85)"  minH="150px">
            <Text color="white">Active Battle Cards View</Text>
          </Box>
          <Box flex="1" bg="rgba(0, 0, 0, 0.85)"  marginTop='5px' minH="200px">
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
              bg="rgba(0, 0, 0, 0.85)"
              p="5px"
              minH="400px" // Adjust the height as needed
            >
              <Text color="white">NFT MetaData and Traits</Text>
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
              bg="rgba(0, 0, 0, 0.85)"
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
              bg="rgba(0, 0, 0, 0.85)"
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
        </Box>
      </Flex>
    );
  };

export default NftDetails;

      //   <YourActiveBattles />







      //        <Text mb="2">------------------------------------------------------</Text>
      // <Text mb="2">Connected Accounts Address: {userAddress}</Text>
      // <Text mb="2">Connected Accounts BNB Balance: {bnbBalance} BNB (${(parseFloat(bnbBalance) * parseFloat(bnbPriceInUSD)).toFixed(2)} USD)</Text>
      // <Text mb="2">Connected Accounts Alpha7 Token Balance: {alpha7TokenBalance} ALPHA7 Tokens (${(parseFloat(alpha7TokenBalance) * parseFloat(tokenPriceUSD)).toFixed(2)} USD)</Text>
      // <Text mb="2">Connected Wallet LP Token Balance: {connectedWalletLPTokenBalance} Tokens (${(parseFloat(connectedWalletLPTokenBalance) * parseFloat(lpTokenValue) * 2).toFixed(2)} USD)</Text>
      //       <Text mb="2">------------------------------------------------------</Text>
      //             <Text mb="2">------------------------------------------------------</Text>
      //
