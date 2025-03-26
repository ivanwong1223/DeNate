import { NextResponse } from "next/server";
import connectDB from "@/config/mongodb";
import { OrganizationModel } from "@/models/User";

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all organizations with all fields
    const organizations = await OrganizationModel.find({}).lean();

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}
