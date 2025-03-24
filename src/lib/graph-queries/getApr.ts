import { aptosClient } from '@/lib/utils/aptosClient';

const kofi_address = process.env.NEXT_PUBLIC_KOFI_MODULE_ADDRESS;
// --- GraphQL Query ---
// This query fetches up to 84 reward events (ordered ascending by block height).
const REWARDS_QUERY = `
query RewardsQuery {
  events(
    limit: 84
    where: {indexed_type: {_eq: "${kofi_address}::rewards_manager::RewardsUpdated"}}
    order_by: {transaction_block_height: desc}
  ) {
    data
  }
}
`;

// --- TypeScript Interfaces ---
interface RewardEventData {
  apt_staked: string;
  kapt_supply: string;
  exchange_rate: string;
  fees_collected: string;
}

interface RewardEvent {
  data: RewardEventData;
}

interface RewardsQueryResponse {
  events: RewardEvent[];
}

// --- Fetching the Data ---
// This function queries the Aptos indexer using the GraphQL query.
async function fetchRewardEvents(): Promise<RewardEvent[]> {
  // Create an AptosClient instance using the indexer GraphQL endpoint.
  // (Change the URL to the correct endpoint for your environment.)
  const aptos = aptosClient();
  try {
    // The SDK exposes a "queryIndexer" method which accepts a query object.
    const response: RewardsQueryResponse = await aptos.queryIndexer({
      query: {
        query: REWARDS_QUERY,
      },
    });
    return response.events;
  } catch (error) {
    throw error;
  }
}

// --- Removing Duplicates ---
// Since every update appears twice, we remove duplicates by serializing the event data.
function removeDuplicateEvents(events: RewardEvent[]): RewardEvent[] {
  const seen = new Set<string>();
  const uniqueEvents: RewardEvent[] = [];

  for (const event of events) {
    const key = JSON.stringify(event.data);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEvents.push(event);
    }
  }

  return uniqueEvents;
}

// --- APR Calculation ---
// We assume each event represents a 2‑hour update. We calculate the yield
// from the change in "exchange_rate" over the last update and annualize it.
export function calculateAPR(events: RewardEvent[]): number | null {
  if (events.length < 2) {
    return null;
  }

  // Use the last two events (which are assumed to be sequential 2‑hour updates)
  const previous = events[1].data;
  const current = events[0].data;

  // Convert the exchange rate strings to numbers.
  const prevExchangeRate = parseFloat(previous.exchange_rate);
  const currExchangeRate = parseFloat(current.exchange_rate);

  if (prevExchangeRate === 0) {
    return null;
  }

  const delta = currExchangeRate - prevExchangeRate;
  const yieldPerInterval = delta / prevExchangeRate;

  // There are 24/2 = 12 intervals per day, and 365 days per year: 12 * 365 = 4380 intervals.
  const intervalsPerYear = 4380;
  const apr = yieldPerInterval * intervalsPerYear;

  return apr;
}

export async function getAPR() {
  try {
    const events = await fetchRewardEvents();
    const uniqueEvents = removeDuplicateEvents(events);
    const computedApr = calculateAPR(uniqueEvents);
    return computedApr;
  } catch (err) {
    console.error(err);
    return null;
  }
}
