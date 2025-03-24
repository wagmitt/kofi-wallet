import { aptosClient } from '@/lib/utils/aptosClient';

const kapt_address = process.env.NEXT_PUBLIC_KAPT_ADDRESS;

// --- GraphQL Query for User Transactions ---
// This query fetches user transactions that interacted with the Kofi contract
const USER_TRANSACTIONS_QUERY = `
query MyQuery {
  current_fungible_asset_balances_aggregate(
    distinct_on: owner_address
    where: {asset_type_v2: {_eq: "${kapt_address}"}}
  ) {
    aggregate {
      count
    }
  }
}
`;

// --- TypeScript Interfaces ---


interface UserTransactionsQueryResponse {
  current_fungible_asset_balances_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

// --- Fetching Unique Users ---
// This function queries the Aptos indexer to get unique users that interacted with the Kofi contract
async function fetchUniqueUsers(): Promise<number> {
  const aptos = aptosClient();


  const response: UserTransactionsQueryResponse = await aptos.queryIndexer({
    query: {
      query: USER_TRANSACTIONS_QUERY,
    },
  });
  console.log("🚀 | fetchUniqueUsers | response:", response)


  return response.current_fungible_asset_balances_aggregate.aggregate.count;
}

// --- Get Unique Wallets ---
// This function returns the total number of unique users that interacted with the Kofi contract
export async function getUniqueWallets(): Promise<number> {
  try {
    const uniqueUsers = await fetchUniqueUsers();
    return uniqueUsers;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
