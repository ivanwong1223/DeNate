"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export default function WalletConnectDonor({ onConnected }: { onConnected?: () => void }) {
  const { address, isConnected } = useAccount();
  const hasConnected = useRef(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWalletInDb = async () => {
      if (!address) return;

      try {
        setLoading(true);

        // Call API to get all donors
        const res = await fetch("/api/donors/get-donors");
        if (!res.ok) throw new Error("Failed to fetch donors");

        const donors = await res.json();

        // Check if wallet address exists in the donors list
        const existingDonor = donors.find(
          (donor: any) => donor.walletAddress.toLowerCase() === address.toLowerCase()
        );

        if (existingDonor) {
          console.log("Existing donor found:", existingDonor);
          router.push("/donors/dashboard");
        } else {
          console.log("New donor, redirecting to create profile");
          router.push("/create-profile");
        }
      } catch (error) {
        console.error("Error checking wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && !hasConnected.current) {
      hasConnected.current = true;
      checkWalletInDb();
      if (onConnected) onConnected();
    }
  }, [isConnected, address, onConnected, router]);

  return (
    <Button variant="outline" className="w-full" onClick={openConnectModal} disabled={loading}>
      {loading ? "Checking..." : "Connect Wallet"}
    </Button>
  );
}
