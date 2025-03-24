import mongoose, { Schema, Document } from 'mongoose';
import { User, Organization, Donor } from '@/lib/types';

// Base User Schema
const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: ['donor', 'organization'], required: true },
  createdAt: { type: String, default: new Date().toISOString() }
});

// Organization Schema (extends User)
const organizationSchema = new Schema<Organization>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: ['organization'], required: true },
  createdAt: { type: String, default: new Date().toISOString() },
  totalRaised: { type: Number, default: 0 },
  campaigns: { type: Number, default: 0 },
  donors: { type: Number, default: 0 },
  badges: [{ type: String }],
  website: { type: String },
  description: { type: String },
  walletAddress: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

// donor Schema (extends User)
const donorSchema = new Schema<Donor>({
  name: { type: String, required: true },
  type: { type: String, enum: ['donor'], required: true },
  avatar: { type: String, required: true },
  walletAddress: { type: String, required: true },
  createdAt: { type: String, default: new Date().toISOString() },
});

// Create models
export const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);
export const OrganizationModel = mongoose.models.Organization || mongoose.model<Organization>('Organization', organizationSchema);
export const DonorModel = mongoose.models.Donor || mongoose.model<Donor>('Donor', donorSchema);