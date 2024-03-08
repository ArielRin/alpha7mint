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


const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

return (
      <footer style={{ backgroundColor: '#000', color: 'white', textAlign: 'center', padding: '20px 0' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
              <Image
                  src="https://prismatic-semifreddo-aec57e.netlify.app/assets/headerlogo.90cb497a.png"
                  alt="Logo"
                  width="163px"
              />
              <span>&copy; {currentYear} Alpha7 part of the System7 LLC. All rights reserved.</span>
              

          </div>
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
