"use client";

import Link from "next/link"
// This is donors dashboard
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, History } from "lucide-react"
import { getDonorDashboardData, getLeaderboard } from "@/lib/mockData"
import { Donor } from "@/lib/types";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";
import { ethers } from "ethers"
import { charityCentral_ABI, charityCentral_CA, charityCampaigns_ABI } from "@/config/contractABI"
import DonorChatbot from "@/components/dashboard/DonorChatbot"

interface Campaign {
  address: string;
  name: string;
  description: string;
  imageURI: string;
  goal: string;
  totalDonated: string;
  state: number;
  charityAddress: string;
  donors: number;
  daysLeft: number;
  images?: string[];
}

// For demo purposes, using a static donor ID - in a real app, this would come from authentication
const DEMO_DONOR_ID = "d1"

export default function DonorDashboardPage() {
  const { address, isConnected } = useAccount();
  const [campaignDetails, setCampaignDetails] = useState<any[]>([])
  const [orgData, setOrgData] = useState<Partial<Donor> | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("all-time");
  const [userLeaderboardInfo, setUserLeaderboardInfo] = useState<{ rank: number | string; amount: string }>({
    rank: "unranked",
    amount: "0",
  });

  const contractAddress = charityCentral_CA;
  const contractABI = charityCentral_ABI;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        // Find if current user is in leaderboard
        const found = leaderboardData.find((donor: any) =>
          donor.address.toLowerCase() === address?.toLowerCase()
        );

        if (found) {
          setUserLeaderboardInfo({
            rank: found.rank,
            amount: ethers.formatUnits(found.amount, 18),
          });
        } else {
          setUserLeaderboardInfo({ rank: "unranked", amount: "0" });
        }

      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    if (address) {
      fetchLeaderboard();
    }
  }, [timeframe, address]);

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

        const campaignInterface = new ethers.Interface(charityCampaigns_ABI);

        // Fetch details for each campaign
        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            // Create contract instance for each campaign
            const campaignContract = new ethers.Contract(
              address,
              campaignInterface,
              signer
            );

            // Fetch campaign details
            const details = await campaignContract.getCampaignDetails();

            // Return details with the campaign address
            return {
              name: details._name,
              description: details._description,
              imageURI: details._campaignImageURI || '',
              goal: ethers.formatEther(details._goal),
              totalDonated: ethers.formatEther(details._totalDonated),
              state: Number(details._state),
              charityAddress: details._charityAddress,
              donors: Math.floor(Math.random() * 100), // Placeholder value
              daysLeft: Math.floor(Math.random() * 50), // Placeholder value
              images: [],
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
  const activeCampaignCount = campaignDetails.length;

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
                <div className="text-2xl font-bold">{userLeaderboardInfo.amount} ETH</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userLeaderboardInfo.rank === "unranked" ? "Unranked" : `#${userLeaderboardInfo.rank}`}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCampaignCount}</div>
                <p className="text-xs text-muted-foreground">Currently supporting</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donor Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Campaigns that are currently active</CardDescription>
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
          </div>
        </div>
      </section>

      {/* Add the DonorChatbot at the end of the return statement */}
      {isConnected && address && (
        <DonorChatbot
          donorName={orgData?.name || donor.name || "Donor"}
          walletAddress={address}
          totalDonated={userLeaderboardInfo.amount}
          donationsCount={recentDonations.length}
          recentDonations={recentDonations.map(donation => ({
            campaignId: donation.campaignId,
            campaignName: donation.campaignTitle,
            amount: donation.amount.toString(),
            date: donation.date
          }))}
        />
      )}
    </div>
  )
}

