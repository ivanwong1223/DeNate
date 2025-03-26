"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Users, Clock, ChevronRight, BarChart3, Award, X } from "lucide-react";
import { Organization } from "@/lib/types";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useAccount } from "wagmi";
import { charityCentral_CA, charityCentral_ABI, charityCampaigns_ABI } from "@/config/contractABI";
import { ethers } from "ethers";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  state?: number;
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false);
  const [createCampaignError, setCreateCampaignError] = useState("");
  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    description: "",
    goal: ""
  });

  // Handle campaign form input change
  const handleCampaignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form when dialog closes
  const resetCampaignForm = () => {
    setCampaignFormData({
      name: "",
      description: "",
      goal: ""
    });
    setCreateCampaignError("");
    setCreateCampaignLoading(false);
  };

  // Handle campaign creation
  const handleCreateCampaign = () => {
    if (!isConnected || !address) {
      setCreateCampaignError("Please connect your wallet first");
      return;
    }

    setCreateCampaignLoading(true);
    setCreateCampaignError("");

    // Connect to provider and contract
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    provider.getSigner().then(signer => {
      const contract = new ethers.Contract(
        charityCentral_CA,
        charityCentral_ABI,
        signer
      );

      // Convert goal to wei
      const goalInWei = ethers.parseEther(campaignFormData.goal);

      // Call createCampaign function
      contract.createCampaign(
        campaignFormData.name,
        campaignFormData.description,
        goalInWei
      ).then(transaction => {
        console.log("Transaction sent:", transaction);
        return transaction.wait();
      }).then(receipt => {
        console.log("Transaction confirmed:", receipt);
        setDialogOpen(false);
        resetCampaignForm();
        
        // Refresh campaign data
        if (address && isConnected && orgData) {
          fetchCampaignData(address);
        }
      }).catch(err => {
        console.error("Error creating campaign:", err);
        setCreateCampaignError(err.message || "Failed to create campaign");
        setCreateCampaignLoading(false);
      });
    }).catch(err => {
      console.error("Error getting signer:", err);
      setCreateCampaignError(err.message || "Failed to connect to wallet");
      setCreateCampaignLoading(false);
    });
  };

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

  // Fetch campaign data function (extracted to reuse after campaign creation)
  const fetchCampaignData = async (walletAddress: string) => {
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
      const campaignAddresses = await centralContract.getCharityCampaigns(walletAddress);

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

  // Get campaign data from smart contract
  useEffect(() => {
    if (!address || !isConnected || !orgData) return;
    fetchCampaignData(address);
  }, [address, isConnected, orgData]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Loading organization data...</h1>
      </div>
    );
  }

  // Show error state
  if (error || !orgData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <div className="max-w-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-950/20">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error || "Failed to load organization data"}</p>
          {!isConnected && (
            <div className="mt-4 text-center">
              <p className="mb-4 text-muted-foreground">Please connect your wallet first</p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/"}>
                Return to Home
              </Button>
            </div>
          )}
          {isConnected && !orgData && (
            <Button className="bg-primary hover:bg-primary/90 mt-4" onClick={() => window.location.href = "/register"}>
              Register Your Organization
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Calculate the total funding raised across all campaigns
  const totalRaised = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.raised), 0).toFixed(8);
  // Calculate the total goal amount across all campaigns
  const totalGoal = campaigns.reduce((sum, campaign) => sum + parseFloat(campaign.goal), 0).toFixed(8);
  // Calculate the total donor count
  const totalDonors = campaigns.reduce((sum, campaign) => sum + campaign.donors, 0);

  // Format ETH amount with more decimal places
  const formatEthAmount = (amount: string) => {
    // Parse the amount to ensure we're working with a number
    const value = parseFloat(amount);
    // Format to 8 decimal places
    return value.toFixed(8);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Create Campaign Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
            <DialogDescription>
              Enter the details for your new fundraising campaign
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {createCampaignError && (
              <div className="bg-red-950/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-md text-sm">
                {createCampaignError}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter a clear, descriptive name"
                value={campaignFormData.name}
                onChange={handleCampaignInputChange}
                disabled={createCampaignLoading}
                className="bg-card/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of your campaign"
                className="min-h-[120px] bg-card/50"
                value={campaignFormData.description}
                onChange={handleCampaignInputChange}
                disabled={createCampaignLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal">Funding Goal (ETH)</Label>
              <Input
                id="goal"
                name="goal"
                type="number"
                step="0.01"
                min="0"
                placeholder="100"
                value={campaignFormData.goal}
                onChange={handleCampaignInputChange}
                disabled={createCampaignLoading}
                className="bg-card/50"
              />
              <p className="text-xs text-muted-foreground">
                Enter the amount in ETH (e.g., 100 for 100 ETH)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={createCampaignLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={createCampaignLoading || !campaignFormData.name || !campaignFormData.description || !campaignFormData.goal}
            >
              {createCampaignLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner section with background image */}
      <section
        className="relative w-full py-16 md:py-24 text-white overflow-hidden"
        style={{
          backgroundImage: "url('/charity.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-slate-900/70"></div>

        <div className="container relative px-4 md:px-6 z-10 mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
                  {orgData.name}
                </h1>
                {orgData.verified && (
                  <Badge className="bg-emerald-500/80 text-white border-none">
                    <Award className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-xl text-slate-200 max-w-2xl drop-shadow-md">
                {orgData.description || "No description available."}
              </p>
              {/* <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="font-medium">Wallet:</span>
                <span className="font-mono bg-white/10 px-3 py-1 rounded-full">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div> */}
            </div>
            <div className="flex flex-col md:flex-row lg:flex-col items-center md:items-end gap-4 lg:justify-center">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 shadow-lg transition-all"
                onClick={() => setDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="w-full py-8 -mt-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-lg border-none bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                    <h3 className="text-2xl font-bold text-foreground">{totalRaised} ETH</h3>
                    <p className="text-xs text-muted-foreground">of {totalGoal} ETH goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                    <h3 className="text-2xl font-bold text-foreground">{totalDonors}</h3>
                    <p className="text-xs text-muted-foreground">across {campaigns.length} campaigns</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <PlusCircle className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                    <h3 className="text-2xl font-bold text-foreground">{campaigns.length}</h3>
                    <p className="text-xs text-muted-foreground">making an impact</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Campaigns section */}
      <section className="w-full py-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Your Campaigns</h2>
            <p className="text-muted-foreground">Manage and track the progress of your fundraising efforts</p>
          </div>

          <Card className="border-0 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-card/50 border-b border-border">
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>Status and progress of your active campaigns</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {campaignsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p className="text-muted-foreground">Loading campaign data...</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-20 bg-card/30 rounded-lg">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">You haven't created any campaigns yet. Start making a difference by creating your first campaign.</p>
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-border rounded-lg p-6 hover:bg-card/80 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-foreground">{campaign.title}</h3>
                          <p className="text-muted-foreground mt-1 line-clamp-2">{campaign.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              <span>{campaign.donors} donors</span>
                            </div>
                            <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {campaign.state === 0 ? "Active" : campaign.state === 1 ? "Completed" : "Inactive"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href={`/organizations/campaigns/${campaign.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/organizations/campaigns/${campaign.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{formatEthAmount(campaign.raised)} ETH raised</span>
                          <span className="text-muted-foreground">of {formatEthAmount(campaign.goal)} ETH goal</span>
                        </div>
                        <Progress
                          value={(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100}
                          className="h-2"
                        />
                      </div>
                      {campaign.milestones && campaign.milestones.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-foreground mb-3">Milestones</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {campaign.milestones.map((milestone, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg text-center ${milestone.status === "completed"
                                    ? "bg-emerald-950/20 text-emerald-400 border border-emerald-800/50"
                                    : "bg-card/50 text-muted-foreground border border-border"
                                  }`}
                              >
                                <div className="font-medium text-xs mb-1">{milestone.title}</div>
                                <div className="text-sm">{formatEthAmount(milestone.amount)} ETH</div>
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
            <CardFooter className="bg-card/50 border-t border-border p-4">
              <Link href="/organizations/campaigns" className="w-full">
                <Button variant="outline" className="w-full">
                  Manage All Campaigns
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

