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

const USER_REGISTRY_CONTRACT_ADDRESS = "0x37922C5C3DEEF8A82492E6855EE08307a8D27278";
const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Democratic Republic of the", "Congo", "Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast (Côte d'Ivoire)", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea", "North", "Korea", "South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City (Holy See)", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const selectStyle = {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      borderColor: '#e2e8f0'
    };



  return (
    <Box style={{
      width: '90%',
      margin: '0 auto',
      padding: '20px',
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
                <Button type="submit" colorScheme="blue">Create a User Profile</Button>
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
