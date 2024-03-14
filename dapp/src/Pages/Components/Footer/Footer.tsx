import React from 'react';

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
  Flex,
  Container,
  SimpleGrid,
  VStack,
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
} from "@chakra-ui/react";



import bscscanLogo from "./logos/bscscan.png";
import cmcLogo from "./logos/cmc.png";
import dexscrnLogo from "./logos/dexscrn.png";
import geckoLogo from "./logos/gecko.png";
import elementLogo from "./logos/element.png";
import githubLogo from "./logos/github.png";
import mediumLogo from "./logos/medium.png";
import openseaLogo from "./logos/opensea.png";
import pcsLogo from "./logos/pcs.png";
import pooLogo from "./logos/poo.png";
import telegramLogo from "./logos/telegram.png";
import tofuLogo from "./logos/tofu.png";
import xLogo from "./logos/x.png";




const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

        return (
          <footer style={{ backgroundColor: '#000', color: 'white', textAlign: 'center', padding: '20px 0' }}>
              <Flex direction="column" alignItems="center">

                  <SimpleGrid columns={{ base: 1, md: 6 }} spacing="20px" width="100%" minH="220px" px="5" py="20px">
                      {/* Column 1 */}
                      <Box width="200px" padding="5px">

                      </Box>
                      <Box  padding="5px">
                        <VStack align="center" color="white">
                        <ChakraLink href="https://dexscreener.com/bsc/0xa2136fEA6086f2254c9361C2c3E28c00F9e73366" isExternal>
                          <Image src={dexscrnLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://bscscan.com/address/0x88CE0d545cF2eE28d622535724B4A06E59a766F0#code" isExternal>
                          <Image src={bscscanLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://www.geckoterminal.com/bsc/pools/0xa2136fea6086f2254c9361c2c3e28c00f9e73366" isExternal>
                          <Image src={geckoLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        </VStack>
                      </Box>

                      {/* Column 2 */}
                      <Box padding="5px">
                        <VStack align="center" color="white">
                        <ChakraLink href="https://t.me/system7_token" isExternal>
                          <Image src={telegramLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://twitter.com/system7labs" isExternal>
                          <Image src={xLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://poocoin.app/tokens/0x88ce0d545cf2ee28d622535724b4a06e59a766f0" isExternal>
                          <Image src={pooLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        </VStack>
                      </Box>

                      <Box padding="5px">
                        <VStack align="center" color="white">
                        <ChakraLink href="https://element.market/collections/aplhadawgz-NFT" isExternal>
                          <Image src={elementLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://opensea.io/collection/aplha-dawgz-nft-collection" isExternal>
                          <Image src={openseaLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://tofunft.com/discover/items?contracts=98523" isExternal>
                          <Image src={tofuLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        </VStack>
                      </Box>

                      <Box padding="5px">
                        <VStack align="center" color="white">
                        <ChakraLink href="https://pancakeswap.finance/swap?outputCurrency=0x88CE0d545cF2eE28d622535724B4A06E59a766F0" isExternal>
                          <Image src={pcsLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://github.com/ArielRin/alpha7mint" isExternal>
                          <Image src={githubLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        <ChakraLink href="https://medium.com/@system7setup/introducing-alpha7-a-revolutionary-token-in-the-cryptocurrency-world-74f756cf670b" isExternal>
                          <Image src={mediumLogo} alt="Description of Image" width="220px"  />
                        </ChakraLink>
                        </VStack>
                      </Box>
                      <Box width="300px" padding="5px">

                      </Box>
                      {/* Repeat the Box with different content as needed for each column */}
                  </SimpleGrid>
                  <Image
                      src="https://raw.githubusercontent.com/ArielRin/alpha7mint/day-12/dapp/src/headerlogo.png"
                      alt="Logo"
                      width="230px"
                  />
                  <span>&copy; {currentYear} Alpha7 part of the System7 LLC. All rights reserved.</span>
              </Flex>
          </footer>
        );
    };

    export default Footer;

// <span>
//     Follow us on
//     <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>Twitter</a>,
//     <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>Facebook</a>,
//     <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>Instagram</a>
// </span>
