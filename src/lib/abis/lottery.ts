const KOFI_LOTTERY_ABI = {
  "address": "0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52",
  "name": "lottery",
  "friends": [
    "0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::gateway"
  ],
  "exposed_functions": [
    {
      "name": "get_user_tickets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "add_tickets",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "create_new_pot",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "get_pot_probabilities",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "vector<0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::PayoutConfig>"
      ]
    },
    {
      "name": "get_pot_stats",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::Pot"
      ]
    },
    {
      "name": "get_total_pot",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_vault_balance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "u64"
      ]
    },
    {
      "name": "spin",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "spin_and_payout",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "u64"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "LotteryStore",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pots",
          "type": "0x1::table::Table<u64, 0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::Pot>"
        },
        {
          "name": "next_pot_id",
          "type": "u64"
        },
        {
          "name": "total_pot",
          "type": "u64"
        }
      ]
    },
    {
      "name": "LotteryVault",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "extend_ref",
          "type": "0x1::object::ExtendRef"
        }
      ]
    },
    {
      "name": "PayoutConfig",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "probability",
          "type": "u64"
        },
        {
          "name": "points",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PayoutEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "user_address",
          "type": "address"
        },
        {
          "name": "pot_id",
          "type": "u64"
        },
        {
          "name": "payout_amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Pot",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "config",
          "type": "0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::PotConfig"
        },
        {
          "name": "deposit_amount",
          "type": "u64"
        },
        {
          "name": "remaining_deposit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PotConfig",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "max_points",
          "type": "u64"
        },
        {
          "name": "remaining_points",
          "type": "u64"
        },
        {
          "name": "payouts",
          "type": "vector<0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::PayoutConfig>"
        }
      ]
    },
    {
      "name": "PotCreatedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pot_id",
          "type": "u64"
        },
        {
          "name": "deposit_amount",
          "type": "u64"
        },
        {
          "name": "max_points",
          "type": "u64"
        },
        {
          "name": "payouts",
          "type": "vector<0x42d3d74c53601215495bff2346890198713f7df3758e165018474b04055a2d52::lottery::PayoutConfig>"
        }
      ]
    },
    {
      "name": "ProbabilityConfig",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "probability",
          "type": "u64"
        },
        {
          "name": "points",
          "type": "u64"
        }
      ]
    },
    {
      "name": "TicketStore",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "tickets",
          "type": "0x1::table::Table<address, u64>"
        }
      ]
    }
  ]
} as const;

export default KOFI_LOTTERY_ABI;
