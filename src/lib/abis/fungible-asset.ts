const KOFI_LOTTERY_ABI = {
    "address": "0x1",
    "name": "aptos_account",
    "friends": [
        "0x1::transaction_fee",
        "0x1::transaction_validation",
        "0x1::genesis",
        "0x1::resource_account"
    ],
    "exposed_functions": [
        {
            "name": "create_account",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "address"
            ],
            "return": []
        },
        {
            "name": "transfer",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "address",
                "u64"
            ],
            "return": []
        },
        {
            "name": "assert_account_exists",
            "visibility": "public",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "address"
            ],
            "return": []
        },
        {
            "name": "assert_account_is_registered_for_apt",
            "visibility": "public",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "address"
            ],
            "return": []
        },
        {
            "name": "batch_transfer",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "vector<address>",
                "vector<u64>"
            ],
            "return": []
        },
        {
            "name": "batch_transfer_coins",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [
                {
                    "constraints": []
                }
            ],
            "params": [
                "&signer",
                "vector<address>",
                "vector<u64>"
            ],
            "return": []
        },
        {
            "name": "batch_transfer_fungible_assets",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "0x1::object::Object<0x1::fungible_asset::Metadata>",
                "vector<address>",
                "vector<u64>"
            ],
            "return": []
        },
        {
            "name": "burn_from_fungible_store_for_gas",
            "visibility": "friend",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&0x1::fungible_asset::BurnRef",
                "address",
                "u64"
            ],
            "return": []
        },
        {
            "name": "can_receive_direct_coin_transfers",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [
                "address"
            ],
            "return": [
                "bool"
            ]
        },
        {
            "name": "deposit_coins",
            "visibility": "public",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [
                {
                    "constraints": []
                }
            ],
            "params": [
                "address",
                "0x1::coin::Coin<T0>"
            ],
            "return": []
        },
        {
            "name": "deposit_fungible_assets",
            "visibility": "public",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "address",
                "0x1::fungible_asset::FungibleAsset"
            ],
            "return": []
        },
        {
            "name": "fungible_transfer_only",
            "visibility": "friend",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "address",
                "u64"
            ],
            "return": []
        },
        {
            "name": "is_fungible_balance_at_least",
            "visibility": "friend",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "address",
                "u64"
            ],
            "return": [
                "bool"
            ]
        },
        {
            "name": "register_apt",
            "visibility": "friend",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer"
            ],
            "return": []
        },
        {
            "name": "set_allow_direct_coin_transfers",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "bool"
            ],
            "return": []
        },
        {
            "name": "transfer_coins",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [
                {
                    "constraints": []
                }
            ],
            "params": [
                "&signer",
                "address",
                "u64"
            ],
            "return": []
        },
        {
            "name": "transfer_fungible_assets",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "0x1::object::Object<0x1::fungible_asset::Metadata>",
                "address",
                "u64"
            ],
            "return": []
        }
    ],
    "structs": [
        {
            "name": "DirectCoinTransferConfigUpdated",
            "is_native": false,
            "is_event": true,
            "abilities": [
                "drop",
                "store"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "account",
                    "type": "address"
                },
                {
                    "name": "new_allow_direct_transfers",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "DirectCoinTransferConfigUpdatedEvent",
            "is_native": false,
            "is_event": false,
            "abilities": [
                "drop",
                "store"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "new_allow_direct_transfers",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "DirectTransferConfig",
            "is_native": false,
            "is_event": false,
            "abilities": [
                "key"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "allow_arbitrary_coin_transfers",
                    "type": "bool"
                },
                {
                    "name": "update_coin_transfer_events",
                    "type": "0x1::event::EventHandle<0x1::aptos_account::DirectCoinTransferConfigUpdatedEvent>"
                }
            ]
        }
    ]
} as const;

export default KOFI_LOTTERY_ABI;
