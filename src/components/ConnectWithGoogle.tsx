'use client';

import { useWallet, WalletName } from '@aptos-labs/wallet-adapter-react';
import Image from 'next/image';
import { Button } from './ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import { truncateAddress } from '@aptos-labs/wallet-adapter-react';

const googleWallet = {
  name: 'Continue with Google',
  url: 'https://aptosconnect.app',
  icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0iaF8yMCB3XzIwIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIzLjU0IDEyLjc2MTNDMjMuNTQgMTEuOTQ1OSAyMy40NjY4IDExLjE2MTggMjMuMzMwOSAxMC40MDkxSDEyLjVWMTQuODU3NUgxOC42ODkxQzE4LjQyMjUgMTYuMjk1IDE3LjYxMjMgMTcuNTEyOSAxNi4zOTQzIDE4LjMyODRWMjEuMjEzOEgyMC4xMTA5QzIyLjI4NTUgMTkuMjExOCAyMy41NCAxNi4yNjM2IDIzLjU0IDEyLjc2MTNaIiBmaWxsPSIjNDI4NUY0Ij48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi40OTk1IDIzLjk5OThDMTUuNjA0NSAyMy45OTk4IDE4LjIwNzcgMjIuOTcgMjAuMTEwNCAyMS4yMTM3TDE2LjM5MzggMTguMzI4MkMxNS4zNjQgMTkuMDE4MiAxNC4wNDY3IDE5LjQyNTkgMTIuNDk5NSAxOS40MjU5QzkuNTA0MjUgMTkuNDI1OSA2Ljk2OTAyIDE3LjQwMyA2LjA2NDcgMTQuNjg0OEgyLjIyMjY2VjE3LjY2NDRDNC4xMTQ5MyAyMS40MjI4IDguMDA0MDIgMjMuOTk5OCAxMi40OTk1IDIzLjk5OThaIiBmaWxsPSIjMzRBODUzIj48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjA2NTIzIDE0LjY4NTFDNS44MzUyMyAxMy45OTUxIDUuNzA0NTUgMTMuMjU4MSA1LjcwNDU1IDEyLjUwMDFDNS43MDQ1NSAxMS43NDIyIDUuODM1MjMgMTEuMDA1MSA2LjA2NTIzIDEwLjMxNTFWNy4zMzU1N0gyLjIyMzE4QzEuNDQ0MzIgOC44ODgwNyAxIDEwLjY0NDQgMSAxMi41MDAxQzEgMTQuMzU1OCAxLjQ0NDMyIDE2LjExMjIgMi4yMjMxOCAxNy42NjQ3TDYuMDY1MjMgMTQuNjg1MVoiIGZpbGw9IiNGQkJDMDUiPjwvcGF0aD48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjQ5OTUgNS41NzM4NkMxNC4xODc5IDUuNTczODYgMTUuNzAzOCA2LjE1NDA5IDE2Ljg5NTYgNy4yOTM2NEwyMC4xOTQgMy45OTUyM0MxOC4yMDI0IDIuMTM5NTUgMTUuNTk5MiAxIDEyLjQ5OTUgMUM4LjAwNDAyIDEgNC4xMTQ5MyAzLjU3NzA1IDIuMjIyNjYgNy4zMzU0NUw2LjA2NDcgMTAuMzE1QzYuOTY5MDIgNy41OTY4MiA5LjUwNDI1IDUuNTczODYgMTIuNDk5NSA1LjU3Mzg2WiIgZmlsbD0iI0VBNDMzNSI+PC9wYXRoPjwvc3ZnPg==',
  provider: {
    version: '1.0.0',
    chains: ['aptos:devnet', 'aptos:testnet', 'aptos:localnet', 'aptos:mainnet'],
    client: {
      defaultNetworkName: 'mainnet',
      dappInfo: {
        domain: 'https://localhost:3000',
        name: 'Kofi Wallet ☕️',
      },
      transport: {
        baseUrl: 'https://aptosconnect.app',
        provider: 'google',
      },
      pairingClient: {
        onDisconnectListeners: {},
        accessors: {},
        defaultNetworkName: 'mainnet',
        initPromise: {},
      },
    },
    aptosClient: {
      config: {
        network: 'mainnet',
        client: {},
        clientConfig: {},
        fullnodeConfig: {},
        indexerConfig: {},
        faucetConfig: {},
      },
      account: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
        abstraction: {
          config: {
            network: 'mainnet',
            client: {},
            clientConfig: {},
            fullnodeConfig: {},
            indexerConfig: {},
            faucetConfig: {},
          },
        },
      },
      abstraction: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      ans: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      coin: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      digitalAsset: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      event: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      experimental: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      faucet: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      fungibleAsset: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      general: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      staking: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      transaction: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
        build: {
          config: {
            network: 'mainnet',
            client: {},
            clientConfig: {},
            fullnodeConfig: {},
            indexerConfig: {},
            faucetConfig: {},
          },
        },
        simulate: {
          config: {
            network: 'mainnet',
            client: {},
            clientConfig: {},
            fullnodeConfig: {},
            indexerConfig: {},
            faucetConfig: {},
          },
        },
        submit: {
          config: {
            network: 'mainnet',
            client: {},
            clientConfig: {},
            fullnodeConfig: {},
            indexerConfig: {},
            faucetConfig: {},
          },
        },
        batch: {
          _events: {},
          _eventsCount: 0,
          config: {
            network: 'mainnet',
            client: {},
            clientConfig: {},
            fullnodeConfig: {},
            indexerConfig: {},
            faucetConfig: {},
          },
        },
      },
      table: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      keyless: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
      object: {
        config: {
          network: 'mainnet',
          client: {},
          clientConfig: {},
          fullnodeConfig: {},
          indexerConfig: {},
          faucetConfig: {},
        },
      },
    },
    name: 'Continue with Google',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjbGFzcz0iaF8yMCB3XzIwIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIzLjU0IDEyLjc2MTNDMjMuNTQgMTEuOTQ1OSAyMy40NjY4IDExLjE2MTggMjMuMzMwOSAxMC40MDkxSDEyLjVWMTQuODU3NUgxOC42ODkxQzE4LjQyMjUgMTYuMjk1IDE3LjYxMjMgMTcuNTEyOSAxNi4zOTQzIDE4LjMyODRWMjEuMjEzOEgyMC4xMTA5QzIyLjI4NTUgMTkuMjExOCAyMy41NCAxNi4yNjM2IDIzLjU0IDEyLjc2MTNaIiBmaWxsPSIjNDI4NUY0Ij48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi40OTk1IDIzLjk5OThDMTUuNjA0NSAyMy45OTk4IDE4LjIwNzcgMjIuOTcgMjAuMTEwNCAyMS4yMTM3TDE2LjM5MzggMTguMzI4MkMxNS4zNjQgMTkuMDE4MiAxNC4wNDY3IDE5LjQyNTkgMTIuNDk5NSAxOS40MjU5QzkuNTA0MjUgMTkuNDI1OSA2Ljk2OTAyIDE3LjQwMyA2LjA2NDcgMTQuNjg0OEgyLjIyMjY2VjE3LjY2NDRDNC4xMTQ5MyAyMS40MjI4IDguMDA0MDIgMjMuOTk5OCAxMi40OTk1IDIzLjk5OThaIiBmaWxsPSIjMzRBODUzIj48L3BhdGg+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjA2NTIzIDE0LjY4NTFDNS44MzUyMyAxMy45OTUxIDUuNzA0NTUgMTMuMjU4MSA1LjcwNDU1IDEyLjUwMDFDNS43MDQ1NSAxMS43NDIyIDUuODM1MjMgMTEuMDA1MSA2LjA2NTIzIDEwLjMxNTFWNy4zMzU1N0gyLjIyMzE4QzEuNDQ0MzIgOC44ODgwNyAxIDEwLjY0NDQgMSAxMi41MDAxQzEgMTQuMzU1OCAxLjQ0NDMyIDE2LjExMjIgMi4yMjMxOCAxNy42NjQ3TDYuMDY1MjMgMTQuNjg1MVoiIGZpbGw9IiNGQkJDMDUiPjwvcGF0aD48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjQ5OTUgNS41NzM4NkMxNC4xODc5IDUuNTczODYgMTUuNzAzOCA2LjE1NDA5IDE2Ljg5NTYgNy4yOTM2NEwyMC4xOTQgMy45OTUyM0MxOC4yMDI0IDIuMTM5NTUgMTUuNTk5MiAxIDEyLjQ5OTUgMUM4LjAwNDAyIDEgNC4xMTQ5MyAzLjU3NzA1IDIuMjIyNjYgNy4zMzU0NUw2LjA2NDcgMTAuMzE1QzYuOTY5MDIgNy41OTY4MiA5LjUwNDI1IDUuNTczODYgMTIuNDk5NSA1LjU3Mzg2WiIgZmlsbD0iI0VBNDMzNSI+PC9wYXRoPjwvc3ZnPg==',
    url: 'https://aptosconnect.app',
    readyState: 'Installed',
  },
  readyState: 'Installed',
  isAIP62Standard: true,
  isSignTransactionV1_1: true,
};

export function ConnectWithGoogle() {
  const { account, connected, disconnect, connect } = useWallet();

  // Wallet connection dialog
  const WalletConnectionDialog = () => (
    <div>
      <Button
        key={googleWallet.name}
        onClick={async () => {
          try {
            await connect(googleWallet.name as WalletName);
          } catch (error) {
            console.error('Failed to connect:', error);
          }
        }}
        className="flex items-center gap-3 w-full bg-semantic-neutral-alpha hover:bg-button-primary text-text-primary border border-border-alpha-light rounded-lg px-4 py-6 justify-start"
      >
        <Image
          src={googleWallet.icon}
          alt={googleWallet.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-vcr">{googleWallet.name}</span>
      </Button>
    </div>
  );

  if (!connected) {
    return <WalletConnectionDialog />;
  }

  // Use the refactored WalletDropdown component
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
                  : truncateAddress(account?.address) || 'Unknown'}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-icon-secondary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={9}
          className="w-[300px] bg-background-primary border border-border-alpha-light  z-[250] shadow-lg"
        >
          {/* Actions */}
          <div className="flex flex-col gap-1">
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
