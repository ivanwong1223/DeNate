import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Award, TrendingUp, Calendar } from "lucide-react"

// Mock data for donors
const donors = [
  { rank: 1, name: "John Smith", amount: "120 ETH", campaigns: 8, badges: ["Platinum Donor", "Early Supporter"] },
  { rank: 2, name: "Emily Davis", amount: "85 ETH", campaigns: 5, badges: ["Gold Donor"] },
  { rank: 3, name: "Robert Wilson", amount: "62 ETH", campaigns: 4, badges: ["Silver Donor", "Consistent Giver"] },
  { rank: 4, name: "Lisa Thompson", amount: "45 ETH", campaigns: 3, badges: ["Bronze Donor"] },
  { rank: 5, name: "Michael Chen", amount: "38 ETH", campaigns: 6, badges: ["Bronze Donor", "Diverse Supporter"] },
  { rank: 6, name: "Sarah Johnson", amount: "32 ETH", campaigns: 4, badges: ["Bronze Donor"] },
  { rank: 7, name: "David Rodriguez", amount: "28 ETH", campaigns: 3, badges: ["Bronze Donor"] },
  { rank: 8, name: "Emma Williams", amount: "25 ETH", campaigns: 5, badges: ["Bronze Donor", "Diverse Supporter"] },
  { rank: 9, name: "James Brown", amount: "22 ETH", campaigns: 2, badges: ["Bronze Donor"] },
  { rank: 10, name: "Olivia Martinez", amount: "20 ETH", campaigns: 3, badges: ["Bronze Donor"] },
]

// Mock data for organizations
const organizations = [
  {
    rank: 1,
    name: "Global Water Foundation",
    raised: "320 ETH",
    campaigns: 4,
    donors: 450,
    badges: ["Verified", "Top Performer"],
  },
  { rank: 2, name: "Education First", raised: "280 ETH", campaigns: 3, donors: 380, badges: ["Verified"] },
  {
    rank: 3,
    name: "Emergency Response Network",
    raised: "210 ETH",
    campaigns: 5,
    donors: 320,
    badges: ["Verified", "Rapid Response"],
  },
  { rank: 4, name: "Nature Preservation Alliance", raised: "185 ETH", campaigns: 2, donors: 290, badges: ["Verified"] },
  { rank: 5, name: "Children's Health Initiative", raised: "160 ETH", campaigns: 3, donors: 240, badges: ["Verified"] },
  { rank: 6, name: "Community Development Fund", raised: "140 ETH", campaigns: 4, donors: 210, badges: ["Verified"] },
  { rank: 7, name: "Hunger Relief Project", raised: "125 ETH", campaigns: 2, donors: 180, badges: ["Verified"] },
  { rank: 8, name: "Renewable Energy Coalition", raised: "110 ETH", campaigns: 3, donors: 150, badges: ["Verified"] },
  { rank: 9, name: "Mental Health Awareness", raised: "95 ETH", campaigns: 2, donors: 130, badges: ["Verified"] },
  { rank: 10, name: "Animal Welfare Society", raised: "85 ETH", campaigns: 3, donors: 120, badges: ["Verified"] },
]

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Leaderboard</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Recognizing the top contributors and organizations making a difference through our platform.
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
                <TabsTrigger value="organizations">Top Organizations</TabsTrigger>
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
                    <div className="grid grid-cols-5 p-4 font-medium">
                      <div>Rank</div>
                      <div>Donor</div>
                      <div className="text-center">Total Donated</div>
                      <div className="text-center">Campaigns</div>
                      <div className="text-right">Badges</div>
                    </div>
                    <div className="divide-y">
                      {donors.map((donor) => (
                        <div key={donor.rank} className="grid grid-cols-5 p-4 items-center">
                          <div className="flex items-center">
                            {donor.rank <= 3 ? (
                              <Award
                                className={`h-5 w-5 mr-1 ${donor.rank === 1 ? "text-yellow-500" : donor.rank === 2 ? "text-gray-400" : "text-amber-600"}`}
                              />
                            ) : null}
                            <span>{donor.rank}</span>
                          </div>
                          <div>{donor.name}</div>
                          <div className="text-center font-medium">{donor.amount}</div>
                          <div className="text-center">{donor.campaigns}</div>
                          <div className="flex justify-end gap-1 flex-wrap">
                            {donor.badges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="whitespace-nowrap">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="organizations" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Organizations</CardTitle>
                  <CardDescription>
                    Organizations that have successfully raised funds and created impact through our platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-5 p-4 font-medium">
                      <div>Rank</div>
                      <div>Organization</div>
                      <div className="text-center">Total Raised</div>
                      <div className="text-center">Campaigns / Donors</div>
                      <div className="text-right">Badges</div>
                    </div>
                    <div className="divide-y">
                      {organizations.map((org) => (
                        <div key={org.rank} className="grid grid-cols-5 p-4 items-center">
                          <div className="flex items-center">
                            {org.rank <= 3 ? (
                              <Award
                                className={`h-5 w-5 mr-1 ${org.rank === 1 ? "text-yellow-500" : org.rank === 2 ? "text-gray-400" : "text-amber-600"}`}
                              />
                            ) : null}
                            <span>{org.rank}</span>
                          </div>
                          <div>{org.name}</div>
                          <div className="text-center font-medium">{org.raised}</div>
                          <div className="text-center">
                            {org.campaigns} / {org.donors}
                          </div>
                          <div className="flex justify-end gap-1 flex-wrap">
                            {org.badges.map((badge, index) => (
                              <Badge key={index} variant="outline" className="whitespace-nowrap">
                                {badge}
                              </Badge>
                            ))}
                          </div>
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

