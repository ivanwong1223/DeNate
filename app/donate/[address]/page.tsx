"use client";

import React, { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Clock, Users, Share2, ExternalLink, ChevronLeft, ChevronRight, Trophy, ArrowDownCircle, ArrowUpCircle, Copy, Check } from "lucide-react";
import { ethers } from "ethers";
import { charityCampaigns_ABI } from "@/config/contractABI";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DonorChatbot from "@/components/dashboard/DonorChatbot";
import { toast } from "react-toastify";

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

interface Milestone {
  target: string;
  reached: boolean;
  fundsReleased: boolean;
}

interface Donor {
  donorAddress: string;
  donorName: string;
  totalDonated: string;
  isTopDonor: boolean;
  date: string;
}

interface LeaderboardDonor {
  address: string;
  totalDonated: string;
  rank: number;
  name?: string;
}

interface Donation {
  amount: string;
  timestamp: string;
  donor: {
    address: string;
  };
  formattedAmount?: string;
  formattedDate?: string;
}

interface FundRelease {
  amount: string;
  recipient: string;
  timestamp: string;
  milestoneIndex: number;
  formattedAmount?: string;
  formattedDate?: string;
}

interface Transaction {
  type: 'donation' | 'release';
  amount: string;
  timestamp: string;
  address: string;
  milestoneIndex?: number;
  formattedAmount: string;
  formattedDate: string;
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

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
    <div className="relative w-full h-[300px] overflow-hidden rounded-t-lg">
      <div className="absolute inset-0 bg-gray-900/20 z-10"></div>
      <div className="relative h-full w-full">
        <Image
          src={getDisplayUrl(images[currentImageIndex])}
          alt="Campaign image"
          fill
          style={{ objectFit: 'cover' }}
          className="transition-opacity duration-300"
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

// Fetch and parse IPFS data
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

export default function CampaignDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const resolvedParams = use(params);
  const campaignAddress = resolvedParams.address;

