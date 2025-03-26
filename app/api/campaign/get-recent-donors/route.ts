import { NextResponse } from "next/server";
import connectDB from "@/config/mongodb";
import { DonorModel } from "@/models/User";

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all donors with all fields
    const donors = await DonorModel.find({}).lean();

    return NextResponse.json(donors);
  } catch (error) {
    console.error("Failed to fetch donors:", error);
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 });
  }
}
