'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserData } from '@/context/UserDataContext';
import { formatTokenAmount, fromOctas } from '@/lib/utils/currencyConversion';
import { WalletDropdown } from './WalletDropdown';

export function Wallet() {
  const { account, connected, disconnect, wallets = [], connect } = useWallet();
  const { balances, isLoading } = useUserData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: 'Success',
        description: 'Copied wallet address to clipboard.',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to copy wallet address.',
      });
    }
  }, [account?.address, toast]);

  const getFormattedBalance = (tokenType: keyof typeof balances) => {
    if (isLoading || !balances[tokenType]) return '--';
    return formatTokenAmount(fromOctas(balances[tokenType]!));
  };

  const availableWallets = wallets.filter(wallet => wallet.readyState === 'Installed');
  console.log('🚀 | Wallet | availableWallets:', availableWallets);
  // const installableWallets = wallets.filter(wallet => wallet.readyState === 'NotDetected');

  // Wallet connection dialog
  const WalletConnectionDialog = () => (
    <div className="relative z-[10]">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[linear-gradient(hsla(85,54%,53%,1)_0%,hsla(85,77%,41%,1)_100%)] w-full hover:bg-button-primary text-black border border-border-alpha-light rounded-full px-4 h-[40px]">
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-auto bg-background-primary border border-border-alpha-light">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-2xl font-vcr text-text-primary mb-6">Sign In</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {availableWallets.map(wallet => (
              <Button
                key={wallet.name}
                onClick={async () => {
                  try {
                    await connect(wallet.name);
                    closeDialog();
                  } catch (error) {
                    console.error('Failed to connect:', error);
                  }
                }}
                className="flex items-center gap-3 w-full bg-semantic-neutral-alpha hover:bg-button-primary text-text-primary border border-border-alpha-light rounded-lg px-4 py-6 justify-start"
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-vcr">{wallet.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (!connected) {
    return <WalletConnectionDialog />;
  }

  // Use the refactored WalletDropdown component
  return (
    <WalletDropdown
      account={account}
      getFormattedBalance={getFormattedBalance}
      copyAddress={copyAddress}
      disconnect={disconnect}
    />
  );
}
