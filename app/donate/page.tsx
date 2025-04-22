"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { charityCentral_ABI, charityCentral_CA, charityCampaigns_ABI } from "@/config/contractABI"
import axios from "axios"
import DonorChatbot from "@/components/dashboard/DonorChatbot"
import { useAccount } from "wagmi"

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
    <div className="relative w-full h-[200px] overflow-hidden">
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

export default function DonatePage() {
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const { address, isConnected } = useAccount();

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
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();

        const centralContract = new ethers.Contract(
          charityCentral_CA,
          charityCentral_ABI,
          signer
        );

        const campaignAddresses = await centralContract.getAllCampaigns();
        const campaignInterface = new ethers.Interface(charityCampaigns_ABI);

        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            const campaignContract = new ethers.Contract(
              address,
              campaignInterface,
              signer
            );

            const details = await campaignContract.getCampaignDetails();

            const campaign: Campaign = {
              address,
              name: details._name,
              description: details._description,
              imageURI: details._campaignImageURI || '',
              goal: ethers.formatEther(details._goal),
              totalDonated: ethers.formatEther(details._totalDonated),
              state: Number(details._state),
              charityAddress: details._charityAddress,
              donors: Math.floor(Math.random() * 100),
              daysLeft: Math.floor(Math.random() * 50),
              images: [],
            };

            if (campaign.imageURI) {
              try {
                const imageData = await fetchIPFSData(campaign.imageURI);
                if (imageData && Array.isArray(imageData.images)) {
                  campaign.images = imageData.images;
                }
              } catch (error) {
                console.error(`Error fetching images for campaign ${campaign.address}:`, error);
              }
            }

            return campaign;
          })
        );

        const activeCampaigns = detailedCampaigns.filter(
          (campaign) => campaign.state === 0
        );

        setCampaignDetails(activeCampaigns);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaignsDetails();
  }, []);

  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return "Unknown Organization";
    const org = organizations.find((o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    return org?.name || walletAddress;
  };

  const filteredCampaigns = campaignDetails.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative bg-[url('/donate-banner.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                Make a Difference Today
              </h1>
              <p className="max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse active campaigns and donate to causes you care about. Track your impact in real-time with blockchain transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Active Campaigns</h2>
              <p className="text-muted-foreground">
                Support these verified organizations and track your impact through blockchain.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
              />
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </div>
          <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  {campaign.images && campaign.images.length > 0 ? (
                    <ImageCarousel images={campaign.images} />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={campaign.name}
                      width={400}
                      height={200}
                      className="w-full object-cover h-[200px]"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{getOrgNameByAddress(campaign.charityAddress)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{campaign.totalDonated} ETH raised</span>
                      <span className="text-muted-foreground">of {campaign.goal} ETH goal</span>
                    </div>
                    <Progress value={(parseFloat(campaign.totalDonated) / parseFloat(campaign.goal)) * 100} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center ml-auto">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/donate/${campaign.address}`} className="w-full">
                    <Button className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Add DonorChatbot */}
      {isConnected && address && (
        <DonorChatbot
          donorName="Donor"
          walletAddress={address}
          totalDonated="0"
          donationsCount={0}
          recentDonations={[]}
        />
      )}
    </div>
  )
}
