import { useEffect, useState } from 'react';
import { QrReader, OnResultFunction } from 'react-qr-reader';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (address: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const { toast } = useToast();

  const requestCameraPermission = async () => {
    try {
      setIsRequestingPermission(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      // Stop the stream immediately as QrReader will request it again
      stream.getTracks().forEach(track => track.stop());

      setHasPermission(true);
      setIsRequestingPermission(false);
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      setIsRequestingPermission(false);

      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast({
            title: 'Camera Access Denied',
            description: 'Please allow camera access in your browser settings to scan QR codes.',
            variant: 'error',
          });
        } else if (error.name === 'NotFoundError') {
          toast({
            title: 'Camera Not Found',
            description: 'No camera device was found on your device.',
            variant: 'error',
          });
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen && hasPermission === null) {
      requestCameraPermission();
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
                <Camera className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
                <p className="text-sm text-text-secondary mb-4">
                  {isRequestingPermission
                    ? 'Requesting camera access...'
                    : 'Camera permission is required to scan QR codes'}
                </p>
                {!isRequestingPermission && !hasPermission && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={requestCameraPermission}
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? (
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    Allow Camera Access
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
