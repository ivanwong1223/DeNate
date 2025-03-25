import type {
  Campaign,
  CampaignDetail,
  Donor,
  DonationRecord,
  Organization,
  LeaderboardEntry,
  OrganizationLeaderboardEntry,
  DonorDashboardData,
  OrganizationDashboardData,
  ImpactMetric,
  Milestone,
  Update,
  Testimonial,
} from "./types"

// Mock Donors
export const mockDonors: Donor[] = [
  {
    id: "d1",
    name: "John Smith",
    email: "john@example.com",
    type: "donor",
    totalDonated: 120,
    campaigns: 8,
    rank: 1,
    badges: ["Platinum Donor", "Early Supporter"],
    createdAt: "2023-01-15",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d2",
    name: "Emily Davis",
    email: "emily@example.com",
    type: "donor",
    totalDonated: 85,
    campaigns: 5,
    rank: 2,
    badges: ["Gold Donor"],
    createdAt: "2023-02-10",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d3",
    name: "Robert Wilson",
    email: "robert@example.com",
    type: "donor",
    totalDonated: 62,
    campaigns: 4,
    rank: 3,
    badges: ["Silver Donor", "Consistent Giver"],
    createdAt: "2023-01-20",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d4",
    name: "Lisa Thompson",
    email: "lisa@example.com",
    type: "donor",
    totalDonated: 45,
    campaigns: 3,
    rank: 4,
    badges: ["Bronze Donor"],
    createdAt: "2023-03-05",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d5",
    name: "Michael Chen",
    email: "michael@example.com",
    type: "donor",
    totalDonated: 38,
    campaigns: 6,
    rank: 5,
    badges: ["Bronze Donor", "Diverse Supporter"],
    createdAt: "2023-02-18",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d6",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    type: "donor",
    totalDonated: 32,
    campaigns: 4,
    rank: 6,
    badges: ["Bronze Donor"],
    createdAt: "2023-03-22",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d7",
    name: "David Rodriguez",
    email: "david@example.com",
    type: "donor",
    totalDonated: 28,
    campaigns: 3,
    rank: 7,
    badges: ["Bronze Donor"],
    createdAt: "2023-04-10",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d8",
    name: "Emma Williams",
    email: "emma@example.com",
    type: "donor",
    totalDonated: 25,
    campaigns: 5,
    rank: 8,
    badges: ["Bronze Donor", "Diverse Supporter"],
    createdAt: "2023-03-15",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d9",
    name: "James Brown",
    email: "james@example.com",
    type: "donor",
    totalDonated: 22,
    campaigns: 2,
    rank: 9,
    badges: ["Bronze Donor"],
    createdAt: "2023-04-05",
    avatar: "",
    walletAddress: "",
  },
  {
    id: "d10",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    type: "donor",
    totalDonated: 20,
    campaigns: 3,
    rank: 10,
    badges: ["Bronze Donor"],
    createdAt: "2023-04-18",
    avatar: "",
    walletAddress: "",
  },
]

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: "o1",
    name: "Global Water Foundation",
    email: "contact@gwf.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 320,
    campaigns: 4,
    donors: 450,
    badges: ["Verified", "Top Performer"],
    verified: true,
    website: "https://globalwaterfoundation.org",
    description: "Providing clean water access to communities in need through sustainable infrastructure projects.",
    createdAt: "2022-10-15",
  },
  {
    id: "o2",
    name: "Education First",
    email: "info@educationfirst.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 280,
    campaigns: 3,
    donors: 380,
    badges: ["Verified"],
    verified: true,
    website: "https://educationfirst.org",
    description: "Building schools and providing educational resources for underprivileged children worldwide.",
    createdAt: "2022-11-20",
  },
  {
    id: "o3",
    name: "Emergency Response Network",
    email: "help@ern.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 210,
    campaigns: 5,
    donors: 320,
    badges: ["Verified", "Rapid Response"],
    verified: true,
    website: "https://emergencyresponsenetwork.org",
    description: "Providing immediate assistance to communities affected by natural disasters and humanitarian crises.",
    createdAt: "2022-09-05",
  },
  {
    id: "o4",
    name: "Nature Preservation Alliance",
    email: "info@naturealliance.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 185,
    campaigns: 2,
    donors: 290,
    badges: ["Verified"],
    verified: true,
    website: "https://naturealliance.org",
    description:
      "Protecting endangered species and their habitats through conservation efforts and community engagement.",
    createdAt: "2022-12-10",
  },
  {
    id: "o5",
    name: "Children's Health Initiative",
    email: "contact@childhealth.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 160,
    campaigns: 3,
    donors: 240,
    badges: ["Verified"],
    verified: true,
    website: "https://childrenshealthinitiative.org",
    description: "Improving healthcare access and outcomes for children in underserved communities.",
    createdAt: "2023-01-15",
  },
  {
    id: "o6",
    name: "Community Development Fund",
    email: "info@communityfund.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 140,
    campaigns: 4,
    donors: 210,
    badges: ["Verified"],
    verified: true,
    website: "https://communitydevelopmentfund.org",
    description: "Supporting local initiatives to strengthen communities and improve quality of life.",
    createdAt: "2023-02-20",
  },
  {
    id: "o7",
    name: "Hunger Relief Project",
    email: "contact@hungerrelief.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 125,
    campaigns: 2,
    donors: 180,
    badges: ["Verified"],
    verified: true,
    website: "https://hungerreliefproject.org",
    description: "Combating food insecurity through sustainable food systems and emergency relief.",
    createdAt: "2023-01-05",
  },
  {
    id: "o8",
    name: "Renewable Energy Coalition",
    email: "info@renewablecoalition.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 110,
    campaigns: 3,
    donors: 150,
    badges: ["Verified"],
    verified: true,
    website: "https://renewableenergycoalition.org",
    description: "Promoting clean energy solutions and sustainable practices to combat climate change.",
    createdAt: "2023-03-10",
  },
  {
    id: "o9",
    name: "Mental Health Awareness",
    email: "contact@mentalhealthawareness.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 95,
    campaigns: 2,
    donors: 130,
    badges: ["Verified"],
    verified: true,
    website: "https://mentalhealthawareness.org",
    description: "Raising awareness and providing resources for mental health support and treatment.",
    createdAt: "2023-02-15",
  },
  {
    id: "o10",
    name: "Animal Welfare Society",
    email: "info@animalwelfare.org",
    type: "organization",
    walletAddress: "",
    totalRaised: 85,
    campaigns: 3,
    donors: 120,
    badges: ["Verified"],
    verified: true,
    website: "https://animalwelfaresociety.org",
    description: "Protecting and caring for animals through rescue operations, shelters, and advocacy.",
    createdAt: "2023-03-20",
  },
]

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    title: "Clean Water Initiative",
    organization: "Global Water Foundation",
    organizationId: "o1",
    description: "Providing clean water access to communities in need through sustainable infrastructure projects.",
    raised: 85,
    goal: 100,
    donors: 128,
    daysLeft: 15,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Infrastructure", "Health"],
    startDate: "2023-05-15",
    endDate: "2023-07-15",
    createdAt: "2023-05-10",
    status: "active",
  },
  {
    id: "c2",
    title: "Education for All",
    organization: "Education First",
    organizationId: "o2",
    description: "Building schools and providing educational resources for underprivileged children worldwide.",
    raised: 120,
    goal: 200,
    donors: 215,
    daysLeft: 30,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Education", "Children"],
    startDate: "2023-05-01",
    endDate: "2023-08-01",
    createdAt: "2023-04-25",
    status: "active",
  },
  {
    id: "c3",
    title: "Disaster Relief Fund",
    organization: "Emergency Response Network",
    organizationId: "o3",
    description: "Providing immediate assistance to communities affected by natural disasters and humanitarian crises.",
    raised: 45,
    goal: 150,
    donors: 78,
    daysLeft: 7,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Emergency", "Humanitarian"],
    startDate: "2023-06-01",
    endDate: "2023-07-01",
    createdAt: "2023-05-28",
    status: "active",
  },
  {
    id: "c4",
    title: "Wildlife Conservation",
    organization: "Nature Preservation Alliance",
    organizationId: "o4",
    description:
      "Protecting endangered species and their habitats through conservation efforts and community engagement.",
    raised: 65,
    goal: 120,
    donors: 92,
    daysLeft: 22,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Environment", "Conservation"],
    startDate: "2023-05-20",
    endDate: "2023-07-20",
    createdAt: "2023-05-15",
    status: "active",
  },
  {
    id: "c5",
    title: "Water Purification Systems",
    organization: "Global Water Foundation",
    organizationId: "o1",
    description: "Installing water purification systems in regions with contaminated water sources.",
    raised: 45,
    goal: 150,
    donors: 72,
    daysLeft: 30,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Infrastructure", "Health", "Technology"],
    startDate: "2023-06-01",
    endDate: "2023-08-01",
    createdAt: "2023-05-25",
    status: "active",
  },
  {
    id: "c6",
    title: "Community Wells Project",
    organization: "Global Water Foundation",
    organizationId: "o1",
    description: "Building community wells to provide sustainable water access in rural areas.",
    raised: 120,
    goal: 120,
    donors: 210,
    daysLeft: 0,
    image: "/placeholder.svg?height=200&width=400",
    categories: ["Infrastructure", "Community"],
    startDate: "2023-04-01",
    endDate: "2023-06-01",
    createdAt: "2023-03-25",
    status: "completed",
  },
]

