import { aptosClient } from '@/lib/utils/aptosClient';

const kofi_address = process.env.NEXT_PUBLIC_KOFI_MODULE_ADDRESS;

// --- GraphQL Query for Total Transactions Count (Aggregate) ---
// This query uses an aggregate function to directly get the total count of transactions
const TOTAL_TRANSACTIONS_AGGREGATE_QUERY = `
query TotalTransactionsAggregateQuery {
  account_transactions_aggregate(
    where: {account_address: {_eq: "${kofi_address}"}}
  ) {
    aggregate {
      count
    }
  }
}
`;

interface AggregateQueryResponse {
  account_transactions_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

// --- Get Total Transactions (Efficient Method) ---
// This function uses the aggregate query to efficiently get the total transaction count
export async function getTotalTransactions(): Promise<number> {
  const aptos = aptosClient();

  try {
    const response: AggregateQueryResponse = await aptos.queryIndexer({
      query: {
        query: TOTAL_TRANSACTIONS_AGGREGATE_QUERY,
      },
    });

    const count = response.account_transactions_aggregate.aggregate.count;
    return count;
  } catch (err) {
    console.error(err);
    return 0;
  }
}
