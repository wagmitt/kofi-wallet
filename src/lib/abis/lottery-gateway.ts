const KOFI_LOTTERY_GATEWAY_ABI = {
  "address": "0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52",
  "name": "gateway",
  "friends": [],
  "exposed_functions": [
    {
      "name": "lottery_deposit_and_stake_entry",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "lottery_deposit_entry",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    }
  ],
  "structs": []
} as const;

export default KOFI_LOTTERY_GATEWAY_ABI;
