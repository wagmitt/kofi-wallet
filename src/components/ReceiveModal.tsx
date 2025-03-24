import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function ReceiveModal({ isOpen, onClose, address }: ReceiveModalProps) {
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: 'Copied!',
        description: 'Address copied to clipboard',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to copy address',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background-secondary border-border-alpha-light p-6 sm:p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-[280px] aspect-square bg-white rounded-lg flex items-center justify-center p-4 shadow-sm">
            <QRCodeSVG
              value={address}
              size={Math.min(280, window.innerWidth * 0.7)}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="w-full max-w-[320px] space-y-2">
            <p className="text-xs text-text-secondary text-center">Your Address</p>
            <div className="flex items-center justify-between gap-2 bg-background-input rounded-full px-4 py-2">
              <p className="text-sm text-text-primary truncate flex-1">{address}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                className="h-8 w-8 p-0 rounded-full shrink-0"
              >
                <Copy className="h-4 w-4 text-text-tertiary" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