  const [campaignDetails, setCampaignDetails] = useState<Campaign>({
    address: '',
    name: '',
    description: '',
    imageURI: '',
    goal: '0',
    totalDonated: '0',
    state: 0,
    charityAddress: '',
    donors: 0,
    daysLeft: 30,
    images: []
  });
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [milestones, setMilestones] = useState<{
    targets: string[];
    reached: boolean[];
    fundsReleased: boolean[];
  } | null>(null);
  const [donorsData, setDonorsData] = useState<Donor[]>([]);
  const [isDonating, setIsDonating] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [imageCarouselImages, setImageCarouselImages] = useState<string[]>([]);
  const [leaderboardDonors, setLeaderboardDonors] = useState<LeaderboardDonor[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [fundsReleased, setFundsReleased] = useState<FundRelease[]>([]);
  const [combinedTransactions, setCombinedTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [copiedAddresses, setCopiedAddresses] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const { isConnected, address } = useAccount();

  // Fetch campaign details, milestones, and donors
  const fetchCampaignData = async () => {
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask not detected. Please install a wallet.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();

      const campaignInterface = new ethers.Interface(charityCampaigns_ABI);
      const campaignContract = new ethers.Contract(
        campaignAddress,
        campaignInterface,
        signer
      );

      // Fetch campaign details
      const details = await campaignContract.getCampaignDetails();

      const campaignData: Campaign = {
        address: campaignAddress,
        name: details._name,
        description: details._description,
        imageURI: details._campaignImageURI || '',
        goal: ethers.formatEther(details._goal),
        totalDonated: ethers.formatEther(details._totalDonated),
        state: Number(details._state),
        charityAddress: details._charityAddress,
        daysLeft: Math.floor(Math.random() * 50), // Placeholder
        donors: 0, // Placeholder, update with real donor count
        images: [],
      };

      if (campaignData.imageURI) {
        try {
          const imageData = await fetchIPFSData(campaignData.imageURI);
          if (imageData && Array.isArray(imageData.images)) {
            campaignData.images = imageData.images;
            setImageCarouselImages(imageData.images);
          }
        } catch (error) {
          console.error(`Error fetching images for campaign ${campaignData.address}:`, error);
        }
      }

      setCampaignDetails(campaignData);

      // Fetch milestones
      try {
        const milestoneData = await campaignContract.getMilestones();

        if (!milestoneData || !milestoneData.targets || !milestoneData.reached || !milestoneData.fundsReleased) {
          console.error("Invalid milestone data structure:", milestoneData);
          return;
        }

        const formattedMilestones = {
          targets: Array.from(milestoneData.targets as bigint[]).map((target: bigint) => ethers.formatEther(target)),
          reached: Array.from(milestoneData.reached as unknown[]).map(Boolean),
          fundsReleased: Array.from(milestoneData.fundsReleased as unknown[]).map(Boolean),
        };

        setMilestones(formattedMilestones);
      } catch (error) {
        console.error("Error fetching milestones:", error);
      }

      try {
        const donorAddresses = await campaignContract.getAllDonors();
        const donorNames = await fetchDonorNames(donorAddresses);

        const donorsInfo: Donor[] = await Promise.all(
          donorAddresses.map(async (donorAddress: string) => {
            const donorData = await campaignContract.donors(donorAddress);
            const donorName = donorNames.find((d) => d.address === donorAddress)?.name || "Anonymous";

            return {
              donorAddress,
              donorName,
              totalDonated: ethers.formatEther(donorData.totalDonated),
              isTopDonor: Boolean(donorData.isTopDonor),
              date: new Date().toLocaleDateString()
            };
          })
        );

        const sortedDonors = donorsInfo.sort(
          (a, b) => parseFloat(b.totalDonated) - parseFloat(a.totalDonated)
        );

        setDonorsData(sortedDonors);

        campaignData.donors = donorAddresses.length;
        setCampaignDetails(campaignData);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }

    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  };

  // Fetch donors
  const fetchDonorNames = async (addresses: string[]) => {
    try {
      const response = await fetch("/api/campaign/get-recent-donors");
      if (!response.ok) throw new Error("Failed to fetch donor names");
      const donors = await response.json();

      const addressToNameMap = donors.reduce((map: Record<string, string>, donor: any) => {
        map[donor.walletAddress.toLowerCase()] = donor.name || "Anonymous";
        return map;
      }, {});

      return addresses.map((address) => ({
        address,
        name: addressToNameMap[address.toLowerCase()] || "Anonymous",
      }));
    } catch (error) {
      console.error("Error fetching donor names:", error);
      return addresses.map((address) => ({
        address,
        name: "Anonymous",
      }));
    }
  };

  // Fetch campaign leaderboard data
  const fetchLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
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
            query CampaignLeaderboard($campaignId: ID!) {
              campaign(id: $campaignId) {
                donors(orderBy: totalDonated, orderDirection: desc) {
                  donor {
                    address
                  }
                  totalDonated
                  rank
                }
              }
            }
          `,
            variables: {
              campaignId: campaignAddress.toLowerCase(),
            },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.campaign?.donors) {
        const donorsData = result.data.campaign.donors.map((item: any) => {
          const donationInWei = BigInt(item.totalDonated);
          return {
            address: item.donor.address,
            totalDonated: ethers.formatEther(donationInWei),
            rank: item.rank
          };
        });

        const donorsWithNames = await fetchDonorNames(donorsData.map((d: any) => d.address));

        const enrichedDonors = donorsData.map((donor: any) => {
          const matchingDonor = donorsWithNames.find(d => d.address.toLowerCase() === donor.address.toLowerCase());
          return {
            ...donor,
            name: matchingDonor?.name || "Anonymous",
          };
        });

        setLeaderboardDonors(enrichedDonors);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  // Fetch campaign transaction history
  const fetchTransactionHistory = async () => {
    setIsLoadingTransactions(true);
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
            query GetCampaignTransactions($campaignId: ID!) {
              campaign(id: $campaignId) {
                name
                totalDonated
                charity {
                  address
                }
                
                donations(orderBy: timestamp, orderDirection: desc) {
                  amount
                  timestamp
                  donor {
                    address
                  }
                }
                  
                fundsReleased(orderBy: timestamp, orderDirection: desc) {
                  amount
                  recipient
                  timestamp
                  milestoneIndex
                }
              }
            }
            `,
            variables: {
              campaignId: campaignAddress.toLowerCase(),
            },
          }),
        }
      );

      const result = await response.json();

      if (result.data?.campaign) {
        const campaignData = result.data.campaign;

        // Process donations
        const processedDonations = campaignData.donations.map((donation: any) => {
          const donationInWei = BigInt(donation.amount);
          const date = new Date(Number(donation.timestamp) * 1000); // Convert to milliseconds

          return {
            ...donation,
            formattedAmount: ethers.formatEther(donationInWei),
            formattedDate: date.toLocaleString()
          };
        });

        // Process fund releases
        const processedReleases = campaignData.fundsReleased.map((release: any) => {
          const amountInWei = BigInt(release.amount);
          const date = new Date(Number(release.timestamp) * 1000);

          return {
            ...release,
            formattedAmount: ethers.formatEther(amountInWei),
            formattedDate: date.toLocaleString()
          };
        });

        // Create combined transactions list
        const allTransactions: Transaction[] = [
          ...processedDonations.map((donation: any) => ({
            type: 'donation',
            amount: donation.amount,
            timestamp: donation.timestamp,
            address: donation.donor.address,
            formattedAmount: donation.formattedAmount,
            formattedDate: donation.formattedDate
          })),
          ...processedReleases.map((release: any) => ({
            type: 'release',
            amount: release.amount,
            timestamp: release.timestamp,
            address: release.recipient,
            milestoneIndex: release.milestoneIndex,
            formattedAmount: release.formattedAmount,
            formattedDate: release.formattedDate
          }))
        ];

        // Sort by timestamp descending (most recent first)
        allTransactions.sort((a, b) =>
          Number(b.timestamp) - Number(a.timestamp)
        );

        setDonations(processedDonations);
        setFundsReleased(processedReleases);
        setCombinedTransactions(allTransactions);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (campaignAddress) {
      fetchCampaignData();
      fetchLeaderboardData();
      fetchTransactionHistory();
    }
  }, [campaignAddress]);

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

  // Handle donation
  const handleDonate = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setDonationError("Please enter a valid donation amount greater than 0.");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      setDonationError("MetaMask not detected. Please install a wallet.");
      return;
    }

    setIsDonating(true);
    setDonationError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();

      const campaignInterface = new ethers.Interface(charityCampaigns_ABI);
      const campaignContract = new ethers.Contract(
        campaignAddress,
        campaignInterface,
        signer
      );

      const tx = await campaignContract.donate({
        value: ethers.parseEther(donationAmount),
      });
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      await fetchCampaignData();
      setDonationAmount("");
      toast.success("🎉 Donation successful! Thank you for your contribution.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error: any) {
      console.error("Error donating:", error);

      if (error.code === "ACTION_REJECTED" || error.code === 4001) {
        // User rejected the transaction
        setDonationError("Transaction cancelled. No funds were sent.");
      } else {
        setDonationError(error.message || "Failed to process donation. Please try again.");
      }
    } finally {
      setIsDonating(false);
    }
  };

  // Function to get organization name by wallet address
  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return "Unknown Organization"; // Early return if no address or organizations
    const org = organizations.find((o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    return org?.name || walletAddress; // Return name if found, otherwise fallback to address
  };

  const getDisplayUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '/placeholder.svg';
    return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  };

  const calculateProgressPercentage = () => {
    const goalValue = parseFloat(campaignDetails.goal || "0");
    const donatedValue = parseFloat(campaignDetails.totalDonated || "0");

    if (goalValue <= 0) return 0;
    return Math.min((donatedValue / goalValue) * 100, 100);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopiedAddresses({ ...copiedAddresses, [address]: true });
        setTimeout(() => {
          setCopiedAddresses({ ...copiedAddresses, [address]: false });
        }, 2000);
      });
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDonation = (amount: string) => {
    const value = parseFloat(amount);
    return value.toFixed(6);
  };

  const isCurrentUserAddress = (donorAddress: string) => {
    return isConnected && address && donorAddress.toLowerCase() === address.toLowerCase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              {imageCarouselImages.length > 0 ? (
                <ImageCarousel images={imageCarouselImages} />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt={campaignDetails.name}
                  width={800}
                  height={400}
                  className="rounded-lg object-cover w-full aspect-video"
                />
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{campaignDetails.name}</h1>
              <p className="text-sm text-muted-foreground">
                {getOrgNameByAddress(campaignDetails.charityAddress)}
              </p>
              <p className="text-muted-foreground">{campaignDetails.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{campaignDetails.totalDonated} ETH raised</span>
                  <span className="text-muted-foreground">of {campaignDetails.goal} ETH goal</span>
                </div>
                <Progress value={calculateProgressPercentage()} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{campaignDetails.donors || 0} donors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{campaignDetails.daysLeft} days left</span>
                </div>
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>Your donation will be securely processed via blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" onClick={() => setDonationAmount("5")}>
                        5 ETH
                      </Button>
                      <Button variant="outline" onClick={() => setDonationAmount("10")}>
                        10 ETH
                      </Button>
                      <Button variant="outline" onClick={() => setDonationAmount("25")}>
                        25 ETH
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        min="0.1"
                        step="0.1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        disabled={isDonating}
                      />
                      <span>ETH</span>
                    </div>
                    {donationError && (
                      <p className="text-red-500 text-sm">{donationError}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {isConnected ? (
                    <Button
                      className="w-full"
                      onClick={handleDonate}
                      disabled={isDonating || !donationAmount}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      {isDonating ? "Donating..." : "Donate Now"}
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => router.push("/login")}>
                      Connect Wallet to Donate
                    </Button>
                  )}
                </CardFooter>
              </Card>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Blockchain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About This Campaign</h2>
                <p>{campaignDetails.description}</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This project will provide clean water access to over 5,000 people across multiple communities.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sustainability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Local communities will be trained to maintain the water systems, ensuring long-term sustainability.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Transparency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        All funds are managed through smart contracts, ensuring complete transparency and accountability.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="milestones" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Project Milestones</h2>
                <p className="text-muted-foreground">
                  Funds are released to the organization as each milestone is completed and verified.
                </p>
                <div className="space-y-4">
                  {milestones && milestones.targets.map((target: string, index: number) => {
                    const targetValue = parseFloat(target);
                    const totalDonated = parseFloat(campaignDetails.totalDonated || "0");
                    const progress = Math.min((totalDonated / targetValue) * 100, 100);
                    const isReached = milestones.reached[index];
                    const isFundsReleased = milestones.fundsReleased[index];

                    return (
                      <Card key={index} className={isReached ? "border-primary" : ""}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Milestone {index + 1}</CardTitle>
                            <Badge variant={isReached ? "default" : "outline"}>
                              {isReached ? "Reached" : "Pending"}
                            </Badge>
                          </div>
                          <CardDescription>
                            Target: {targetValue.toFixed(18)} ETH {isFundsReleased ? "(Funds Released)" : ""}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={progress} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            {totalDonated.toFixed(18)} / {targetValue.toFixed(18)} ETH ({progress.toFixed(2)}%)
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {(!milestones || (milestones.targets.length === 0)) && (
                    <p className="text-muted-foreground">No milestones defined for this campaign.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Campaign Transaction History</h2>
                  <p className="text-muted-foreground mb-4">All financial activity for this campaign</p>

                  {isLoadingTransactions ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Combined transaction history */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">All Transactions</CardTitle>
                          <CardDescription>Combined chronological transaction history</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {combinedTransactions.length > 0 ? (
                                combinedTransactions.map((tx, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        {tx.type === 'donation' ? (
                                          <>
                                            <ArrowDownCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-green-500 font-medium">Donation</span>
                                          </>
                                        ) : (
                                          <>
                                            <ArrowUpCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-red-500 font-medium">Funds Released</span>
                                            <Badge variant="outline">Milestone {(tx.milestoneIndex !== undefined ? tx.milestoneIndex + 1 : '?')}</Badge>
                                          </>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {tx.formattedDate}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span>{tx.type === 'donation' ? 'From' : 'To'}</span>
                                        {tx.type === 'donation' ? (
                                          <span className="text-xs font-mono">{formatAddress(tx.address)}</span>
                                        ) : (
                                          <div className="group flex items-center">
                                            <span className="text-xs font-mono">{formatAddress(tx.address)}</span>
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <button
                                                    onClick={() => copyToClipboard(tx.address)}
                                                    className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  >
                                                    {copiedAddresses[tx.address] ?
                                                      <Check className="h-3.5 w-3.5 text-green-500" /> :
                                                      <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                                    }
                                                  </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" align="center" className="px-3 py-1.5 text-xs">
                                                  <p>{copiedAddresses[tx.address] ? 'Copied!' : 'Copy address'}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                      {tx.formattedAmount} ETH
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                    No transaction history available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      {/* Incoming Donations Section */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <ArrowDownCircle className="h-5 w-5 text-green-500" />
                              <CardTitle className="text-lg">Incoming Donations</CardTitle>
                            </div>
                            <CardDescription>Money received from donors</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {donations.length > 0 ? (
                              <div className="space-y-4">
                                {donations.map((donation, index) => (
                                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{formatAddress(donation.donor.address)}</span>
                                      <span className="text-xs text-muted-foreground">{donation.formattedDate}</span>
                                    </div>
                                    <div className="font-mono text-green-600">
                                      +{donation.formattedAmount} ETH
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No donations yet
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Outgoing Funds Section */}
                        <Card>
                          <CardHeader>
                            <div className="flex items-center gap-2">
                              <ArrowUpCircle className="h-5 w-5 text-red-500" />
                              <CardTitle className="text-lg">Funds Released</CardTitle>
                            </div>
                            <CardDescription>Money sent to campaign recipients</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {fundsReleased.length > 0 ? (
                              <div className="space-y-4">
                                {fundsReleased.map((release, index) => (
                                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <div className="group flex items-center">
                                          <span className="font-medium">{formatAddress(release.recipient)}</span>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <button
                                                  onClick={() => copyToClipboard(release.recipient)}
                                                  className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                  {copiedAddresses[release.recipient] ?
                                                    <Check className="h-3.5 w-3.5 text-green-500" /> :
                                                    <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                                  }
                                                </button>
                                              </TooltipTrigger>
                                              <TooltipContent side="top" align="center" className="px-3 py-1.5 text-xs">
                                                <p>{copiedAddresses[release.recipient] ? 'Copied!' : 'Copy address'}</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                        <Badge variant="outline">Milestone {release.milestoneIndex + 1}</Badge>
                                      </div>
                                      <span className="text-xs text-muted-foreground">{release.formattedDate}</span>
                                    </div>
                                    <div className="font-mono text-red-600">
                                      -{release.formattedAmount} ETH
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                No funds released yet
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="donors" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Recent Donors</h2>
                  <div className="rounded-lg border mt-4">
                    <div className="p-4 grid grid-cols-3 font-medium">
                      <div>Donor</div>
                      <div className="text-center">Amount</div>
                      <div className="text-right">Date</div>
                    </div>
                    <div className="divide-y">
                      {donorsData.slice(0, 5).map((donor, index) => (
                        <div key={index} className="p-4 grid grid-cols-3">
                          <div>{donor.donorName}</div>
                          <div className="text-center">{donor.totalDonated} ETH</div>
                          <div className="text-right">{donor.date}</div>
                        </div>
                      ))}
                      {donorsData.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No donors yet.</div>
                      )}
                    </div>
                  </div>
                  {donorsData.length > 5 && (
                    <div className="flex justify-center mt-4">
                      <Button variant="outline">View All Donors</Button>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Campaign Leaderboard
                  </h2>
                  <p className="text-muted-foreground mb-4">Top donors for this campaign</p>

                  {isLoadingLeaderboard ? (
                    <div className="text-center py-8">Loading leaderboard data...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Rank</TableHead>
                          <TableHead>Donor</TableHead>
                          <TableHead className="text-right">Total Donated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboardDonors.length > 0 ? (
                          leaderboardDonors.map((donor, index) => {
                            const isCurrentUser = isConnected && address && donor.address.toLowerCase() === address.toLowerCase();

                            return (
                              <TableRow key={index} className={isCurrentUser ? "bg-green-900/20" : ""}>
                                <TableCell className="font-medium">
                                  {index < 3 ? (
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                                      ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                        index === 1 ? 'bg-gray-100 text-gray-800' :
                                          'bg-amber-100 text-amber-800'}`}>
                                      {index + 1}
                                    </span>
                                  ) : (
                                    index + 1
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className={isCurrentUser ? "text-green-400 font-medium" : ""}>
                                      {donor.name || "Anonymous"}{isCurrentUser ? " (You)" : ""}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{formatAddress(donor.address)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{formatDonation(donor.totalDonated)} ETH</TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                              No leaderboard data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Add DonorChatbot */}
      {isConnected && address && (
        <DonorChatbot
          donorName={donorsData.find(d => d.donorAddress.toLowerCase() === address.toLowerCase())?.donorName || "Donor"}
          walletAddress={address}
          totalDonated={donorsData.find(d => d.donorAddress.toLowerCase() === address.toLowerCase())?.totalDonated || "0"}
          donationsCount={1}
          recentDonations={[
            {
              campaignId: campaignAddress,
              campaignName: campaignDetails.name,
              amount: donorsData.find(d => d.donorAddress.toLowerCase() === address.toLowerCase())?.totalDonated || "0",
              date: new Date().toLocaleDateString()
            }
          ]}
        />
      )}
    </div>
  );
}