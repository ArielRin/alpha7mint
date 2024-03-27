import BnbPriceContext from '../Pages/BnbPriceContext'; // //

import HeaderWithDropdown from './Components/HeaderWithDropdown/HeaderWithDropdown';
// <HeaderWithDropdown />

import Leaderboard from './Comp1/Leaderboard/7Leaderboard';
// <Leaderboard />

import UserLeaderboard from './Comp1/Leaderboard/UserLeaderboard';
// <UserLeaderboard />


import TopDawg from './Comp1/Leaderboard/TopDawg';
// <TopDawg />

import UserHeaderComponent from './Components/UserHeaderComponent/UserHeaderComponent';
// <UserHeaderComponent />
// //
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles';
// // // <YourActiveBattles />
//
// import AllActiveBattlesTest from './Components/AllActiveBattlesTest/AllActiveBattlesTest';
// // // <AllActiveBattlesTest />
//
// import YourComplatedBattles from './Components/YourActiveBattles/YourCompletedBattles';
// // <YourComplatedBattles />

import BattleNowMainComponent from './Components/QuickBattleComponent/BattleNowMainComponent';
// <BattleNowMainComponent />

// import QuickBattleComponent from './Components/QuickBattleComponent/QuickBattleTemp';
// <QuickBattleComponent />

// import MiniMint from './Components/MiniMint/MiniMint';
// <NftMint0 />

// import ZapToLP from './Components/ZapToLP/ZapToLP';
// <ZapToLP />

import Footer from './Components/Footer/Footer';
// <Footer />
import UserProfileRegister from './Components/UserProfile/UserProfile';
// <UserProfileRegister />


// import DropdownComponent from './TheDawgz/dropdownComponent';
// // <DropdownComponent />


// import MiniSwapper from './Components/MiniSwapper/MiniSwapper'; // //
// <MiniSwapper />

// import FastSwapComponent from './Components/ReferralSawpper/ReferralSwapper'; // //
// <FastSwapComponent />


import React, { useEffect, useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useParams,
  useNavigate,
} from "react-router-dom";



import Web3 from "web3";
import tokenAbi from './tokenAbi.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Modal,
  ModalOverlay,
  Heading,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Link as ChakraLink,
  Flex,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Spacer,
  Center,
  Tab,
  TabPanel,
  Input,
  Button,
  Text,
  Image,
  useToast,
  Collapse,
} from "@chakra-ui/react";


import nft1Image from "./image1.png";
import nft2Image from "./image2.png";
import nft3Image from "./image3.png";
import nft4Image from "./image4.png";

import section2Image from "./bwdrkbackground.png";
import sectionImage from "./bwbackground.png";
import sectionBattleImage from "./sectionBattleImage.png";
import leaderboardImage from "./leaderboardImage.png";


import sectionBlueImage from "./bkg.png";
import tokenomicBkg from "./tokenomicBkg.png";

import battleVsImage from "./battleVsImage.png";
import petterdaleImage from "./petterdale.png";
import aboutImage from "./about.png";
import mainbackgroundImage from "./a7banner.png";
import tokenGif from "./token.gif";
import a7Logo from "./headerlogo.png";
import dawgImage from "./token.gif";
import MainTextLogo from "./headerlogo.png";



import { ethers } from 'ethers';

// import NftDetails from './Nft/NftDetails'; // Adjust the import path as needed

const TOKEN_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
const DEVELOPER_WALLET_ADDRESS = "0x57103b1909fB4D295241d1D5EFD553a7629736A9";
const TREASURY_WALLET_ADDRESS = "0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7";
const ALPHA7_LP_TOKEN_ADDRESS = "0xa2136fEA6086f2254c9361C2c3E28c00F9e73366"; // Address for the Alpha7 LP token contract
// import YourActiveBattles from './Components/YourActiveBattles/YourActiveBattles'; // //



// ________________________________________________________________________________ //

const REFERRAL_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
import referralAbi from './tokenAbi.json';

const REFERRER_WALLET_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

// ________________________________________________________________________________ //


const tokenLogoUrl = 'https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/dapp/src/Pages/Alpha7token.png';
const bnbLogoUrl = 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png?1696501970';





