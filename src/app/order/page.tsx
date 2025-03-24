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
  image: string;
  category: 'drinks' | 'food' | 'desserts';
};

// Cart item type
type CartItem = MenuItem & { quantity: number };

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 3.5,
    image: '/images/cappuccino.jpg', // You can add actual images later
    category: 'drinks',
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso with steamed milk',
    price: 4.0,
    image: '/images/latte.jpg',
    category: 'drinks',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Strong coffee brewed by forcing steam through ground coffee beans',
    price: 2.5,
    image: '/images/espresso.jpg',
    category: 'drinks',
  },
  {
    id: 'croissant',
    name: 'Croissant',
    description: 'Flaky, buttery pastry',
    price: 2.0,
    image: '/images/croissant.jpg',
    category: 'food',
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    description: 'Mashed avocado spread on toast with seasonings',
    price: 6.0,
    image: '/images/avocado-toast.jpg',
    category: 'food',
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    description: 'Rich, moist chocolate cake slice',
    price: 5.0,
    image: '/images/chocolate-cake.jpg',
    category: 'desserts',
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake',
    description: 'Creamy, sweet dessert with graham cracker crust',
    price: 5.5,
    image: '/images/cheesecake.jpg',
    category: 'desserts',
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
  const drinks = menuItems.filter(item => item.category === 'drinks');
  const food = menuItems.filter(item => item.category === 'food');
  const desserts = menuItems.filter(item => item.category === 'desserts');

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
        <div className="flex items-center flex-1">
          {/* Image Container */}
          <div className="w-14 h-14 bg-background-secondary rounded-lg mr-3 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
            ) : (
              <Coffee className="h-6 w-6 text-text-secondary opacity-50" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-text-primary">{item.name}</h3>
            <p className="text-xs text-text-shallow line-clamp-1">{item.description}</p>
            <p className="mt-1 font-medium text-sm text-text-tertiary">{formatPrice(item.price)}</p>
          </div>
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
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Kofi Cafe</h1>
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
        {/* Drinks Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Drinks
            </h2>
          </div>
          <div>{drinks.map(renderMenuItem)}</div>
        </div>

        {/* Food Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Food
            </h2>
          </div>
          <div>{food.map(renderMenuItem)}</div>
        </div>

        {/* Desserts Section */}
        <div className="mb-4">
          <div className="px-4 py-2 bg-background-secondary">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
              Desserts
            </h2>
          </div>
          <div>{desserts.map(renderMenuItem)}</div>
        </div>
      </div>

      {/* Cart Summary & Checkout Button */}
      {cart.length > 0 && (
        <div className="sticky bottom-16 left-0 right-0 bg-background-primary border-t border-border-alpha-light px-4 py-3">
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
