// SPDX-License-Identifier: MIT




/*
                                                  --------------------------------================.
                                                 *@@@@@%%%%%%%%%%%%@@@@@%%%%%%%%%%%%@%@@@@@@@@@@@=
                                                #@@@%+:::::::::::::::::::::::::::::::::::-*@@@@@-
           :+++++++++++++++++++++++============%@@@%+:...................................*@@@@@#========-
            -%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#******++++*******************-======#@@@@@@@@@@@@@@#
             *@@@*-::-=%@@@@@+---=@@@@@@=--:-::::-:--------:-+#@@@#---=@@@@@@@@%***####%@@@%=----=#@@@#
            *@@@*.     =@@@@@*   -@@@@@@%-                     :%@#   -@@@@@@@@+####%%@@@@%=      -#@@@*
          .#@@@*-::--:::+@@@@#---=@@@@@@@@%%%%@@@@@@@@@@@@@%+----%#===+@@@@@@@@++++#@@@@@%=--:-=---=#@@@#
         .%@@@+.  .##.  .+@@@*   :@@@@@@@@-   +@@@@@@@@@@@@@@:. .##   :@@@@@@@@:   +@@@@%-   :%@-   :#@@@#.
        :@@@@+----%@@#:::-*@@*:::-@@@@@@@@=...+%%%%%%%%%%%%#=:::-@#::::::::::::::::+@@@%=:::-%@@@=:::=#@@@%.
       -@@@@*####%@@@@%###*#@****+@@@@@@@@*+*+=================+@@#+**+*************@@@**###@@@@@@####*#@@@@:
      +@@@%*#%%%%#****#%%%%#%####*@@@@@@@@*###*#************##%@@@%*##*@@@@@@@@####*@@###%%%******%%%%%#*@@@@:
     *@@@#++++*#========%*+++%%*=+@@@@@@@@*+++#@@@@@@@@@@@@@@@@@@@%==*%#%%%#%@@++++#%*+++##========+%++*+=%@@@-
    #@@@*::::=@#####****#%-..:*#+....:::::=#-.*@@@@@@@@@@@@@@@@@@@*-##*****%@@@-:*++=...+@##########%#:::::%@@@=
  .%@@@*----=@@@@@@@@@@@@@@-::-#**----------*++@@@@########%#@@@@@%#++===+%@@@%+*==*---+@@@@@@@@@@@@@@#----=#@@@*
 :%@@@*#%%%%@@@@@@@@@@@@@@@@%%%@@%%%%%%%%%%%%##@@@#         +@@@@*=-::::=@@@@@#*%@@@%%%@@@@@@@@@@@@@@@@%%%%%+#@@@*
.*###++**********#############################*+#%.        *@@@%=..    =@@@@#==+***************************++=****:
                                                          *@@@%:      +@@@@%.
                                                         #@@@#:     .*@@@@#
                                                       .%@@@#-::::::#@@@@*
                                                      :%@@@*+++++++%@@@@+
                                                     -@@@@*######*%@@@@=
                                                    =@@@@%#%%%%%#@@@@@-
                                                   =@@@@@@@@@@@@@@@@%:
                                                  :+++++++++++++++++.
AlphaDawgs Battle System
testing at : https://scan.maxxchain.org/address/0x5fB8e15bea06A8688BB0876A4D1F47F7ac1a8074/contracts#address-tabs
0x5fB8e15bea06A8688BB0876A4D1F47F7ac1a8074

testing at BSC:


NFT Contract AlphaDawgs: 0xca695feb6b1b603ca9fec66aaa98be164db4e660 //for testmax use 0xC4Ba9f624B9ebc0386C7a8160Bb489f96b47aD68
Treasury Fee to Developer Wallet: 0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7

The Dawg Pound Contract: 0x3cf4d5ef3cB24F061dEe1E75e4E0b47f99cb4a6E



---Version History Added Features---
V7_2_1
Comments section when entering battle . Suggested by Affinity King on our Telegram Chat.


# Technical Document: AlphaDawgsBattleSystem Contract Mechanics

## Overview

The AlphaDawgsBattleSystem contract is a decentralized application (dApp) deployed on the BSC blockchain, facilitating a competitive game between two participants using Non-Fungible Tokens (NFTs) from a specific collection. This document provides a detailed overview of the game mechanics, smart contract functionality, and the interaction flow between participants.

## Contract Objective

The primary objective of the AlphaDawgsBattleSystem contract is to offer a blockchain-based platform where users can engage in head-to-head battles using NFTs as their avatars or representatives. Each battle round requires two participants, each entering the battle by staking an NFT (verified to be from a predetermined collection) and paying an entry fee in Ether (ETH). The winner of the battle is determined through a randomized algorithm, with the victor receiving a majority portion of the total entry fees.

## Key Features

- **NFT-Based Participation**: Entry into battles is restricted to owners of NFTs from a specified collection.
- **ETH Entry Fee**: A fixed entry fee in ETH is required to participate in a battle, creating a prize pool.
- **Random Winner Selection**: The contract employs a pseudo-random selection process to determine the battle's outcome.
- **Reward Allocation**: The winner receives 95% of the combined entry fees, incentivizing participation.
- **Transparency and Fairness**: The contract records and makes public the token IDs of the participating NFTs and the battle outcome.

## Contract Mechanics

### Entry Mechanism

1. **Ownership Verification**: Upon attempting to enter a battle, the contract verifies that the participant owns the NFT they wish to use, matching it against the specified collection's contract address.
2. **Entry Fee**: Participants must send the required ETH amount along with their battle entry call.
3. **Unique Participation**: The contract ensures that each NFT can only be used for one active battle at a time to maintain fairness.

### Battle Initialization

- **Two-Participant Limit**: A battle round is initialized when two unique participants have successfully entered.
- **Readiness Confirmation**: Participants can signal their readiness to proceed with the battle. The battle automatically triggers once both participants are ready or after a 30-minute wait time, whichever comes first.

### Winner Determination and Reward Distribution

- **Randomness**: The winner is selected using a pseudo-random algorithm based on blockchain data (e.g., blockhash) to ensure unpredictability within the constraints of blockchain determinism.
- **Prize Allocation**: Upon determining the winner, 95% of the total entry fees are transferred to the winner's address. The contract retains no fees, ensuring all proceeds are returned to participants.

### Post-Battle

- **Result Recording**: The token IDs of the winning and losing NFTs are recorded for transparency.
- **Re-Entry**: NFTs used in completed battles are eligible for re-entry in subsequent battles.

## Security Measures

- **Reentrancy Guard**: The contract utilizes the ReentrancyGuard modifier to prevent reentrancy attacks, particularly during the funds transfer phase.
- **Validation Checks**: Comprehensive checks are in place to validate participant entries, ownership of NFTs, and readiness signals to prevent unauthorized actions.

## Deployment and Interaction

### Deployment

The contract must be compiled and deployed to the Ethereum network using a development environment like Hardhat or Truffle. The deployment process involves setting the NFT collection's contract address as an immutable parameter within the contract.

### Interaction

Participants interact with the contract through Ethereum transactions, specifically calling the `enterBattle` and `markReady` functions. Interactions can be facilitated through web3 providers or Ethereum wallet interfaces integrated into a user interface.

## Future Enhancements

- **Improved Randomness**: Integrating a verifiably random function (VRF), such as Chainlink VRF, could enhance the fairness and unpredictability of the winner selection process.
- **Dynamic Entry Fees**: Implementing a mechanism to adjust entry fees based on market conditions or participant demand could optimize participation rates and prize pools.
- **Community Features**: Adding functionalities such as leaderboards, recurring tournaments, and special rewards could further engage the community and incentivize continuous participation.

## Conclusion

The AlphaDawgsBattleSystem contract introduces a novel use case for NFTs, allowing owners to engage in competitive battles on the blockchain. By leveraging the inherent properties of NFTs for entry and utilizing smart contract capabilities for secure, transparent operations, the game offers a unique and engaging experience for participants. Future improvements can enhance the game's fairness, engagement, and overall appeal to a broader audience.

Made by InHaus Development
https://t.me/InHausDevelopment



*/

