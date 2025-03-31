import { surfClient } from '../utils/surfClient';
import KOFI_LOTTERY_ABI from '../abis/lottery';

type Payout = {
  points: string;
  probability: string;
};

type PotConfig = {
  max_points: string;
  payouts: Payout[];
  remaining_points: string;
};

export type PotStats = {
  config: PotConfig;
  deposit_amount: string;
  remaining_deposit: string;
};

export type SpinArguments = {
  potNumber?: number;
};

export const getPotStats = async (args?: SpinArguments): Promise<PotStats> => {
  let { potNumber } = args || {};

  // default pot number
  const defaultPotNumber = 1;

  if (!potNumber) {
    potNumber = defaultPotNumber;
  }

  try {
    const payload = (await surfClient()
      .useABI(KOFI_LOTTERY_ABI)
      .view.get_pot_stats({
        functionArguments: [potNumber],
        typeArguments: [],
      })) as unknown as PotStats[];

    return payload[0];
  } catch (error) {
    console.error('Error fetching pot stats:', error);
    throw error;
  }
};
