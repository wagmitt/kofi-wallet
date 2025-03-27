export const KOFI_MODULE_ADDRESS = '0x2acee43658eedf3d0197e5a1fefff6b8971577ff5f04324c0e97c9520e8509a7::coin_factory::Emojicoin';
const DECIMALS = 8;

export interface Transaction {
  transaction_version: string;
  type: string;
  amount: string;
  transaction_timestamp: string;
  formatted_amount: string;
}

export interface Balance {
  amount: string;
  formatted_amount: string;
  last_transaction_timestamp: string;
}

export interface AssetInfoResponse {
  transactions: Transaction[];
  balance: Balance[];
}

// Format amount by dividing by 10^8 and always show 2 decimal places
const formatAmount = (amount: string): string => {
  try {
    const value = BigInt(amount);
    const divisor = BigInt(10 ** DECIMALS);
    const wholePart = value / divisor;
    const fractionalPart = value % divisor;
    const fractionalStr = fractionalPart.toString().padStart(DECIMALS, '0');
    const formattedFractional = fractionalStr.slice(0, 2);

    // Always show 2 decimal places
    return `${wholePart}.${formattedFractional}`;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0.00';
  }
};

// Format transaction type
const formatTransactionType = (type: string): string => {
  if (type.includes('::coin::WithdrawEvent')) return 'Sent';
  if (type.includes('::coin::DepositEvent')) return 'Received';
  if (type.includes('::fungible_asset::Withdraw')) return 'Sent';
  if (type.includes('::fungible_asset::Deposit')) return 'Received';
  return type;
};

// --- GraphQL Query ---
// This query fetches up to 84 reward events (ordered ascending by block height).
export const ASSET_INFO_QUERY = `
  query AssetInfo($userAddress: String!, $assetAddress: String!) {
    transactions: fungible_asset_activities(
      where: {owner_address: {_eq: $userAddress}, metadata: {symbol: {_eq: "☕"}}}
      order_by: {transaction_version: desc}
      limit: 10
    ) {
      type
      amount
      transaction_timestamp
    }
    balance: current_fungible_asset_balances(
      where: {
        owner_address: { _eq: $userAddress }
        asset_type: { _eq: $assetAddress }
      }
    ) {
      amount
      last_transaction_timestamp
    }
  }
`;

// --- Fetching the Data ---
// This function queries the Aptos indexer using the GraphQL query.
export async function fetchKofiBalance(userAddress: string): Promise<AssetInfoResponse> {
  try {
    const response = await fetch('https://api.mainnet.aptoslabs.com/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer aptoslabs_7Szss4Ys7EH_Ezk4prHWBn7yrREc9KHVZNH6zKEXyt1Kn`,
      },
      body: JSON.stringify({
        query: ASSET_INFO_QUERY,
        variables: {
          userAddress,
          assetAddress: KOFI_MODULE_ADDRESS,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    // Transform the response to include formatted amounts and transaction types
    const transformedData: AssetInfoResponse = {
      transactions: result.data.transactions.map((tx: Transaction) => ({
        ...tx,
        type: formatTransactionType(tx.type),
        formatted_amount: formatAmount(tx.amount),
      })),
      balance: result.data.balance.map((bal: Balance) => ({
        ...bal,
        formatted_amount: formatAmount(bal.amount),
      })),
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching Kofi balance:', error);
    throw error;
  }
}