// File: @openzeppelin/contracts@4.5.0/utils/Context.sol

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts@4.5.0/access/Ownable.sol


// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: @openzeppelin/contracts@4.5.0/security/ReentrancyGuard.sol


// OpenZeppelin Contracts v4.4.1 (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

// File: @openzeppelin/contracts@4.5.0/utils/Counters.sol


// OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)

pragma solidity ^0.8.0;

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

// File: @openzeppelin/contracts@4.5.0/utils/introspection/IERC165.sol


// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: @openzeppelin/contracts@4.5.0/token/ERC721/IERC721.sol


// OpenZeppelin Contracts v4.4.1 (token/ERC721/IERC721.sol)

pragma solidity ^0.8.0;


/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool _approved) external;

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external;
}

// File: BATTLEDAWGZ V3/AlphaDawgsBattleSystemBetaV5.sol
pragma solidity ^0.8.0;

// Add at the top where other interfaces are declared
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract AlphaDawgsBattleSystemBetaV7_2_1 is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _battleIdCounter;

    struct Battle {
        uint256 id;
        address[2] entrants;
        uint256[2] tokenIds;
        uint256 startTime;
        bool[2] readyNow;
        bool completed;
        uint256 additionalPrize;
        string[2] comments; // Stores comments for each entrant
    }

    bool public commentsEnabled = true; // Controls if comments are allowed

    struct TokenStats {
        uint256 valueEarned;
        uint256 timesWon;
        uint256 timesLost;
    }

    mapping(uint256 => Battle) public battles;
    mapping(uint256 => TokenStats) public tokenStats;
    mapping(uint256 => bool) public tokenInBattle;

    IERC721 public nftContract;
    uint256 public entryFee = 0.00001 ether;
    address public treasuryAddress;
    uint256 public devFeePercentage = 7;

    event BattleInitiated(uint256 indexed battleId, uint256 initiatedByTokenId, string comment);
    event BattleReady(uint256 indexed battleId, address entrant);
    event WinnerDeclared(uint256 indexed battleId, address winner, uint256 winningTokenId, uint256 losingTokenId, uint256 prize, uint256 devFee);
    event PrizeBoosted(uint256 battleId, uint256 additionalValue);

    constructor(address _nftContract, address _treasuryAddress) {
        require(_nftContract != address(0), "NFT contract address cannot be zero address");
        nftContract = IERC721(_nftContract);
        treasuryAddress = _treasuryAddress;
    }

    function enterBattle(uint256 tokenId, string calldata comment) external payable {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        require(!tokenInBattle[tokenId], "Token already in an active battle");
        require(commentsEnabled || bytes(comment).length == 0, "Comments are disabled");
        require(bytes(comment).length <= 55, "Comment exceeds maximum length");

        uint256 battleId = _findOrCreateBattle(tokenId, comment);
        emit BattleInitiated(battleId, tokenId, comment);
    }
    function _findOrCreateBattle(uint256 tokenId, string memory comment) private returns (uint256) {
    for (uint256 i = 1; i <= _battleIdCounter.current(); i++) {
        Battle storage battle = battles[i];
        if (!battle.completed && battle.entrants[1] == address(0) && battle.entrants[0] != msg.sender) {
            battle.entrants[1] = msg.sender;
            battle.tokenIds[1] = tokenId;
            battle.startTime = block.timestamp;
            battle.comments[1] = comment; // Assuming the comment is for the second entrant
            tokenInBattle[tokenId] = true;
            return i;
        }
    }

    _battleIdCounter.increment();
    uint256 battleId = _battleIdCounter.current();
    battles[battleId] = Battle({
        id: battleId,
        entrants: [msg.sender, address(0)],
        tokenIds: [tokenId, 0],
        startTime: 0,
        readyNow: [false, false],
        completed: false,
        additionalPrize: 0,
        comments: [comment, ""] // Store the comment for the initiator
    });
    tokenInBattle[tokenId] = true;
    return battleId;
} // This closing brace was missing

