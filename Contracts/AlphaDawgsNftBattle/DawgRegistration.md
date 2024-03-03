### Readme for NFTRegistration Contract

#### Simple Explanation

The `NFTRegistration` contract is designed for the Ethereum blockchain and is used to manage the registration and customization of unique digital assets known as Non-Fungible Tokens (NFTs). Specifically, it allows users to register their NFTs, update specific details about them (like name, taunt, and bio), and handle various administrative tasks related to these digital assets.

#### Breakdown of Functions and How They Work

1. **Constructor**
   - Called when the contract is deployed.
   - Initializes the contract with specific addresses for NFT and battle contracts, an ERC20 token address, a treasury address, fees, and a base URI.

2. **registerNFT(tokenId, dawgzName, dawgzDefaultTaunt, dawgzBio)**
   - Registers an NFT with the given `tokenId`.
   - Associates the NFT with a name, a default taunt, and a bio.
   - Requires a registration fee to be paid.
   - Ensures that the NFT is not already registered.

3. **modifyNFTDetails(tokenId, newName, newTaunt, newBio)**
   - Allows the NFT owner to update the name, taunt, and bio of their registered NFT.
   - Requires a modification fee to be paid.
   - Ensures that only the owner of the NFT can make these changes.

4. **transferOwnership(tokenId, newOwner)**
   - Transfers the ownership of a registered NFT to a new owner.
   - Ensures that the transfer is initiated by the current owner.

5. **recoverTokens(tokenAddress, to, amount)**
   - Allows the contract owner to recover ERC20 tokens sent to the contract.
   - Can be used in cases where tokens are sent to the contract by mistake.

6. **recoverNativeTokens(to, amount)**
   - Enables the contract owner to transfer Ether out of the contract.
   - Useful for managing funds within the contract.

7. **setRegistrationFee(_registrationFee)**
   - Used by the contract owner to set the registration fee for NFTs.

8. **setModificationFee(_modificationFee)**
   - Allows the contract owner to set the fee for modifying NFT details.

9. **setBaseURI(_baseURI)**
   - Lets the contract owner update the base URI used for NFT metadata.

10. **getNFTDetails(tokenId)**
    - Public function to retrieve the name, default taunt, and bio of a registered NFT.

11. **isNFTRegistered(tokenId)**
    - Public view function to check if an NFT is registered.

12. **getRegistrationDate(tokenId, owner)**
    - Provides the date when a specific NFT was registered.

13. **getModificationCount(tokenId)**
    - Returns the number of times an NFT's details have been modified.

14. **getRegistrationCount(tokenId)**
    - Indicates how many times an NFT has been registered.

#### Additional Notes

- The contract uses Ethereum's native currency, Ether, for payments.
- It is crucial for users to understand that once an NFT is registered or modified, certain actions cannot be reversed.
- The contract is designed to work with specific external NFT and battle contracts, and its functionality depends on their interfaces.
- The security of the contract and the integrity of the NFT data are paramount, so users should exercise caution and ensure they understand the contract's operations before interacting with it.
