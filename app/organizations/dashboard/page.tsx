"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Users, Clock, ChevronRight, BarChart3, Award, X, Upload, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
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
import axios from "axios";
import { CampaignPredictionChart } from "@/components/dashboard/CampaignPredictionChart";
import OrgChatbot from "@/components/dashboard/OrgChatbot";
import  {toast} from "react-toastify";

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
  images?: string[];
  imageURI?: string;
  donations?: {
    donor: { address: string };
    amount: string;
    timestamp: string;
  }[];
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
    if (!ipfsUrl) return '';
    return ipfsUrl.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  };

  return (
    <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden mb-4">
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
            <ChevronRightIcon className="h-4 w-4" />
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

export default function OrganizationDashboardPage() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orgData, setOrgData] = useState<Partial<Organization> | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createCampaignLoading, setCreateCampaignLoading] = useState(false);
  const [createCampaignError, setCreateCampaignError] = useState("");
  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    description: "",
    goal: ""
  });
  const [campaignImages, setCampaignImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Handle campaign form input change
  const handleCampaignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaignFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    // Check if adding these files would exceed the limit
    if (campaignImages.length + files.length > 5) {
      setCreateCampaignError("Maximum 5 images allowed");
      return;
    }

    setCampaignImages(prev => [...prev, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

    setCreateCampaignError("");

    e.target.value = '';
  };

  // Remove an image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);

    // Remove the image and its preview URL
    setCampaignImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Reset form when dialog closes
  const resetCampaignForm = () => {
    setCampaignFormData({
      name: "",
      description: "",
      goal: ""
    });
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setCampaignImages([]);
    setImagePreviewUrls([]);
    setCreateCampaignError("");
    setCreateCampaignLoading(false);
  };

  // Upload file to Pinata and get IPFS hash
  const uploadToPinata = async (file: File): Promise<string> => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          'Content-Type': 'multipart/form-data',
        },
      });
      const ipfsHash = response.data.IpfsHash;
      return `ipfs://${ipfsHash}`;
    } catch (error) {
      console.error('Pinata upload error:', error);
      throw new Error('Failed to upload image to Pinata');
    }
  };

  // Upload JSON metadata to Pinata
  const uploadJSONToPinata = async (jsonData: any): Promise<string> => {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    try {
      const response = await axios.post(url, jsonData, {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
          'Content-Type': 'application/json',
        },
      });
      const ipfsHash = response.data.IpfsHash;
      return `ipfs://${ipfsHash}`;
    } catch (error) {
      console.error('Pinata JSON upload error:', error);
      throw new Error('Failed to upload metadata to Pinata');
    }
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (!isConnected || !address) {
      setCreateCampaignError("Please connect your wallet first");
      return;
    }

    setCreateCampaignLoading(true);
    setCreateCampaignError("");

    try {
      let imagesIpfsLink = null;

      // Upload images to IPFS if any are provided
      if (campaignImages.length > 0) {
        try {
          const imageUploadPromises = campaignImages.map(uploadToPinata);
          const imageIPFSHashes = await Promise.all(imageUploadPromises);

          imagesIpfsLink = await uploadJSONToPinata({
            images: imageIPFSHashes
          });

          console.log("Campaign images uploaded to IPFS:", imagesIpfsLink);
        } catch (error) {
          console.error("Error uploading images to IPFS:", error);
          setCreateCampaignError("Failed to upload images. Please try again.");
          setCreateCampaignLoading(false);
          return;
        }
      }

      // Connect to provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        charityCentral_CA,
        charityCentral_ABI,
        signer
      );

      // Convert goal to wei
      const goalInWei = ethers.parseEther(campaignFormData.goal);

      // Call createCampaign function
      const tx = await contract.createCampaign(
        campaignFormData.name,
        campaignFormData.description,
        goalInWei,
        imagesIpfsLink || "" // Pass empty string if no images
      );

      console.log("Transaction sent:", tx);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      toast.success('Campaign created successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close dialog and reset form
      setDialogOpen(false);
      resetCampaignForm();

      // Refresh campaign data
      if (address && isConnected && orgData) {
        fetchCampaignData(address);
      }
    } catch (err: any) {
      console.error("Error creating campaign:", err);
      setCreateCampaignError(err instanceof Error ? err.message : "Failed to create campaign");
    } finally {
      setCreateCampaignLoading(false);
    }
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

  // Update activeCampaigns whenever campaigns changes
  useEffect(() => {
    const filtered = campaigns.filter(campaign => campaign.state === 0);
    setActiveCampaigns(filtered);
  }, [campaigns]);

  // Fetch campaign data function (modified to fetch image data from IPFS)
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

      // Create Interface from ABI for campaign contracts
      const campaignInterface = new ethers.Interface(charityCampaigns_ABI);

      // Fetch details for each campaign
      const campaignDetailsPromises = campaignAddresses.map(async (campaignAddress: string) => {
        const campaignContract = new ethers.Contract(
          campaignAddress,
          campaignInterface,
          provider
        );

        // Call getCampaignDetails
        const details = await campaignContract.getCampaignDetails();

        // Create a campaign object with the retrieved data
        return {
          id: campaignAddress,
          address: campaignAddress,
          title: details._name,
          description: details._description,
          goal: ethers.formatEther(details._goal),
          raised: ethers.formatEther(details._totalDonated),
          daysLeft: 30, // Default value
          donors: 0, // Will fetch separately
          state: parseInt(details._state),
          imageURI: details._campaignImageURI || "" // Get the campaign image URI
        };
      });

      let campaignDetails = await Promise.all(campaignDetailsPromises);

      // Fetch additional details for each campaign
      const enhancedCampaignsPromises = campaignDetails.map(async (campaign) => {
        const campaignContract = new ethers.Contract(
          campaign.address,
          campaignInterface,
          provider
        );

        // Get donor count
        try {
          const donors = await campaignContract.getAllDonors();
          campaign.donors = donors.length;

          campaign.donations = [];
        } catch (error) {
          console.error("Error fetching donors for campaign:", error);
          campaign.donations = [];
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

        // Fetch images from IPFS if available
        if (campaign.imageURI) {
          try {
            const imageData = await fetchIPFSData(campaign.imageURI);
            if (imageData && Array.isArray(imageData.images)) {
              campaign.images = imageData.images;
            }
          } catch (error) {
            console.error(`Error fetching images for campaign ${campaign.id}:`, error);
          }
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
  console.log("Check goal: ", totalGoal);
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
        <DialogContent className="sm:max-w-[650px] md:max-w-[700px] bg-background border-border max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 bg-background sticky top-0 z-10">
            <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
            <DialogDescription>
              Enter the details for your new fundraising campaign
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {createCampaignError && (
              <div className="bg-red-950/20 border border-red-800/30 text-red-400 px-4 py-3 mb-6 rounded-md text-sm">
                {createCampaignError}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base">Campaign Name</Label>
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
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of your campaign"
                  className="min-h-[120px] bg-card/50 resize-none"
                  value={campaignFormData.description}
                  onChange={handleCampaignInputChange}
                  disabled={createCampaignLoading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal" className="text-base">Funding Goal (ETH)</Label>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the amount in ETH (e.g., 100 for 100 ETH)
                </p>
              </div>

              {/* Campaign Images Upload */}
              <div className="grid gap-2">
                <Label htmlFor="images" className="text-base">Campaign Images</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload up to 5 high-quality images related to your campaign (PNG, JPG)
                </p>

                {/* Image previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid gap-3 max-h-[220px] overflow-y-auto pr-2 mb-4 border border-border rounded-md p-3 bg-card/30">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative flex items-center gap-3 border border-border rounded-md p-2 bg-background"
                      >
                        <div className="h-12 w-12 relative overflow-hidden rounded-md shrink-0">
                          <Image
                            src={url}
                            alt={`Preview ${index}`}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm truncate font-medium">
                            {campaignImages[index].name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(campaignImages[index].size / 1024)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => removeImage(index)}
                          type="button"
                          disabled={createCampaignLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                {imagePreviewUrls.length < 5 && (
                  <div className="flex items-center">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={
                        createCampaignLoading || imagePreviewUrls.length >= 5
                      }
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('images')?.click()}
                      disabled={
                        createCampaignLoading || imagePreviewUrls.length >= 5
                      }
                      type="button"
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {imagePreviewUrls.length === 0 ? "Upload Images" : "Add More Images"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sticky bottom-0 z-10">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={createCampaignLoading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              disabled={
                createCampaignLoading ||
                !campaignFormData.name ||
                !campaignFormData.description ||
                !campaignFormData.goal
              }
              className="min-w-[120px]"
            >
              {createCampaignLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Banner section with background image */}
      <section
        className="relative w-full py-16 md:py-24 text-white overflow-hidden"
        style={{
          backgroundImage: "url('/Org-dashboard.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
                  <Badge className="bg-green-500/80 text-white border-none">
                    <Award className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-xl text-slate-200 max-w-2xl drop-shadow-md">
                {orgData.description || 'No description available.'}
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Raised
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {totalRaised} ETH
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      of {totalGoal} ETH goal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Donors
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {totalDonors}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      across {campaigns.length} campaigns
                    </p>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Campaigns
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {campaigns.length}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      making an impact
                    </p>
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
            <h2 className="text-2xl font-bold text-foreground">
              Your Campaigns
            </h2>
            <p className="text-muted-foreground">
              Manage and track the progress of your fundraising efforts
            </p>
          </div>

          <Card className="border-0 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <CampaignPredictionChart campaigns={activeCampaigns} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/60 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-card/50 border-b border-border">
              <CardTitle>Campaign Overview</CardTitle>
              <CardDescription>
                Status and progress of your active campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {campaignsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p className="text-muted-foreground">
                    Loading campaign data...
                  </p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-20 bg-card/30 rounded-lg">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No campaigns yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't created any campaigns yet. Start making a
                    difference by creating your first campaign.
                  </p>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setDialogOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Active Campaigns Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <div className="mr-2 w-2 h-2 rounded-full bg-green-500"></div>
                      Active Campaigns
                    </h3>
                    <div className="space-y-8">
                      {campaigns.filter(campaign => campaign.state === 0).map((campaign) => (
                        <div
                          key={campaign.id}
                          className="border border-border bg-gradient-to-br from-card/80 to-card/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row overflow-hidden">
                            {/* Image section - takes 40% width on desktop */}
                            <div className="md:w-2/5 relative">
                              {campaign.images && campaign.images.length > 0 ? (
                                <ImageCarousel images={campaign.images} />
                              ) : (
                                <div className="h-48 md:h-full min-h-[200px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                  <div className="text-primary/50 text-4xl font-bold">{campaign.title?.charAt(0) || "C"}</div>
                                </div>
                              )}
                            </div>

                            {/* Content section - takes 60% width on desktop */}
                            <div className="flex-1 p-6 flex flex-col h-full justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="font-bold text-xl text-foreground">{campaign.title}</h3>
                                  <div className="flex items-center text-muted-foreground text-sm">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    <span>{campaign.daysLeft} days left</span>
                                  </div>
                                </div>

                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                  {campaign.description}
                                </p>

                                <div className="mb-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-foreground">
                                      {formatEthAmount(campaign.raised)} ETH raised
                                    </span>
                                    <span className="text-muted-foreground">
                                      of {formatEthAmount(campaign.goal)} ETH goal
                                    </span>
                                  </div>
                                  <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${Math.min((parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-4">
                                  <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs">
                                    <Users className="mr-1.5 h-3.5 w-3.5" />
                                    <span className="font-medium">{campaign.donors} donors</span>
                                  </div>

                                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    Active
                                  </div>

                                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    Malaysia
                                  </div>

                                  {/* Conditional milestone summary badge */}
                                  {campaign.milestones && campaign.milestones.length > 0 && (
                                    <div className="flex items-center bg-amber-500/10 text-amber-500 rounded-full px-3 py-1.5 text-xs">
                                      <span className="font-medium">
                                        {campaign.milestones.filter(m => m.status === 'completed').length} of {campaign.milestones.length} milestones completed
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                <Link
                                  href={`/organizations/campaigns/${campaign.id}`}
                                  className="flex-1"
                                >
                                  <Button variant="default" size="sm" className="w-full">
                                    View Details
                                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/organizations/campaigns/${campaign.id}/edit`}
                                  className="flex-1"
                                >
                                  <Button variant="outline" size="sm" className="w-full">
                                    Manage Campaign
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Milestone section - conditionally rendered */}
                          {campaign.milestones && campaign.milestones.length > 0 && (
                            <div>
                              <div className="flex items-center px-6 py-4 mb-2">
                                <Award className="h-4 w-4 mr-1.5 text-amber-500" />
                                <h4 className="text-sm font-medium text-foreground">
                                  Project Milestones
                                </h4>
                              </div>
                              <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                                {campaign.milestones.map((milestone, index) => (
                                  <div
                                    key={index}
                                    className={`border text-center p-4 rounded-lg ${milestone.status === 'completed'
                                        ? 'bg-green-950/10 border-green-800/30 text-green-500'
                                        : 'bg-red-950/5 border-red-800/20 text-red-400'
                                      }`}
                                  >
                                    <div className="font-medium mb-1">{milestone.title}</div>
                                    <div className="text-sm font-bold mb-2">
                                      {formatEthAmount(milestone.amount)} ETH
                                    </div>
                                    {milestone.status === 'completed' ? (
                                      <div className="text-xs text-green-500 bg-green-950/20 inline-block px-2 py-0.5 rounded">
                                        Completed
                                      </div>
                                    ) : (
                                      <div className="text-xs text-red-400 bg-red-950/10 inline-block px-2 py-0.5 rounded">
                                        Pending
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completed Campaigns Section */}
                  {campaigns.filter(campaign => campaign.state !== 0).length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <div className="mr-2 w-2 h-2 rounded-full bg-amber-500"></div>
                        Completed Campaigns
                      </h3>
                      <div className="space-y-8">
                        {campaigns.filter(campaign => campaign.state !== 0).map((campaign) => (
                          <div
                            key={campaign.id}
                            className="border border-border bg-gradient-to-br from-card/80 to-card/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex flex-col md:flex-row overflow-hidden">
                              {/* Image section - takes 40% width on desktop */}
                              <div className="md:w-2/5 relative">
                                {campaign.images && campaign.images.length > 0 ? (
                                  <ImageCarousel images={campaign.images} />
                                ) : (
                                  <div className="h-48 md:h-full min-h-[200px] bg-gradient-to-br from-amber-500/10 to-amber-500/5 flex items-center justify-center">
                                    <div className="text-amber-500/50 text-4xl font-bold">{campaign.title?.charAt(0) || "C"}</div>
                                  </div>
                                )}
                              </div>

                              {/* Content section - takes 60% width on desktop */}
                              <div className="flex-1 p-6 flex flex-col h-full justify-between">
                                <div>
                                  <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-xl text-foreground">{campaign.title}</h3>
                                    <div className="flex items-center text-amber-500 text-sm">
                                      <div className="flex items-center text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">
                                        Completed
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {campaign.description}
                                  </p>

                                  <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                      <span className="font-medium text-foreground">
                                        {formatEthAmount(campaign.raised)} ETH raised
                                      </span>
                                      <span className="text-muted-foreground">
                                        of {formatEthAmount(campaign.goal)} ETH goal
                                      </span>
                                    </div>
                                    <div className="h-2.5 w-full bg-amber-500/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-500/80 rounded-full transition-all duration-500"
                                        style={{
                                          width: `${Math.min((parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100, 100)}%`,
                                        }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-3 mb-4">
                                    <div className="flex items-center bg-amber-500/10 text-amber-500 rounded-full px-3 py-1.5 text-xs">
                                      <Users className="mr-1.5 h-3.5 w-3.5" />
                                      <span className="font-medium">{campaign.donors} donors</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                  <Link
                                    href={`/organizations/campaigns/${campaign.id}`}
                                    className="flex-1"
                                  >
                                    <Button variant="default" size="sm" className="w-full">
                                      View Details
                                      <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* Milestone section - conditionally rendered */}
                            {campaign.milestones && campaign.milestones.length > 0 && (
                              <div>
                                <div className="flex items-center px-6 py-4 mb-2">
                                  <Award className="h-4 w-4 mr-1.5 text-amber-500" />
                                  <h4 className="text-sm font-medium text-foreground">
                                    Project Milestones
                                  </h4>
                                </div>
                                <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                                  {campaign.milestones.map((milestone, index) => (
                                    <div
                                      key={index}
                                      className={`border text-center p-4 rounded-lg ${milestone.status === 'completed'
                                          ? 'bg-green-950/10 border-green-800/30 text-green-500'
                                          : 'bg-red-950/5 border-red-800/20 text-red-400'
                                        }`}
                                    >
                                      <div className="font-medium mb-1">{milestone.title}</div>
                                      <div className="text-sm font-bold mb-2">
                                        {formatEthAmount(milestone.amount)} ETH
                                      </div>
                                      {milestone.status === 'completed' ? (
                                        <div className="text-xs text-green-500 bg-green-950/20 inline-block px-2 py-0.5 rounded">
                                          Completed
                                        </div>
                                      ) : (
                                        <div className="text-xs text-red-400 bg-red-950/10 inline-block px-2 py-0.5 rounded">
                                          Pending
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-card/50 border-t border-border p-4">
              {/* <Link href="/organizations/campaigns" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Campaigns
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link> */}
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Add the chatbot at the bottom of the return, outside any section */}
      {!loading && !error && orgData && (
        <OrgChatbot
          orgData={orgData}
          campaigns={campaigns}
          totalRaised={totalRaised}
          totalGoal={totalGoal}
          totalDonors={totalDonors}
        />
      )}
    </div>
  );
}

