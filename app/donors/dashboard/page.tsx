"use client";

import Link from "next/link"
// This is donors dashboard
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, History } from "lucide-react"
import { getDonorDashboardData } from "@/lib/mockData"
import { Donor } from "@/lib/types";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";
import { ethers } from "ethers"
import { charityCentral_ABI, charityCentral_CA, charityCampaigns_ABI } from "@/config/contractABI"

// For demo purposes, using a static donor ID - in a real app, this would come from authentication
const DEMO_DONOR_ID = "d1"

export default function DonorDashboardPage() {
  const { address, isConnected } = useAccount();
  const [campaignDetails, setCampaignDetails] = useState<any[]>([])
  const [orgData, setOrgData] = useState<Partial<Donor> | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const contractAddress = charityCentral_CA;
  const contractABI = charityCentral_ABI;
  const charityCampaignABI = [
    {
      inputs: [],
      name: 'getCampaignDetails',
      outputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'string', name: 'description', type: 'string' },
        { internalType: 'uint256', name: 'goal', type: 'uint256' },
        { internalType: 'uint256', name: 'totalDonated', type: 'uint256' },
        { internalType: 'uint8', name: 'state', type: 'uint8' },
        { internalType: 'address', name: 'charityAddress', type: 'address' }
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  useEffect(() => {

    // Fetch organization data by wallet address
    const fetchOrgData = async () => {
      try {
        const response = await fetch(`/api/donors/getByWallet?walletAddress=${address}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch organization data");
        }

        setOrgData(data);
      } catch (err) {
        console.error("Error fetching organization data:", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrgData();
  }, [address, isConnected]);

  // Fetch all organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations/getAllOrganizations"); // Assuming the endpoint is /api/organizations
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch organizations");
        }

        setOrganizations(data);
      } catch (err) {
        console.error("Error fetching organizations:", err);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchCampaignsDetails = async () => {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not detected. Please install a wallet.");
        return;
      }

      try {
        // Create provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Request wallet connection
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Get signer
        const signer = await provider.getSigner();

        // Instantiate charity central contract
        const centralContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Fetch campaign addresses
        const campaignAddresses = await centralContract.getAllCampaigns();

        // Fetch details for each campaign
        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            // Create contract instance for each campaign
            const campaignContract = new ethers.Contract(
              address,
              charityCampaignABI,
              signer
            );

            // Fetch campaign details
            const details = await campaignContract.getCampaignDetails();

            // Return details with the campaign address
            return {
              address,
              name: details[0],
              description: details[1],
              goal: ethers.formatUnits(details[2], 18), // Assuming ETH has 18 decimals
              totalDonated: ethers.formatUnits(details[3], 18),
              state: details[4],
              charityAddress: details[5]
            };
          })
        );

        // Filter only campaigns where state === 0 (convert BigInt to Number)
        const activeCampaigns = detailedCampaigns.filter((campaign) => Number(campaign.state) === 0);

        // Update state with detailed campaigns
        setCampaignDetails(activeCampaigns);
        console.log("Detailed Campaigns:", detailedCampaigns);

      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaignsDetails();
  }, []);

  // Get donor dashboard data from mockData
  const donorData = getDonorDashboardData(DEMO_DONOR_ID)

  if (!donorData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Donor not found</h1>
        <p className="text-muted-foreground">The donor dashboard you are looking for does not exist.</p>
      </div>
    )
  }

  const { donor, recentDonations, activeCampaigns, impactMetrics } = donorData

  // Function to get organization name by wallet address
  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return "Unknown Organization"; // Early return if no address or organizations
    const org = organizations.find((o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    return org?.name || walletAddress; // Return name if found, otherwise fallback to address
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative bg-[url('/donors.png')] bg-cover bg-center"
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12 items-center">
            {/* Avatar + Welcome Text */}
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                {orgData?.avatar ? (
                  <img
                    src={orgData.avatar}
                    alt="Organization Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-gray-500">
                    <span className="text-lg">?</span>
                  </div>
                )}
              </div>

              {/* Welcome Text */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Welcome, {orgData?.name}
                </h1>
                <p className="text-white text-opacity-90">
                  Track your donations, impact, and discover new opportunities to make a difference.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/donate">
                <Button>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Button>
              </Link>
              <Link href="/donors/settings">
                <Button variant="outline">Settings</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donor.totalDonated} ETH</div>
                <p className="text-xs text-muted-foreground">Across {donor.campaigns} campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{donor.rank}</div>
                <p className="text-xs text-muted-foreground">Top 1% of all donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">Currently supporting</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donor Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donor.badges.length}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {donor.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-8 lg:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
                <CardDescription>The difference your donations have made</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {impactMetrics.map((metric, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <h3 className="text-lg font-medium">{metric.metric}</h3>
                      <p className="text-3xl font-bold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Campaigns you're currently supporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignDetails.map((campaign, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getOrgNameByAddress(campaign.charityAddress)} {/* Display org name instead of address */}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{campaign.totalDonated} ETH</p>
                          <p className="text-sm text-muted-foreground">Your donation</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{campaign.totalDonated} ETH raised</span>
                          <span>{campaign.goal} ETH goal</span>
                        </div>
                        <Progress value={(campaign.totalDonated / campaign.goal) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/donate" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Campaigns
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Your recent contribution history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{donation.campaignTitle}</h3>
                        <p className="text-sm text-muted-foreground">{donation.organizationName}</p>
                        <p className="text-xs text-muted-foreground">{donation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{donation.amount} ETH</p>
                        <Badge variant="outline" className="mt-1">
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/donors/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

