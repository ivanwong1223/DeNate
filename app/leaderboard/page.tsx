"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, Calendar, User } from "lucide-react"
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Leaderboard</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Recognizing the top contributors making a difference through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="donors" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="donors">Top Donors</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  All Time
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  This Month
                </Button>
              </div>
            </div>
            <TabsContent value="donors" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Donors</CardTitle>
                  <CardDescription>
                    Recognizing individuals who have made significant contributions to charitable causes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-3 p-4 font-medium">
                        <div>Rank</div>
                        <div>Donor</div>
                        <div className="text-center">Total Donated</div>
                      </div>
                      <div className="divide-y">
                        {donors.map((donor) => {
                          // Check if this is the current user's entry by direct address comparison
                          const isCurrentUser = isConnected && address && 
                            donor.address && donor.address.toLowerCase() === address.toLowerCase();
                            
                          return (
                            <div 
                              key={donor.rank} 
                              className={`grid grid-cols-3 p-4 items-center ${isCurrentUser ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                            >
                              <div className="flex items-center">
                                {donor.rank <= 3 ? (
                                  <Award
                                    className={`h-5 w-5 mr-1 ${
                                      donor.rank === 1 
                                        ? "text-yellow-500" 
                                        : donor.rank === 2 
                                          ? "text-gray-400" 
                                          : "text-amber-600"
                                    }`}
                                  />
                                ) : null}
                                <span>{donor.rank}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {donor.avatar ? (
                                  <Image 
                                    src={donor.avatar} 
                                    alt={donor.name || "Anonymous"}
                                    width={32}
                                    height={32}
                                    className="rounded-full h-8 w-8"
                                  />
                                ) : (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                                <span className={isCurrentUser ? "font-medium" : ""}>
                                  {isCurrentUser ? `${donor.name} (You)` : donor.name || 'Anonymous'}
                                </span>
                              </div>
                              <div className="text-center font-medium">
                                {formatToEth(donor.amount)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