// Mock Milestones
export const mockMilestones: Milestone[] = [
  // Clean Water Initiative Milestones
  {
    id: "m1",
    campaignId: "c1",
    title: "Initial Assessment",
    description: "Fund initial site assessments and community consultations",
    amount: 25,
    status: "completed",
  },
  {
    id: "m2",
    campaignId: "c1",
    title: "Equipment Purchase",
    description: "Purchase water filtration systems and construction materials",
    amount: 50,
    status: "completed",
  },
  {
    id: "m3",
    campaignId: "c1",
    title: "Construction Phase",
    description: "Begin construction of water wells and distribution systems",
    amount: 75,
    status: "completed",
  },
  {
    id: "m4",
    campaignId: "c1",
    title: "Project Completion",
    description: "Complete construction and implement education programs",
    amount: 100,
    status: "pending",
  },

  // Water Purification Systems Milestones
  {
    id: "m5",
    campaignId: "c5",
    title: "Research & Planning",
    description: "Research appropriate purification technologies and develop implementation plan",
    amount: 30,
    status: "completed",
  },
  {
    id: "m6",
    campaignId: "c5",
    title: "Equipment Acquisition",
    description: "Purchase purification systems and necessary components",
    amount: 60,
    status: "completed",
  },
  {
    id: "m7",
    campaignId: "c5",
    title: "Installation Phase",
    description: "Install purification systems in target communities",
    amount: 90,
    status: "pending",
  },
  {
    id: "m8",
    campaignId: "c5",
    title: "Training & Handover",
    description: "Train community members on system maintenance and complete project handover",
    amount: 150,
    status: "pending",
  },

  // Community Wells Project Milestones
  {
    id: "m9",
    campaignId: "c6",
    title: "Site Selection",
    description: "Identify optimal locations for community wells",
    amount: 30,
    status: "completed",
  },
  {
    id: "m10",
    campaignId: "c6",
    title: "Drilling Operations",
    description: "Conduct drilling operations at selected sites",
    amount: 60,
    status: "completed",
  },
  {
    id: "m11",
    campaignId: "c6",
    title: "Well Construction",
    description: "Complete well construction and water access points",
    amount: 90,
    status: "completed",
  },
  {
    id: "m12",
    campaignId: "c6",
    title: "Community Training",
    description: "Train community members on well maintenance and water management",
    amount: 120,
    status: "completed",
  },
]

