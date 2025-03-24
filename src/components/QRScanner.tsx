import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Camera, ExternalLink } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const qrRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<string | null>(null);

  const stopScanner = useCallback(async () => {
    if (qrRef.current?.isScanning) {
      await qrRef.current.stop();
      const element = document.getElementById(readerRef.current!);
      element?.remove();
    }
  }, []);

  const initializeScanner = useCallback(async () => {
    try {
      setHasPermission(true);
      setError(null);

      const readerId = 'qr-reader-' + Math.random().toString(36).substring(7);
      readerRef.current = readerId;

      if (!document.getElementById(readerId)) {
        const container = document.createElement('div');
        container.id = readerId;
        document.getElementById('qr-container')?.appendChild(container);
      }

      qrRef.current = new Html5Qrcode(readerId);

      await qrRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        decodedText => {
          onScan(decodedText);
          stopScanner();
          onClose();
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
    } catch (err) {
      console.error('Camera initialization error:', err);
      setHasPermission(false);

      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera access and try again.');
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a camera.');
      } else {
        setError('Failed to initialize camera. Please try again.');
      }
    }
  }, [onScan, onClose, stopScanner]);

  const checkCameraPermissions = useCallback(async () => {
    // Reset states
    setError(null);
    setIsRequestingPermission(true);

    // Check if we're on HTTPS or localhost
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Camera access requires HTTPS. Please use a secure connection.');
      setHasPermission(false);
      setIsRequestingPermission(false);
      return;
    }

    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access.');
        setHasPermission(false);
        setIsRequestingPermission(false);
        return;
      }

      // Check camera permissions
      const permissionResult = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (permissionResult.state === 'prompt') {
        // Show permission request UI
        setIsRequestingPermission(true);
        setError(null);
        return;
      }

      if (permissionResult.state === 'denied') {
        setError('Camera access is blocked. Please allow camera access in your browser settings.');
        setHasPermission(false);
        setIsRequestingPermission(false);
        return;
      }

      // Permission is granted, initialize scanner
      await initializeScanner();
    } catch (err) {
      console.error('Permission check error:', err);
      setError('Failed to check camera permissions.');
      setHasPermission(false);
      setIsRequestingPermission(false);
    }
  }, [initializeScanner]);

  const requestPermissionAndInitialize = useCallback(async () => {
    setIsRequestingPermission(true);
    setError(null);

    try {
      // Explicitly request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      await initializeScanner();
    } catch (err) {
      console.error('Permission request error:', err);
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera access in your browser settings.');
      } else {
        setError('Failed to access camera. Please try again.');
      }
      setHasPermission(false);
    } finally {
      setIsRequestingPermission(false);
    }
  }, [initializeScanner]);

  const openBrowserSettings = useCallback(() => {
    if (navigator.userAgent.indexOf('Chrome') !== -1) {
      window.open('chrome://settings/content/camera');
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
      window.open('about:preferences#privacy');
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
      window.open('x-apple.systempreferences:com.apple.preference.security?Privacy_Camera');
    } else {
      window.open('about:settings');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkCameraPermissions();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen, checkCameraPermissions, stopScanner]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        stopScanner();
        onClose();
      }}
    >
      <DialogContent className="bg-background-secondary border-border-alpha-light sm:max-w-md">
        <div className="relative">
          <Button
            variant="ghost"
            className="absolute right-0 top-0 z-10 h-8 w-8 p-0"
            onClick={() => {
              stopScanner();
              onClose();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="mt-4">
            {error ? (
              <div className="text-center p-4">
                <Camera className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-500 mb-2">{error}</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={checkCameraPermissions}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openBrowserSettings}
                    className="flex items-center gap-2"
                  >
                    Open Browser Settings <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : isRequestingPermission ? (
              <div className="text-center p-4">
                <Camera className="h-8 w-8 text-text-primary mx-auto mb-2" />
                <p className="text-text-primary mb-4">Allow camera access to scan QR codes</p>
                <Button onClick={requestPermissionAndInitialize}>Allow Camera Access</Button>
              </div>
            ) : hasPermission ? (
              <div id="qr-container" className="w-full aspect-square rounded-lg overflow-hidden" />
            ) : (
              <div className="text-center p-4">
                <div className="h-6 w-6 border-2 border-text-tertiary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-text-secondary mt-2">Initializing camera...</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
