

# NFT Sales and Battle Fees Payment Automated Distribution

This smart contract is designed to automate the distribution of BNB received from NFT sales and battle fees. Upon receiving BNB, the contract splits the funds into three predetermined portions: 59% for the liquidity wallet (Main Wallet), 20% for the Developer/Marketing Wallet, and 21% for the NFT Treasury Contract. This document explains the process, provides an example, and details the flow of funds.

## How It Works

When the contract receives BNB, it automatically divides the funds according to the specified percentages:

- **59% to the Liquidity Wallet (Main Wallet):** This portion is intended to support liquidity on platforms and exchanges.
- **20% to the Developer/Marketing Wallet:** These funds are allocated for ongoing development, marketing, and operational expenses.
- **21% to the NFT Treasury Contract:** This portion is further processed to swap BNB for Alpha7 tokens, which are then held in treasury to be distributed to NFT holders on a weekly basis as rewards.

### The Process

1. **Receiving BNB**: The contract listens for incoming BNB transactions, which are triggered by NFT sales and battle fees.

2. **Splitting Funds**: Upon receiving BNB, the contract automatically calculates the distribution based on the predefined percentages.

3. **Transferring BNB**: The calculated BNB amounts are then transferred to the respective wallets and the NFT Treasury Contract.

4. **Swapping and Distributing Alpha7 Tokens**:
    - The BNB received by the "NFT Treasury Contract" is used to swap for Alpha7 tokens through a predefined mechanism or exchange.
    - Once swapped, the Alpha7 tokens are sent to the NFT Rewards Treasury.
    - The NFT Rewards Treasury distributes the Alpha7 tokens to NFT holders as rewards on a weekly schedule.

## Visual Representation

Below is a visual flow of how BNB is distributed upon receiving by the contract:

  ![Contract Visual Representation](https://raw.githubusercontent.com/ArielRin/alpha7mint/day-5/Contracts/Payment%20Processing/Diagram.jpg "Contract Visual Representation")


## Example

For illustrative purposes, let's consider a scenario where 1 BNB is sent to the contract (`0x8F48161234E345336D014c6e050341Acc93Af433`).

Here's how the funds are distributed:

- **0.59 BNB** is sent to the **Liquidity Wallet (Main Wallet)**.
- **0.21 BNB** is swapped for Alpha7 tokens. The equivalent amount of Alpha7 tokens is then prepared for distribution.
- **0.20 BNB** is sent to the **Developer/Marketing Wallet**.

Please note, the actual amount of Alpha7 tokens received for the 0.21 BNB depends on the current exchange rate at the time of the swap. Gas fees are considered in the transaction and thus are deducted from the amounts sent.

## Final Outcome

Assuming 1 BNB is sent to the contract, the distribution will be as follows:

- Liquidity Wallet (Main Wallet) receives **0.59 BNB**.
- NFT holders are allocated an equivalent of **0.21 BNB** in Alpha7 tokens (the exact number of tokens will vary based on the swap rate).
- Developer/Marketing Wallet receives **0.20 BNB**.

*Note: The transactions include gas fees, which are subtracted from the sent amounts.*

## Wallets Used

0x57103b1909fB4D295241d1D5EFD553a7629736A9 Develp / marketing wallet

0x0bA23Af142055652Ba3EF1Bedbfe1f86D9bC60f7 NFT Treasury Wallet

0x1234567890 TBA Shortly Projects Main Owners Wallet



## Contract Links

NFTSalesAndBattleFeesPaymentSplitter - 0xadb6755bffe57a01cd24738faf5851c91da77fe2
https://bscscan.com/address/0xadb6755bffe57a01cd24738faf5851c91da77fe2#code

ConverterBNBToAlpha7SwapSendToTreasury - 0xa43323138cc32858b53f8bd9e7fcfde3a4d68037
https://bscscan.com/address/0xa43323138cc32858b53f8bd9e7fcfde3a4d68037#code

Swap BNB to Alpha7-BNB CakeLP token
https://bscscan.com/address/0x3Eeb822A3E4A1CB88FFB6c106773Ba9580c0a5Cc#code

## To Do

BNB to LP swapper (send it BNB receive LP make button for rick to use to do lp)
Automated scheduled dropper (Awaits Owner Push Button on dapp and updates NFT Holder List to current holder then Drops Alpha7 Tokens to tokenIDs Equally)

*Note Currently LP bnb sending to treasury awaiting Dapp and unlock.
---

This README provides a high-level overview of the contract's functionality, ensuring that stakeholders understand how BNB is processed, split, and distributed according to the project's tokenomics.
