import React, { useState, useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Box, Flex, Image, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import DawgRegistration from '../Components/DawgRegistration/DawgRegistration';
import userRegistryAbi from './userRegistryAbi.json';

const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";

const TheDawgz: React.FC = () => {
    interface NFT {
        tokenId: number;
        imageUrl: string;
        name: string;
    }

    const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

    useEffect(() => {
        const fetchNfts = async () => {
            setIsLoading(true);
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                const signer = provider.getSigner();
                const walletAddress = await signer.getAddress();
                const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);

                // Get the list of owned NFT token IDs from the UserRegistry contract
                const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);

                // Convert BigNumber to Number or String for each token ID
                const ownedTokenIdsArray = ownedTokenIds.map((tokenId: BigNumber) => tokenId.toNumber());

                // Fetch metadata for each owned NFT
                const ownedNftsData = await Promise.all(
                    ownedTokenIdsArray.map((tokenId: number) => fetchNftData(tokenId, walletAddress))
                );

                setNfts({ owned: ownedNftsData });
            } catch (error) {
                console.error("Failed to fetch owned NFTs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNfts();
    }, [currentPage]);

    // Function to fetch individual NFT data
    const fetchNftData = async (tokenId: number, walletAddress: string) => {
        const metadataUrl = `/NFTDATA/metadata/${tokenId}.json`;
        const imageUrl = `/NFTDATA/Image/${tokenId}.png`;

        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        return {
            tokenId,
            imageUrl,
            name: metadata.name
        };
    };

    const handleRegisterDawg = (nft: NFT) => {
        setSelectedNFT(nft);
    };

    const handleCloseModal = () => {
        setSelectedNFT(null);
    };

    return (
        <Flex direction="column" align="center" minH="100vh" bgImage="url('https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/NFTDATA/greenbkg.png')" bgPosition="center" bgSize="cover">
            <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
                <Text color="white" fontSize="md" fontWeight="bold"></Text>
            </Box>
            <Box w="100%" minH="80px" paddingY="50px" bgColor="rgba(0, 0, 0, 0.0)" color="white">
                <Flex justify="center">
                    {nfts.owned.map((nft) => (
                        <DawgCard key={nft.tokenId} nft={nft} onRegisterDawg={handleRegisterDawg} />
                    ))}
                </Flex>
            </Box>
            <Modal isOpen={selectedNFT !== null} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Register Dawg</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedNFT && <DawgRegistration tokenId={selectedNFT.tokenId} />}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

const DawgCard: React.FC<{ nft: NFT, onRegisterDawg: (nft: NFT) => void }> = ({ nft, onRegisterDawg }) => {
    return (
        <Box key={nft.tokenId} p="5" shadow="md" borderWidth="1px" bgColor="rgba(0, 0, 0, 0.65)" color="white" m="2">
            <Image src={nft.imageUrl} alt={`NFT ${nft.name}`} borderRadius="md" />
            <Text mt="2" fontSize="xl" fontWeight="semibold" lineHeight="short">
                Token ID: {nft.tokenId}
            </Text>
            <Button mt="4" as={RouterLink} to={`/nftdetails/${nft.tokenId}`} colorScheme="green">
                Detail
            </Button>
            <Button mt="4" ml="2" colorScheme="pink" onClick={() => onRegisterDawg(nft)}>
                Register Dawg
            </Button>
        </Box>
    );
};

export default TheDawgz;
