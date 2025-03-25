"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { charityCentral_CA, charityCentral_ABI } from "@/config/contractABI";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewCampaignPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goal: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");

    // Connect to provider and contract
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    provider.getSigner().then(signer => {
      const contract = new ethers.Contract(
        charityCentral_CA,
        charityCentral_ABI,
        signer
      );

      // Convert goal to wei
      const goalInWei = ethers.parseEther(formData.goal);

      // Call createCampaign function
      contract.createCampaign(
        formData.name,
        formData.description,
        goalInWei
      ).then(transaction => {
        console.log("Transaction sent:", transaction);
        return transaction.wait();
      }).then(receipt => {
        console.log("Transaction confirmed:", receipt);
        router.push("/organizations/dashboard");
      }).catch(err => {
        console.error("Error creating campaign:", err);
        setError(err.message || "Failed to create campaign");
        setLoading(false);
      });
    }).catch(err => {
      console.error("Error getting signer:", err);
      setError(err.message || "Failed to connect to wallet");
      setLoading(false);
    });
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Not Connected</h1>
        <p className="text-muted-foreground mb-4">Please connect your wallet to create a campaign</p>
        <Button onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/organizations/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Create New Campaign</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Provide the essential details about your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter a clear, descriptive name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of your campaign"
                  className="min-h-[200px]"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Funding Goal (ETH)</Label>
                <Input
                  id="goal"
                  name="goal"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100"
                  value={formData.goal}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the amount in ETH (e.g., 100 for 100 ETH)
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/organizations/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.description || !formData.goal}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

