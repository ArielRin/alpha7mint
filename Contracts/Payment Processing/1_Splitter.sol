// SPDX-License-Identifier: MIT

// File: @openzeppelin/contracts@4.5.0/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

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

// File: PAYMENT AUTOMATION/1 - SplitReceivedBnbToTokenomicsStructure.sol



// Addresses of wallets to deploy for split
// dev: 0x57103b1909fB4D295241d1D5EFD553a7629736A9
// NFTtreasury: 0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7

// NFT converter to treasury for alpha7 contract:
//  0xA43323138cc32858b53F8Bd9e7fCFde3a4d68037
//      here -        https://bscscan.com/address/0xa43323138cc32858b53f8bd9e7fcfde3a4d68037



pragma solidity ^0.8.0;




/**
 * @title NFTSalesAndBattleFeesPaymentSplitter
 * @dev This contract is designed to split incoming payments between different wallets
 * based on predefined percentages for different purposes: developer marketing, NFT treasury rewards, and liquidity.
 */


contract ReceiveBNBandConvertToAlpha7ThenSendToTreasury is Ownable {
    address public developerMarketingWallet;
    address public nftTreasuryRewardsWallet;
    address public liquidityWallet;

    uint256 public developerMarketingPercentage = 20;
    uint256 public nftTreasuryRewardsPercentage = 21;
    uint256 public liquidityPercentage = 59;

    bool public splitPaused = false;

    event FundsSplit(uint256 developerMarketingShare, uint256 nftTreasuryRewardsShare, uint256 liquidityShare);
    event SplitPaused();
    event SplitResumed();
    event AddressesUpdated(address developerMarketingWallet, address nftTreasuryRewardsWallet, address liquidityWallet);
    event PercentagesUpdated(uint256 developerMarketingPercentage, uint256 nftTreasuryRewardsPercentage, uint256 liquidityPercentage);

    constructor(address _developerMarketingWallet, address _nftTreasuryRewardsWallet, address _liquidityWallet) {
        require(_developerMarketingWallet != address(0) && _nftTreasuryRewardsWallet != address(0) && _liquidityWallet != address(0), "Addresses cannot be zero");
        developerMarketingWallet = _developerMarketingWallet;
        nftTreasuryRewardsWallet = _nftTreasuryRewardsWallet;
        liquidityWallet = _liquidityWallet;
    }

    receive() external payable {
        if (!splitPaused) {
            _splitFunds();
        }
    }

    function _splitFunds() private {
        uint256 totalReceived = msg.value;

        uint256 developerMarketingShare = (totalReceived * developerMarketingPercentage) / 100;
        uint256 nftTreasuryRewardsShare = (totalReceived * nftTreasuryRewardsPercentage) / 100;
        uint256 liquidityShare = totalReceived - developerMarketingShare - nftTreasuryRewardsShare;

        (bool devSent,) = developerMarketingWallet.call{value: developerMarketingShare}("");
        require(devSent, "Failed to send Ether to developer marketing wallet");

        (bool nftSent,) = nftTreasuryRewardsWallet.call{value: nftTreasuryRewardsShare}("");
        require(nftSent, "Failed to send Ether to NFT treasury rewards wallet");

        (bool liqSent,) = liquidityWallet.call{value: liquidityShare}("");
        require(liqSent, "Failed to send Ether to liquidity wallet");

        emit FundsSplit(developerMarketingShare, nftTreasuryRewardsShare, liquidityShare);
    }

    function pauseSplit() public onlyOwner {
        splitPaused = true;
        emit SplitPaused();
    }

    function resumeSplit() public onlyOwner {
        splitPaused = false;
        emit SplitResumed();
    }

    function setAddresses(address _developerMarketingWallet, address _nftTreasuryRewardsWallet, address _liquidityWallet) public onlyOwner {
        require(_developerMarketingWallet != address(0) && _nftTreasuryRewardsWallet != address(0) && _liquidityWallet != address(0), "Addresses cannot be zero");
        developerMarketingWallet = _developerMarketingWallet;
        nftTreasuryRewardsWallet = _nftTreasuryRewardsWallet;
        liquidityWallet = _liquidityWallet;
        emit AddressesUpdated(_developerMarketingWallet, _nftTreasuryRewardsWallet, _liquidityWallet);
    }

    function setPercentages(uint256 _developerMarketingPercentage, uint256 _nftTreasuryRewardsPercentage, uint256 _liquidityPercentage) public onlyOwner {
        require(_developerMarketingPercentage + _nftTreasuryRewardsPercentage + _liquidityPercentage == 100, "Percentages must sum to 100");
        developerMarketingPercentage = _developerMarketingPercentage;
        nftTreasuryRewardsPercentage = _nftTreasuryRewardsPercentage;
        liquidityPercentage = _liquidityPercentage;
        emit PercentagesUpdated(_developerMarketingPercentage, _nftTreasuryRewardsPercentage, _liquidityPercentage);
    }

    function recoverEther() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function recoverERC20(IERC20 token) public onlyOwner {
        token.transfer(owner(), token.balanceOf(address(this)));
    }
}