function toggleCommentsFeature() external onlyOwner {
    commentsEnabled = !commentsEnabled;
}


    function markReady(uint256 battleId) external {
        Battle storage battle = battles[battleId];
        require(msg.sender == battle.entrants[0], "Only the first entrant can mark ready");
        battle.readyNow[0] = true;
        emit BattleReady(battleId, msg.sender);
    }
// Assuming roundDuration is in seconds for consistency with Solidity's timestamp units
uint256 public roundDuration = 300; // Default to 30 minutes in seconds

function setRoundDuration(uint256 _durationInMinutes) external onlyOwner {
    roundDuration = _durationInMinutes * 60; // Convert minutes to seconds
}

function startBattleManually(uint256 battleId) external {
    Battle storage battle = battles[battleId];
    require(block.timestamp >= battle.startTime + roundDuration, "Cannot start battle yet");
    require(battle.entrants[0] == msg.sender || battle.entrants[1] == msg.sender, "Caller is not an entrant");
    require(!battle.completed, "Battle already completed");
    _declareWinner(battleId);
}


    function forceStartBattle(uint256 battleId) external onlyOwner {
        Battle storage battle = battles[battleId];
        require(battle.entrants[0] != address(0), "Battle does not exist.");
        require(!battle.completed, "Battle already completed");
        _declareWinner(battleId);
    }

