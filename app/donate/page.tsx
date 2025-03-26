"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Clock, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { charityCentral_ABI, charityCentral_CA } from "@/config/contractABI"

export default function DonatePage() {
  const [campaignDetails, setCampaignDetails] = useState<any[]>([])
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
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const centralContract = new ethers.Contract(contractAddress, contractABI, signer);
        const campaignAddresses = await centralContract.getAllCampaigns();

        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            const campaignContract = new ethers.Contract(address, charityCampaignABI, signer);
            const details = await campaignContract.getCampaignDetails();
            return {
              address,
              name: details[0],
              description: details[1],
              goal: ethers.formatUnits(details[2], 18),
              totalDonated: ethers.formatUnits(details[3], 18),
              state: details[4],
              charityAddress: details[5],
              donors: Math.floor(Math.random() * 100), // Placeholder value
              daysLeft: Math.floor(Math.random() * 50), // Placeholder value
              image: "/donors.png",
            };
          })
        );

        // Filter only campaigns where state === 0 (convert BigInt to Number)
        const activeCampaigns = detailedCampaigns.filter((campaign) => Number(campaign.state) === 0);

        setCampaignDetails(activeCampaigns);
        console.log("Detailed Campaigns:", activeCampaigns);

      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    fetchCampaignsDetails();
  }, []);

  console.log("Charity Central Contract Address:", charityCentral_CA);
  // Function to get organization name by wallet address
  const getOrgNameByAddress = (walletAddress: string) => {
    if (!walletAddress || !organizations.length) return "Unknown Organization"; // Early return if no address or organizations
    const org = organizations.find((o) => o?.walletAddress?.toLowerCase() === walletAddress.toLowerCase());
    return org?.name || walletAddress; // Return name if found, otherwise fallback to address
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative bg-[url('/donate-banner.png')] bg-cover bg-center"
      >
        {/* Overlay for text readability */}
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
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Active Campaigns</h2>
              <p className="text-muted-foreground">
                Support these verified organizations and track your impact through blockchain.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </div>
          <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {campaignDetails.map((campaign, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.name}
                    width={400}
                    height={200}
                    className="w-full object-cover h-[200px]"
                  />
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
    </div>
  )
}
