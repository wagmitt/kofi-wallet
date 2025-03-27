import { Account, Aptos, AptosConfig, Deserializer, Ed25519PrivateKey, Network, SimpleTransaction, AccountAuthenticator } from "@aptos-labs/ts-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Initialize Aptos client
    const config = new AptosConfig({
        network: Network.MAINNET // Change to proper network for your environment
    });
    const aptos = new Aptos(config);

    // Load sponsor account from environment variables
    const SPONSOR_PRIVATE_KEY = process.env.SPONSOR_PRIVATE_KEY!;
    const sponsorAccount = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(SPONSOR_PRIVATE_KEY) });

    try {
        const body = await req.json();
        console.log("Received request for transaction submission");

        const { serializedData } = body;

        if (!serializedData) {
            return NextResponse.json(
                { error: "Missing serialized data in request body" },
                { status: 400 }
            );
        }

        try {
            // Deserialize the data
            const bytes = Buffer.from(serializedData, 'base64');
            const deserializer = new Deserializer(bytes);

            // Deserialize transaction and authenticator
            const transaction = SimpleTransaction.deserialize(deserializer);
            const senderAuthenticator = deserializer.deserialize(AccountAuthenticator) as AccountAuthenticator;

            // Sign the transaction as fee payer
            const feePayerAuthenticator = aptos.transaction.signAsFeePayer({
                signer: sponsorAccount,
                transaction
            });

            console.log("Fee payer authenticator created");

            // Submit the transaction with both authenticators
            const result = await aptos.transaction.submit.simple({
                transaction,
                senderAuthenticator,
                feePayerAuthenticator
            });

            console.log("Transaction submitted:", result);

            return NextResponse.json({
                success: true,
                transactionHash: result.hash
            });
        } catch (txError) {
            console.error("Transaction error:", txError);
            return NextResponse.json(
                { error: "Transaction error: " + (txError instanceof Error ? txError.message : String(txError)) },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Server error: " + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
} 