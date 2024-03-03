import React, { useState } from 'react';
import { Box, Button, Flex, Input, useToast } from "@chakra-ui/react";
import { useContractWrite, useContract } from 'wagmi';
import { ethers } from 'ethers';
import ERC20ABI from './abiFile.json'; // Import ERC20 ABI
import dawgRegistrationAbi from './dawgRegistrationAbi.json'; // Import Dawg Registration ABI

const DawgRegistrationComponent: React.FC = () => {
    const [dawgName, setDawgName] = useState('');
    const [dawgTaunt, setDawgTaunt] = useState('');
    const [dawgBio, setDawgBio] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const toast = useToast();

    // Define your contract addresses
    const ERC20_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
    const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x168Bc5B7537929827EA339332de1DC11907ca760";

    // Function to handle ERC20 approval
    const handleApproval = async () => {
        try {
            setIsApproving(true);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const erc20Contract = useContract({
                addressOrName: ERC20_CONTRACT_ADDRESS,
                contractInterface: ERC20ABI, // Use imported ERC20 ABI
                signerOrProvider: signer,
            });

            const approvalTx = await erc20Contract.approve(DAWG_REGISTRATION_CONTRACT_ADDRESS, ethers.utils.parseEther('10'));
            await approvalTx.wait();

            toast({
                title: "Approval Success",
                description: "ERC20 token approval successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Approval Error",
                description: error.message || "An error occurred while approving tokens.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsApproving(false);
        }
    };

    // Function to handle Dawg registration
    const handleRegistration = async () => {
        try {
            setIsRegistering(true);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const dawgRegistrationContract = useContractWrite({
                addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
                contractInterface: dawgRegistrationAbi, // Use imported Dawg Registration ABI
                signerOrProvider: signer,
                functionName: 'registerNFT',
            });

            // Perform the registration
            const registrationTx = await dawgRegistrationContract(dawgName, dawgTaunt, dawgBio);
            await registrationTx.wait();

            toast({
                title: "Registration Success",
                description: "Dawg registration successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Registration Error",
                description: error.message || "An error occurred while registering Dawg.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <Box>
            <Flex direction="column" padding="20px">
                <Input placeholder="Dawg's Name" value={dawgName} onChange={(e) => setDawgName(e.target.value)} />
                <Input placeholder="Dawg's Default Taunt" value={dawgTaunt} onChange={(e) => setDawgTaunt(e.target.value)} />
                <Input placeholder="Dawg's Bio" value={dawgBio} onChange={(e) => setDawgBio(e.target.value)} />

                <Button onClick={handleApproval} isLoading={isApproving}>
                    Approve Tokens
                </Button>

                <Button onClick={handleRegistration} isLoading={isRegistering}>
                    Register Dawg
                </Button>
            </Flex>
        </Box>
    );
};

export default DawgRegistrationComponent;



// import React, { useState, useEffect } from 'react';
// import { Box, Button, Flex, Input, useToast, Text } from "@chakra-ui/react";
// import { useContract, useSigner, useAccount, useContractWrite, useContractRead } from 'wagmi';
// import { ethers } from 'ethers';
// import dawgRegistrationAbi from './dawgRegistrationAbi.json';
//
// const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x168Bc5B7537929827EA339332de1DC11907ca760";
// const ERC20_CONTRACT_ADDRESS = "0x88CE0d545cF2eE28d622535724B4A06E59a766F0";
//
// const DawgRegistration: React.FC = () => {
//   const [dawgzName, setDawgzName] = useState<string>('');
//   const [dawgzDefaultTaunt, setDawgzDefaultTaunt] = useState<string>('');
//   const [dawgzBio, setDawgzBio] = useState<string>('');
//   const [tokenId, setTokenId] = useState<string>('');
//   const [approvalStatus, setApprovalStatus] = useState<boolean>(false);
//   const [isRegistering, setIsRegistering] = useState<boolean>(false);
//   const [isOwner, setIsOwner] = useState<boolean>(false);
//   const [ownedDawg, setOwnedDawg] = useState<string>('');
//
//   const toast = useToast();
//   const { data: signer } = useSigner();
//   const { address: userAddress } = useAccount();
//
//   const dawgContract = useContract({
//     addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
//     contractInterface: dawgRegistrationAbi,
//     signerOrProvider: signer,
//   });
//
//   const erc20Contract = useContract({
//     addressOrName: ERC20_CONTRACT_ADDRESS,
//     contractInterface: [
//       "function allowance(address owner, address spender) view returns (uint256)",
//       "function approve(address spender, uint256 amount)",
//       "function transferFrom(address sender, address recipient, uint256 amount)"
//     ],
//     signerOrProvider: signer,
//   });
//
//   const { data: registrationFee } = useContractRead({
//     addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
//     contractInterface: dawgRegistrationAbi,
//     functionName: 'registrationFee',
//   });
//
//   useEffect(() => {
//     if (registrationFee) {
//       console.log(`Registration Fee: ${ethers.utils.formatEther(registrationFee)}`);
//     }
//   }, [registrationFee]);
//
//   useEffect(() => {
//     const checkOwnership = async () => {
//       if (!userAddress || !tokenId) return;
//
//       const owner = await dawgContract.ownerOf(tokenId);
//       setIsOwner(owner === userAddress);
//       setOwnedDawg(owner);
//     };
//
//     checkOwnership();
//   }, [userAddress, tokenId]);
//
//   const checkAndRequestTokenApproval = async () => {
//     if (!registrationFee || !userAddress) return;
//
//     const registrationFeeInWei = ethers.utils.parseEther(ethers.utils.formatEther(registrationFee));
//     const allowance = await erc20Contract.allowance(userAddress, DAWG_REGISTRATION_CONTRACT_ADDRESS);
//
//     if (allowance.lt(registrationFeeInWei)) {
//       const approveTx = await erc20Contract.approve(DAWG_REGISTRATION_CONTRACT_ADDRESS, registrationFeeInWei);
//       await approveTx.wait();
//       setApprovalStatus(true);
//     }
//   };
//
//   const { write: registerNFT } = useContractWrite({
//     addressOrName: DAWG_REGISTRATION_CONTRACT_ADDRESS,
//     contractInterface: dawgRegistrationAbi,
//     functionName: 'registerNFT',
//     args: [tokenId, dawgzName, dawgzDefaultTaunt, dawgzBio],
//     onSuccess(data) {
//       toast({
//         title: "Dawg Registration",
//         description: "Transaction sent successfully!",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//       });
//       console.log('Transaction Success:', data);
//     },
//     onError(error) {
//       toast({
//         title: "Registration Error",
//         description: error.message || "Error occurred during Dawg registration.",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//       });
//       console.error('Transaction Error:', error);
//     },
//   });
//
//   const handleRegisterDawg = async () => {
//     if (approvalStatus) {
//       setIsRegistering(true);
//       registerNFT();
//     } else {
//       await checkAndRequestTokenApproval();
//     }
//   };
//
//   return (
//     <Box>
//       <Flex direction="column" padding="20px">
//         <Input placeholder="Token ID" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
//         <Input placeholder="Dawg's Name" value={dawgzName} onChange={(e) => setDawgzName(e.target.value)} />
//         <Input placeholder="Dawg's Default Taunt" value={dawgzDefaultTaunt} onChange={(e) => setDawgzDefaultTaunt(e.target.value)} />
//         <Input placeholder="Dawg's Bio" value={dawgzBio} onChange={(e) => setDawgzBio(e.target.value)} />
//         {isOwner && <Text color="green">You own this Dawg</Text>}
//         {!isOwner && <Text color="red">You are not the owner of this Dawg</Text>}
//         <Button onClick={handleRegisterDawg} isLoading={isRegistering || (!approvalStatus && !!registrationFee)}>
//           {approvalStatus ? "Register Dawg" : "Approve Token"}
//         </Button>
//       </Flex>
//     </Box>
//   );
// };
//
// export default DawgRegistration;
