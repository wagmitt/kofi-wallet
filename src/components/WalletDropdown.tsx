'use client';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Copy, LogOut, ChevronsUpDown } from 'lucide-react';
import { AccountInfo, truncateAddress } from '@aptos-labs/wallet-adapter-react';
import { TokenBalances } from '@/types';

type WalletDropdownProps = {
  account: AccountInfo | null;
  getFormattedBalance: (tokenType: keyof TokenBalances) => string;
  copyAddress: () => Promise<void>;
  disconnect: () => void;
};

export function WalletDropdown({ account, copyAddress, disconnect }: WalletDropdownProps) {
  return (
    <div className="relative z-[10]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="bg-semantic-neutral-alpha hover:bg-button-primary text-text-primary border border-border-alpha-light rounded-full min-w-[267px] justify-between px-3"
            onClick={e => {
              // Prevent any default behavior that might interfere with dropdown
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-3">
              <span>
                {account?.ansName
                  ? `${account.ansName}.apt`
                  : truncateAddress(account?.address.toString()) || 'Unknown'}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-icon-secondary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="w-[300px] bg-background-primary border border-border-alpha-light p-3 z-[250] shadow-lg"
        >
          {/* Wallet Address */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">Balances</span>
          </div>

          <DropdownMenuSeparator className="bg-border-alpha-light my-1" />

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                copyAddress();
              }}
              className="gap-2 text-sm text-text-primary hover:text-text-primary hover:bg-button-primary focus:bg-button-primary py-2"
            >
              <Copy className="h-4 w-4 text-icon-secondary" /> Copy address
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                disconnect();
              }}
              className="gap-2 text-sm text-text-primary hover:text-text-primary hover:bg-button-primary focus:bg-button-primary py-2"
            >
              <LogOut className="h-4 w-4 text-icon-secondary" /> Disconnect
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