function _declareWinner(uint256 battleId) internal {
    Battle storage battle = battles[battleId];
    require(!battle.completed, "Battle already completed");
    require(battle.entrants[1] != address(0), "Not enough participants");

    uint256 winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, battleId))) % 2;
    uint256 loserIndex = 1 - winnerIndex; // Determine the loser based on the winnerIndex

    address winner = battle.entrants[winnerIndex];
    uint256 winnerTokenId = battle.tokenIds[winnerIndex];
    uint256 loserTokenId = battle.tokenIds[loserIndex];

    // Calculate the total prize and dev fee
    uint256 totalEntryFees = entryFee * 2; // Both participants have paid the entry fee
    uint256 totalPrize = totalEntryFees + battle.additionalPrize;
    uint256 devFee = (totalPrize * devFeePercentage) / 100;
    uint256 prize = totalPrize - devFee;

    // Transfer the prize to the winner and the dev fee to the treasury
    payable(winner).transfer(prize);
    payable(treasuryAddress).transfer(devFee);

    // Update battle completion status
    battle.completed = true;
    tokenInBattle[winnerTokenId] = false;
    tokenInBattle[loserTokenId] = false;

    // Update win/loss counts
    tokenStats[winnerTokenId].timesWon += 1;
    tokenStats[winnerTokenId].valueEarned += prize; // Ensure value earned is updated here
    tokenStats[loserTokenId].timesLost += 1;

    // Emit the winner declaration event
    emit WinnerDeclared(battleId, winner, winnerTokenId, loserTokenId, prize, devFee);
}


    function boostPrizeValue(uint256 battleId) external payable onlyOwner {
        require(battleId <= _battleIdCounter.current(), "Battle does not exist.");
        require(!battles[battleId].completed, "Battle already completed");
        battles[battleId].additionalPrize += msg.value;
        emit PrizeBoosted(battleId, msg.value);
    }

    function setEntryFee(uint256 _entryFee) external onlyOwner {
        entryFee = _entryFee;
    }

   function getBattleDetails(uint256 battleId) public view returns (
    uint256 id,
    address initiator,
    uint256 initiatorTokenId,
    address secondaryEntrant,
    uint256 secondaryTokenId,
    uint256 startTime,
    bool initiatorReady,
    bool completed,
    uint256 totalValueInBattle,
    string memory initiatorComment,
    string memory secondaryEntrantComment
) {
    Battle storage battle = battles[battleId];
    require(battle.entrants[0] != address(0), "Battle does not exist.");

    uint256 participants = (battle.entrants[1] != address(0)) ? 2 : 1;
    totalValueInBattle = entryFee * participants + battle.additionalPrize;

    initiatorComment = battle.comments[0];
    secondaryEntrantComment = battle.comments[1];

    return (
        battle.id,
        battle.entrants[0],
        battle.tokenIds[0],
        battle.entrants[1],
        battle.tokenIds[1],
        battle.startTime,
        battle.readyNow[0],
        battle.completed,
        totalValueInBattle,
        initiatorComment,
        secondaryEntrantComment
    );
}



    function getActiveBattleIds() public view returns (uint256[] memory) {
    uint256 activeCount = 0;
    for (uint256 i = 1; i <= _battleIdCounter.current(); i++) {
        if (!battles[i].completed) {
            activeCount++;
        }
    }

    uint256[] memory activeIds = new uint256[](activeCount);
    uint256 currentIndex = 0;
    for (uint256 i = 1; i <= _battleIdCounter.current(); i++) {
        if (!battles[i].completed) {
            activeIds[currentIndex] = i;
            currentIndex++;
        }
    }
    return activeIds;
}

    function getCompletedBattleIds() public view returns (uint256[] memory) {
    uint256 completedCount = 0;
    for (uint256 i = 1; i <= _battleIdCounter.current(); i++) {
        if (battles[i].completed) {
            completedCount++;
        }
    }

    uint256[] memory completedIds = new uint256[](completedCount);
    uint256 currentIndex = 0;
    for (uint256 i = 1; i <= _battleIdCounter.current(); i++) {
        if (battles[i].completed) {
            completedIds[currentIndex] = i;
            currentIndex++;
        }
    }
    return completedIds;
    }


    // Function to withdraw Ether sent to the contract by mistake
    function withdrawEther(address payable recipient, uint256 amount) external onlyOwner {
    require(address(this).balance >= amount, "Insufficient balance");
    recipient.transfer(amount);
    }

    // Function to withdraw ERC20 tokens sent to the contract by mistake
    function withdrawERC20(address tokenAddress, address recipient, uint256 amount) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    require(token.transfer(recipient, amount), "Transfer failed");
    }


    receive() external payable {}
    fallback() external payable {}
}