// Mock Updates
export const mockUpdates: Update[] = [
  {
    id: "u1",
    campaignId: "c1",
    title: "Project Kickoff",
    content: "We've officially launched the Clean Water Initiative with community meetings in target regions.",
    date: "2023-03-15",
  },
  {
    id: "u2",
    campaignId: "c1",
    title: "Assessment Complete",
    content: "Our team has completed the initial assessment of water needs in 5 communities.",
    date: "2023-04-10",
  },
  {
    id: "u3",
    campaignId: "c1",
    title: "Equipment Delivered",
    content: "All necessary equipment has been delivered to the project sites and construction will begin next week.",
    date: "2023-05-22",
  },
  {
    id: "u4",
    campaignId: "c5",
    title: "Technology Selection Complete",
    content:
      "After thorough research, we've selected the most appropriate water purification technology for the target regions.",
    date: "2023-06-05",
  },
  {
    id: "u5",
    campaignId: "c5",
    title: "Equipment Ordered",
    content: "We've placed orders for all necessary purification equipment and expect delivery within two weeks.",
    date: "2023-06-15",
  },
  {
    id: "u6",
    campaignId: "c6",
    title: "Project Complete",
    content:
      "We're thrilled to announce that all community wells have been successfully constructed and are now operational!",
    date: "2023-06-01",
  },
]

