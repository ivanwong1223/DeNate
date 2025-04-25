"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, History, Wallet, TrendingUp, AlertCircle, Gift, Users, Award, ChevronLeft, ChevronRight } from "lucide-react"
import { getDonorDashboardData, getLeaderboard } from "@/lib/mockData"
import { Donor } from "@/lib/types";
import { useEffect, useState } from "react"
import { useAccount } from "wagmi";
import { ethers } from "ethers"
import { charityCentral_ABI, charityCentral_CA, charityCampaigns_ABI } from "@/config/contractABI"
import DonorChatbot from "@/components/dashboard/DonorChatbot"
import axios from "axios"

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
  userDonation: string;
  images?: string[];
}

// Add interface for donation history from GraphQL
interface GraphQLDonation {
  amount: string;
  timestamp: string;
  campaign: {
    id: string;
    name: string;
  };
}

interface DonorDonationHistory {
  id: string;
  totalDonated: string;
  donations: GraphQLDonation[];
}

// For demo purposes, using a static donor ID - in a real app, this would come from authentication
const DEMO_DONOR_ID = "d1"

// Add the ImageCarousel component from the donate page
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getDisplayUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '/placeholder.svg';
    return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gray-900/20 z-10"></div>
      <div className="relative h-full w-full">
        <img
          src={getDisplayUrl(images[currentImageIndex])}
          alt="Campaign image"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/60'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Add the fetchIPFSData function from the donate page
const fetchIPFSData = async (uri: string) => {
  if (!uri || !uri.startsWith('ipfs://')) return null;

  try {
    const url = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching IPFS data:', error);
    return null;
  }
};

// Add an interface for the donation format expected by the DonorChatbot
interface ChatbotDonation {
  campaignId: string;
  campaignName: string;
  amount: string;
  date: string;
}

