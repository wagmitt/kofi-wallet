export const APT_DECIMALS = 8;

/**
 * Converts a human-readable amount to on-chain representation
 * Note: This function uses regular number math which can lead to precision issues
 * For critical financial calculations, use convertAmountToOnChainBigInt instead
 */
export const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
  return value * Math.pow(10, decimal);
};

/**
 * Converts a human-readable amount to on-chain representation using BigInt for precision
 * This is the preferred method for financial calculations to avoid floating point errors
 * @param value - The string representation of the amount (e.g. "1.11")
 * @param decimal - The number of decimal places (e.g. 8 for APT)
 * @returns The on-chain amount as a string (to preserve precision)
 */
export const convertAmountToOnChainBigInt = (value: string, decimal: number): string => {
  if (!value || value === '') return '0';

  // Handle the case where the value is already an integer
  if (!value.includes('.')) {
    return (BigInt(value) * BigInt(10 ** decimal)).toString();
  }

  const parts = value.split('.');
  const wholePart = parts[0];
  let fractionalPart = parts[1] || '';

  // Pad or truncate the fractional part to the specified decimal places
  if (fractionalPart.length > decimal) {
    fractionalPart = fractionalPart.substring(0, decimal);
  } else {
    fractionalPart = fractionalPart.padEnd(decimal, '0');
  }

  // Convert to bigint, handling negative values
  const isNegative = wholePart.startsWith('-');
  const absWholePart = isNegative ? wholePart.substring(1) : wholePart;

  const wholeAsBigInt = BigInt(absWholePart) * BigInt(10 ** decimal);
  const fractionalAsBigInt = BigInt(fractionalPart);

  const result = wholeAsBigInt + fractionalAsBigInt;
  return (isNegative ? -result : result).toString();
};

export const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
  return value / Math.pow(10, decimal);
};
