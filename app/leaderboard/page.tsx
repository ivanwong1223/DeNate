"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, Calendar, User, Filter } from "lucide-react"
import { getLeaderboard } from "@/lib/mockData"
import Image from "next/image"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"

// Helper function to format WEI to ETH with proper decimal display
function formatToEth(wei: number): string {
  // Convert wei to ETH (1 ETH = 10^18 wei)
  const ethValue = wei / 1000000000000000000;
  
  // Use toLocaleString to ensure it doesn't use scientific notation
  // and displays the full decimal value up to 18 places
  return ethValue.toLocaleString('fullwide', { 
    useGrouping: false,
    maximumFractionDigits: 18 
  }) + " ETH";
}

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount();
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all-time");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        setDonors(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <section className="w-full py-16 px-4 md:px-6 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Donation Leaderboard
                </span>
              </h1>
              <p className="max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Recognizing the greatest impact makers in our ecosystem
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-white">Top Donors</h2>
                {/* {isConnected && (
                  <div className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    Your position highlighted
                  </div>
                )} */}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                  <Button 
                    variant={timeframe === "all-time" ? "secondary" : "ghost"} 
                    size="sm" 
                    onClick={() => setTimeframe("all-time")}
                    className={timeframe === "all-time" ? "text-white" : "text-gray-400"}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    All Time
                  </Button>
                  <Button 
                    variant={timeframe === "monthly" ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => setTimeframe("monthly")}
                    className={timeframe === "monthly" ? "text-white" : "text-gray-400"}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    This Month
                  </Button>
                </div>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 text-gray-300">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="grid grid-cols-3 px-6 py-3 bg-gray-800/80 border-b border-gray-700 text-sm font-medium text-gray-400">
                  <div>Rank</div>
                  <div>Donor</div>
                  <div className="text-center">Total Donated</div>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {donors.map((donor) => {
                    // Check if this is the current user's entry
                    const isCurrentUser = isConnected && address && 
                      donor.address && donor.address.toLowerCase() === address.toLowerCase();
                      
                    return (
                      <div 
                        key={donor.rank} 
                        className={`grid grid-cols-3 px-6 py-4 items-center transition-colors hover:bg-gray-700/20 ${
                          isCurrentUser ? 'bg-green-900/20 border-l-4 border-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          {donor.rank <= 3 ? (
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full 
                              ${donor.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" : 
                                donor.rank === 2 ? "bg-gray-400/20 text-gray-300 border border-gray-400/50" : 
                                "bg-amber-600/20 text-amber-500 border border-amber-600/50"}`}>
                              {donor.rank}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                              {donor.rank}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {donor.avatar ? (
                            <Image 
                              src={donor.avatar} 
                              alt={donor.name || "Anonymous"}
                              width={36}
                              height={36}
                              className="rounded-full h-9 w-9 ring-2 ring-gray-700"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 ring-2 ring-gray-700">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <span className={`text-sm font-medium ${isCurrentUser ? "text-green-400" : "text-white"}`}>
                              {isCurrentUser ? `${donor.name} (You)` : donor.name || 'Anonymous'}
                            </span>
                            {isCurrentUser && (
                              <span className="block text-xs text-gray-400">Connected Wallet</span>
                            )}
                          </div>
                        </div>
                        <div className="text-center font-mono text-sm font-medium">
                          {formatToEth(donor.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800/80">
              <div className="text-sm text-gray-400">
                Showing {donors.length} donors
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 text-gray-300">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

