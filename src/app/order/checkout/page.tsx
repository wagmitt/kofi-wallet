'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useUserData } from '@/context/UserDataContext';
import { useToast } from '@/hooks/use-toast';
import { LoginView } from '@/components/LoginView';
import { pay } from '@/lib/entry-functions/pay';
import { aptosClient } from '@/lib/utils/aptosClient';
import { Serializer } from '@aptos-labs/ts-sdk';
import Link from 'next/link';

// Types
type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'drinks' | 'food' | 'desserts';
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const router = useRouter();
  const { account, signTransaction } = useWallet();
  const { balances, refetch } = useUserData();
  const { toast } = useToast();

  // Load cart data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedTotalPrice = localStorage.getItem('totalPrice');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedTotalPrice) {
      setTotalPrice(parseFloat(savedTotalPrice));
    }
  }, []);

  // Check if user has enough balance whenever balances or totalPrice changes
  useEffect(() => {
    const kofiBalance = parseFloat(balances.kofi || '0');
    setHasInsufficientBalance(kofiBalance < totalPrice);
  }, [balances, totalPrice]);

  // If no account is connected, show login view
  if (!account) {
    return <LoginView />;
  }

  // Format price with coffee emoji
  const formatPrice = (price: number) => {
    return `☕️${price.toFixed(2)}`;
  };

  // Process order
  const processOrder = async () => {
    if (cart.length === 0) return;

    try {
      // Check if user has enough balance
      const kofiBalance = parseFloat(balances.kofi || '0');
      if (kofiBalance < totalPrice) {
        toast({
          variant: 'error',
          title: 'Insufficient Balance',
          description: `You need at least ${formatPrice(totalPrice)} to complete this order.`,
        });
        return;
      }

      setIsLoading(true);

      try {
        const aptos = aptosClient();
        // Build the transaction
        const transaction = await aptos.transaction.build.simple({
          sender: account.address,
          data: pay({ amount: totalPrice * 10 ** 8 }).data,
          withFeePayer: true,
        });

        // Sign the transaction with sender's key
        let senderAuthenticator;
        try {
          senderAuthenticator = await signTransaction({
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
          setTransactionHash(result.transactionHash);
          setIsSuccess(true);
        } catch (error) {
          console.error('Payment failed:', error);
          toast({
            variant: 'error',
            title: 'Payment Failed',
            description: error instanceof Error ? error.message : 'Failed to process payment',
          });
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Order processing error:', error);
        toast({
          variant: 'error',
          title: 'Error',
          description: 'Failed to process your order. Please try again.',
        });
      }

      // Clear cart
      localStorage.removeItem('cart');
      localStorage.removeItem('totalPrice');

      // Refresh user data to update balance
      refetch();

      toast({
        title: 'Order Successful',
        description: 'Your order has been placed successfully!',
      });
    } catch (error) {
      console.error('Order processing error:', error);
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to process your order. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-primary border-b border-border-alpha-light">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-1 mr-2 text-text-primary hover:text-text-tertiary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-text-primary">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-8">
            <div className="h-16 w-16 rounded-full bg-button-primary flex items-center justify-center animate-pulse">
              <Check className="h-10 w-10 text-text-dark" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Order Successful!</h2>

            {/* Order Summary */}
            <Card className="w-full bg-background-component-primary border-border-alpha-light">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-text-primary">Order Summary</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-text-primary">
                        {item.quantity} x {item.name}
                      </p>
                    </div>
                    <p className="font-medium text-text-tertiary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <div className="border-t border-border-alpha-light pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <p className="text-text-primary">Total Paid</p>
                    <p className="text-text-tertiary">{formatPrice(totalPrice)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Transaction Details */}
            <Card className="w-full bg-background-component-primary border-border-alpha-light">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Transaction Hash</p>
                  <Link
                    href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=mainnet`}
                    className="text-xs text-text-tertiary break-all font-mono"
                    target="_blank"
                  >
                    {transactionHash}
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => router.push('/')}
              className="w-full bg-button-primary text-text-dark hover:bg-opacity-90 py-6"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Order Summary</h2>

              {/* Order Items */}
              <Card className="bg-background-component-primary border-border-alpha-light">
                <CardContent className="p-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <p className="text-text-primary">
                          {item.quantity} x {item.name}
                        </p>
                        <p className="text-sm text-text-secondary">{item.description}</p>
                      </div>
                      <p className="font-medium text-text-tertiary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="bg-background-component-primary border-border-alpha-light">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-text-secondary">Subtotal</p>
                    <p className="text-text-tertiary">{formatPrice(totalPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-text-secondary">Service Fee</p>
                    <p className="text-text-tertiary">{formatPrice(0.0)}</p>
                  </div>
                  <div className="border-t border-border-alpha-light my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <p className="text-text-primary">Total</p>
                    <p className="text-text-tertiary">{formatPrice(totalPrice)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Current Balance */}
              <div className="bg-background-secondary p-4 rounded-md border border-border-alpha-subtle">
                <div className="flex justify-between">
                  <p className="text-text-secondary">Your Balance</p>
                  <p
                    className={`${hasInsufficientBalance ? 'text-red-500' : 'text-text-tertiary'}`}
                  >
                    {formatPrice(parseFloat(balances.kofi || '0'))}
                  </p>
                </div>
                {hasInsufficientBalance && (
                  <p className="text-red-500 text-sm mt-2">
                    Insufficient balance to complete this order
                  </p>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-primary border-t border-border-alpha-light">
              <Button
                onClick={processOrder}
                className={`w-full py-6 text-base ${
                  hasInsufficientBalance
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-button-primary hover:bg-opacity-90'
                } text-text-dark`}
                disabled={isLoading || cart.length === 0 || hasInsufficientBalance}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-text-dark border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : hasInsufficientBalance ? (
                  `Insufficient Balance`
                ) : (
                  `Pay ${formatPrice(totalPrice)}`
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