export default function DonorDashboardPage() {
  const { address, isConnected } = useAccount();
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([])
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([])
  const [orgData, setOrgData] = useState<Partial<Donor> | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState("all-time");
  const [userLeaderboardInfo, setUserLeaderboardInfo] = useState<{ rank: number | string; amount: string }>({
    rank: "unranked",
    amount: "0",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [donationHistory, setDonationHistory] = useState<GraphQLDonation[]>([]);
  const [isLoadingDonationHistory, setIsLoadingDonationHistory] = useState(false);

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
      }
    };

    fetchOrgData();
  }, [address, isConnected]);

  // Fetch all organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations/getAllOrganizations");
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
            
            // Get donors count
            let donorsCount = 0;
            try {
              const donorsList = await campaignContract.getAllDonors();
              donorsCount = donorsList.length;
            } catch (error) {
              console.error("Error fetching donors for campaign:", error);
            }
            
            // Get user-specific donation data if connected
            let userDonation = "0";
            if (address) {
              try {
                const donorInfo = await campaignContract.donors(signer.address);
                userDonation = ethers.formatEther(donorInfo.totalDonated || "0");
              } catch (error) {
                console.error("Error fetching user donation for campaign:", error);
              }
            }
            
            // Calculate days left (mock calculation based on campaign state)
            // In a real implementation, you might store campaign end dates
            const daysLeft = Number(details._state) === 0 ? 
              Math.floor(30 - (parseFloat(ethers.formatEther(details._totalDonated)) / parseFloat(ethers.formatEther(details._goal))) * 30) : 
              0;

            // Process images from IPFS if available
            let campaignImages: string[] = [];
            if (details._campaignImageURI) {
              try {
                const imageData = await fetchIPFSData(details._campaignImageURI);
                if (imageData && Array.isArray(imageData.images)) {
                  campaignImages = imageData.images;
                } else if (details._campaignImageURI.startsWith('ipfs://')) {
                  // If no array of images found but it's an IPFS URI, use it directly
                  campaignImages = [details._campaignImageURI];
                }
              } catch (error) {
                console.error(`Error fetching images for campaign ${address}:`, error);
              }
            }

            // Return details with the campaign address
            return {
              address: address,
              name: details._name,
              description: details._description,
              imageURI: details._campaignImageURI || '',
              goal: ethers.formatEther(details._goal),
              totalDonated: ethers.formatEther(details._totalDonated),
              state: Number(details._state),
              charityAddress: details._charityAddress,
              donors: donorsCount, // Real donors count instead of random
              daysLeft: daysLeft > 0 ? daysLeft : 1, // Ensure at least 1 day left if active
              userDonation: userDonation,
              images: campaignImages,
            };
          })
        );

        // Filter only campaigns where state === 0 (convert BigInt to Number)
        const activeCampaigns = detailedCampaigns.filter((campaign) => Number(campaign.state) === 0);

        // Filter campaigns that user has donated to
        const userDonatedCampaigns = activeCampaigns.filter(campaign => 
          parseFloat(campaign.userDonation) > 0
        );

        // Update state with detailed campaigns
        setCampaignDetails(activeCampaigns);
        setUserCampaigns(userDonatedCampaigns);
        
        // Calculate total user donations across all campaigns
        const totalUserDonations = detailedCampaigns.reduce((total, campaign) => {
          return total + parseFloat(campaign.userDonation || "0");
        }, 0);
        
        // Update user's total donation amount if not already set by leaderboard
        if (userLeaderboardInfo.amount === "0" && totalUserDonations > 0) {
          setUserLeaderboardInfo(prev => ({
            ...prev,
            amount: totalUserDonations.toString()
          }));
        }
        
        console.log("Detailed Campaigns:", detailedCampaigns);
        console.log("User Donated Campaigns:", userDonatedCampaigns);
        
        // Generate recent donations from real campaign data
        const userDonations: ChatbotDonation[] = detailedCampaigns
          .filter(campaign => parseFloat(campaign.userDonation) > 0)
          .map(campaign => ({
            campaignId: campaign.address,
            campaignName: campaign.name,
            amount: campaign.userDonation,
            date: new Date().toLocaleDateString() // Use current date as a placeholder
          }));
          
        // If we have real donations from the blockchain, use them
        if (userDonations.length > 0) {
          console.log("Found user donations:", userDonations);
        }

      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaignsDetails();
  }, [address]);

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
  // Now activeCampaignCount represents the number of campaigns the user has donated to
  const activeCampaignCount = userCampaigns.length;

  // Function to get organization name by wallet address
  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return "Unknown Organization"; // Early return if no address or organizations
    const org = organizations.find((o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    return org?.name || walletAddress; // Return name if found, otherwise fallback to address
  };

  // Function to fetch donor donation history from The Graph
  const fetchDonationHistory = async () => {
    if (!address) return;
    
    setIsLoadingDonationHistory(true);
    try {
      const response = await fetch(
        'https://api.studio.thegraph.com/query/105145/denate/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GetDonorDonations($donorAddress: ID!) {
              donor(id: $donorAddress) {
                id
                totalDonated
                donations(orderBy: timestamp, orderDirection: desc) {
                  amount
                  timestamp
                  campaign {
                    id
                    name
                  }
                }
              }
            }
            `,
            variables: {
              donorAddress: address.toLowerCase(),
            },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.donor?.donations) {
        const graphDonorData = result.data.donor;
        setDonationHistory(graphDonorData.donations);
        
        // Update user's total donation amount from graph data if available
        if (graphDonorData.totalDonated) {
          const totalDonated = ethers.formatEther(graphDonorData.totalDonated);
          setUserLeaderboardInfo(prev => ({
            ...prev,
            amount: totalDonated
          }));
        }
        
        // Generate recentDonations for donor chatbot from real donation data
        if (graphDonorData.donations.length > 0) {
          const formattedDonations: ChatbotDonation[] = graphDonorData.donations.map((donation: GraphQLDonation) => ({
            campaignId: donation.campaign.id,
            campaignName: donation.campaign.name,
            amount: ethers.formatEther(donation.amount),
            date: new Date(Number(donation.timestamp) * 1000).toLocaleDateString()
          }));
          
          // Log the formatted donations
          if (formattedDonations.length > 0) {
            console.log("Found donation history:", formattedDonations);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching donation history:", error);
    } finally {
      setIsLoadingDonationHistory(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchDonationHistory();
    }
  }, [address]);

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return ethers.formatEther(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="w-full py-12 md:py-16 bg-black relative bg-[url('/donors.png')] bg-cover bg-center"
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12 items-center">
            {/* Avatar + Welcome Text */}
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <Avatar className="w-full h-full border-4 border-gray-800 shadow-lg">
                  {orgData?.avatar ? (
                    <AvatarImage src={orgData.avatar} alt="Organization Avatar" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-lg">
                      {orgData?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Status indicator */}
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></span>
              </div>

              {/* Welcome Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                    Welcome, {orgData?.name || donor.name}
                  </h1>
                  {userLeaderboardInfo.rank !== "unranked" && (
                    <Badge className="bg-amber-500/90 text-black font-medium ml-2 py-1 flex items-center">
                      <Award className="h-3.5 w-3.5 mr-1" /> Rank #{userLeaderboardInfo.rank}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 max-w-2xl">
                  Track your donations, see your impact, and discover new campaigns that align with your values.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Link href="/donate">
                <Button className="bg-white hover:bg-gray-100 text-black" size="lg">
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12 bg-black text-white">
        <div className="container px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-gray-900 p-1 border border-gray-800">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  <Heart className="h-4 w-4 mr-2" />
                  Active Campaigns
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-black">
                  <History className="h-4 w-4 mr-2" />
                  Donation History
                </TabsTrigger>
              </TabsList>
              
              <div className="hidden md:flex gap-3">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Gift className="h-4 w-4 mr-2" />
                  Gift a Donation
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </div>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-400" />
                      Total Donated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{userLeaderboardInfo.amount} ETH</div>
                    <p className="text-xs text-gray-500 mt-1">Lifetime contribution</p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-400" />
                      Leaderboard Rank
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{userLeaderboardInfo.rank === "unranked" ? "Unranked" : `#${userLeaderboardInfo.rank}`}</div>
                    <p className="text-xs text-gray-500 mt-1">Among all donors</p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      Active Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{activeCampaignCount}</div>
                    <p className="text-xs text-gray-500 mt-1">Currently supporting</p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-gray-900 to-gray-800">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                      Donor Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      <Badge variant="outline" className="text-xs font-medium bg-green-500/10 text-green-400 border-green-800">
                        {parseFloat(userLeaderboardInfo.amount) > 0 ? "Active" : "New"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {parseFloat(userLeaderboardInfo.amount) > 0 
                        ? "Account in good standing" 
                        : "Make your first donation"
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Active campaigns preview */}
              <div className="grid gap-6">
                <Card className="border-none shadow-lg overflow-hidden bg-gray-900 border border-gray-800">
                  <CardHeader className="bg-gray-800/50 border-b border-gray-800 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Active Campaigns</CardTitle>
                        <CardDescription className="text-gray-400">Campaigns you're currently supporting</CardDescription>
                      </div>
                      <Link href="/donate">
                        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {userCampaigns.length > 0 ? (
                        userCampaigns.slice(0, 3).map((campaign, index) => {
                          // Calculate if user has donated to this campaign
                          const hasUserDonated = parseFloat(campaign.userDonation || "0") > 0;
                          
                          return (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700 hover:bg-gray-800/70 transition-colors">
                              {/* Campaign image */}
                              <div className="h-32 w-full md:w-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                                {campaign.images && campaign.images.length > 0 ? (
                                  <ImageCarousel images={campaign.images} />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                                    <Heart className="h-10 w-10 opacity-50" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-medium text-lg text-white">{campaign.name}</h3>
                                    <p className="text-sm text-gray-400">
                                      {getOrgNameByAddress(campaign.charityAddress)}
                                      <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-900 text-xs">
                                        You've Donated
                                      </Badge>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-white">{campaign.userDonation} ETH</p>
                                    <p className="text-sm text-gray-400">Your donation</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="flex items-center gap-1">
                                      <Badge variant="outline" className="bg-black text-green-400 border-gray-700 text-xs">
                                        {campaign.daysLeft} days left
                                      </Badge>
                                    </span>
                                    <span className="text-gray-400">{campaign.totalDonated}/{campaign.goal} ETH</span>
                                  </div>
                                  <Progress 
                                    value={(parseFloat(campaign.totalDonated) / parseFloat(campaign.goal)) * 100} 
                                    className="h-2 bg-gray-700" 
                                  />
                                  
                                  {/* Additional campaign stats */}
                                  <div className="flex gap-4 pt-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" /> {campaign.donors} donors
                                    </span>
                                    <span>
                                      {Math.round((parseFloat(campaign.totalDonated) / parseFloat(campaign.goal)) * 100)}% funded
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400">You haven't donated to any campaigns yet</p>
                          <Link href="/donate">
                            <Button variant="outline" className="mt-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Explore Campaigns</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-800/30 border-t border-gray-800 px-6 py-4">
                    <Link href="/donate" className="w-full">
                      <Button variant="default" className="w-full bg-white text-black hover:bg-gray-100">
                        <Heart className="mr-2 h-4 w-4" />
                        Donate to More Campaigns
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                {/* Recent Donations Preview */}
                <Card className="border-none shadow-lg overflow-hidden bg-gray-900 border border-gray-800">
                  <CardHeader className="bg-gray-800/50 border-b border-gray-800 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Recent Donations</CardTitle>
                        <CardDescription className="text-gray-400">Your latest contributions</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-300 hover:text-white hover:bg-gray-800"
                        onClick={() => setActiveTab("history")}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {isLoadingDonationHistory ? (
                        <div className="text-center py-4">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-current border-r-transparent border-white/30 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                          <p className="mt-2 text-gray-400">Loading your donation history...</p>
                        </div>
                      ) : donationHistory && donationHistory.length > 0 ? (
                        donationHistory.slice(0, 3).map((donation, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/40 hover:bg-gray-800/70 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center">
                                <Heart className="h-4 w-4 text-red-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white text-sm">{donation.campaign.name}</h4>
                                <p className="text-xs text-gray-400">{formatDate(donation.timestamp)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white font-mono text-sm">{formatAmount(donation.amount)} ETH</p>
                              <Badge variant="outline" className="bg-gray-800 text-green-400 border-gray-700 text-[10px]">
                                Completed
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400">No donation history available</p>
                          <Link href="/donate">
                            <Button variant="outline" className="mt-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">Make Your First Donation</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {donationHistory && donationHistory.length > 0 && (
                    <CardFooter className="bg-gray-800/30 border-t border-gray-800 px-6 py-3 justify-between flex text-sm text-gray-400">
                      <span>Recent activity</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800"
                        onClick={() => setActiveTab("history")}
                      >
                        <History className="mr-2 h-3.5 w-3.5" />
                        View Full History
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <Card className="border-none shadow-lg overflow-hidden bg-gray-900 border border-gray-800">
                <CardHeader className="bg-gray-800/50 border-b border-gray-800">
                  <CardTitle className="text-white">Your Supported Campaigns</CardTitle>
                  <CardDescription className="text-gray-400">Detailed view of all campaigns you've donated to</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {userCampaigns.length > 0 ? (
                      userCampaigns.map((campaign, index) => {
                        // Calculate contribution percentage
                        const userContributionPercentage = Math.round((parseFloat(campaign.userDonation) / parseFloat(campaign.totalDonated)) * 100);
                          
                        return (
                          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-gray-800/40 border border-gray-700 hover:bg-gray-800/70 transition-colors">
                            {/* Campaign image */}
                            <div className="h-32 w-full md:w-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              {campaign.images && campaign.images.length > 0 ? (
                                <ImageCarousel images={campaign.images} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                                  <Heart className="h-10 w-10 opacity-50" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium text-lg text-white">{campaign.name}</h3>
                                  <p className="text-sm text-gray-400 flex items-center gap-1">
                                    {getOrgNameByAddress(campaign.charityAddress)}
                                    <Badge variant="outline" className="bg-black text-green-400 border-gray-700 text-[10px] ml-2">
                                      {campaign.daysLeft} days left
                                    </Badge>
                                    <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-900 text-[10px]">
                                      You've Donated
                                    </Badge>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-white">{campaign.userDonation} ETH</p>
                                  <p className="text-sm text-gray-400">
                                    {userContributionPercentage > 0 ? 
                                      `${userContributionPercentage}% of total` : 
                                      'Your contribution'
                                    }
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-400 max-w-md line-clamp-2">
                                {campaign.description || "No description available for this campaign."}
                              </p>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>
                                    {Math.round((parseFloat(campaign.totalDonated) / parseFloat(campaign.goal)) * 100)}% funded
                                  </span>
                                  <span>{campaign.totalDonated}/{campaign.goal} ETH</span>
                                </div>
                                <Progress 
                                  value={(parseFloat(campaign.totalDonated) / parseFloat(campaign.goal)) * 100} 
                                  className="h-2 bg-gray-700" 
                                />
                                
                                {/* Additional campaign stats */}
                                <div className="flex justify-between pt-2 text-xs text-gray-400">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" /> {campaign.donors} donors
                                    </span>
                                    {userContributionPercentage > 10 && (
                                      <span className="flex items-center gap-1 text-amber-400">
                                        <Award className="h-3 w-3" /> Top contributor
                                      </span>
                                    )}
                                  </div>
                                  <Link href={`/donate/${campaign.address}`}>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1 text-white">You haven't made any donations yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          Start your giving journey by supporting a campaign to see your donations here.
                        </p>
                        <Link href="/donate">
                          <Button variant="outline" className="mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                            Explore All Campaigns
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="border-none shadow-lg overflow-hidden bg-gray-900 border border-gray-800">
                <CardHeader className="bg-gray-800/50 border-b border-gray-800">
                  <CardTitle className="text-white">Donation History</CardTitle>
                  <CardDescription className="text-gray-400">Record of all your past donations</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {isLoadingDonationHistory ? (
                      <div className="text-center py-8">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent border-white/30 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-2 text-gray-400">Loading your donation history...</p>
                      </div>
                    ) : donationHistory && donationHistory.length > 0 ? (
                      donationHistory.map((donation, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/40">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                              <Heart className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{donation.campaign.name}</h4>
                              <p className="text-sm text-gray-400">{formatDate(donation.timestamp)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white font-mono">{formatAmount(donation.amount)} ETH</p>
                            <Badge variant="outline" className="bg-gray-800 text-green-400 border-gray-700 text-xs">
                              Completed
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1 text-white">No donation history yet</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          You haven't made any donations yet. Start your giving journey by supporting a campaign.
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                          <Link href="/donate">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                              <Heart className="mr-2 h-4 w-4" />
                              Find Campaigns
                            </Button>
                          </Link>
                          <Link href="/leaderboard">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                              <TrendingUp className="mr-2 h-4 w-4" />
                              View Leaderboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                {donationHistory && donationHistory.length > 0 && (
                  <CardFooter className="bg-gray-800/30 border-t border-gray-800 px-6 py-4 flex justify-between">
                    <div className="text-sm text-gray-400">
                      Total Donations: <span className="text-white font-medium">{donationHistory.length}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Total Amount: <span className="text-white font-medium">
                        {userLeaderboardInfo.amount} ETH
                      </span>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add the DonorChatbot at the end of the return statement */}
      {isConnected && address && (
        <DonorChatbot
          donorName={orgData?.name || donor.name || "Donor"}
          walletAddress={address}
          totalDonated={userLeaderboardInfo.amount}
          donationsCount={donationHistory.length || recentDonations.length}
          recentDonations={donationHistory.length > 0 
            ? donationHistory.map(donation => ({
                campaignId: donation.campaign.id,
                campaignName: donation.campaign.name,
                amount: formatAmount(donation.amount),
                date: formatDate(donation.timestamp)
              }))
            : recentDonations.map(donation => ({
                campaignId: donation.campaignId || "",
                campaignName: donation.campaignTitle || "",
                amount: donation.amount.toString(),
                date: donation.date
              }))
          }
        />
      )}
    </div>
  )
}

