import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import { DonorModel } from '@/models/User';
import { Donor } from '@/lib/types';

export async function POST(request: Request) {
    try {
        // Connect to MongoDB
        await connectDB();

        // Get request body
        const body = await request.json();
        const { name, avatar, walletAddress } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Create new donor
        const donor: Partial<Donor> = {
            name,
            type: 'donor',
            walletAddress,
            avatar,
            createdAt: new Date().toISOString(),
        };

        const newDonor = await DonorModel.create(donor);

        return NextResponse.json(
            { message: 'Donor registered successfully', donor: newDonor },
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