import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, useToast, Text } from "@chakra-ui/react";
import { useContractRead, useContractWrite, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import dawgRegistrationAbi from './dawgRegistrationAbi.json';
import erc20Abi from './tokenAbi.json';


interface DawgRegistrationProps {
  tokenId: number;
}

const DawgRegistrationComponent: React.FC<DawgRegistrationProps> = ({ tokenId }) => {
  const [dawgName, setDawgName] = useState('');
  const [dawgTaunt, setDawgTaunt] = useState('');
  const [dawgBio, setDawgBio] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationFee, setRegistrationFee] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { data: signer, isError: signerError } = useSigner();
  const toast = useToast();

  const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7";
  const ERC20_TOKEN_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";

  useEffect(() => {
    checkRegistrationStatus();
  }, [tokenId, signer]);

  useEffect(() => {
    if (isRegistered) {
      fetchDawgDetails();
    }
  }, [isRegistered]);

  const checkRegistrationStatus = async () => {
    if (!signer) return;
    // Add logic to check if the Dawg is registered.
    // Assuming a method `isRegistered` exists in your contract.
    try {
      const contract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, signer);
      const registered = await contract.isRegistered(tokenId);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  const fetchDawgDetails = async () => {
    if (!signer) return;
    // Replace this with your method to fetch Dawg details.
    try {
      const contract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, signer);
      const details = await contract.getDawgDetails(tokenId);
      setDawgName(details.name);
      setDawgTaunt(details.taunt);
      setDawgBio(details.bio);
    } catch (error) {
      console.error('Error fetching Dawg details:', error);
    }
  };



  const handleApproval = async () => {
      if (!signer) {
          toast({
              title: "Signer Error",
              description: "No Ethereum signer is available.",
              status: "error",
              duration: 5000,
              isClosable: true,
          });
          return;
      }

      try {
          // Adjusting to 9 decimal places for the token
          const feeInWei = ethers.utils.parseUnits(registrationFee, 9);
          const erc20Contract = new ethers.Contract(ERC20_TOKEN_ADDRESS, erc20Abi, signer);
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
              description: error instanceof Error ? error.message : "Unknown error",
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
      const writeFunction = isRegistered ? modifyNFTDetails : registerNFT;
      await writeFunction();
      toast({
        title: "Dawg Registration",
        description: isRegistered ? "Dawg modified successfully!" : "Dawg registered successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const { write: registerNFT } = useContractWrite({
    addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
    contractInterface: dawgRegistrationAbi,
    functionName: 'registerNFT',
    args: [tokenId, dawgName, dawgTaunt, dawgBio],
  });

  const { write: modifyNFTDetails } = useContractWrite({
    addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
    contractInterface: dawgRegistrationAbi,
    functionName: 'modifyNFTDetails',
    args: [tokenId, dawgName, dawgTaunt, dawgBio],
  });


  return (
     <Box>
       <Flex direction="column" padding="20px">
         <Text mb="4" fontSize="lg" fontWeight="bold">
           {isRegistered ? `Modify Dawg #${tokenId}` : `Registering Dawg #${tokenId}`}
         </Text>
         {registrationFee && <Text>Registration Fee: {registrationFee} Tokens</Text>}

         <Input placeholder="Dawg's Name" value={dawgName} onChange={(e) => setDawgName(e.target.value)} />
         <Input placeholder="Dawg's Default Taunt" value={dawgTaunt} onChange={(e) => setDawgTaunt(e.target.value)} />
         <Input placeholder="Dawg's Bio" value={dawgBio} onChange={(e) => setDawgBio(e.target.value)} />

         {!isApproved && !isRegistered &&
           <Button onClick={handleApproval} mt="4">
             Approve ERC20 Token Spend
           </Button>
         }
         <Button onClick={handleRegistration} mt="4" isLoading={isRegistering} disabled={!isApproved && !isRegistered}>
           {isRegistered ? 'Modify Registration' : 'Register Dawg'}
         </Button>
       </Flex>
     </Box>
   );
 };

 export default DawgRegistrationComponent;
