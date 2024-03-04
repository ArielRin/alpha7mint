import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Box, VStack, Input, Button, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

const userProfileAbi = [
  {
    "inputs": [
      { "internalType": "string", "name": "_username", "type": "string" },
      { "internalType": "string", "name": "_bio", "type": "string" },
      { "internalType": "string", "name": "_telegramHandle", "type": "string" },
      { "internalType": "string", "name": "_twitterName", "type": "string" },
      { "internalType": "string", "name": "_countryOfOrigin", "type": "string" },
      { "internalType": "string", "name": "_nationality", "type": "string" },
      { "internalType": "string", "name": "_mainLanguage", "type": "string" },
      { "internalType": "string", "name": "_secondLanguage", "type": "string" },
      { "internalType": "string", "name": "_emailAddress", "type": "string" }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const USER_REGISTRY_CONTRACT_ADDRESS = "0x889aD5c66Bd0402EF1b672ca7E80b1caA7Ed5d62";
const countries = ["Afghanistan", "Albania", "Algeria", /* ... other countries ... */, "Zimbabwe"];

const UserProfileRegister = () => {
  const [tab, setTab] = useState('required');
  const [formData, setFormData] = useState({
    _username: '',
    _bio: 'nodataentered',
    _telegramHandle: 'nodataentered',
    _twitterName: 'nodataentered',
    _countryOfOrigin: 'nodataentered',
    _nationality: '',
    _mainLanguage: '',
    _secondLanguage: 'nodataentered',
    _emailAddress: 'nodataentered'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value || 'nodataentered' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.ethereum) {
      console.log('Ethereum wallet is not connected');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(USER_REGISTRY_CONTRACT_ADDRESS, userProfileAbi, signer);

      const tx = await contract.registerUser(
        formData._username,
        formData._bio,
        formData._telegramHandle,
        formData._twitterName,
        formData._countryOfOrigin,
        formData._nationality,
        formData._mainLanguage,
        formData._secondLanguage,
        formData._emailAddress
      );

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };


const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {


  return (
    <Box style={{
      width: '350px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff'
    }}>
      <Tabs>
        <TabList>
          <Tab onClick={() => setTab('required')}>Required</Tab>
          <Tab onClick={() => setTab('optional')}>Optional</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Input placeholder="Username" name="_username" onChange={handleInputChange} required />
                <select name="_nationality" onChange={handleInputChange} required style={selectStyle}>
                  <option value="">Choose Nation</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <Input placeholder="Main Language" name="_mainLanguage" onChange={handleInputChange} required />
                <Button type="submit" colorScheme="blue">Register Profile</Button>
              </VStack>
            </form>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4}>
              <Input placeholder="Bio" name="_bio" onChange={handleInputChange} />
              <Input placeholder="Telegram Handle" name="_telegramHandle" onChange={handleInputChange} />
              <Input placeholder="Twitter Name" name="_twitterName" onChange={handleInputChange} />
              <Input placeholder="Second Language" name="_secondLanguage" onChange={handleInputChange} />
              <Input placeholder="Email Address" type="email" name="_emailAddress" onChange={handleInputChange} />
              <Input placeholder="Country of Origin" name="_countryOfOrigin" onChange={handleInputChange} />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  borderColor: '#e2e8f0'
};

export default UserProfileRegister;
