import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, ScanLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipientAddress: string, amount: string) => Promise<void>;
  balance: string;
  isLoading: boolean;
}

export function SendModal({ isOpen, onClose, onSend, balance, isLoading }: SendModalProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();

  // Handle amount input with proper formatting
  const handleAmountChange = (value: string) => {
    setAmountError('');
    // Remove any non-digit and non-decimal characters
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Only allow one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      setAmountError('Invalid number format');
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
      setAmount(parts.join('.'));
    } else {
      setAmount(cleanValue);
    }

    // Validate amount against balance
    if (cleanValue && balance) {
      const inputAmount = Number(cleanValue);
      const balanceAmount = Number(balance);
      if (inputAmount > balanceAmount) {
        setAmountError('Insufficient balance');
      }
    }
  };

  // Handle address input
  const handleAddressChange = (value: string) => {
    setAddressError('');
    if (value && !/^0x[a-fA-F0-9]{64}$/.test(value)) {
      setAddressError('Invalid address format');
    }
    setRecipientAddress(value);
  };

  // Handle QR scan
  const handleQRScan = (result: string) => {
    if (result.startsWith('0x') && result.length === 66) {
      setRecipientAddress(result);
    } else {
      toast({
        variant: 'error',
        title: 'Invalid QR Code',
        description: 'The scanned QR code is not a valid Aptos address.',
      });
    }
  };

  // Handle send transaction
  const handleSend = async () => {
    if (!recipientAddress || !amount) return;
    await onSend(recipientAddress, amount);
    setRecipientAddress('');
    setAmount('');
    setAmountError('');
    setAddressError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background-secondary border-border-alpha-light p-6 sm:p-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold text-text-primary">Send KOFI</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary block">Recipient Address</label>
            <div className="relative w-full">
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={recipientAddress}
                  onChange={e => handleAddressChange(e.target.value)}
                  placeholder="Enter recipient's address"
                  className="bg-background-input w-full border-border-alpha-light rounded-full h-8 text-sm text-text-primary text-center placeholder:text-center p-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQRScanner(true)}
                  className="h-8 w-8 p-0 rounded-full bg-background-input border border-border-alpha-light"
                >
                  <ScanLine className="h-4 w-4 text-text-tertiary" />
                </Button>
              </div>
              {addressError && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  <p className="text-xs text-red-500">{addressError}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary block">Amount (KOFI)</label>
            <div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="bg-background-input border-border-alpha-light rounded-full pr-8 h-8 text-sm text-text-primary text-center placeholder:text-center p-2"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  ☕️
                </span>
              </div>
              {amountError && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  <p className="text-xs text-red-500">{amountError}</p>
                </div>
              )}
              {balance && !amountError && (
                <p className="text-xs text-text-secondary mt-1">Balance: ☕️{balance}</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={
              isLoading ||
              !recipientAddress ||
              !amount ||
              Number(amount) === 0 ||
              !!amountError ||
              !!addressError
            }
            className="w-full bg-button-primary hover:bg-opacity-90 text-text-dark rounded-full h-8 text-sm mt-2"
          >
            {isLoading ? 'Sending...' : 'Send KOFI'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
