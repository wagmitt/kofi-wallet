'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import type { TokenBalances, UserDataContextState } from '@/types';
import { REFRESH_INTERVAL } from '@/settings';
import { fetchKofiBalance, type Transaction } from '@/lib/graph-queries/getKofiBalance';

const UserDataContext = createContext<UserDataContextState | undefined>(undefined);

const INITIAL_BALANCES: TokenBalances = {
  apt: null,
  kapt: null,
  stkapt: null,
  kofi: '0.00',
};

// Format amount by dividing by 10^8 and always show 2 decimal places
const formatAmount = (amount: string): string => {
  try {
    const value = BigInt(amount);
    const divisor = BigInt(10 ** 8); // 8 decimals for Kofi
    const wholePart = value / divisor;
    const fractionalPart = value % divisor;
    const fractionalStr = fractionalPart.toString().padStart(8, '0');
    const formattedFractional = fractionalStr.slice(0, 2);

    // Always show 2 decimal places
    return `${wholePart}.${formattedFractional}`;
  } catch (error) {
    console.error('Error formatting amount:', error);
    return '0.00';
  }
};

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { connected, account } = useWallet();
  const [balances, setBalances] = useState<TokenBalances>(INITIAL_BALANCES);
  const [kofiTransactions, setKofiTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingKofi, setIsLoadingKofi] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [lastRefetchTime, setLastRefetchTime] = useState(0);
  const initialFetchRef = useRef(false);

  // Minimum time between refetch calls in milliseconds (to prevent rapid successive calls)
  const DEBOUNCE_TIME = 2000; // 2 seconds

  // Fetch Kofi balance and transactions
  const fetchKofiData = useCallback(async () => {
    if (!connected || !account?.address) {
      setKofiTransactions([]);
      setBalances(INITIAL_BALANCES);
      return;
    }

    setIsLoadingKofi(true);
    try {
      const data = await fetchKofiBalance(account.address.toString());
      setKofiTransactions(data.transactions);

      // Update Kofi balance in balances state with formatted amount
      if (data.balance && data.balance[0]) {
        setBalances(prev => ({
          ...prev,
          kofi: formatAmount(data.balance[0].amount),
        }));
      }
    } catch (error) {
      console.error('Error fetching Kofi data:', error);
      setBalances(prev => ({ ...prev, kofi: '0.00' }));
    } finally {
      setIsLoadingKofi(false);
    }
  }, [connected, account?.address]);

  const refetch = useCallback(async () => {
    const now = Date.now();

    if (isRefetching || now - lastRefetchTime < DEBOUNCE_TIME) {
      return;
    }

    setIsRefetching(true);
    setIsLoading(true);

    try {
      await fetchKofiData();
      setLastRefetchTime(Date.now());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [fetchKofiData, isRefetching, lastRefetchTime]);

  // Initial data load when wallet connects
  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;

      // Fetch wallet-dependent data if connected
      if (connected && account?.address) {
        fetchKofiData();
      }
    }
  }, [connected, account?.address, fetchKofiData]);

  // Fetch data when wallet connection changes
  useEffect(() => {
    if (connected && account?.address) {
      refetch();
    } else {
      // Reset wallet-dependent data when disconnected
      setBalances(INITIAL_BALANCES);
      setKofiTransactions([]);
    }
  }, [connected, account?.address, refetch]);

  // Set up periodic refresh intervals
  useEffect(() => {
    // Set up wallet-dependent data refresh only when connected
    let dataInterval: NodeJS.Timeout | null = null;
    if (connected && account?.address) {
      dataInterval = setInterval(fetchKofiData, REFRESH_INTERVAL);
    }

    return () => {
      if (dataInterval) clearInterval(dataInterval);
    };
  }, [connected, account?.address, fetchKofiData]);

  return (
    <UserDataContext.Provider
      value={{
        balances,
        prices: {
          apt: null,
          kapt: null,
          stkapt: null,
        },
        kofiTransactions,
        isLoading,
        isLoadingKofi,
        refetch,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
