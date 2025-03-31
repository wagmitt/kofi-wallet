import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Ticket } from 'lucide-react';
import { QRScanner } from './QRScanner';
import { useToast } from '@/hooks/use-toast';
import { giveTickets } from '@/lib/entry-functions/give-tickets';
import { useTransaction } from '@/hooks/useTransaction';

export function MoreDropdown() {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const { toast } = useToast();
  const { submitTransaction } = useTransaction();

  const handleGiveTickets = async (address: string) => {
    try {
      // Validate the address format
      if (!address.startsWith('0x') || address.length !== 66) {
        throw new Error('Invalid address format');
      }

      const transaction = giveTickets({
        address: address as `0x${string}`,
        amount: 1,
      });

      await submitTransaction(transaction);

      toast({
        title: 'Success',
        description: 'Successfully gave 1 ticket!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to give ticket',
        variant: 'error',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-full bg-background-secondary border border-border-alpha-light"
          >
            <MoreVertical className="h-5 w-5 text-text-tertiary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-background-primary border border-border-alpha-light"
        >
          <DropdownMenuItem
            className="gap-2 text-sm text-text-secondary hover:text-text-primary hover:bg-button-primary focus:bg-button-primary py-2"
            onClick={() => setIsQRScannerOpen(true)}
          >
            <Ticket className="mr-2 h-4 w-4" />
            Give Tickets
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleGiveTickets}
      />
    </>
  );
}
