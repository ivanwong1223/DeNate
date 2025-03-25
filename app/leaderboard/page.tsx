import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, Calendar, User } from "lucide-react"
import { getLeaderboard } from "@/lib/mockData"
import Image from "next/image"

// Helper function to format large WEI numbers
function formatWei(wei: number): string {
  if (wei >= 1e18) {
    return `${(wei / 1e18).toFixed(2)} ETH`;
  } else if (wei >= 1e15) {
    return `${(wei / 1e15).toFixed(2)} Finney`;
  } else if (wei >= 1e12) {
    return `${(wei / 1e12).toFixed(2)} Szabo`;
  } else if (wei >= 1e9) {
    return `${(wei / 1e9).toFixed(2)} Gwei`;
  } else if (wei >= 1e6) {
    return `${(wei / 1e6).toFixed(2)} Mwei`;
  } else {
    return `${wei} WEI`;
  }
}

export default async function LeaderboardPage() {
  const donors = await getLeaderboard()

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
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-3 p-4 font-medium">
                      <div>Rank</div>
                      <div>Donor</div>
                      <div className="text-center">Total Donated</div>
                    </div>
                    <div className="divide-y">
                      {donors.map((donor) => (
                        <div key={donor.rank} className="grid grid-cols-3 p-4 items-center">
                          <div className="flex items-center">
                            {donor.rank <= 3 ? (
                              <Award
                                className={`h-5 w-5 mr-1 ${donor.rank === 1 ? "text-yellow-500" : donor.rank === 2 ? "text-gray-400" : "text-amber-600"}`}
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
                            <span>{donor.name || 'Anonymous'}</span>
                          </div>
                          <div className="text-center font-medium">{formatWei(donor.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

