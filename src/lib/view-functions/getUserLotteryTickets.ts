import { surfClient } from '../utils/surfClient';
import KOFI_LOTTERY_ABI from '../abis/lottery';

export type UserTickets = {
  amount: string;
};

export type GetTicketsArguments = {
  userAddress: `0x${string}`;
};

export const getUserLotteryTickets = async (args: GetTicketsArguments): Promise<UserTickets> => {
  const { userAddress } = args || {};

  const payload = await surfClient()
    .useABI(KOFI_LOTTERY_ABI)
    .view.get_user_tickets({
      functionArguments: [userAddress],
      typeArguments: [],
    });

  return { amount: payload[0] };
};
