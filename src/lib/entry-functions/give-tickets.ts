import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
// Internal utils

import KOFI_LOTTERY_ABI from '../abis/lottery';

import { createEntryPayload } from '@thalalabs/surf';

export type GiveTicketsArguments = {
  address: `0x${string}`;
  amount: number;
};

export const giveTickets = (args?: GiveTicketsArguments): InputTransactionData => {
  let { amount } = args || {};

  // default pot number
  const address = args?.address as `0x${string}`;

  if (!amount) {
    amount = 1;
  }

  // Convert the amount to a string with fixed precision to avoid floating point issues
  const payload = createEntryPayload(KOFI_LOTTERY_ABI, {
    function: 'admin_add_tickets',
    functionArguments: [address, amount],
    typeArguments: [],
  });

  return {
    data: {
      function: payload.function,
      functionArguments: payload.functionArguments,
      typeArguments: payload.typeArguments,
    },
  };
};
