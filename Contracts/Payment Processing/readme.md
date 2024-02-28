

# NFT Sales and Battle Fees Payment Splitter

This smart contract is designed to automate the distribution of BNB received from NFT sales and battle fees. Upon receiving BNB, the contract splits the funds into three predetermined portions: 59% for the liquidity wallet (Main Wallet), 20% for the Developer/Marketing Wallet, and 21% for the NFT Treasury Contract. This document explains the process, provides an example, and details the flow of funds.

## How It Works

When the contract receives BNB, it automatically divides the funds according to the specified percentages:

- **59% to the Liquidity Wallet (Main Wallet):** This portion is intended to support liquidity on platforms and exchanges.
- **20% to the Developer/Marketing Wallet:** These funds are allocated for ongoing development, marketing, and operational expenses.
- **21% to the NFT Treasury Contract:** This portion is further processed to swap BNB for Alpha7 tokens, which are then distributed to NFT holders on a weekly basis as rewards.

### The Process

1. **Receiving BNB**: The contract listens for incoming BNB transactions, which are triggered by NFT sales and battle fees.

2. **Splitting Funds**: Upon receiving BNB, the contract automatically calculates the distribution based on the predefined percentages.

3. **Transferring BNB**: The calculated BNB amounts are then transferred to the respective wallets and the NFT Treasury Contract.

4. **Swapping and Distributing Alpha7 Tokens**:
    - The BNB received by the "NFT Treasury Contract" is used to swap for Alpha7 tokens through a predefined mechanism or exchange.
    - Once swapped, the Alpha7 tokens are sent to the NFT Rewards Treasury.
    - The NFT Rewards Treasury distributes the Alpha7 tokens to NFT holders as rewards on a weekly schedule.

## Example

For illustrative purposes, let's consider a scenario where 1 BNB is sent to the contract (`0xAdb6755BfFE57a01Cd24738FAF5851c91dA77FE2`).

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

---

This README provides a high-level overview of the contract's functionality, ensuring that stakeholders understand how BNB is processed, split, and distributed according to the project's tokenomics.