const HomePage: React.FC = () => {


  const navigate = useNavigate();





  const logoSize = '28.5px';


  return (

    <Box>
      <HeaderWithDropdown />
         <Box
           flex={1}
           p={0}
           m={0}
           display="flex"
           flexDirection="column"
           bg="rgba(0, 0, 0, 1)"
           bgPosition="center"
           bgRepeat="no-repeat"
           bgSize="cover"
         >

        <Flex
             direction={{ base: 'column', md: 'row' }}
             gap="4" // Adjust gap as needed
             bg="rgba(0, 0, 0, 1)"
             p={4} // Adjust padding as needed
             minH="90px" // Minimum height of 400px for the row
           >
         </Flex>



           <Flex
             direction={{ base: 'column', md: 'row' }}
             wrap="wrap"
             justify="center"
             align="center"
             gap="4" // Adjust the gap as needed
             p={6} // Adjust the padding as needed
             minH="90px" // Minimum height of 60px for the row
             w="full" // Take full width of the container
             bg="black"
           >
           <Heading textAlign="center" color="white" mb="30px">AlphaDawgz First Battle Tournament is LIVE!</Heading>
           </Flex>

          <Flex
          direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
          align="center" // Align items vertically in the center
          gap="4" // Adjust gap as needed
          p={4} // Adjust padding as needed
          minH="200px" // Minimum height of 60px for the row
          w="full" // Take full width of the container
          bg="black"
          bgImage={`url(${leaderboardImage})`}
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          >

          {/* Left Column  <Heading color="white" mb="30px">Introducing AlphaDawgz! NFT with a PvP Battle System </Heading>
           */}
          <Box
            alignItems="center" // Changed from align to alignItems
          w="100%" // Equal width for both columns
          bg="rgba(0, 0, 0, 0.75)" // Dark grey with transparency
          p={4} // Padding inside the box
          >

          <Text color="white">
          AlphaDawgz Battle System is all about fun and excitement! Picture this: the top seven Dawgz, battling it out to see who's the toughest. These Dawgz have won the most battles, and everyone's eager to see who will become the ultimate AlphaDawg. The best part? You get to join in and battle other players. It's a straight-up 50/50 shot at winning each time, and if you win, you score some cool BNB crypto. It's a wild ride where every battle is a new chance to be the top Dawg!
          </Text>
           <TopDawg />
           <Flex justify="center" mt="4">
       <Button colorScheme="red" onClick={() => navigate('/BattleCompetition')}>
         Enter Now
       </Button>
     </Flex>
          </Box>

          {/* Right Column */}
          <Box
          w="100%" // Equal width for both columns
          bg="rgba(33, 33, 33, 0.0)" // Dark grey with transparency
          p={4} // Padding inside the box
          minH="200px" // Minimum height of the box
          >
          <Flex direction="column" align="center" justify="center" height="100%">

          <Leaderboard />

          </Flex>

          {/* Content for the right column goes here */}
          </Box>
          </Flex>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            wrap="wrap"
            justify="center"
            align="center"
            gap="4" // Adjust the gap as needed
            p={6} // Adjust the padding as needed
            minH="90px" // Minimum height of 60px for the row
            w="full" // Take full width of the container
            bg="black"
          >
          <UserLeaderboard />
        </Flex>

         <Flex
              direction={{ base: 'column', md: 'row' }}
              gap="4" // Adjust gap as needed

              bgImage={`url(${mainbackgroundImage})`}
              p={4} // Adjust padding as needed
              minH="800px" // Minimum height of 400px for the row
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
            >
          </Flex>









           <Flex
             direction={{ base: 'column', md: 'row' }} // Stack on mobile, horizontal on medium devices and above
             gap={0} // Adjust the gap as needed
             p={0} // Adjust the padding as needed
           >
             {/* FastSwapComponent with 30% width on medium devices and above */}
             <Box flex={{ base: 1, md: 3 }}>
             </Box>
           </Flex>
         </Box>

         {/* Welcome Text and logo*/}
         <Flex
     direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
     align="center" // Align items vertically in the center
     gap="4" // Adjust gap as needed
     p={4} // Adjust padding as needed
     minH="400px" // Minimum height of 60px for the row
     w="full" // Take full width of the container
     bg="black"
     >


     {/* Left Column */}
     <Box
       w="80%" // Equal width for both columns
       bg="rgba(33, 33, 33, 0.0)" // Dark grey with transparency
       p={4} // Padding inside the box
     >
       <Heading color="white" mb="30px">Welcome to Alpha7 Token on Binance Smart Chain</Heading>
       <Text color="white">
         A groundbreaking BEP20 token on the BSC that is set to redefine the standards of cryptocurrency tokens. On this page, we will take a closer look at ALPHA7, a token not just designed to be part of the crypto market but to lead it with innovative features and a robust ecosystem.
       </Text>
     </Box>

     {/* Right Column */}
     <Box
  w="50%" // Equal width for both columns
  bg="rgba(33, 33, 33, 0.0)" // Dark grey with transparency
  p={4} // Padding inside the box
  minH="400px" // Minimum height of the box
>
  <Flex direction="column" align="center" justify="center" height="100%">
    <Image src={aboutImage} alt="WireFrame Dawgz" width="320px" objectFit="contain" />
  </Flex>

  {/* Content for the right column goes here */}
</Box>
   </Flex>


   <Flex
        direction={{ base: 'column', md: 'row' }}
        gap="4" // Adjust gap as needed
        bg="rgba(0, 0, 0, 1)"
        p={4} // Adjust padding as needed
        minH="140px" // Minimum height of 400px for the row
      >
    </Flex>

   <Flex
     direction={{ base: 'column', md: 'row' }}
     wrap="wrap"
     justify="center"
     align="center"
     gap="4" // Adjust the gap as needed
     p={6} // Adjust the padding as needed
     minH="90px" // Minimum height of 60px for the row
     w="full" // Take full width of the container
     bg="black"
   >
   <Heading textAlign="center" color="white" mb="30px">About Alpha7 Token</Heading>
   </Flex>


   <Flex
direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
align="center" // Align items vertically in the center
justify="center" // Justify content (horizontally) to the center
gap="4" // Adjust gap as needed
p={4} // Adjust padding as needed
minH="400px" // Minimum height of 60px for the row
w="full" // Take full width of the container
bg="black"
bgImage={`url(${sectionBlueImage})`}
bgPosition="center"
bgRepeat="no-repeat"
bgSize="cover"
>
{/* Left Column */}


<Box
  w="50%" // Equal width for both columns
  bg="rgba(0, 0, 0, 0.0)" // Dark grey with transparency
  p={9} // Padding inside the box
>
  <Flex direction="column" align="center" justify="center" height="100%">
    <Image src={a7Logo} alt="WireFrame Dawgz" width="320px" objectFit="contain" />
  </Flex>

  {/* Content for the right column goes here */}
</Box>

{/* Right Column */}
<Box
 w="80%" // Equal width for both columns
 bg="rgba(0, 0, 0, 0.7)" // Dark grey with transparency
 p={4} // Padding inside the box
>
 <Text color="white">
 If humanity does not make it when AI takes over, dogs will because of the bonding strength of the tightly-knit community of Alpha7.
</Text>
<Text mt="20px" color="white">
Alpha7 is an unruly dog leveraging the up-to-date intelligent power of Grok AI to reveal, unlock and protect the most fun in the world as it builds the largest Binance Smart Chain (BSC) Meme Family. This is where AI fuses with dogs to unlock the unimaginable.
</Text>
<Text mt="20px" color="white">
Catch all of the fun in the world with a hilarious community, open to learning and constantly challenging the norm. $ALPHA7 is the meme coin powering the Alpha7 community towards its recalcitrant goals, exhilarating fun and meme singularity.
</Text>
<Text mt="20px" color="white">
Human x Artificial intelligence has achieved great feats. Let’s see what happens when you combine Humans x Memes x Artificial intelligence.
</Text>
<Text
marginBottom="130px" color="white">
Let’s Barking Go! Alpha7 It!  </Text>
</Box>

</Flex>
<Flex
     direction={{ base: 'column', md: 'row' }}
     gap="4" // Adjust gap as needed
     bg="rgba(0, 0, 0, 1)"
     p={4} // Adjust padding as needed
     minH="200px" // Minimum height of 400px for the row
   >
 </Flex>
 <Flex
   direction={{ base: 'column', md: 'row' }}
   wrap="wrap"
   justify="center"
   align="center"
   gap="4" // Adjust the gap as needed
   p={6} // Adjust the padding as needed
   minH="90px" // Minimum height of 60px for the row
   w="full" // Take full width of the container
   bg="black"
 >
 <Heading textAlign="center" color="white" mb="30px">Tokenomics</Heading>
 </Flex>

 <Flex
 direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
 align="center" // Align items vertically in the center
 justify="center" // Justify content (horizontally) to the center
 gap="4" // Adjust gap as needed
 p={4} // Adjust padding as needed
 minH="300px" // Minimum height of 60px for the row
 w="full" // Take full width of the container
 bg="black"
 bgImage={`url(${tokenomicBkg})`}
 bgPosition="center"
 bgRepeat="no-repeat"
 bgSize="cover"
 >
<Flex
direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
align="center" // Align items vertically in the center
justify="center" // Justify content (horizontally) to the center
gap="4" // Adjust gap as needed
p={4} // Adjust padding as needed
w="full" // Take full width of the container
>

{/* Left Column */}
<Box
w="100%" // Equal width for both columns
bg="rgba(0, 0, 0, 0.75)" // Dark grey with transparency
p={6} // Padding inside the box
>
<Heading color="white" mb="30px">Alpha7 Token</Heading>
<Text color="white">

</Text>
<Text color="white">
Token Contract:
</Text>
<Text color="white">
0x88CE0d545cF2eE28d622535724B4A06E59a766F0
</Text>
<Text color="white">
Total Supply:

7,000,000,000
</Text>
<Text color="white">
Live Price (USD):

Launch Price $0.0000002984
</Text>
<Text color="white">
Liquidity:

Minimum $18,000
</Text>
<Text color="white">
Tax:

7/7
</Text>
<Text color="white">
Token Reflections:

1%
</Text>
<Text color="white">
NFT Reflections:

2%
</Text>
<Text color="white">
Treasury:

4%
</Text>
</Box>

{/* Right Column */}


</Flex>

<Flex
  direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
  align="center" // Align items vertically in the center
  gap="4" // Adjust gap as needed
  p={4} // Adjust padding as needed
  h="600px" // Set height to 400px
  w="full" // Full width of the container
>
  <Box
    w="full" // Full width of the container
    h="100%" // Use full height of the Flex container
    bg="rgba(0, 0, 0, 1)" // Background color
    display="flex"
    justifyContent="center"
    position="relative" // Relative positioning for the iframe
  >
    <iframe
      src="https://dexscreener.com/bsc/0xa2136fEA6086f2254c9361C2c3E28c00F9e73366?embed=1&theme=dark&trades=0&info=0"
      style={{
        width: '80%', // Width set to 80% of its parent
        height: '100%', // Height set to 100% of its parent
        border: 0
      }}
      title="DexScreener"
    ></iframe>
  </Box>
</Flex>
</Flex>


<Flex
     direction={{ base: 'column', md: 'row' }}
     gap="4" // Adjust gap as needed
     bg="rgba(0, 0, 0, 1)"
     p={4} // Adjust padding as needed
     minH="200px" // Minimum height of 400px for the row
   >
 </Flex>


<Flex
  direction={{ base: 'column', md: 'row' }}
  wrap="wrap"
  justify="center"
  align="center"
  gap="4" // Adjust the gap as needed
  p={6} // Adjust the padding as needed
  minH="90px" // Minimum height of 60px for the row
  w="full" // Take full width of the container
  bg="black"
>
<Heading textAlign="center" color="white" mb="30px">Meet the AlphaDawgz</Heading>
</Flex>
<Flex
  direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
  wrap="wrap" // Enable wrapping
  justify={{ base: "center", md: "center" }} // Center the items on all screen sizes
  align="center" // Align items vertically in the center
  gap="2" // Reduced gap for closer images
  px={{ base: "4", md: "14%" }} // 14% left and right padding on larger devices
  py={4} // Padding top and bottom
  minH="200px" // Minimum height for the row
  w="full" // Take full width of the container
  bg="black"
>
  {/* Image 1 */}
  <Box w={{ base: 'full', md: '20%' }} p={2}>
    <Image src={nft1Image} alt="Image 1" style={{ width: '100%', height: 'auto' }} />
  </Box>

  {/* Image 2 */}
  <Box w={{ base: 'full', md: '20%' }} p={2}>
    <Image src={nft2Image} alt="Image 2" style={{ width: '100%', height: 'auto' }} />
  </Box>

  {/* Image 3 */}
  <Box w={{ base: 'full', md: '20%' }} p={2}>
    <Image src={nft3Image} alt="Image 3" style={{ width: '100%', height: 'auto' }} />
  </Box>

  {/* Image 4 */}
  <Box w={{ base: 'full', md: '20%' }} p={2}>
    <Image src={nft4Image} alt="Image 4" style={{ width: '100%', height: 'auto' }} />
  </Box>
</Flex>




<Flex
direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
align="center" // Align items vertically in the center
gap="4" // Adjust gap as needed
p={4} // Adjust padding as needed
minH="100px" // Minimum height of 60px for the row
w="full" // Take full width of the container
bg="black"
>

{/* Left Column  <Heading color="white" mb="30px">Introducing AlphaDawgz! NFT with a PvP Battle System </Heading>
 */}
<Box
w="100%" // Equal width for both columns
bg="rgba(33, 33, 33, 0.0)" // Dark grey with transparency
p={4} // Padding inside the box
>
<Text align="center" color="white">




Alpha Dawg NFTs were released prior to the Alpha7 token launch, with the sales contributing to the initial liquidity pool (LP) and the NFT Holder rewards pool. Holders of these NFTs continue to receive benefits, such as Alpha7 Airdrops and reflections for each NFT they own. This approach was strategically designed to swiftly balance the initial cost of the NFTs. Additionally, holders of Alpha Dawg NFTs benefit from an ongoing additional 2% reflection from the Alpha7 token to the NFT rewards pool, which is distributed to them on a weekly basis.
</Text>
<Text marginBottom="130px" align="center" color="white">

 Each ALPHA Dawg NFT, priced at just 0.07 BNB, is not only an artistic digital asset but also a key to unlocking a world of benefits. As a holder of these NFTs, you gain access to VIP competitions with weekly prizes, reflections, and community trades.

 </Text>
</Box>

</Flex>


<Flex
  direction={{ base: 'column', md: 'row' }}
  wrap="wrap"
  justify="center"
  align="center"
  gap="4" // Adjust the gap as needed
  p={6} // Adjust the padding as needed
  minH="90px" // Minimum height of 60px for the row
  w="full" // Take full width of the container
  bg="black"
>
<Heading textAlign="center" color="white" mb="30px">AlphaDawgz Battle System NFT PvP!</Heading>
</Flex>
<Flex
direction={{ base: 'column', md: 'row' }} // Column on small screens, row on medium and larger screens
align="center" // Align items vertically in the center
gap="4" // Adjust gap as needed
p={4} // Adjust padding as needed
minH="200px" // Minimum height of 60px for the row
w="full" // Take full width of the container
bg="black"
bgImage={`url(${sectionBattleImage})`}
bgPosition="center"
bgRepeat="no-repeat"
bgSize="cover"
>

{/* Left Column  <Heading color="white" mb="30px">Introducing AlphaDawgz! NFT with a PvP Battle System </Heading>
 */}
<Box
w="100%" // Equal width for both columns
bg="rgba(0, 0, 0, 0.6)" // Dark grey with transparency
p={4} // Padding inside the box
>

<Text color="white">
The AlphaDawgsBattleSystem offers a unique and thrilling experience in the world of NFTs and blockchain gaming, where chance reigns supreme in deciding the victors. In this simple yet captivating game, players place their bets on their AlphaDawg NFTs, entering them into a battle arena with no additional player interaction required. The allure of this system lies in its complete reliance on randomness; each battle outcome is determined by a random draw, ensuring that all participating AlphaDawgz have an equal opportunity to emerge victorious. This approach strips away the complexities of strategy and skill, making it a game of pure luck and anticipation. Players get the chance to win Binance Coin (BNB) from their competitors, adding a layer of excitement and reward to their NFT ownership.
</Text>
<Text color="white">
The game’s format is straightforward yet engaging: two AlphaDawgz enter the battle, but only one comes out victorious. The process is entirely automated, with the smart contract executing the random selection to decide the winner. This simplicity and the thrill of potentially winning BNB just by participating make the AlphaDawgsBattleSystem an attractive and accessible option for NFT enthusiasts. It's not just a game but an experience where the thrill of chance and the beauty of NFTs converge, offering a unique and enjoyable way for players to engage with their digital assets in the blockchain space. </Text>
</Box>

{/* Right Column */}
<Box
w="100%" // Equal width for both columns
bg="rgba(33, 33, 33, 0.0)" // Dark grey with transparency
p={4} // Padding inside the box
minH="200px" // Minimum height of the box
>
<Flex direction="column" align="center" justify="center" height="100%">
<Image src={battleVsImage} alt="WireFrame Dawgz" width="80%" objectFit="contain" />
</Flex>

{/* Content for the right column goes here */}
</Box>
</Flex>
<Flex
     direction={{ base: 'column', md: 'row' }}
     gap="4" // Adjust gap as needed
     bg="rgba(0, 0, 0, 1)"
     p={4} // Adjust padding as needed
     minH="140px" // Minimum height of 400px for the row
   >
 </Flex>



<Flex
     direction={{ base: 'column', md: 'row' }}
     gap="4" // Adjust gap as needed
     bg="rgba(0, 0, 0, 1)"
     p={4} // Adjust padding as needed
     minH="140px" // Minimum height of 400px for the row
   >
 </Flex>


<Flex
     direction={{ base: 'column', md: 'row' }}
     gap="4" // Adjust gap as needed
     bg="rgba(0, 0, 0, 1)"
     p={4} // Adjust padding as needed
     minH="140px" // Minimum height of 400px for the row
   >
 </Flex>



         <Footer />
       </Box>
     );
};

export default HomePage;
