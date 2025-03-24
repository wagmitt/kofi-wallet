'use client';

// Constants for localStorage keys
export const STORAGE_KEYS = {
  TERMS_ACCEPTED: 'KofiTermsAccepted',
  MODAL_TIMESTAMP: 'KofiModalTimestamp',
};

/**
 * Get a value from localStorage with type safety
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set a value in localStorage with type safety
 */
export function setLocalStorage<T>(key: string, value: T): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

/**
 * Check if terms have been accepted before
 */
export function hasAcceptedTerms(): boolean {
  return getLocalStorage<boolean>(STORAGE_KEYS.TERMS_ACCEPTED, false);
}

/**
 * Save terms acceptance to localStorage
 */
export function saveTermsAcceptance(accepted: boolean = true): void {
  setLocalStorage(STORAGE_KEYS.TERMS_ACCEPTED, accepted);
  setLocalStorage(`${STORAGE_KEYS.TERMS_ACCEPTED}_timestamp`, Date.now());
}

/**
 * Check if enough time has passed since the last terms acceptance
 * to show the dialog again (default: 30 days)
 */
export function shouldShowTermsDialog(daysToExpire: number = 30): boolean {
  const accepted = getLocalStorage<boolean>(STORAGE_KEYS.TERMS_ACCEPTED, false);

  if (!accepted) {
    return true; // Never accepted terms before
  }

  const acceptedTimestamp = getLocalStorage<number>(`${STORAGE_KEYS.TERMS_ACCEPTED}_timestamp`, 0);

  if (acceptedTimestamp === 0) {
    return true; // Timestamp not set
  }

  const now = Date.now();
  const dayInMs = 86400000; // 24 hours in milliseconds
  const expiryTime = daysToExpire * dayInMs;

  return now - acceptedTimestamp > expiryTime;
}
