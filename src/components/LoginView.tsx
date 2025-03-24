import { Button } from '@/components/ui/button';
import { ConnectWithGoogle } from '@/components/ConnectWithGoogle';

export function LoginView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="text-6xl mb-2">☕️</div>
          <h1 className="text-3xl font-bold text-text-primary">Kofi Wallet</h1>
          <p className="text-text-secondary">
            Connect your wallet to manage your KOFI tokens and transactions
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
