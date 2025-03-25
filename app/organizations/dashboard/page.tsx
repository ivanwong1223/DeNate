"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Settings, Users, Clock } from "lucide-react";
import { Organization } from "@/lib/types";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { getOrganizationDashboardData } from "@/lib/mockData";
import { useAccount } from "wagmi";
import { charityCentral_CA, charityCentral_ABI, charityCampaigns_ABI } from "@/config/contractABI";
import { ethers } from "ethers";

// Campaign interface based on the contract structure
interface Campaign {
  id: string;
  address: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  daysLeft: number;
  donors: number;
  milestones?: {
    title: string;
    amount: string;
    status: string;
  }[];
}

export default function OrganizationDashboardPage() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgData, setOrgData] = useState<Partial<Organization> | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Get org data from database
  useEffect(() => {
    // Get wallet address from connected wallet
    if (!isConnected || !address) {
      setError("No wallet connected. Please connect your wallet.");
      setLoading(false);
      return;
    }
    
    // Fetch organization data by wallet address
    const fetchOrgData = async () => {
      try {
        const response = await fetch(`/api/organizations/getByWallet?walletAddress=${address}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch organization data");
        }
        
        setOrgData(data);
      } catch (err) {
        console.error("Error fetching organization data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch organization data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrgData();
  }, [address, isConnected]);

  // Get campaign data from smart contract
  useEffect(() => {
    if (!address || !isConnected || !orgData) return;

    const fetchCampaignData = async () => {
      setCampaignsLoading(true);
      try {
        // Connect to provider - updated for ethers v6
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Create contract instances
        const centralContract = new ethers.Contract(
          charityCentral_CA,
          charityCentral_ABI,
          provider
        );
        
        // Get charity campaigns
        const campaignAddresses = await centralContract.getCharityCampaigns(address);
        
        if (campaignAddresses.length === 0) {
          setCampaigns([]);
          setCampaignsLoading(false);
          return;
        }
        
        // Fetch details for each campaign
        const campaignDetailsPromises = campaignAddresses.map(async (campaignAddress: string) => {
          const campaignContract = new ethers.Contract(
            campaignAddress,
            charityCampaigns_ABI[0], // Using the first ABI in the array
            provider
          );
          
          // Call getCampaignDetails
          const details = await campaignContract.getCampaignDetails();
          
          // Get total donated
          const totalDonated = await campaignContract.totalDonated();
          
          // Create a campaign object with the retrieved data
          return {
            id: campaignAddress,
            address: campaignAddress,
            title: details._name,
            description: details._description,
            goal: ethers.formatEther(details._goal),
            raised: ethers.formatEther(totalDonated),
            daysLeft: 30, // Default value
            donors: 0, // Will fetch separately
            state: details._state
          };
        });
        
        const campaignDetails = await Promise.all(campaignDetailsPromises);
        
        // Fetch additional details for each campaign
        const enhancedCampaignsPromises = campaignDetails.map(async (campaign) => {
          const campaignContract = new ethers.Contract(
            campaign.address,
            charityCampaigns_ABI[0],
            provider
          );
          
          // Get donor count
          try {
            const donors = await campaignContract.getAllDonors();
            campaign.donors = donors.length;
          } catch (error) {
            console.error("Error fetching donors for campaign:", error);
          }
          
          // Get milestones
          try {
            const milestones = await campaignContract.getMilestones();
            campaign.milestones = milestones.targets.map((target: bigint, index: number) => ({
              title: `Milestone ${index + 1}`,
              amount: ethers.formatEther(target),
              status: milestones.reached[index] ? "completed" : "pending"
            }));
          } catch (error) {
            console.error("Error fetching milestones for campaign:", error);
          }
          
          return campaign;
        });
        
        const enhancedCampaigns = await Promise.all(enhancedCampaignsPromises);
        setCampaigns(enhancedCampaigns);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setCampaignsLoading(false);
      }
    };
    
    fetchCampaignData();
  }, [address, isConnected, orgData]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Loading organization data...</h1>
      </div>
    );
  }

  // Show error state
  if (error || !orgData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-muted-foreground">{error || "Failed to load organization data"}</p>
        {!isConnected && (
          <div className="mt-4 text-center">
            <p className="mb-2">Please connect your wallet first</p>
            <Button onClick={() => window.location.href = "/"}>
              Return to Home
            </Button>
          </div>
        )}
        {isConnected && !orgData && (
          <Button className="mt-4" onClick={() => window.location.href = "/register"}>
            Register Your Organization
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {orgData.name}
                </h1>
                {orgData.verified && <Badge className="ml-2">Verified</Badge>}
              </div>
              <p className="text-muted-foreground">
                {orgData.description || "No description available."}
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Link href="/organizations/campaigns/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 mt-8 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>Status and progress of your active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                    <p>Loading campaign data...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">You haven't created any campaigns yet.</p>
                    <Link href="/organizations/campaigns/new">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Campaign
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-lg">{campaign.title}</h3>
                            <p className="text-muted-foreground">{campaign.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center">
                                <Users className="mr-1 h-4 w-4" />
                                <span>{campaign.donors} donors</span>
                              </div>
                              {/* <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{campaign.daysLeft} days left</span>
                              </div> */}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{campaign.raised} ETH raised</span>
                            <span className="text-muted-foreground">of {campaign.goal} ETH goal</span>
                          </div>
                          <Progress 
                            value={(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100} 
                            className="h-2" 
                          />
                        </div>
                        {campaign.milestones && campaign.milestones.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Milestones</h4>
                            <div className="grid grid-cols-4 gap-2">
                              {campaign.milestones.map((milestone, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-lg text-center text-xs ${
                                    milestone.status === "completed"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <div className="font-medium">{milestone.title}</div>
                                  <div>{milestone.amount} ETH</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/organizations/campaigns" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage All Campaigns
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

