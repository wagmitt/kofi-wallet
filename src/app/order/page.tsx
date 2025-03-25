'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, ArrowLeft, Home, Coffee, Ticket } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LoginView } from '@/components/LoginView';

// Menu item type
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'signature' | 'coffee' | 'non-coffee' | 'cocoa-milk' | 'soda' | 'soft-drinks';
};

// Cart item type
type CartItem = MenuItem & { quantity: number };

// Menu data
const menuItems: MenuItem[] = [
  // Signature Drinks
  {
    id: 'dirty',
    name: 'Dirty',
    description: 'Espresso with milk',
    price: 2000,
    category: 'signature',
  },
  {
    id: 'espresso-yen',
    name: 'Espresso-Yen (Thai Style)',
    description: 'Thai-style espresso with condensed milk',
    price: 2000,
    category: 'signature',
  },
  {
    id: 'espresso-tonic',
    name: 'Espresso Tonic',
    description: 'Espresso with tonic water',
    price: 2000,
    category: 'signature',
  },
  {
    id: 'espresso-kek-huai',
    name: 'Espresso Kek-Huai',
    description: 'Specialty espresso drink',
    price: 2000,
    category: 'signature',
  },
  {
    id: 'caramel-latte',
    name: 'Caramel Latte',
    description: 'Espresso with steamed milk and caramel',
    price: 2000,
    category: 'signature',
  },
  {
    id: 'mocha-caramel-latte',
    name: 'Mocha Caramel Latte',
    description: 'Espresso with chocolate, caramel and steamed milk',
    price: 2000,
    category: 'signature',
  },

  // Coffee
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Strong coffee brewed by forcing steam through ground coffee beans',
    price: 2000,
    category: 'coffee',
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    price: 2000,
    category: 'coffee',
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 2000,
    category: 'coffee',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 2000,
    category: 'coffee',
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    price: 2000,
    category: 'coffee',
  },

  // Non-Coffee
  {
    id: 'thai-milk-tea',
    name: 'Thai Milk Tea',
    description: 'Sweet tea with milk',
    price: 2000,
    category: 'non-coffee',
  },
  {
    id: 'thai-black-tea',
    name: 'Thai Black Tea',
    description: 'Traditional Thai black tea',
    price: 2000,
    category: 'non-coffee',
  },
  {
    id: 'honey-lemon-tea',
    name: 'Honey Lemon Tea',
    description: 'Tea with honey and lemon',
    price: 2000,
    category: 'non-coffee',
  },
  {
    id: 'cocoa-thai-milk-tea',
    name: 'Cocoa Thai Milk Tea',
    description: 'Thai milk tea with cocoa',
    price: 2000,
    category: 'non-coffee',
  },

  // Cocoa & Milk
  {
    id: 'cocoa-with-milk',
    name: 'Cocoa with Milk',
    description: 'Chocolate drink with milk',
    price: 2000,
    category: 'cocoa-milk',
  },
  {
    id: 'cocoa-caramel',
    name: 'Cocoa Caramel',
    description: 'Chocolate drink with caramel',
    price: 2000,
    category: 'cocoa-milk',
  },
  {
    id: 'cocoa-honey',
    name: 'Cocoa Honey',
    description: 'Chocolate drink with honey',
    price: 2000,
    category: 'cocoa-milk',
  },
  {
    id: 'honey-milk',
    name: 'Honey Milk',
    description: 'Sweet milk with honey',
    price: 2000,
    category: 'cocoa-milk',
  },

  // Soda
  {
    id: 'honey-lemon-soda',
    name: 'Honey Lemon Soda',
    description: 'Refreshing lemon soda with honey',
    price: 2000,
    category: 'soda',
  },
  {
    id: 'espresso-soda',
    name: 'Espresso Soda',
    description: 'Espresso with soda water',
    price: 2000,
    category: 'soda',
  },
  {
    id: 'yuzu-soda',
    name: 'Yuzu Soda',
    description: 'Refreshing yuzu-flavored soda',
    price: 2000,
    category: 'soda',
  },

  // Soft Drinks
  {
    id: 'coke-zero',
    name: 'Coke Zero',
    description: 'Sugar-free cola',
    price: 2000,
    category: 'soft-drinks',
  },
  {
    id: 'soda-water',
    name: 'Soda Water',
    description: 'Plain carbonated water',
    price: 2000,
    category: 'soft-drinks',
  },
  {
    id: 'mineral-water',
    name: 'Mineral Water from Chiang Dao, Thailand',
    description: 'Natural mineral water',
    price: 2000,
    category: 'soft-drinks',
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
  const signature = menuItems.filter(item => item.category === 'signature');
  const coffee = menuItems.filter(item => item.category === 'coffee');
  const nonCoffee = menuItems.filter(item => item.category === 'non-coffee');
  const cocoaMilk = menuItems.filter(item => item.category === 'cocoa-milk');
  const soda = menuItems.filter(item => item.category === 'soda');
  const softDrinks = menuItems.filter(item => item.category === 'soft-drinks');

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
        {/* Signature Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Signature
            </h2>
          </div>
          <div>{signature.map(renderMenuItem)}</div>
        </div>

        {/* Coffee Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Coffee
            </h2>
          </div>
          <div>{coffee.map(renderMenuItem)}</div>
        </div>

        {/* Non-Coffee Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Non-Coffee
            </h2>
          </div>
          <div>{nonCoffee.map(renderMenuItem)}</div>
        </div>

        {/* Cocoa & Milk Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Cocoa & Milk
            </h2>
          </div>
          <div>{cocoaMilk.map(renderMenuItem)}</div>
        </div>

        {/* Soda Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Soda
            </h2>
          </div>
          <div>{soda.map(renderMenuItem)}</div>
        </div>

        {/* Soft Drinks Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Soft Drinks
            </h2>
          </div>
          <div>{softDrinks.map(renderMenuItem)}</div>
        </div>
      </div>

      {/* Cart Summary & Checkout Button */}
      {cart.length > 0 && (
        <div className="sticky bottom-[68px] left-0 right-0 bg-background-primary border-t border-border-alpha-light px-4 py-3">
          <Button
            onClick={goToCheckout}
            className="w-full py-5 text-base rounded-xl bg-button-primary text-text-dark hover:bg-opacity-90"
            disabled={cart.length === 0}
          >
            Checkout • {formatPrice(totalPrice)}
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-alpha-light">
        <div className="flex justify-around py-4 px-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex flex-col items-center text-text-secondary"
          >
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-text-tertiary">
            <Coffee className="h-6 w-6 mb-1" />
            <span className="text-xs">Order</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-text-secondary">
            <Ticket className="h-6 w-6 mb-1" />
            <span className="text-xs">Lottery</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