// Mock Donations
export const mockDonations: DonationRecord[] = [
  {
    id: "don1",
    donorId: "d6",
    donorName: "Sarah Johnson",
    campaignId: "c1",
    campaignTitle: "Clean Water Initiative",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 10,
    date: "2023-05-30",
    status: "confirmed",
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
  {
    id: "don2",
    donorId: "d5",
    donorName: "Michael Chen",
    campaignId: "c1",
    campaignTitle: "Clean Water Initiative",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 2.5,
    date: "2023-05-29",
    status: "confirmed",
    transactionHash: "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef",
  },
  {
    id: "don3",
    donorId: "d8",
    donorName: "Emma Williams",
    campaignId: "c6",
    campaignTitle: "Community Wells Project",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 7,
    date: "2023-05-28",
    status: "confirmed",
    transactionHash: "0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef",
  },
  {
    id: "don4",
    donorId: "d7",
    donorName: "David Rodriguez",
    campaignId: "c5",
    campaignTitle: "Water Purification Systems",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 3,
    date: "2023-05-27",
    status: "confirmed",
    transactionHash: "0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef",
  },
  {
    id: "don5",
    donorId: "d1",
    donorName: "John Smith",
    campaignId: "c1",
    campaignTitle: "Clean Water Initiative",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 15,
    date: "2023-06-01",
    status: "confirmed",
    transactionHash: "0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef",
  },
  {
    id: "don6",
    donorId: "d1",
    donorName: "John Smith",
    campaignId: "c2",
    campaignTitle: "Education for All",
    organizationId: "o2",
    organizationName: "Education First",
    amount: 10,
    date: "2023-05-15",
    status: "confirmed",
    transactionHash: "0x6789012345abcdef6789012345abcdef6789012345abcdef6789012345abcdef",
  },
  {
    id: "don7",
    donorId: "d1",
    donorName: "John Smith",
    campaignId: "c3",
    campaignTitle: "Disaster Relief Fund",
    organizationId: "o3",
    organizationName: "Emergency Response Network",
    amount: 20,
    date: "2023-04-22",
    status: "confirmed",
    transactionHash: "0x7890123456abcdef7890123456abcdef7890123456abcdef7890123456abcdef",
  },
  {
    id: "don8",
    donorId: "d1",
    donorName: "John Smith",
    campaignId: "c4",
    campaignTitle: "Wildlife Conservation",
    organizationId: "o4",
    organizationName: "Nature Preservation Alliance",
    amount: 5,
    date: "2023-05-10",
    status: "confirmed",
    transactionHash: "0x8901234567abcdef8901234567abcdef8901234567abcdef8901234567abcdef",
  },
  {
    id: "don9",
    donorId: "d0",
    donorName: "Anonymous",
    campaignId: "c1",
    campaignTitle: "Clean Water Initiative",
    organizationId: "o1",
    organizationName: "Global Water Foundation",
    amount: 5,
    date: "2023-06-01",
    status: "confirmed",
    transactionHash: "0x9012345678abcdef9012345678abcdef9012345678abcdef9012345678abcdef",
  },
]

// Mock Leaderboard Data with avatar
export const mockLeaderboard: LeaderboardDonor[] = mockDonors.map((donor) => ({
  rank: donor.rank,
  id: donor.id,
  name: donor.name,
  amount: donor.totalDonated,
  campaigns: donor.campaigns,
  badges: donor.badges,
  avatar: donor.avatar
}));

export const mockOrganizationLeaderboard: OrganizationLeaderboardEntry[] = mockOrganizations.map((org, index) => ({
  rank: index + 1,
  id: org.id,
  name: org.name,
  raised: org.totalRaised,
  campaigns: org.campaigns,
  donors: org.donors,
  badges: org.badges,
}))

// Mock Impact Metrics
export const mockImpactMetrics: ImpactMetric[] = [
  { metric: "Lives Impacted", value: "1,200+" },
  { metric: "Communities Served", value: "8" },
  { metric: "Projects Completed", value: "5" },
  { metric: "Ongoing Projects", value: "3" },
]

// Helper function to get campaign details
export const getCampaignDetails = (campaignId: string): CampaignDetail | undefined => {
  const campaign = mockCampaigns.find((c) => c.id === campaignId)
  if (!campaign) return undefined

  return {
    ...campaign,
    milestones: mockMilestones.filter((m) => m.campaignId === campaignId),
    updates: mockUpdates.filter((u) => u.campaignId === campaignId),
    recentDonors: mockDonations
      .filter((d) => d.campaignId === campaignId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  }
}

// Helper function to get donor dashboard data
export const getDonorDashboardData = (donorId: string): DonorDashboardData | undefined => {
  const donor = mockDonors.find((d) => d.id === donorId)
  if (!donor) return undefined

  const recentDonations = mockDonations
    .filter((d) => d.donorId === donorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const donatedCampaignIds = new Set(recentDonations.map((d) => d.campaignId))
  const activeCampaigns = mockCampaigns
    .filter((c) => donatedCampaignIds.has(c.id) && c.status === "active")
    .map((campaign) => ({
      ...campaign,
      donated: recentDonations.filter((d) => d.campaignId === campaign.id).reduce((sum, d) => sum + d.amount, 0),
    }))

  return {
    donor,
    recentDonations,
    activeCampaigns,
    impactMetrics: mockImpactMetrics,
  }
}

// Helper function to get organization dashboard data
export const getOrganizationDashboardData = (organizationId: string): OrganizationDashboardData | undefined => {
  const organization = mockOrganizations.find((o) => o.id === organizationId)
  if (!organization) return undefined

  const activeCampaigns = mockCampaigns
    .filter((c) => c.organizationId === organizationId)
    .map((campaign) => ({
      ...campaign,
      milestones: mockMilestones.filter((m) => m.campaignId === campaign.id),
    }))

  const recentDonations = mockDonations
    .filter((d) => d.organizationId === organizationId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    organization,
    activeCampaigns,
    recentDonations,
  }
}

// Export a function to get a campaign by ID
export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find((campaign) => campaign.id === id)
}

// Export a function to get a donor by ID
export const getDonorById = (id: string): Donor | undefined => {
  return mockDonors.find((donor) => donor.id === id)
}

// Export a function to get an organization by ID
export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find((org) => org.id === id)
}

// Export a function to get donations by campaign ID
export const getDonationsByCampaignId = (campaignId: string): DonationRecord[] => {
  return mockDonations.filter((donation) => donation.campaignId === campaignId)
}

// Export a function to get donations by donor ID
export const getDonationsByDonorId = (donorId: string): DonationRecord[] => {
  return mockDonations.filter((donation) => donation.donorId === donorId)
}

// Export a function to get donations by organization ID
export const getDonationsByOrganizationId = (organizationId: string): DonationRecord[] => {
  return mockDonations.filter((donation) => donation.organizationId === organizationId)
}

// Export a function to get active campaigns
export const getActiveCampaigns = (): Campaign[] => {
  return mockCampaigns.filter((campaign) => campaign.status === "active")
}

// Export a function to get completed campaigns
export const getCompletedCampaigns = (): Campaign[] => {
  return mockCampaigns.filter((campaign) => campaign.status === "completed")
}

// Export a function to get campaigns by organization ID
export const getCampaignsByOrganizationId = (organizationId: string): Campaign[] => {
  return mockCampaigns.filter((campaign) => campaign.organizationId === organizationId)
}

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    role: "Donor",
    content: "DeNate has transformed how I give to charity. The transparency gives me confidence that my donations are making a real impact. Being able to track progress and see milestones completed is incredible!",
    avatar: "/avatars/avatar-1.jpg",
    rating: 5
  },
  {
    id: "t2",
    name: "Michael Chen",
    role: "Regular Donor",
    content: "As someone who donates regularly, I've always worried about where my money actually goes. With DeNate's blockchain verification, I can finally see the real impact of every dollar I contribute.",
    avatar: "/avatars/avatar-2.jpg",
    rating: 5
  },
  {
    id: "t3",
    name: "Emily Davis",
    role: "Volunteer",
    content: "The transparency that DeNate provides has brought a new level of trust to charitable giving. I've seen firsthand how this platform bridges the gap between donors and the communities they're helping.",
    avatar: "/avatars/avatar-3.jpg",
    rating: 4
  },
  {
    id: "t4",
    name: "David Rodriguez",
    role: "Organization Director",
    content: "DeNate has revolutionized how our organization handles donations. The smart contract system ensures we're accountable, while the milestone tracking helps us communicate our impact effectively.",
    avatar: "/avatars/avatar-4.jpg",
    rating: 5
  },
  {
    id: "t5",
    name: "Lisa Thompson",
    role: "Community Leader",
    content: "Our community has benefited enormously from projects funded through DeNate. The platform's transparency has attracted more donors and allowed us to complete projects that would have been impossible otherwise.",
    avatar: "/avatars/avatar-5.jpg",
    rating: 5
  }
];

