'use client';

import { Button } from '@/components/ui/button';
import { Home, Coffee, Ticket } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
    },
    {
      label: 'Order',
      icon: Coffee,
      href: '/order',
    },
    {
      label: 'Lottery',
      icon: Ticket,
      href: '/lottery',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-alpha-light">
      <div className="flex justify-around py-4 px-6">
        {navItems.map(item => (
          <Button
            key={item.href}
            variant="default"
            onClick={() => router.push(item.href)}
            className={cn(
              'flex flex-col items-center bg-transparent active:bg-transparent hover:bg-transparent',
              pathname === item.href ? 'text-text-tertiary' : 'text-text-secondary'
            )}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
