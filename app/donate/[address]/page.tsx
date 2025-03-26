"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Clock, Users, Share2, ExternalLink } from "lucide-react";
import { ethers } from "ethers";

export default function CampaignDetailPage({ params }: { params: { address: string } }) {
  const { address } = params;
  console.log("Campaign Address:", address);
  const [campaignDetails, setCampaignDetails] = useState<any>({});
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [milestones, setMilestones] = useState<any>(null);
  const [donorsData, setDonorsData] = useState<any[]>([]); // Store donor info
  const [isDonating, setIsDonating] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const router = useRouter();
  const { isConnected } = useAccount();

  const charityCampaignABI = [
    {
      inputs: [],
      name: "getMilestones",
      outputs: [
        { internalType: "uint256[]", name: "targets", type: "uint256[]" },
        { internalType: "bool[]", name: "reached", type: "bool[]" },
        { internalType: "bool[]", name: "fundsReleased", type: "bool[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "donate",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getCampaignDetails",
      outputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "description", type: "string" },
        { internalType: "uint256", name: "goal", type: "uint256" },
        { internalType: "uint256", name: "totalDonated", type: "uint256" },
        { internalType: "uint8", name: "state", type: "uint8" },
        { internalType: "address", name: "charityAddress", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllDonors",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "donors",
      outputs: [
        { internalType: "uint256", name: "totalDonated", type: "uint256" },
        { internalType: "bool", name: "isTopDonor", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

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
      const campaignContract = new ethers.Contract(address, charityCampaignABI, signer);

      // Fetch campaign details
      const details = await campaignContract.getCampaignDetails();
      const campaignData = {
        address,
        name: details[0],
        description: details[1],
        goal: ethers.formatUnits(details[2], 18),
        totalDonated: ethers.formatUnits(details[3], 18),
        state: details[4],
        charityAddress: details[5],
        image: "/donors.png",
        daysLeft: Math.floor(Math.random() * 50), // Placeholder, replace if contract provides
        donors: 0, // Placeholder, update with real donor count
      };
      setCampaignDetails(campaignData);
      console.log("Campaign Details:", campaignData);

      // Fetch milestones
      const milestoneData = await campaignContract.getMilestones();
      const formattedMilestones = {
        targets: milestoneData[0].map((target: ethers.BigNumberish) =>
          ethers.formatUnits(target, 18)
        ),
        reached: milestoneData[1],
        fundsReleased: milestoneData[2],
      };
      setMilestones(formattedMilestones);
      console.log("Milestones:", formattedMilestones);

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

      // Fetch donors
      const donorAddresses = await campaignContract.getAllDonors();
      console.log("Donor Addresses:", donorAddresses);

      // Fetch donor names
      const donorNames = await fetchDonorNames(donorAddresses);
      console.log("Donor Names:", donorNames);

      const donorsInfo = await Promise.all(
        donorAddresses.map(async (donorAddress: string) => {
          const donorData = await campaignContract.donors(donorAddress);
          const donorName = donorNames.find((d) => d.address === donorAddress)?.name || "Anonymous";

          return {
            donorAddress,
            donorName,
            totalDonated: ethers.formatUnits(donorData.totalDonated, 18),
            isTopDonor: donorData.isTopDonor,
            date: new Date().toLocaleDateString(), // Placeholder, no timestamp in contract
          };
        })
      );
      // Sort by donation amount (descending) and take recent donors
      const sortedDonors = donorsInfo.sort(
        (a, b) => parseFloat(b.totalDonated) - parseFloat(a.totalDonated)
      );
      setDonorsData(sortedDonors);
      campaignData.donors = donorAddresses.length; // Update donors count
      setCampaignDetails(campaignData); // Update with real donor count
      console.log("Donors Data:", sortedDonors);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [address]);

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
      const campaignContract = new ethers.Contract(address, charityCampaignABI, signer);

      const tx = await campaignContract.donate({
        value: ethers.parseEther(donationAmount),
      });
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      await fetchCampaignData();
      setDonationAmount("");
      alert("Donation successful! Thank you for your contribution.");
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

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <Image
                src={campaignDetails.image || "/placeholder.svg"}
                alt={campaignDetails.name}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full aspect-video"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{campaignDetails.name}</h1>
              <p className="text-sm text-muted-foreground">
                {getOrgNameByAddress(campaignDetails.charityAddress)} {/* Display org name instead of address */}
              </p>
              <p className="text-muted-foreground">{campaignDetails.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{campaignDetails.totalDonated} ETH raised</span>
                  <span className="text-muted-foreground">of {campaignDetails.goal} ETH goal</span>
                </div>
                <Progress value={(campaignDetails.totalDonated / campaignDetails.goal) * 100} className="h-2" />
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
              <TabsTrigger value="updates">Updates</TabsTrigger>
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
                </div>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Campaign Updates</h2>
                <p className="text-muted-foreground">No updates available yet.</p>
                {/* Add real updates if contract provides them */}
              </div>
            </TabsContent>
            <TabsContent value="donors" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Recent Donors</h2>
                <div className="rounded-lg border">
                  <div className="p-4 grid grid-cols-3 font-medium">
                    <div>Donor</div>
                    <div className="text-center">Amount</div>
                    <div className="text-right">Date</div>
                  </div>
                  <div className="divide-y">
                    {donorsData.slice(0, 5).map((donor, index) => ( // Show top 5 recent donors
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
                  <div className="flex justify-center">
                    <Button variant="outline">View All Donors</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}