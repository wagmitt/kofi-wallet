import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (address: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const code = detectedCodes[0];
    if (code?.rawValue) {
      onScan(code.rawValue);
      onClose();
    }
  };

  const handleError = (error: unknown) => {
    console.error('QR Scanner error:', error);
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        setHasPermission(false);
        toast({
          title: 'Camera Access Denied',
          description: (
            <div className="space-y-2">
              <p>To enable camera access:</p>
              <ol className="list-decimal pl-4 text-sm">
                <li>Click the camera icon in your browser&apos;s address bar</li>
                <li>Select &quot;Allow&quot; for camera access</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          ),
          variant: 'error',
          duration: 10000,
        });
      } else {
        toast({
          title: 'Scanner Error',
          description: error.message || 'An error occurred while scanning.',
          variant: 'error',
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background-secondary border-border-alpha-light">
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 z-10 h-8 w-8 p-0 bg-background-secondary/80"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="w-full">
            {hasPermission === false ? (
              <div className="text-center py-12 bg-background-input">
                <Camera className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
                <p className="text-sm text-text-secondary mb-4">
                  Camera access was denied. Please allow camera access in your browser settings to
                  scan QR codes.
                </p>
              </div>
            ) : (
              <div className="relative aspect-square w-full bg-background-input">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  scanDelay={500}
                  constraints={{
                    facingMode: 'environment',
                  }}
                  className="w-full h-full"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                <div className="absolute inset-0 border-[3px] border-text-tertiary/30 rounded-lg m-12 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-text-tertiary/50 rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
