'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useUserData } from '@/context/UserDataContext';
import { SendHorizontal, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReceiveModal } from '@/components/ReceiveModal';
import { SendModal } from '@/components/SendModal';
import { ConnectWithGoogle } from '@/components/ConnectWithGoogle';
import { LoginView } from '@/components/LoginView';
import { BottomNav } from '@/components/BottomNav';
import { MoreDropdown } from '@/components/MoreDropdown';
import { aptosClient } from '@/lib/utils/aptosClient';
import { pay } from '@/lib/entry-functions/pay';
import { Serializer } from '@aptos-labs/ts-sdk';

export default function WalletPage() {
  const [showSendForm, setShowSendForm] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { account, signTransaction } = useWallet();
  const { balances, refetch, kofiTransactions, isLoadingKofi } = useUserData();
  const { toast } = useToast();

  // If no account is connected, show login view
  if (!account) {
    return <LoginView />;
  }

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

  // Handle send transaction
  const handleSend = async (recipientAddress: string, amount: string) => {
    console.log('🚀 | handleSend | amount:', amount);
    if (!account?.address) return;

    try {
      const aptos = aptosClient();
      // Build the transaction
      const transaction = await aptos.transaction.build.simple({
        sender: account.address,
        data: pay({ address: recipientAddress as `0x${string}`, amount: Number(amount) * 10 ** 8 })
          .data,
        withFeePayer: true,
      });

      // Sign the transaction with sender's key
      const senderAuthenticator = await signTransaction({
        transactionOrPayload: transaction,
        asFeePayer: false,
      });

      // Serialize the transaction and authenticator using BCS
      const serializer = new Serializer();
      transaction.serialize(serializer);
      senderAuthenticator.authenticator.serialize(serializer);
      const serializedData = Buffer.from(serializer.toUint8Array()).toString('base64');

      // Send to server for fee payer signing and submission
      const response = await fetch('/api/submit-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serializedData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit transaction');
      }

      const result = await response.json();

      await new Promise(resolve => setTimeout(resolve, 500));

      // wait for tx to be confirmed
      await aptos.waitForTransaction({
        transactionHash: result.transactionHash,
        options: {
          waitForIndexer: true,
          timeoutSecs: 5,
        },
      });

      toast({
        title: 'Success',
        description: 'Transaction sent successfully!',
      });
      refetch();
      setShowSendForm(false);
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

  return (
    <div className="flex flex-col min-h-screen bg-background-primary relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center px-4 py-3 relative z-10">
        <ConnectWithGoogle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Balance and Actions Section */}
        <div className="px-4 py-12">
          {/* Balance Section */}
          <div className="text-center mb-16">
            <p className="text-text-secondary mb-2 -ml-2">Your Balance</p>
            <h1 className="text-3xl font-bold text-text-primary mb-4">{formattedKofiBalance} ☕️</h1>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 ">
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
                onClick={() => setShowReceiveModal(true)}
                className="h-12 w-12 rounded-full bg-background-secondary border border-border-alpha-light"
              >
                <Download className="h-5 w-5 text-text-tertiary" />
              </Button>
              <span className="text-xs text-text-secondary mt-2">Receive</span>
            </div>
            <div className="flex flex-col items-center">
              <MoreDropdown />
              <span className="text-xs text-text-secondary mt-2">More</span>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 bg-background-secondary border-t border-border-alpha-light rounded-t-2xl">
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
      <BottomNav />

      {/* Send Modal */}
      <SendModal
        isOpen={showSendForm}
        onClose={() => setShowSendForm(false)}
        onSend={handleSend}
        balance={balances.kofi || '0'}
        isLoading={isLoading}
      />

      {/* Receive Modal */}
      <ReceiveModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        address={account.address.toString()}
      />
    </div>
  );
}
