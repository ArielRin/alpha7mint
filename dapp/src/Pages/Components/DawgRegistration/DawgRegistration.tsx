import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, useToast, Text } from "@chakra-ui/react";
import { useContractRead, useContractWrite, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import dawgRegistrationAbi from './dawgRegistrationAbi.json';
import erc20Abi from './tokenAbi.json';

const DawgRegistrationComponent = ({ tokenId }) => {
    const [dawgName, setDawgName] = useState('');
    const [dawgTaunt, setDawgTaunt] = useState('');
    const [dawgBio, setDawgBio] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationFee, setRegistrationFee] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const { data: signer } = useSigner();
    const toast = useToast();

    const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7";
    const ERC20_TOKEN_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

    // Fetch registration fee in tokens (in wei, smallest unit of the token)
    const { data: feeData } = useContractRead({
        addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
        contractInterface: dawgRegistrationAbi,
        functionName: 'registrationFee',
    });

    useEffect(() => {
        if (feeData) {
            // Convert the fee from wei to token units considering 9 decimals
            const feeFormatted = ethers.utils.formatUnits(feeData, 9);
            setRegistrationFee(feeFormatted);
        }
    }, [feeData]);

    // ERC20 contract instance
    const erc20Contract = new ethers.Contract(ERC20_TOKEN_ADDRESS, erc20Abi, signer);

    const handleApproval = async () => {
        try {
            // Convert the registration fee back to wei for approval
            const feeInWei = ethers.utils.parseUnits(registrationFee, 9);
            const tx = await erc20Contract.approve(DAWG_REGISTRATION_CONTRACT_ADDRESS, feeInWei);
            await tx.wait();
            setIsApproved(true);
            toast({
                title: "Approval Successful",
                description: "ERC20 token spend approved.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Approval Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleRegistration = async () => {
        if (!isApproved) {
            toast({
                title: "Approval Needed",
                description: "Please approve ERC20 token spend first.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setIsRegistering(true);
        try {
            // Call registerNFT function on contract
            await registerNFT();

            toast({
                title: "Dawg Registration",
                description: "Dawg registered successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Registration Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsRegistering(false);
        }
    };

    // Write hook for contract interaction
    const { write: registerNFT } = useContractWrite({
        addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
        contractInterface: dawgRegistrationAbi,
        functionName: 'registerNFT',
        args: [tokenId, dawgName, dawgTaunt, dawgBio],
    });

    return (
        <Box>
            <Flex direction="column" padding="20px">
                <Text mb="4" fontSize="lg" fontWeight="bold">
                    Registering Dawg #{tokenId}
                </Text>
                {registrationFee && <Text>Registration Fee: {registrationFee} Tokens</Text>}

                <Input placeholder="Dawg's Name" value={dawgName} onChange={(e) => setDawgName(e.target.value)} />
                <Input placeholder="Dawg's Default Taunt" value={dawgTaunt} onChange={(e) => setDawgTaunt(e.target.value)} />
                <Input placeholder="Dawg's Bio" value={dawgBio} onChange={(e) => setDawgBio(e.target.value)} />

                {!isApproved &&
                    <Button onClick={handleApproval} mt="4">
                        Approve ERC20 Token Spend
                    </Button>
                }
                <Button onClick={handleRegistration} mt="4" isLoading={isRegistering} disabled={!isApproved}>
                    Register Dawg
                </Button>
            </Flex>
        </Box>
    );
};

export default DawgRegistrationComponent;
