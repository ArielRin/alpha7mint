// useStartBattleManually.js
import { useContract, useSigner } from 'wagmi';
import dawgBattleAbi from './dawgBattleAbi.json';
const BATTLE_CONTRACT_ADDRESS = '0x0460eCB4cf623C83Ac066347de9F4Bf5A0A6495c';

export function useStartBattleManually() {
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: BATTLE_CONTRACT_ADDRESS,
    contractInterface: dawgBattleAbi,
    signerOrProvider: signer,
  });

  const startBattleManually = async (battleId) => {
    try {
      const transaction = await contract.startBattleManually(battleId);
      await transaction.wait();
      console.log(`Battle ${battleId} finalized successfully`);
    } catch (error) {
      console.error(`Error finalizing battle ${battleId}:`, error);
    }
  };

  return startBattleManually;
}
