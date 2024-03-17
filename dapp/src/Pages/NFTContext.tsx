import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';


const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";

import userRegistryAbi from './userRegistryAbi.json';


// Define the structure of your NFT metadata
interface NFTMetadata {
    name: string;
    description: string;
    image: string;
}

// Interface for NFT data
interface NFT {
    tokenId: number;
    metadata: NFTMetadata;
}

// Interface for NFT context
interface NFTContextType {
    nfts: NFT[];
    isLoading: boolean;
    error: Error | null;
}

// Function to fetch NFT metadata
const fetchNftMetadata = async (tokenId: number): Promise<NFTMetadata> => {
    const metadataUrl = `https://your-api/nft/${tokenId}`;
    const response = await fetch(metadataUrl);
    const metadata = await response.json() as NFTMetadata;
    return metadata;
};

// Create the context with a default value
export const NFTContext = createContext<NFTContextType>({
    nfts: [],
    isLoading: false,
    error: null,
});

interface NFTProviderProps {
    children: React.ReactNode;
}

// Provider Component
export const NFTProvider: React.FC<NFTProviderProps> = ({ children }) => {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchOwnedNfts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (typeof window.ethereum !== 'undefined') {
                    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
                    const userRegistryContract = new ethers.Contract(
                        USER_REGISTRY_CONTRACT_ADDRESS,
                        userRegistryAbi,
                        provider
                    );

                    const signer = provider.getSigner();
                    const walletAddress = await signer.getAddress();

                    const ownedTokenIds = await userRegistryContract.listNFTs(walletAddress);
                    const ownedTokenIdsArray = ownedTokenIds.map(
                        (tokenId: ethers.BigNumber) => tokenId.toNumber()
                    );

                    const nftsWithMetadata = await Promise.all(
                        ownedTokenIdsArray.map(async (tokenId: number) => {
                            const metadata = await fetchNftMetadata(tokenId);
                            return { tokenId, metadata };
                        })
                    );

                    setNfts(nftsWithMetadata);
                } else {
                    setError(new Error('Ethereum wallet is not available'));
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('Unknown error occurred'));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOwnedNfts();
    }, []);

    const value = { nfts, isLoading, error };

    return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};
