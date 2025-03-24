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
  const router = useRouter();
  const { account } = useWallet();
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

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Order success
      setIsSuccess(true);

      // Clear cart
      localStorage.removeItem('cart');
      localStorage.removeItem('totalPrice');

      // Refresh user data to update balance
      refetch();

      toast({
        title: 'Order Successful',
        description: 'Your order has been placed successfully!',
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
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
          <Button variant="ghost" onClick={() => router.back()} className="p-1 mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Order Successful!</h2>
            <p className="text-text-secondary text-center">
              Your order has been placed successfully. Redirecting to home...
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Order Summary</h2>

              {/* Order Items */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <p className="text-text-primary">
                          {item.quantity} x {item.name}
                        </p>
                        <p className="text-sm text-text-secondary">{item.description}</p>
                      </div>
                      <p className="font-medium text-text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-text-secondary">Subtotal</p>
                    <p className="text-text-primary">{formatPrice(totalPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-text-secondary">Service Fee</p>
                    <p className="text-text-primary">{formatPrice(0.0)}</p>
                  </div>
                  <div className="border-t border-border-alpha-light my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <p className="text-text-primary">Total</p>
                    <p className="text-text-primary">{formatPrice(totalPrice)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Current Balance */}
              <div className="bg-background-secondary p-4 rounded-md">
                <div className="flex justify-between">
                  <p className="text-text-secondary">Your Balance</p>
                  <p className="text-text-primary">
                    {formatPrice(parseFloat(balances.kofi || '0'))}
                  </p>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-primary border-t border-border-alpha-light">
              <Button
                onClick={processOrder}
                className="w-full py-6 text-base"
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
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
