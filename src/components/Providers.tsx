'use client';

import { PropsWithChildren } from 'react';
import { AptosWalletAdapterProvider, Network } from '@aptos-labs/wallet-adapter-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Internal components
import { useToast } from '@/hooks/use-toast';
import { UserDataProvider } from '@/context/UserDataContext';
// Internal constants
import { APTOS_API_KEY, NETWORK } from '@/constants';

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  const { toast } = useToast();

  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect={true}
        optInWallets={['Continue with Google']}
        dappConfig={{ network: NETWORK as Network, aptosApiKey: APTOS_API_KEY }}
        onError={error => {
          toast({
            variant: 'error',
            title: 'Error',
            description: error || 'Unknown wallet error',
          });
        }}
      >
        <UserDataProvider>{children}</UserDataProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
