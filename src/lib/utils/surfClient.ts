import { aptosClient } from './aptosClient';
import { createSurfClient } from '@thalalabs/surf';

// Reuse same Aptos instance to utilize cookie based sticky routing
export function surfClient() {
  const client = createSurfClient(aptosClient());
  return client;
}
