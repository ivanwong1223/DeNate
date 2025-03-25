import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import { DonorModel } from '@/models/User';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }
  
  try {
    await connectDB();
    const donor = await DonorModel.collection.findOne({
      walletAddress: { $regex: new RegExp(address, 'i') }
    });
    
    if (!donor) {
      return NextResponse.json({ username: null, avatar: null }, { status: 404 });
    }
    
    return NextResponse.json({ 
      username: donor.name,
      avatar: donor.avatar 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 