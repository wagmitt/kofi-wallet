import { useEffect, useState } from 'react';
import { QrReader, OnResultFunction } from 'react-qr-reader';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (address: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    }
  }, [isOpen]);

  const handleScan: OnResultFunction = result => {
    if (result) {
      const text = result.getText();
      if (text) {
        onScan(text);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 z-10 h-8 w-8 p-0 bg-background/80"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="w-full">
            {hasPermission ? (
              <div className="relative aspect-square w-full bg-black">
                <QrReader
                  constraints={{
                    facingMode: 'environment',
                    aspectRatio: 1,
                  }}
                  onResult={handleScan}
                  className="w-full h-full"
                  videoStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  containerStyle={{
                    width: '100%',
                    height: '100%',
                    padding: 0,
                  }}
                  scanDelay={500}
                  videoContainerStyle={{
                    width: '100%',
                    height: '100%',
                    paddingTop: 0,
                  }}
                />
                <div className="absolute inset-0 border-[3px] border-white/30 rounded-lg m-12" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/50 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-text-secondary">
                  Camera permission is required to scan QR codes
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    navigator.mediaDevices
                      .getUserMedia({ video: true })
                      .then(() => setHasPermission(true))
                      .catch(() => setHasPermission(false));
                  }}
                >
                  Allow Camera Access
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
