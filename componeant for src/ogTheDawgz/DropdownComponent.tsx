import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Select,
  Input,
  Button,
  VStack,
  Text,
  Image,
} from '@chakra-ui/react';

// Import ABIs and Contract Addresses
import dawgBattleAbi from './dawgBattleOldAbi.json';
import userRegistryAbi from './userRegistryAbi.json';
import dawgRegistrationAbi from './dawgRegistrationAbi.json';

const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";
const DAWG_REGISTRATION_CONTRACT_ADDRESS = "0x6B49F7B1239F5487566815Ce58ec0396b2E363e7";
const BATTLE_CONTRACT_ADDRESS = '0x8d695bf3cB976210c8a7aE403D93Eec8332D0f5D';

const DawgDropdown = () => {
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState('');
  const [customTaunt, setCustomTaunt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  interface NFT {
    tokenId: number;
    imageUrl: string;
    name: string;
    isRegistered: boolean;
    dawgName?: string;
    dawgTaunt?: string;
}



    const [nfts, setNfts] = useState<{ owned: NFT[] }>({ owned: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

    useEffect(() => {
  const fetchNfts = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const userRegistryContract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userRegistryAbi, provider);
      const dawgRegistrationContract = new ethers.Contract(DAWG_REGISTRATION_CONTRACT_ADDRESS, dawgRegistrationAbi, provider);

      const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);
      const ownedTokenIdsArray = ownedTokenIds.map((tokenId: BigNumber) => tokenId.toNumber());

      const ownedNftsData = await Promise.all(
        ownedTokenIdsArray.map(async (tokenId: number) => {
          const metadata = await fetchNftData(tokenId);
          const isRegistered = await dawgRegistrationContract.isNFTRegistered(tokenId);

          let dawgName = null;
          let dawgTaunt = null; // Initialize variable for Dawg Taunt

          if (isRegistered) {
            dawgName = await dawgRegistrationContract.dawgzNames(tokenId);
            dawgTaunt = await dawgRegistrationContract.dawgzDefaultTaunts(tokenId); // Fetch Dawg Taunt
          }

          return { ...metadata, tokenId, isRegistered, dawgName, dawgTaunt }; // Include dawgTaunt in the return object
        })
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
    const fetchNftData = async (tokenId: number) => {


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


  const handleNftChange = (event) => {
    setSelectedNft(event.target.value);
  };

  const handleTauntChange = (event) => {
    setCustomTaunt(event.target.value);
  };

  const enterBattle = async () => {
    if (!selectedNft) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const battleContract = new ethers.Contract(BATTLE_CONTRACT_ADDRESS, dawgBattleAbi, signer);

    try {
      const taunt = customTaunt || 'Default taunt';
      // Fetch the entry fee from the contract
      const entryFee = await battleContract.entryFee();

      // Call the enterBattle function from the contract
      const tx = await battleContract.enterBattle(selectedNft, taunt, { value: entryFee });
      await tx.wait();
      console.log('Battle entered successfully');
    } catch (error) {
      console.error('Error entering the battle:', error);
    }
  };

  return (
    <VStack spacing={4}>
      <Box minW="350px" minH="500px" bg="gray.700" borderRadius="md" p={4}>
        <Heading size="md" mb={4}>Enter Battle</Heading>
        <Text mb={2}>Choose your Dawg and enter the battle!</Text>

        <Select placeholder="Select Dawg" onChange={handleNftChange} value={selectedNft} mb={3}>
          {nfts.map((nft) => (
            <option key={nft.tokenId} value={nft.tokenId}> #{nft.tokenId}</option>
          ))}
        </Select>

        <Input placeholder="Custom Taunt" value={customTaunt} onChange={handleTauntChange} mb={3} />

        <Button colorScheme="blue" onClick={enterBattle} isLoading={isLoading}>Enter Battle</Button>
      </Box>
    </VStack>
  );
};

export default DawgDropdown;
