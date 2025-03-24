"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export default function WalletConnect({ onConnected }: { onConnected?: () => void }) {
  const { isConnected } = useAccount();
  const hasConnected = useRef(false);
  const { openConnectModal } = useConnectModal();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && !hasConnected.current) {
      hasConnected.current = true;
      if (onConnected) onConnected();
      // for now just route to index, once imported the db will be route to their own user role
      setTimeout(() => router.push("/organizations/dashboard"), 2000);
    }
  }, [isConnected, onConnected, router]);

  return (
    <Button variant="outline" className="w-full" onClick={openConnectModal}>
      Connect Wallet
    </Button>
  );
}