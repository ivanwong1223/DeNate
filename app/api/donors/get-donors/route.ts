import { NextResponse } from "next/server";
import connectDB from "@/config/mongodb";
import { DonorModel } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const donors = await DonorModel.find({}, "walletAddress").lean();
    return NextResponse.json(donors);
  } catch (error) {
    console.error("Failed to fetch donors:", error);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}