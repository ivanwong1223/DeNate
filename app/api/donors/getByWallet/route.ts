import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import { DonorModel } from '@/models/User';

export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Extract wallet address from URL
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find donor by wallet address
    const donor = await DonorModel.findOne({ walletAddress });
    
    if (!donor) {
      return NextResponse.json(
        { error: 'donor not found' },
        { status: 404 }
      );
    }

    // Return only the necessary data
    return NextResponse.json({
      name: donor.name,
      avatar: donor.avatar,
      walletAddress: donor.walletAddress,
      createdAt: donor.createdAt
    });

  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}