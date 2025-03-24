const APTOS_GRAPHQL_ENDPOINT = 'https://api.mainnet.aptoslabs.com/v1/graphql';

export interface Transaction {
    transaction_version: string;
    type: string;
    amount: string;
    transaction_timestamp: string;
}

export interface Balance {
    amount: string;
    last_transaction_timestamp: string;
}

export interface AssetInfoResponse {
    transactions: Transaction[];
    balance: Balance[];
}

export const ASSET_INFO_QUERY = `
  query AssetInfo($userAddress: String!, $assetAddress: String!) {
    transactions: fungible_asset_activities(
      where: {
        owner_address: { _eq: $userAddress }
        asset_type: { _eq: $assetAddress }
      }
      order_by: { transaction_version: desc }
      limit: 10
    ) {
      transaction_version
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

export async function fetchAssetInfo(userAddress: string, assetAddress: string): Promise<AssetInfoResponse> {
    const response = await fetch(APTOS_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: ASSET_INFO_QUERY,
            variables: {
                userAddress,
                assetAddress,
            },
        }),
    });

    const data = await response.json();
    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    return data.data;
} 