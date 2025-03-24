import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import { OrganizationModel } from '@/models/User';
import { Organization } from '@/lib/types';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const body = await request.json();
    const { name, email, website, description, walletAddress, agreeToTerms } = body;

    // Validate required fields
    if (!name || !email || !walletAddress) {
      return NextResponse.json(
        { error: 'Name, email, and wallet address are required' },
        { status: 400 }
      );
    }

    // Check if terms are agreed to
    if (!agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms of service and privacy policy' },
        { status: 400 }
      );
    }

    // Check if organization already exists
    const existingOrg = await OrganizationModel.findOne({ email });
    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization with this email already exists' },
        { status: 400 }
      );
    }

    // Create new organization
    const organization: Partial<Organization> = {
      name,
      email,
      type: 'organization',
      website,
      description,
      walletAddress,
      createdAt: new Date().toISOString(),
      totalRaised: 0,
      campaigns: 0,
      donors: 0,
      badges: [],
      verified: false
    };

    const newOrganization = await OrganizationModel.create(organization);

    return NextResponse.json(
      { message: 'Organization registered successfully', organization: newOrganization },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}