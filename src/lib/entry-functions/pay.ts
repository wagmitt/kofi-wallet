import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
// Internal utils

import FUNGIBLE_ASSET_ABI from '../abis/fungible-asset';

import { createEntryPayload } from '@thalalabs/surf';

export type GiveTicketsArguments = {
  address?: `0x${string}`;
  amount: number;
};

export const pay = (args?: GiveTicketsArguments): InputTransactionData => {
  let { address, amount } = args || {};
  console.log("🚀 | pay | amount:", amount)

  if (!amount) {
    amount = 1;
  }

  if (!address) {
    address = '0x15fc9d4db533357da61c4e30341256c11636495f505cc2a48291ddbe0da83694';
  }

  // Convert the amount to a string with fixed precision to avoid floating point issues
  const payload = createEntryPayload(FUNGIBLE_ASSET_ABI, {
    function: 'transfer_coins',
    functionArguments: [address, amount],
    typeArguments: ["0x2acee43658eedf3d0197e5a1fefff6b8971577ff5f04324c0e97c9520e8509a7::coin_factory::Emojicoin"],
  });

  return {
    data: {
      function: payload.function,
      functionArguments: payload.functionArguments,
      typeArguments: payload.typeArguments,
    },
  };
};
