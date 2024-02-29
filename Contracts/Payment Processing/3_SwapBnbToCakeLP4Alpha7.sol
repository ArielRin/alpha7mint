
/*
LP Swapper - Send BNB Swap to Alpha7 and Return to holder deployed 0x3Eeb822A3E4A1CB88FFB6c106773Ba9580c0a5Cc

Live at: https://bscscan.com/address/0x3Eeb822A3E4A1CB88FFB6c106773Ba9580c0a5Cc#code


0x10ED43C718714eb63d5aA57B78B54704E256024E router PCSV2
0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c (weth) WBNB BSC
0x88CE0d545cF2eE28d622535724B4A06E59a766F0 token Alpha7
0x57103b1909fB4D295241d1D5EFD553a7629736A9 Dev Wallet


The contract automates BNB swapping for another token (myToken) and adding both to a Uniswap V2 liquidity pool. Here's a simplified workflow:

    Receive BNB: Users send BNB to the contract for swapping and liquidity addition.
    Tax Deduction: The contract deducts a tax from the BNB sent, transferring it to a treasury address. The applied tax is half of the taxRate.
    Swap BNB for Tokens: Half of the post-tax BNB is swapped for myToken using Uniswap V2, considering minimum tokens to account for slippage.
    Add Liquidity: The contract then uses the swapped myToken and the rest of the BNB to add liquidity to the BNB/myToken Uniswap V2 pool.
    Return LP Tokens: LP tokens generated from liquidity addition are sent to the transaction initiator, granting them pool shares and fee rewards.
    Refund Excess BNB: Any BNB leftover after these operations is refunded to the user.



    Made For Alpha7 Token - Network: BSC (56)

    Contract: 0x88CE0d545cF2eE28d622535724B4A06E59a766F0

    Pair: 0xa2136fEA6086f2254c9361C2c3E28c00F9e73366

    Dexscreener: https://dexscreener.com/bsc/0xa2136fEA6086f2254c9361C2c3E28c00F9e73366
    Website: https://system7.io
    Github: https://github.com/ArielRin/alpha7mint
    Telegram: https://t.me/system7_token
    Twitter: https://twitter.com/system7labs
    NFT Marketplace ELEMENT NFT: https://element.market/collections/aplhadawgz-NFT
    NFT Marketplace TofuNFT: https://tofunft.com/discover/items?contracts=98523
    Opensea BSC Viewer: https://opensea.io/collection/aplha-dawgz-nft-collection
    Medium token Introduction: https://medium.com/@system7setup/introducing-alpha7-a-revolutionary-token-in-the-cryptocurrency-world-74f756cf670b
    AlphaDawgz NFTs https://medium.com/@system7setup/introducing-alpha7-a-revolutionary-token-in-the-cryptocurrency-world-74f756cf670b

*/
// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/GSN/Context.sol



pragma solidity ^0.6.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/access/Ownable.sol



pragma solidity ^0.6.0;

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
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
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
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: PAYMENT AUTOMATION/3 - LP Swapper.sol





pragma solidity ^0.6.12;


interface IUniswapV2Router02 {
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IERC20 {
    function approve(address spender, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
}

contract A8LPMyContract is Ownable {
    IUniswapV2Router02 public uniswapRouter;
    address public immutable weth;
    address public immutable myToken;
    address public treasury; // Treasury address for receiving tax
    uint public taxRate = 8; // Full rate, will apply half as effective tax rate

    constructor(address _router, address _weth, address _myToken, address _treasury) public {
        uniswapRouter = IUniswapV2Router02(_router);
        weth = _weth;
        myToken = _myToken;
        treasury = _treasury; // Initialize treasury address
    }

    function swapAndAddLiquidity() external payable {
        require(msg.value > 0, "Need ETH for swap");

        // Calculate effective tax and remaining ETH after tax
        uint effectiveTax = msg.value * taxRate / 200; // Half of the specified tax rate
        (bool taxSent,) = treasury.call{value: effectiveTax}("");
        require(taxSent, "Failed to send ETH to treasury");

        uint ethForSwapAndLiquidity = msg.value - effectiveTax;
        uint halfEth = ethForSwapAndLiquidity / 2;

        // Swap half ETH for tokens
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;
        uint[] memory amountsOutMin = uniswapRouter.getAmountsOut(halfEth, path);
        uint amountOutMin = amountsOutMin[1] * 95 / 100; // Adjusting for slippage

        uniswapRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{value: halfEth}(
            amountOutMin,
            path,
            address(this),
            block.timestamp + 15 minutes
        );

        // Approve token transfer to router and add liquidity
        uint tokenAmount = IERC20(myToken).balanceOf(address(this));
        IERC20(myToken).approve(address(uniswapRouter), tokenAmount);

        uniswapRouter.addLiquidityETH{value: (ethForSwapAndLiquidity - halfEth)}(
            myToken,
            tokenAmount,
            0, // accept any amount of tokens due to fee-on-transfer
            0, // accept any amount of ETH due to fee-on-transfer
            msg.sender, // LP tokens sent to the caller
            block.timestamp + 15 minutes
        );

        // Refund leftover ETH to the caller
        if (address(this).balance > 0) {
            (bool refundSuccess,) = msg.sender.call{value: address(this).balance}("");
            require(refundSuccess, "Refund failed");
        }
    }

    function setTaxRate(uint _taxRate) external onlyOwner {
        require(_taxRate <= 100, "Tax rate cannot exceed 100%");
        taxRate = _taxRate;
    }

    function updateTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        treasury = _newTreasury;
    }

    // Function to receive ETH when sent directly to the contract
    receive() external payable {}
}
