import { APTOS_API_KEY, NETWORK } from '@/constants';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const aptos = new Aptos(
  new AptosConfig({
    network: NETWORK as Network,
    clientConfig: { API_KEY: APTOS_API_KEY },
  })
);

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}

export function aptosMainnetClient() {
  return new Aptos(
    new AptosConfig({
      network: Network.MAINNET,
      clientConfig: { API_KEY: APTOS_API_KEY },
    })
  );
}
