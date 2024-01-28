import React, { useEffect, useState } from 'react';

import {
  Box,
  Link,
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
  useToast,
} from '@chakra-ui/react';

import Web3 from 'web3';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import tokenGif from './token.gif';
import tokenLogo from './token.jpg';

import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xca695feb6b1b603ca9fec66aaa98be164db4e660';
const TOKEN_ADDRESS = '0x88CE0d545cF2eE28d622535724B4A06E59a766F0';

const getExplorerLink = () => `https://bscscan.com/address/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://opensea.io/collection/aplha-dawgz-nft-collection`;
const getTofuNftURL = () => `https://tofunft.com/discover/items?contracts=98523`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const [newCost, setNewCost] = useState('');

  const { writeAsync: pauseContract, error: pauseError } = useContractWrite({
    ...contractConfig,
    functionName: 'pause',
  });


    const calculateTotalPrice = () => {
      const pricePerToken = parseFloat(cost);
      return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
    };


    const maxSupply = 777;
    const remainingSupply = maxSupply - totalSupply;


  const { writeAsync: setNewCostFn, error: setNewCostError } = useContractWrite({
  ...contractConfig,
  functionName: 'setCost',
});

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 100));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait();
      toast.success('Mint successful! You can view your NFT soon.');
    } catch (error) {
      console.error(error);
      toast.error('Mint unsuccessful! Please try again.');
    } finally {
      setMintLoading(false);
    }
  };



  const onSetCostClick = async () => {
    try {
      // Convert the new cost value to Wei
      const newCostValueInWei = ethers.utils.parseUnits(newCost.toString(), 'wei');

      // Call the setCost function in the contract
      const tx = await setNewCostFn({
        args: [newCostValueInWei],
      });

      await tx.wait();
      toast.success('Cost updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update cost. Please try again.');
    }
  };

  const onTogglePauseClick = async () => {
    try {
      // Toggle the pause state
      const newState = !isPaused;

      // Call the pause function in the contract
      const tx = await pauseContract({
        args: [newState],
      });

      await tx.wait();
      toast.success(`Contract is now ${newState ? 'paused' : 'resumed'}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle pause state. Please try again.');
    }
  };










  useEffect(() => {
    async function fetchContractData() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
        const name = await contract.name();
        const supply = await contract.totalSupply();
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContractData();
  }, []);

  const [contractBalance, setContractBalance] = useState(0);

  useEffect(() => {
    async function fetchContractBalance() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the balance directly from the contract address
        const balance = await provider.getBalance(CONTRACT_ADDRESS);

        // Convert BigNumber to number before setting the state
        setContractBalance(balance.toNumber());
      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    }

    fetchContractBalance();
  }, []);

const [cost, setCost] = useState('0');

useEffect(() => {
  async function fetchCost() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the cost value directly from the contract
      const costValue = await contract.cost();

      // Convert Wei to Ether and set the state
      setCost(ethers.utils.formatEther(costValue));
    } catch (error) {
      console.error('Error fetching cost:', error);
    }
  }

  fetchCost();
}, []);

const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  async function fetchPauseStatus() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

      // Read the paused status directly from the contract
      const pausedStatus = await contract.paused();

      setIsPaused(pausedStatus);
    } catch (error) {
      console.error('Error fetching paused status:', error);
    }
  }

  fetchPauseStatus();
}, []);

const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    async function fetchRevealStatus() {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

        // Read the revealed status directly from the contract
        const revealedStatus = await contract.revealed();

        setIsRevealed(revealedStatus);
      } catch (error) {
        console.error('Error fetching revealed status:', error);
      }
    }

    fetchRevealStatus();
  }, []);



  const { writeAsync: revealCollection, error: revealError } = useContractWrite({
    ...contractConfig,
    functionName: 'reveal',
  });

  const onRevealClick = async () => {
    try {
      // Check if the collection is already revealed
      if (isRevealed) {
        toast.info('Collection is already revealed!');
        return;
      }

      // Call the reveal function in the contract
      const tx = await revealCollection();

      await tx.wait();
      toast.success('Collection revealed successfully!');
      setIsRevealed(true); // Update the local state to reflect that the collection is revealed
    } catch (error) {
      console.error(error);
      toast.error('Failed to reveal collection. Please try again.');
    }
  };




//
//   return (
//     <>
//       <ToastContainer />
//
//       <header>
//         <div className="connect-button">
//           <ConnectButton />
//         </div>
//       </header>
//
//       <div
//         className="wrapper"
//         style={{
//           backgroundColor: 'black',
//           color: 'white',
//           backgroundImage: `url(${backgroundGif})`,
//           backgroundSize: 'cover',
//         }}
//       >
//         <div className="mainboxwrapper">
//           <Container className="container" paddingY="4">
//           <Tabs isFitted variant="enclosed">
//             <TabList>
//               <Tab style={{ fontWeight: 'bold', color: 'white' }}>Mint</Tab>
//             </TabList>
//
//             <TabPanels>
//               <TabPanel>

//
//
//
//
//               </TabPanel>
//             </TabPanels>
//           </Tabs>
//             <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
//               &copy; Alpha 7 Token on BSC 2024. All rights reserved.
//             </Text>
//           </Container>
//         </div>
//       </div>
//     </>
//   );
// }
//
// export default App;

// Function to handle adding token to MetaMask
const handleAddToken = async () => {
  if (window.ethereum) {
    try {
      // MetaMask request to watch the asset
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Use 'ERC721' for NFTs
          options: {
            address: TOKEN_ADDRESS, // The address that the token is at
            symbol: 'ALPHA7', // A ticker symbol or shorthand, up to 5 characters
            decimals: 9, // The number of decimals in the token
            image: tokenLogo, // A string url of the token logo
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('MetaMask is not installed!');
  }
};

  const headerTextStyle = {
    fontSize: '28px', // Increased font size
    fontWeight: 'bold', // Make the text bolder
    color: '#f8f8ff', // Off-white color
  };

  return (
    <>
      <header className="header">
          <div style={headerTextStyle}>Mint AlphaDawgz</div>
          <div className="connect-button">
            <ConnectButton />
        </div>
      </header>



      <div className="container">
      <div className="row row-1_0"></div>

        <div className="row row-1">
                  {/* Apply the logobody class to the image */}
                  <img src={MainTextLogo} alt="Main Text Logo" className="logobody" />
                  {/* Rest of your first row content */}
                </div>
        <div className="row row-3">

                                                    <div>
                                                    <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                                                      Mint your AlphaDawgz for {cost} BNB Each!
                                                    </Text>
                                                    <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                                                      <Button
                                                        marginTop='1'
                                                        textColor='white'
                                                        bg='#094da7'
                                                        _hover={{
                                                          bg: '#0b6be8',
                                                        }}
                                                        onClick={handleDecrement}
                                                        disabled={!isConnected || mintLoading || mintAmount === 1}
                                                      >
                                                        -
                                                      </Button>
                                                      <Text marginX='3' textAlign='center' fontSize='lg'>
                                                        {mintAmount}
                                                      </Text>
                                                      <Button
                                                        marginTop='1'
                                                        textColor='white'
                                                        bg='#094da7'
                                                        _hover={{
                                                          bg: '#0b6be8',
                                                        }}
                                                        onClick={handleIncrement}
                                                        disabled={!isConnected || mintLoading || mintAmount === 200}
                                                      >
                                                        +
                                                      </Button>
                                                    </Box>

                                                    <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                                                      <Button
                                                        disabled={!isConnected || mintLoading}
                                                        marginTop='6'
                                                        onClick={onMintClick}
                                                        textColor='white'
                                                        bg='#094da7'
                                                        _hover={{
                                                          bg: '#0b6be8',
                                                        }}
                                                      >
                                                        {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                                                      </Button>
                                                    </Box>
                                                    <Button
                                                            marginTop='6'
                                                            onClick={handleAddToken}
                                                            textColor='white'
                                                            bg='#094da7'
                                                            _hover={{
                                                              bg: '#0b6be8',
                                                            }}
                                                          >
                                                            Add Alpha7 Token to MetaMask
                                                          </Button>

                                            </div>
                </div>
        <div className="row row-4">
        </div>
      </div>
    </>
  );
}

export default App;
