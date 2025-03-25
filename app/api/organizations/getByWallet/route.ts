import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import { OrganizationModel } from '@/models/User';

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

    // Find organization by wallet address
    const organization = await OrganizationModel.findOne({ walletAddress });
    
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Return only the necessary data
    return NextResponse.json({
      name: organization.name,
      description: organization.description || '',
      email: organization.email,
      website: organization.website || '',
      walletAddress: organization.walletAddress,
      verified: organization.verified || false,
      createdAt: organization.createdAt
    });

  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}