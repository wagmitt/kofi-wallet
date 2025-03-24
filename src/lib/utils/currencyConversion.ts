import { type BigNumber } from '@/types';

/**
 * Converts a value from octas (8 decimal places) to a human-readable number
 * @param octas - The value in octas
 * @returns The human-readable number
 */
export const fromOctas = (octas: number | BigNumber): number => {
  return Number(octas) / 100000000;
};

/**
 * Converts a human-readable number to octas (8 decimal places)
 * @param value - The human-readable number
 * @returns The value in octas
 */
export const toOctas = (value: number): number => {
  return Math.floor(value * 100000000);
};

/**
 * Converts a string representation of a decimal number to octas (8 decimal places)
 * This is similar to parseEther in ethers.js but for Aptos's 8 decimal places
 * @param value - The string representation of the decimal number (e.g. "1.11")
 * @returns The value in octas as a bigint
 */
export const toOctasFromString = (value: string): bigint => {
  if (!value || value === '') return BigInt(0);

  // Handle the case where the value is already an integer
  if (!value.includes('.')) {
    return BigInt(value) * BigInt(100000000);
  }

  const parts = value.split('.');
  const wholePart = parts[0];
  let fractionalPart = parts[1] || '';

  // Pad or truncate the fractional part to 8 decimal places
  if (fractionalPart.length > 8) {
    fractionalPart = fractionalPart.substring(0, 8);
  } else {
    fractionalPart = fractionalPart.padEnd(8, '0');
  }

  // Convert to bigint, handling negative values
  const isNegative = wholePart.startsWith('-');
  const absWholePart = isNegative ? wholePart.substring(1) : wholePart;

  const wholeAsBigInt = BigInt(absWholePart) * BigInt(100000000);
  const fractionalAsBigInt = BigInt(fractionalPart);

  const result = wholeAsBigInt + fractionalAsBigInt;
  return isNegative ? -result : result;
};

/**
 * Formats a currency value to a string with the specified number of decimal places
 * @param value - The value to format
 * @param decimals - The number of decimal places (default: 2)
 * @returns The formatted string with "$" prefix
 */
export const formatCurrency = (value: number | null, decimals = 2): string => {
  if (value === null || isNaN(value)) return '--';
  if (value === 0) return '--';
  return `$${value.toFixed(decimals)}`;
};

/**
 * Formats a token amount to a string with the specified number of decimal places
 * @param value - The value to format
 * @param decimals - The number of decimal places (default: 4)
 * @returns The formatted string
 */
export const formatTokenAmount = (value: number | null, decimals = 4): string => {
  if (value === null || isNaN(value)) return '...';
  return value.toFixed(decimals);
};

/**
 * Calculates the dollar value of a token amount
 * @param amount - The token amount
 * @param price - The token price in USD
 * @returns The dollar value or null if inputs are invalid
 */
export const calculateDollarValue = (
  amount: string | number | null,
  price: string | null | number
): number | null => {
  if (!price || !amount) return null;
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return null;
  return numAmount * Number(price);
};
