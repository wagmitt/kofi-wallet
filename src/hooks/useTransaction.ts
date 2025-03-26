import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCallback } from 'react';

export function useTransaction() {
    const { signAndSubmitTransaction } = useWallet();

    const submitTransaction = useCallback(
        async (transaction: any) => {
            try {
                const response = await signAndSubmitTransaction(transaction);
                return response;
            } catch (error) {
                console.error('Transaction failed:', error);
                throw error;
            }
        },
        [signAndSubmitTransaction]
    );

    return { submitTransaction };
} 