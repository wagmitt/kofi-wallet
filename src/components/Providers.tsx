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
        dappConfig={{ network: NETWORK as Network, aptosApiKeys: { mainnet: APTOS_API_KEY } }}
        onError={error => {
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          const isMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);

          if (error === "Couldn't open prompt" && isSafari && isMobile) {
            toast({
              variant: 'error',
              title: 'Enable Pop-ups in Safari',
              description: (
                <div className="space-y-2">
                  <p>To use Aptos Connect, please enable pop-ups in Safari:</p>
                  <ol className="list-decimal pl-4 text-sm space-y-1">
                    <li>Open your iPhone/iPad Settings</li>
                    <li>Scroll down and tap Safari</li>
                    <li>Turn off &quot;Block Pop-ups&quot;</li>
                    <li>Return to this page and try connecting again</li>
                  </ol>
                </div>
              ),
              duration: 10000,
            });
          } else {
            toast({
              variant: 'error',
              title: 'Error',
              description: error || 'Unknown wallet error',
            });
          }
        }}
      >
        <UserDataProvider>{children}</UserDataProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
