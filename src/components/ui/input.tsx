import * as React from 'react';
import { cn } from '@/lib/utils';
import { Wallet } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  dollarAmount?: string;
  balance?: string;
  showBalance?: boolean;
  title?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, dollarAmount, balance, showBalance, title, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            'flex h-[88px] w-full rounded-2xl border border-input/10 bg-white/30 px-4 pt-8 pb-6 text-2xl font-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            className
          )}
          ref={ref}
          {...props}
        />
        {title && (
          <div className="absolute left-4 top-3 text-sm font-medium text-gray-500">{title}</div>
        )}
        <div className="absolute left-4 bottom-2">
          {dollarAmount && <span className="text-xs text-gray-500">{dollarAmount}</span>}
        </div>
        {showBalance && balance && (
          <div className="absolute right-4 bottom-2 flex items-center gap-1.5">
            <Wallet className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">{balance}</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
