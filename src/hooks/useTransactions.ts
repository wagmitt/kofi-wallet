import { useState, useEffect } from 'react';
import { fetchAssetInfo, Transaction } from '@/lib/utils/graphql';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const KOFI_TOKEN_ADDRESS = '0x2acee43658eedf3d0197e5a1fefff6b8971577ff5f04324c0e97c9520e8509a7::coin_factory::Emojicoin';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { account } = useWallet();

    useEffect(() => {
        async function fetchTransactions() {
            if (!account?.address) return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await fetchAssetInfo(account.address.toString(), KOFI_TOKEN_ADDRESS);
                setTransactions(data.transactions);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
                console.error('Error fetching transactions:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTransactions();

        // Set up polling every 30 seconds
        const interval = setInterval(fetchTransactions, 30000);

        return () => clearInterval(interval);
    }, [account?.address]);

    return { transactions, isLoading, error };
} 