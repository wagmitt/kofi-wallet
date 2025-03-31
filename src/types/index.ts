import type { Transaction } from '@/lib/graph-queries/getKofiBalance';
import { PotStats } from '@/lib/view-functions/getPotStats';

export type BigNumber = number | string;

export interface TokenBalances {
  apt: string | null;
  kapt: string | null;
  stkapt: string | null;
  kofi: string | null;
}

export interface TokenPrices {
  apt: string | null;
  kapt: string | null;
  stkapt: string | null;
}

export interface UserDataContextState {
  balances: TokenBalances;
  prices: TokenPrices;
  isLoading: boolean;
  isLoadingKofi: boolean;
  isAdmin: boolean;
  kofiTransactions: Transaction[];
  lotteryTickets: number;
  potStats: PotStats | null;
  refetch: () => Promise<void>;
}
