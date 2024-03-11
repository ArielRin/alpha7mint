// SPDX-License-Identifier: MIT
// LIVE AT 0x37922C5C3DEEF8A82492E6855EE08307a8D27278

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UserRegistry is Ownable {
    IERC721Enumerable public nftContract;

    struct User {
        string username;
        string bio;
        string telegramHandle;
        string twitterName;
        string countryOfOrigin;
        string nationality;
        string mainLanguage;
        string secondLanguage;
        string emailAddress;
        string linkedWallets; // string to store linked wallets
    }

    mapping(address => User) private users;

    // Constructor
    constructor(address _nftContractAddress) Ownable(msg.sender) {
        nftContract = IERC721Enumerable(_nftContractAddress);
    }

    // Register or update user
    function registerUser(
        string memory _username,
        string memory _bio,
        string memory _telegramHandle,
        string memory _twitterName,
        string memory _countryOfOrigin,
        string memory _nationality,
        string memory _mainLanguage,
        string memory _secondLanguage,
        string memory _emailAddress
    ) public {
        users[msg.sender] = User(
            _username,
            _bio,
            _telegramHandle,
            _twitterName,
            _countryOfOrigin,
            _nationality,
            _mainLanguage,
            _secondLanguage,
            _emailAddress,
            "" //
        );
    }
    function ownerRegisterUser(
        address _userAddress,
        string memory _username,
        string memory _bio,
        string memory _telegramHandle,
        string memory _twitterName,
        string memory _countryOfOrigin,
        string memory _nationality,
        string memory _mainLanguage,
        string memory _secondLanguage,
        string memory _emailAddress,
        string memory _linkedWallets
    ) public onlyOwner {
        users[_userAddress] = User(
            _username,
            _bio,
            _telegramHandle,
            _twitterName,
            _countryOfOrigin,
            _nationality,
            _mainLanguage,
            _secondLanguage,
            _emailAddress,
            _linkedWallets

        );
    }


    function getUserData(address _userAddress) public view returns (
    string memory username,
    string memory bio,
    string memory telegramHandle,
    string memory twitterName,
    string memory countryOfOrigin,
    string memory nationality,
    string memory mainLanguage,
    string memory secondLanguage,
    string memory emailAddress
) {
    User memory user = users[_userAddress];
    return (
        user.username,
        user.bio,
        user.telegramHandle,
        user.twitterName,
        user.countryOfOrigin,
        user.nationality,
        user.mainLanguage,
        user.secondLanguage,
        user.emailAddress
    );
}


    // Function to list owned NFTs
    function listNFTs(address _userAddress) public view returns (uint256[] memory) {
        uint256 tokenCount = nftContract.balanceOf(_userAddress);
        uint256[] memory tokensId = new uint256[](tokenCount);
        for(uint256 i = 0; i < tokenCount; i++){
            tokensId[i] = nftContract.tokenOfOwnerByIndex(_userAddress, i);
        }
        return tokensId;
    }

    // Administrative functions
    function setNFTContractAddress(address _newAddress) public onlyOwner {
        nftContract = IERC721Enumerable(_newAddress); // Use IERC721Enumerable for assignment
    }

    function recoverERC20(address _tokenAddress) public onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(owner(), token.balanceOf(address(this)));
    }

    function recoverNativeToken() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Receive ETH
    receive() external payable {}

    // Fallback
    fallback() external payable {}
}
