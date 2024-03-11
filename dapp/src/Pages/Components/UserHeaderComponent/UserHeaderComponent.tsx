import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Box, Button, Modal, Text, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import UserHeaderAbi from './UserHeaderAbi.json';
const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";


import UserProfileRegister from './UserProfile';
// <UserProfileRegister />




const UserHeaderComponent = () => {
    const [username, setUsername] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate(); // Call useNavigate to get the navigate function
    const fetchUsername = async () => {
        if (!window.ethereum) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, UserHeaderAbi, provider);
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) return;

        try {
            const data = await contract.getUserData(accounts[0]);
            setUsername(data.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <Box bg="rgba(0, 0, 0, 0.0)" w="100%"  display="flex" alignItems="center" justifyContent="flex-end" p="10px">
        {username ? (
        <Text color="white" onClick={() => navigate('/')} cursor="pointer">
          Welcome back - {username}
        </Text>
      ) : (
        <Text color="white" onClick={openModal} cursor="pointer">
          Register Username Now
        </Text>
      )}

            <Modal isOpen={isOpen} onClose={closeModal} isCentered>
                <ModalOverlay />
                <ModalContent minH="300px" minW="350px">
                    <ModalHeader>Register Your Username</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <UserProfileRegister />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default UserHeaderComponent;
