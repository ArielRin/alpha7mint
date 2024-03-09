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
    <Flex direction="column" align="center" minH="300px" bgPosition="center" bgColor="rgba(0, 0, 0, 0.0)">
      <Box width="100%" bg="rgba(107, 105, 106, 0.4)" p={4} borderRadius="md">
        <Text fontSize="2xl" color="white" fontWeight="bold">Quick Battle</Text>
        <Text fontSize="md" color="white" mt={3}>Get your Dawgz into the arena fast!</Text>
        <Button colorScheme="red" mt={4} onClick={onOpen}>Battle Now!</Button>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody textAlign="center">
            {/* Your modal content here */}
            <Text fontSize="xl" fontWeight="bold">Battle Details</Text>
        <Text fontSize="md" color="black" mt={3}>Step 1. Select your Dawg to Battle.</Text>

        <QuickBattleComponent />

          </ModalBody>
          <ModalFooter marginTop="25px" justifyContent="center">
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BattleNowMain;
