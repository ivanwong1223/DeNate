"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function MainNav() {
  // check if user is connected to wallet
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/DeNate-logo.png" 
            alt="DeNate Logo" 
            width={120} 
            height={40} 
            className="h-10 w-auto"
          />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About Us
          </Link>
          <Link href="/donate" className="text-sm font-medium hover:underline underline-offset-4">
            Donate
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:underline underline-offset-4">
            Leaderboard
          </Link>
        </nav>

        {/* Wallet Connection */}
        <div className="ml-4 flex items-center gap-2">
          {isConnected ? (
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

