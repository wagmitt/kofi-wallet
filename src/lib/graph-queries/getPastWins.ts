import { aptosClient } from '@/lib/utils/aptosClient';
import KOFI_LOTTERY_ABI from '../abis/lottery';

const lottery_address = KOFI_LOTTERY_ABI.address;
// --- GraphQL Query ---
const PAST_LOTTERY_WINS_QUERY = `
query LotteryWinsQuery($user_address: String!) {
  events(
    limit: 10
    where: {indexed_type: {_eq: "${lottery_address}::lottery::PayoutEvent"}, data: { _contains: { user_address: $user_address } }}
    order_by: {transaction_block_height: desc}
  ) {
    data
    transaction_version
  }
}
`;

// --- TypeScript Interfaces ---
interface PayoutEventData {
  user_address: string;
  pot_id: string;
  payout_amount: string;
}

interface PayoutEvent {
  data: PayoutEventData;
  transaction_version: number;
}

interface PayoutEventsQueryResponse {
  events: PayoutEvent[];
}

// --- Fetching the Data ---
// This function queries the Aptos indexer using the GraphQL query.
async function fetchPayoutEvents(user: string): Promise<PayoutEvent[]> {
  // Create an AptosClient instance using the indexer GraphQL endpoint.
  // (Change the URL to the correct endpoint for your environment.)
  const aptos = aptosClient();
  try {
    // The SDK exposes a "queryIndexer" method which accepts a query object.
    const response: PayoutEventsQueryResponse = await aptos.queryIndexer({
      query: {
        query: PAST_LOTTERY_WINS_QUERY,
        variables: {
          user_address: user,
        },
      },
    });
    return response.events;
  } catch (error) {
    throw error;
  }
}

export async function getPastWins(user: string) {
  try {
    const events = await fetchPayoutEvents(user);

    // Transform the raw events into a more usable format
    return events.map(event => ({
      userAddress: event.data.user_address,
      potId: event.data.pot_id,
      payoutAmount: event.data.payout_amount,
      // You might want to convert payout_amount to a number or format it
      formattedAmount: parseFloat(event.data.payout_amount),
      transactionVersion: event.transaction_version,
    }));
  } catch (err) {
    console.error('Error fetching past wins:', err);
    return null;
  }
}
