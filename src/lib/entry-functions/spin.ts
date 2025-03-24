import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
// Internal utils

import KOFI_LOTTERY_ABI from '../abis/lottery';

import { createEntryPayload } from '@thalalabs/surf';

export type SpinArguments = {
  potNumber?: number;
  amount?: number;
};

export const spin = (args?: SpinArguments): InputTransactionData => {
  let { potNumber, amount } = args || {};

  // default pot number
  const defaultPotNumber = 0;

  if (!potNumber) {
    potNumber = defaultPotNumber;
  }

  if (!amount) {
    amount = 1;
  }

  // Convert the amount to a string with fixed precision to avoid floating point issues
  const payload = createEntryPayload(KOFI_LOTTERY_ABI, {
    function: 'spin',
    functionArguments: [potNumber, amount], // pot number
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
