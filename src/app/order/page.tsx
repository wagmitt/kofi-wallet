'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LoginView } from '@/components/LoginView';
import { BottomNav } from '@/components/BottomNav';

// Menu item type
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'tea' | 'coffee' | 'matcha' | 'cold-brew';
};

// Cart item type
type CartItem = MenuItem & { quantity: number };

const isTest = false;

// Menu data
const menuItems: MenuItem[] = [
  // Signature Drinks
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: isTest ? 0.1 : 1000,
    category: 'coffee',
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    price: isTest ? 0.1 : 1000,
    category: 'coffee',
  },
  // Tea
  {
    id: 'thai-milk-tea',
    name: 'Thai Milk Tea',
    description: 'Sweet tea with milk',
    price: isTest ? 0.1 : 1000,
    category: 'tea',
  },
  // Matcha
  {
    id: 'clear-matcha',
    name: 'Clear Matcha お抹茶',
    description:
      'fresh whisked hoshino matcha pour over water without sweetness — light and refreshing.',
    price: isTest ? 0.1 : 1000,
    category: 'matcha',
  },
];

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const { account } = useWallet();

  // Update total price when cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  // If no account is connected, show login view
  if (!account) {
    return <LoginView />;
  }

  // Group menu items by category
  const coffee = menuItems.filter(item => item.category === 'coffee');
  const tea = menuItems.filter(item => item.category === 'tea');
  const matcha = menuItems.filter(item => item.category === 'matcha');
  const coldBrew = menuItems.filter(item => item.category === 'cold-brew');

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  // Format price with coffee emoji
  const formatPrice = (price: number) => {
    return `☕️${price.toFixed(2)}`;
  };

  // Navigate to checkout
  const goToCheckout = () => {
    if (cart.length === 0) return;

    // Save cart to localStorage or state management solution
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toString());

    router.push('/order/checkout');
  };

  // Render a single menu item card
  const renderMenuItem = (item: MenuItem) => {
    const cartItem = cart.find(cartItem => cartItem.id === item.id);

    return (
      <div
        key={item.id}
        className="flex justify-between items-center px-4 py-3 border-b border-border-alpha-light"
      >
        <div className="flex-1">
          <h3 className="font-medium text-text-primary">{item.name}</h3>
          <p className="text-xs text-text-shallow line-clamp-1">{item.description}</p>
          <p className="mt-1 font-medium text-sm text-text-tertiary">{formatPrice(item.price)}</p>
        </div>

        <div>
          {cartItem ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full border-border-alpha-light"
                onClick={() => removeFromCart(item.id)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-5 text-center text-text-primary">
                {cartItem.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full border-border-alpha-light"
                onClick={() => addToCart(item)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addToCart(item)}
              className="h-8 px-3 rounded-full border-border-alpha-light bg-background-secondary hover:bg-background-light text-text-tertiary"
            >
              Add
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-primary pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-primary border-b border-border-alpha-light">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push('/')} className="p-1 mr-2">
            <ArrowLeft className="h-5 w-5 text-text-primary" />
          </Button>
          <h1 className="text-lg font-semibold text-text-primary">Kofi Cafe</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" className="relative p-1" onClick={goToCheckout}>
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {/* Coffee Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Coffee
            </h2>
          </div>
          <div>{coffee.map(renderMenuItem)}</div>
        </div>

        {/* Tea Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Tea
            </h2>
          </div>
          <div>{tea.map(renderMenuItem)}</div>
        </div>

        {/* Matcha Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Matcha
            </h2>
          </div>
          <div>{matcha.map(renderMenuItem)}</div>
        </div>

        {/* Cold Brew Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Cold Brew
            </h2>
          </div>
          <div>{coldBrew.map(renderMenuItem)}</div>
        </div>
      </div>

      {/* Cart Summary & Checkout Button */}
      {cart.length > 0 && (
        <div className="sticky bottom-[68px] left-0 right-0 bg-background-primary border-t border-border-alpha-light px-4 py-3">
          <Button
            onClick={goToCheckout}
            variant="default"
            className="w-full py-5 text-base rounded-xl bg-button-primary text-text-dark hover:bg-opacity-90"
            disabled={cart.length === 0}
          >
            Checkout • {formatPrice(totalPrice)}
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
