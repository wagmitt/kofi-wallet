import { surfClient } from '../utils/surfClient';
import KOFI_ACCESS_CONTROL_LOTTERY_ABI from '../abis/lottery-access-control';

type IsAdminArguments = {
  address: `0x${string}`;
};

type IsAdminResponse = {
  isAdmin: boolean;
};

export const isAdmin = async (args: IsAdminArguments): Promise<IsAdminResponse> => {
  const { address } = args;

  try {
    const payload = (await surfClient()
      .useABI(KOFI_ACCESS_CONTROL_LOTTERY_ABI)
      .view.is_admin({
        functionArguments: [address],
        typeArguments: [],
      })) as unknown as boolean[];

    return { isAdmin: payload[0] };
  } catch (error) {
    console.error('Error fetching pot stats:', error);
    throw error;
  }
};

