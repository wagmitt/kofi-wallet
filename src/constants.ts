export const NETWORK = process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet';
export const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS ?? '';
export const KOFI_MODULE_ADDRESS =
  process.env.NEXT_PUBLIC_KOFI_MODULE_ADDRESS ??
  '0xaaaaa6754d32c481808fa10852a01208257d666fdbd0127297278449c3b220e6';
export const KOFI_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_KOFI_REGISTRY_ADDRESS ??
  '0x10b54fde8ddf6ca7eeef805e4894184441fa33e2953a967d1f059ab1f79fdfde';
export const CREATOR_ADDRESS = process.env.NEXT_PUBLIC_FA_CREATOR_ADDRESS;
export const FA_ADDRESS = process.env.NEXT_PUBLIC_FA_ADDRESS;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const APTOS_API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY || "";
export const KOFI_LOTTERY_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_ADDRESS;
