'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LoginView } from '@/components/LoginView';
import { BottomNav } from '@/components/BottomNav';
import LotteryWheel, { WheelSection } from '@/components/LotteryWheel';
import { spin } from '@/lib/entry-functions/spin';
import { useTransaction } from '@/hooks/useTransaction';
import { toast } from 'sonner';

// Define wheel sections based on contract probabilities
const wheelSections: WheelSection[] = [
  { points: 100, percentage: 5, color: '#8DC63F', label: '100' },
  { points: 50, percentage: 10, color: '#8DC63F', label: '50' },
  { points: 25, percentage: 20, color: '#8DC63F', label: '25' },
  { points: 10, percentage: 30, color: '#8DC63F', label: '10' },
  { points: 5, percentage: 35, color: '#8DC63F', label: '5' },
];

export default function LotteryPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningAmount, setWinningAmount] = useState<string | null>(null);
  const [chancesLeft, setChancesLeft] = useState(3); // Example value, should come from contract
  const router = useRouter();
  const { account } = useWallet();
  const { submitTransaction } = useTransaction();

  // Handle spin start
  const handleSpinStart = async () => {
    if (chancesLeft <= 0) {
      toast.error('No chances left!');
      return;
    }

    try {
      setIsSpinning(true);
      setWinningAmount(null);

      // Submit spin transaction
      const response = await submitTransaction(spin({ amount: 1 }));

      if (response) {
        // Simulate random winning amount (in production, this would come from the contract)
        const randomSection = wheelSections[Math.floor(Math.random() * wheelSections.length)];
        setWinningAmount(randomSection.label);
        setChancesLeft(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Failed to spin the wheel');
      setIsSpinning(false);
    }
  };

  // Handle spin complete
  const handleSpinComplete = (result: WheelSection) => {
    setIsSpinning(false);
    toast.success(`Congratulations! You won ${result.points} points!`);
  };

  // If no account is connected, show login view
  if (!account) {
    return <LoginView />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-primary pb-16">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-background-primary border-b border-border-alpha-light">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push('/')} className="p-1 mr-2">
            <ArrowLeft className="h-5 w-5 text-text-primary" />
          </Button>
          <h1 className="text-lg font-semibold text-text-primary">Kofi Lottery</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full h-full flex-col justify-center items-center overflow-y-auto">
        {/* Lottery Wheel */}
        <div className="p-8">
          <LotteryWheel
            sections={wheelSections}
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            winningAmount={winningAmount}
          />
        </div>
        {/* Chances Left */}
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold text-text-primary mb-2">{chancesLeft}</div>
          <div className="text-sm text-text-shallow">Chances Left</div>
        </div>

        {/* Spin Button with Glow */}
        <div className="w-full flex justify-center">
          <Button
            onClick={handleSpinStart}
            disabled={isSpinning || chancesLeft <= 0}
            className="relative w-[200px] py-6 text-lg font-semibold rounded-xl bg-button-primary text-text-dark hover:bg-opacity-90 disabled:opacity-50 shadow-[0_0_20px_rgba(141,198,63,0.3)]"
          >
            {isSpinning ? 'Spinning...' : 'Spin!'}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
