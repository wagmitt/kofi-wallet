import { isUserTransactionResponse } from '@aptos-labs/ts-sdk';
import { aptosClient } from '../utils/aptosClient';
import KOFI_LOTTERY_GATEWAY_ABI from '../abis/lottery';

const DECIMALS = 8;

export const getLotteryWinnings = async (transactionHash: string): Promise<string | null> => {
  const aptos = aptosClient();
  try {
    // Fetch transaction by hash
    const txn = await aptos.getTransactionByHash({
      transactionHash: transactionHash,
    });

    // Check if the transaction was successful and has events
    if (isUserTransactionResponse(txn)) {
      // Find the PayoutEvent
      const payoutEvent = txn.events.find(
        event =>
          event.type ===
          `${KOFI_LOTTERY_GATEWAY_ABI.address}::lottery::PayoutEvent`
      );

      if (payoutEvent && 'data' in payoutEvent && 'payout_amount' in payoutEvent.data) {
        const rawAmount = payoutEvent.data.payout_amount as string;
        // Convert to number, divide by 10^DECIMALS, and convert back to string
        const amount = (Number(rawAmount) / Math.pow(10, DECIMALS)).toString();
        return amount;
      }

      return null;
    } else {
      console.log('No events found or transaction failed.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
};
