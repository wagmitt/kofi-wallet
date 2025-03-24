'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import { Send, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import type { ToastVariant } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const variantIcons = {
  default: Send,
  sent: Send,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: X,
};

const variantStyles = {
  default: {
    iconColor: 'text-button-primary',
    progressBarColor: 'bg-button-primary',
    borderColor: 'border-button-primary',
  },
  sent: {
    iconColor: 'text-button-primary',
    progressBarColor: 'bg-button-primary',
    borderColor: 'border-button-primary',
  },
  success: {
    iconColor: 'text-button-primary',
    progressBarColor: 'bg-button-primary',
    borderColor: 'border-button-primary',
  },
  warning: {
    iconColor: 'text-yellow-500',
    progressBarColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500',
  },
  error: {
    iconColor: 'text-red-500',
    progressBarColor: 'bg-red-500',
    borderColor: 'border-red-500',
  },
};

function ToastWithProgress({
  id,
  title,
  description,
  action,
  duration,
  url,
  variant = 'default',
  ...props
}: {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  url?: string;
  variant?: ToastVariant;
  [key: string]: any;
}) {
  const [progress, setProgress] = useState(100);
  const Icon = variantIcons[variant];
  const styles = variantStyles[variant];

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev > 0) {
            return prev - (100 / (duration || 5000)) * 10; // Update every 10ms
          }
          clearInterval(timer);
          return 0;
        });
      }, 10);

      return () => clearInterval(timer);
    }
  }, [duration]);

  return (
    <Toast variant={variant} {...props}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'h-[30px] w-[30px] rounded-2xl flex items-center justify-center border border-2 border-red',
            styles.borderColor
          )}
        >
          <Icon className={cn('h-4 w-4', styles.iconColor)} />
        </div>

        <div className="flex flex-col gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription url={url}>{description}</ToastDescription>}
        </div>
      </div>
      {action}
      <ToastClose />
      {duration !== Infinity && (
        <div className="h-1 w-full bg-semantic-neutral-alpha rounded-full overflow-hidden absolute bottom-0 left-0">
          <div
            className={cn(
              'h-full transition-all duration-100 ease-linear rounded-full',
              styles.progressBarColor
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Toast>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(toast => (
        <ToastWithProgress key={toast.id} {...toast} />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
