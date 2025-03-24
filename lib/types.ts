// User Types
export interface User {
  id: string
  name: string
  email: string
  type: "donor" | "organization"
  createdAt: string
}

export interface Donor extends User {
  type: "donor"
  totalDonated: number
  campaigns: number
  rank: number
  badges: string[]
  avatar: string
  walletAddress: string
}

export interface Organization extends User {
  type: "organization"
  totalRaised: number
  campaigns: number
  donors: number
  badges: string[]
  website?: string
  description?: string
  walletAddress: string
  verified: boolean
}

// Campaign Types
export interface Campaign {
  id: string
  title: string
  organization: string
  organizationId: string
  description: string
  longDescription?: string
  raised: number
  goal: number
  donors: number
  daysLeft: number
  image: string
  categories: string[]
  startDate: string
  endDate: string
  createdAt: string
  status: "active" | "completed" | "pending"
}

export interface CampaignDetail extends Campaign {
  milestones: Milestone[]
  updates: Update[]
  recentDonors: DonationRecord[]
}

// Milestone Types
export interface Milestone {
  id: string
  campaignId: string
  title: string
  description: string
  amount: number
  status: "pending" | "completed" | "failed"
  completedDate?: string
}

// Update Types
export interface Update {
  id: string
  campaignId: string
  title: string
  content: string
  date: string
}

// Donation Types
export interface DonationRecord {
  id: string
  donorId: string
  donorName: string
  campaignId: string
  campaignTitle: string
  organizationId: string
  organizationName: string
  amount: number
  date: string
  status: "pending" | "confirmed" | "failed"
  transactionHash?: string
}

// Testimonial Type
export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
  rating: number
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  amount: number
  campaigns: number
  badges: string[]
}

export interface OrganizationLeaderboardEntry {
  rank: number
  id: string
  name: string
  raised: number
  campaigns: number
  donors: number
  badges: string[]
}

// Impact Metrics
export interface ImpactMetric {
  metric: string
  value: string
}

// Dashboard Data Types
export interface DonorDashboardData {
  donor: Donor
  recentDonations: DonationRecord[]
  activeCampaigns: Campaign[]
  impactMetrics: ImpactMetric[]
}

export interface OrganizationDashboardData {
  organization: Organization
  activeCampaigns: Campaign[]
  recentDonations: DonationRecord[]
}