// Export a function to get all testimonials
export const getTestimonials = (): Testimonial[] => {
  return mockTestimonials;
}

type GraphDonor = {
  address: string;
  totalDonated: string;
}

type LeaderboardDonor = {
  rank: number;
  name: string | null;
  amount: number;
  avatar?: string;
}

async function getUsernameFromDB(address: string): Promise<{ username: string | null; avatar?: string }> {
  try {
    const origin = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${origin}/api/users?address=${encodeURIComponent(address)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // User not found, return shortened wallet address instead
        return { 
          username: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          avatar: undefined
        };
      }
      return { username: null, avatar: undefined };
    }
    
    const data = await response.json();
    return { 
      username: data.username || `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      avatar: data.avatar
    };
  } catch (error) {
    console.error('Error fetching username:', error);
    return { 
      username: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      avatar: undefined 
    };
  }
}

async function fetchOverallLeaderboard(): Promise<GraphDonor[]> {
  try {
    const response = await fetch('https://api.studio.thegraph.com/query/105145/denate/version/latest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GlobalLeaderboard {
            donors(orderBy: totalDonated, orderDirection: desc, first: 100) {
              address
              totalDonated
            }
          }
        `
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from The Graph');
    }

    const data = await response.json();
    return data.data.donors;
  } catch (error) {
    console.error('Error fetching from The Graph:', error);
    return [];
  }
}


export async function getLeaderboard(): Promise<LeaderboardDonor[]> {
  try {
    const graphDonors = await fetchOverallLeaderboard();
    
    if (graphDonors && graphDonors.length > 0) {
      const leaderboardEntries = await Promise.all(
        graphDonors.map(async (donor, index) => {
          const { username, avatar } = await getUsernameFromDB(donor.address);
          const amountInWei = BigInt(donor.totalDonated);
          
          return {
            rank: index + 1,
            name: username,
            amount: Number(amountInWei),
            avatar: avatar,
            address: donor.address 
          };
        })
      );
      
      return leaderboardEntries;
    } else {
      console.log("Falling back to mock leaderboard data");
      return mockLeaderboard.map(entry => ({
        rank: entry.rank,
        name: entry.name,
        amount: entry.amount * 1000000000000000000, 
        avatar: entry.avatar,
        address: "" 
      }));
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return mockLeaderboard.map(entry => ({
      rank: entry.rank,
      name: entry.name,
      amount: entry.amount * 1000000000000000000, 
      avatar: entry.avatar,
      address: "" 
    }));
  }
}

