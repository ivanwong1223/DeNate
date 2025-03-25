import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { charityCentral_CA, charityCentral_ABI } from "@/config/contractABI";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, walletAddress } = body;

        // Validate inputs
        if (!name || !walletAddress) {
            return NextResponse.json({ error: "Missing organization name or wallet address" }, { status: 400 });
        }

        // Setup Provider and Signer (Backend Wallet)
        const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io/");
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider); // Ensure PRIVATE_KEY is in your .env file

        // Connect contract with Signer (to send transactions)
        const contract = new ethers.Contract(charityCentral_CA, charityCentral_ABI, signer);

        // Call verifyCharity on the contract
        const tx = await contract.verifyCharity(walletAddress, name);
        console.log("Transaction sent:", tx.hash);

        // Wait for confirmation
        await tx.wait();
        console.log("Transaction confirmed:", tx.hash);

        return NextResponse.json({ success: true, txHash: tx.hash }, { status: 200 });

    } catch (error: unknown) {
        console.error("Transaction error:", error);
        return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
}