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

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './gold.gif';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0xca695feb6b1b603ca9fec66aaa98be164db4e660';

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
        <div className="row row-2">



          <div  className="column column-left">

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
          </div>





          <div className="column column-right">

          </div>
        </div>
        <div className="row row-3">


                                            <div>
                                                    <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                       <p>Alpha Dawg NFTs are set to be released prior to the launch of the Alpha7 token.
The funds raised from these sales will contribute to the initial liquidity pool (LP) adding to Alpha7 Tokens initial capital and the NFT Holder rewards pool.
Holders of these NFTs will receive benefits like Alpha7 Airdrops and reflections for each NFT they own.
This setup is designed to quickly offset the initial cost of the NFTs. Moreover,
holders of Alpha Dawg NFTs will enjoy an additional 2% reflection from Alpha7 token to the NFT rewards pool,
which will be distributed to holders on a weekly basis.
</p>
                                                      </Text>
                                              <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                {loading ? 'Loading...' : `${contractName || 'N/A'}`}
                                              </Text>
                                              <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                {loading ? 'Loading...' : `Minted : ${totalSupply} `}
                                              </Text>
                                              <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                {loading ? 'Loading...' : `Remaining Dawgz: ${remainingSupply}`}
                                              </Text>
                                              <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                <Link isExternal href={getExplorerLink()}>
                                                  {CONTRACT_ADDRESS}
                                                </Link>
                                              </Text>
                                            </div>
                </div>
        <div className="row row-4">Fourth Row (Min Height: 75px)</div>
      </div>
    </>
  );
}

export default App;
