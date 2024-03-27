import React, { useState } from 'react';
import {
  Box, Flex, Text, Button, Modal, ModalOverlay, ModalContent, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react';


import QuickBattleComponent from './QuickBattleTemp';
// <QuickBattleComponent />



const BattleNowMain = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="row" align="center" minH="300px" bgPosition="center" bgColor="rgba(0, 0, 0, 0.0)">
      <Box width="400px" bg="rgba(0, 0, 0, 0.7)" p={4} borderRadius="md">
        <Text fontSize="2xl" color="white" fontWeight="bold">Battle Tournament 1</Text>
        <Text fontSize="sm" color="white" mt={3}>Winners of competition Share the prize currently set at $80 USD paid in BNB</Text>
          <Text fontSize="xl" color="white" fontWeight="bold">Earn battles wins now . Entry is approx 25 cents plus gas.</Text>
        <Button colorScheme="red" mt={4} onClick={onOpen}>Battle Now!</Button>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody textAlign="center">
            {/* Your modal content here */}
            <Text fontSize="xl" fontWeight="bold">Tournament 1 Battle</Text>
        <Text fontSize="md" color="black" mt={3}>Select your Dawg to Battle.</Text>

        <QuickBattleComponent />

          </ModalBody>
          <ModalFooter marginTop="25px" justifyContent="center">
            <Button colorScheme="red" onClick={onClose}>Close</Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BattleNowMain;
