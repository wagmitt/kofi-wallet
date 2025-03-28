'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LoginView } from '@/components/LoginView';
import { BottomNav } from '@/components/BottomNav';
import LotteryWheel, { WheelSection } from '@/components/LotteryWheel';
import { spin } from '@/lib/entry-functions/spin';
import { toast } from 'sonner';
import { getPotStats, PotStats } from '@/lib/view-functions/getPotStats';
import { getUserLotteryTickets } from '@/lib/view-functions/getUserLotteryTickets';
import { aptosClient } from '@/lib/utils/aptosClient';
import { useTransaction } from '@/hooks/useTransaction';
import { Serializer } from '@aptos-labs/ts-sdk';
import { getLotteryWinnings } from '@/lib/view-functions/getLotteryWinnings';

const DECIMALS = 8;

export default function LotteryPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningAmount, setWinningAmount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [potStats, setPotStats] = useState<PotStats | null>(null);
  const [userTickets, setUserTickets] = useState<number>(0);
  const router = useRouter();
  const { account, signTransaction } = useWallet();
  const { submitTransaction } = useTransaction();

  // Fetch pot stats and user tickets on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const stats = await getPotStats();
        setPotStats(stats);

        // Fetch user tickets if wallet is connected
        if (account?.address) {
          const userAddress = account.address.toString() as `0x${string}`;
          const tickets = await getUserLotteryTickets({ userAddress });
          setUserTickets(Number(tickets.amount));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [account]);

  // Re-fetch user tickets after spinning
  useEffect(() => {
    const updateUserData = async () => {
      if (!isSpinning && account?.address) {
        try {
          const userAddress = account.address.toString() as `0x${string}`;
          const tickets = await getUserLotteryTickets({ userAddress });
          setUserTickets(Number(tickets.amount));
        } catch (error) {
          console.error('Error fetching user tickets:', error);
        }
      }
    };
    updateUserData();
  }, [isSpinning, account]);

  // Convert pot stats to wheel sections
  const wheelSections: WheelSection[] = useMemo(() => {
    if (!potStats || !potStats.config || !potStats.config.payouts) {
      console.warn('Missing pot stats data for wheel sections');
      return [];
    }

    return potStats.config.payouts.map((payout, index) => {
      // Convert probability from parts per million to percentage
      const percentage = Number(payout.probability) / 10000; // 1,000,000 -> 100
      // Convert points to APT amount and multiply by ticket amount
      const amount = (
        (Number(payout.points) * Number(potStats.deposit_amount)) /
        Math.pow(10, DECIMALS) /
        Number(potStats.config.max_points)
      ).toFixed(3);

      return {
        points: Number(payout.points),
        percentage,
        color: index % 2 === 0 ? '#8DC63F' : '#FFFFFF',
        label: amount.toString(),
        text: `${amount} ☕️`,
      };
    });
  }, [potStats]);

  // Handle spin start
  const handleSpinStart = async () => {
    if (!account || userTickets <= 0) {
      toast.error('No chances left!');
      return;
    }

    try {
      setIsSpinning(true);
      setWinningAmount(null);
      const gasSponsored = true;

      if (gasSponsored) {
        const aptos = aptosClient();
        // Build the transaction
        const transaction = await aptos.transaction.build.simple({
          sender: account.address,
          data: spin({ potNumber: 1, amount: 1 }).data,
          withFeePayer: true,
        });

        // Sign the transaction with sender's key
        const senderAuthenticator = await signTransaction({
          transactionOrPayload: transaction,
          asFeePayer: false,
        });

        // Serialize the transaction and authenticator using BCS
        const serializer = new Serializer();
        transaction.serialize(serializer);
        senderAuthenticator.authenticator.serialize(serializer);
        const serializedData = Buffer.from(serializer.toUint8Array()).toString('base64');

        // Send to server for fee payer signing and submission
        const response = await fetch('/api/submit-transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serializedData,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit transaction');
        }

        const result = await response.json();

        await new Promise(resolve => setTimeout(resolve, 500));

        // wait for tx to be confirmed
        await aptos.waitForTransaction({
          transactionHash: result.transactionHash,
          options: {
            waitForIndexer: true,
            timeoutSecs: 5,
          },
        });

        // Get the actual winning amount from the transaction
        const amount = await getLotteryWinnings(result.transactionHash);
        console.log('handleSpinStart: Winning amount:', amount);

        // need to format

        // Set the winning amount to trigger wheel to stop at correct position
        setWinningAmount(amount);
        setUserTickets(prev => prev - 1);
      } else {
        console.log('Using direct wallet submission');
        const transaction = spin({ potNumber: 1, amount: 1 });
        const tx = await submitTransaction(transaction);
        console.log('Transaction result:', tx);
      }
    } catch (error) {
      console.error('Error spinning:', error);
      toast.error('Failed to spin: ' + (error instanceof Error ? error.message : String(error)));
      // setIsSpinning(false);
    }
  };

  // Handle spin complete
  const handleSpinComplete = (winningSection: WheelSection) => {
    console.log('handleSpinComplete: Spin finished, winning section:', winningSection);
    setIsSpinning(false);

    // Show winning amount in toast
    toast.success(`Congratulations! You won ${winningSection.text}!`);

    // Create a timeout and reset result and winning amount
    setTimeout(() => {
      setWinningAmount(null);
    }, 10000);
  };

  // If no account is connected, show login view
  if (!account) {
    return <LoginView />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#8DC63F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading lottery data...</p>
        </div>
      </div>
    );
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
          <div className="text-2xl font-bold text-text-primary mb-2">{userTickets}</div>
          <div className="text-sm text-text-shallow">Chances Left</div>
        </div>

        {/* Spin Button with Glow */}
        <div className="w-full flex justify-center">
          <Button
            onClick={handleSpinStart}
            disabled={isSpinning || userTickets <= 0}
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
