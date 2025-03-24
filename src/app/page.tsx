'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useUserData } from '@/context/UserDataContext';
import { Wallet } from '@/components/Wallet';
import { Card, CardContent } from '@/components/ui/card';
import {
  SendHorizontal,
  Download,
  MoreVertical,
  Home,
  Ticket,
  AlertCircle,
  ScanLine,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRScanner } from '@/components/QRScanner';

export default function WalletPage() {
  const [showSendForm, setShowSendForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();
  const { balances, refetch, kofiTransactions, isLoadingKofi } = useUserData();
  const { toast } = useToast();

  // Format Kofi balance for display
  const formattedKofiBalance = balances.kofi ? balances.kofi : '0.00';

  // Format transaction amount
  const formatTransactionAmount = (amount: string, type: string) => {
    return type === 'Sent' ? `-☕️${amount}` : `+☕️${amount}`;
  };

  // Format transaction date
  const formatTransactionDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours}:${minutes} ${ampm}`;

    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${timeString}`;
    }

    // Check if date was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeString}`;
    }

    // Format date for older transactions
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${timeString}`;
  };

  // Handle amount input with proper formatting
  const handleAmountChange = (value: string) => {
    setAmountError('');
    // Remove any non-digit and non-decimal characters
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Only allow one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      setAmountError('Invalid number format');
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
      setAmount(parts.join('.'));
    } else {
      setAmount(cleanValue);
    }

    // Validate amount against balance
    if (cleanValue && balances.kofi) {
      const inputAmount = Number(cleanValue);
      const balance = Number(balances.kofi);
      if (inputAmount > balance) {
        setAmountError('Insufficient balance');
      }
    }
  };

  // Handle address input
  const handleAddressChange = (value: string) => {
    setAddressError('');
    if (value && !/^0x[a-fA-F0-9]{64}$/.test(value)) {
      setAddressError('Invalid address format');
    }
    setRecipientAddress(value);
  };

  // Convert input amount to blockchain format (multiply by 10^8)
  const getBlockchainAmount = (inputAmount: string): string => {
    try {
      const [whole, decimal = ''] = inputAmount.split('.');
      const paddedDecimal = decimal.padEnd(8, '0');
      return `${whole}${paddedDecimal}`;
    } catch (error) {
      console.error('Error converting amount:', error);
      return '0';
    }
  };

  // Handle send transaction
  const handleSend = async () => {
    if (!account?.address || !recipientAddress || !amount) return;

    try {
      setIsLoading(true);
      const blockchainAmount = getBlockchainAmount(amount);
      console.log('Sending amount:', blockchainAmount);

      toast({
        title: 'Success',
        description: 'Transaction sent successfully!',
      });
      refetch();
      setShowSendForm(false);
      setRecipientAddress('');
      setAmount('');
    } catch (error) {
      console.error('Send transaction error:', error);
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to send transaction.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add QR scanner handler
  const handleQRScan = (result: string) => {
    if (result.startsWith('0x') && result.length === 66) {
      setRecipientAddress(result);
    } else {
      toast({
        variant: 'error',
        title: 'Invalid QR Code',
        description: 'The scanned QR code is not a valid Aptos address.',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-3">
        <Wallet />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Balance and Actions Section */}
        <div className="px-4">
          {/* Balance Section */}
          <div className="text-center mb-8">
            <p className="text-text-secondary mb-2">Personal · KOFI</p>
            <h1 className="text-3xl font-bold text-text-primary mb-4">☕️{formattedKofiBalance}</h1>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                onClick={() => setShowSendForm(true)}
                className="h-12 w-12 rounded-full bg-background-secondary border border-border-alpha-light"
              >
                <SendHorizontal className="h-5 w-5 text-text-tertiary" />
              </Button>
              <span className="text-xs text-text-secondary mt-2">Send</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-full bg-background-secondary border border-border-alpha-light"
              >
                <Download className="h-5 w-5 text-text-tertiary" />
              </Button>
              <span className="text-xs text-text-secondary mt-2">Receive</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-full bg-background-secondary border border-border-alpha-light"
              >
                <MoreVertical className="h-5 w-5 text-text-tertiary" />
              </Button>
              <span className="text-xs text-text-secondary mt-2">More</span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 bg-background-secondary border-t border-border-alpha-light">
          <div className="p-4 space-y-4">
            {isLoadingKofi ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 border-2 border-text-tertiary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : kofiTransactions.length > 0 ? (
              kofiTransactions.map(tx => (
                <div key={tx.transaction_version} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-background-tertiary rounded-full flex items-center justify-center">
                      <span className="text-lg">{tx.type === 'Sent' ? '↑' : '↓'}</span>
                    </div>
                    <div>
                      <p className="text-text-primary">{tx.type}</p>
                      <p className="text-sm text-text-secondary">
                        {formatTransactionDate(tx.transaction_timestamp)}
                      </p>
                    </div>
                  </div>
                  <span className="text-text-primary">
                    {formatTransactionAmount(tx.formatted_amount, tx.type)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-secondary">No transactions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-alpha-light">
        <div className="flex justify-around py-4 px-6">
          <Button variant="ghost" className="flex flex-col items-center text-text-tertiary">
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-text-secondary">
            <Ticket className="h-6 w-6 mb-1" />
            <span className="text-xs">Lottery</span>
          </Button>
        </div>
      </div>

      {/* Send Form Modal */}
      {showSendForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <Card className="bg-background-secondary w-full max-w-md border-border-alpha-light">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-semibold text-text-primary">Send KOFI</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSendForm(false);
                      setRecipientAddress('');
                      setAmount('');
                      setAmountError('');
                      setAddressError('');
                    }}
                    className="text-text-secondary h-7 px-2 rounded-full text-xs"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary block">Recipient Address</label>
                  <div className="relative w-full">
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={recipientAddress}
                        onChange={e => handleAddressChange(e.target.value)}
                        placeholder="Enter recipient's address"
                        className="bg-background-input w-full border-border-alpha-light rounded-full h-8 text-sm text-text-primary text-center placeholder:text-center p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQRScanner(true)}
                        className="h-8 w-8 p-0 rounded-full bg-background-input border border-border-alpha-light"
                      >
                        <ScanLine className="h-4 w-4 text-text-tertiary" />
                      </Button>
                    </div>
                    {addressError && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{addressError}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-text-secondary block">Amount (KOFI)</label>
                  <div>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={e => handleAmountChange(e.target.value)}
                        placeholder="0.00"
                        className="bg-background-input border-border-alpha-light rounded-full pr-8 h-8 text-sm text-text-primary text-center placeholder:text-center p-2"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        ☕️
                      </span>
                    </div>
                    {amountError && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className="text-xs text-red-500">{amountError}</p>
                      </div>
                    )}
                    {balances.kofi && !amountError && (
                      <p className="text-xs text-text-secondary mt-1">Balance: ☕️{balances.kofi}</p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={
                    isLoading ||
                    !recipientAddress ||
                    !amount ||
                    Number(amount) === 0 ||
                    !!amountError ||
                    !!addressError
                  }
                  className="w-full bg-button-primary hover:bg-opacity-90 text-text-dark rounded-full h-8 text-sm mt-2"
                >
                  {isLoading ? 'Sending...' : 'Send KOFI'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add QR Scanner Component */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
}
