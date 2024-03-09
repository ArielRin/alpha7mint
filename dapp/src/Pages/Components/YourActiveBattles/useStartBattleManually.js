// useStartBattleManually.js
import { useContract, useSigner } from 'wagmi';
import dawgBattleAbi from './dawgBattleAbi.json';
const BATTLE_CONTRACT_ADDRESS = '0xb816222825Fd38B715904B301044C7D767389Aa2';

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
