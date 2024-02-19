import React, { useState } from 'react';
import Web3 from 'web3';

// ABI and contract address
const dawgBattleAbi = []; // The ABI array you provided
const BATTLE_CONTRACT_ADDRESS = '0x2Ba25F2AAdfba4E12b99f80A79e6f7AE68e5494C';

const BattleComponent = ({ account }) => {
  const [tokenId, setTokenId] = useState('');
  const [battleId, setBattleId] = useState(null);
  const [web3, setWeb3] = useState(new Web3(window.ethereum));
  const [contract, setContract] = useState(new web3.eth.Contract(dawgBattleAbi, BATTLE_CONTRACT_ADDRESS));

  // Handler for entering a battle
  const handleEnterBattle = async () => {
    try {
      const transaction = await contract.methods.enterBattle(tokenId).send({ from: account });

      // Assuming the event BattleEntered returns the battleId and it's the first event
      const battleId = transaction.events.BattleEntered.returnValues.battleId;
      setBattleId(battleId);
      alert(`Entered battle ID: ${battleId}`);
    } catch (error) {
      console.error('Error entering battle:', error);
      alert('Failed to enter battle.');
    }
  };

  // Handler for marking ready for battle
  const handleMarkReady = async () => {
    try {
      await contract.methods.markReady(battleId).send({ from: account });
      alert('Marked ready for battle.');
    } catch (error) {
      console.error('Error marking ready:', error);
      alert('Failed to mark ready for battle.');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter Token ID"
      />
      <button onClick={handleEnterBattle}>Enter Battle</button>
      {battleId && <button onClick={handleMarkReady}>Ready to Fight</button>}
    </div>
  );
};
