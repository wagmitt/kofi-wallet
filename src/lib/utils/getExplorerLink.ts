type ExplorerType = 'object' | 'account' | 'transaction';
export type Network = 'mainnet' | 'testnet' | 'devnet';

const BASE_URL = 'https://explorer.aptoslabs.com';

const TYPE_PATHS: Record<ExplorerType, string> = {
  object: 'object',
  account: 'account',
  transaction: 'txn',
};

export function getExplorerLink(hash: string, type: ExplorerType, network: Network): string {
  const path = TYPE_PATHS[type];
  const networkParam = network === 'mainnet' ? '' : `?network=${network}`;
  return `${BASE_URL}/${path}/${hash}${networkParam}`;
}
