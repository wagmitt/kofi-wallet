import { motion } from 'framer-motion';
import { Check, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Card } from './ui/card';

interface OrderSuccessProps {
  amount: number;
  transactionHash?: string;
}

export function OrderSuccess({ amount, transactionHash }: OrderSuccessProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 space-y-6"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-text-primary"
      >
        Payment Successful!
      </motion.h2>

      {/* Order Summary Card */}
      <Card className="w-full max-w-md bg-background-secondary border-border-alpha-light p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-secondary">Amount</span>
            <span className="font-medium text-text-primary">{amount} APT</span>
          </div>
          {transactionHash && (
            <div className="pt-3 border-t border-border-alpha-light">
              <p className="text-sm text-text-secondary">Transaction Hash:</p>
              <p className="text-xs text-text-tertiary break-all">{transactionHash}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Home Button */}
      <Button
        onClick={() => router.push('/')}
        className="mt-6 bg-background-secondary hover:bg-button-primary text-text-primary border border-border-alpha-light rounded-full px-6"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </motion.div>
  );
}
