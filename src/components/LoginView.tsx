import { ConnectWithGoogle } from '@/components/ConnectWithGoogle';
import Image from 'next/image';

export function LoginView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo and Title */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="text-6xl mb-2">☕️</div>
          <Image src="/kofi-logo.svg" alt="Kofi Logo" width={100} height={100} />
          <p className="text-text-secondary">
            Connect your wallet to manage your ☕️ tokens and transactions
          </p>
        </div>

        {/* Connect Button */}
        <div className="w-full max-w-sm mx-auto">
          <ConnectWithGoogle />
        </div>
      </div>
    </div>
  );
}
