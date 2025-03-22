import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, History } from "lucide-react"

// Mock data for donor dashboard
const donorData = {
  name: "John Smith",
  totalDonated: "120 ETH",
  campaigns: 8,
  rank: 1,
  badges: ["Platinum Donor", "Early Supporter", "Consistent Giver"],
  recentDonations: [
    {
      id: 1,
      campaign: "Clean Water Initiative",
      organization: "Global Water Foundation",
      amount: "15 ETH",
      date: "2023-06-01",
      status: "Confirmed",
    },
    {
      id: 2,
      campaign: "Education for All",
      organization: "Education First",
      amount: "10 ETH",
      date: "2023-05-15",
      status: "Confirmed",
    },
    {
      id: 3,
      campaign: "Disaster Relief Fund",
      organization: "Emergency Response Network",
      amount: "20 ETH",
      date: "2023-04-22",
      status: "Confirmed",
    },
  ],
  activeCampaigns: [
    {
      id: 1,
      title: "Clean Water Initiative",
      organization: "Global Water Foundation",
      raised: 85,
      goal: 100,
      donated: 15,
    },
    { id: 2, title: "Education for All", organization: "Education First", raised: 120, goal: 200, donated: 10 },
    {
      id: 4,
      title: "Wildlife Conservation",
      organization: "Nature Preservation Alliance",
      raised: 65,
      goal: 120,
      donated: 5,
    },
  ],
  impactMetrics: [
    { metric: "Lives Impacted", value: "1,200+" },
    { metric: "Communities Served", value: "8" },
    { metric: "Projects Completed", value: "5" },
    { metric: "Ongoing Projects", value: "3" },
  ],
}

export default function DonorDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome, {donorData.name}</h1>
              <p className="text-muted-foreground">
                Track your donations, impact, and discover new opportunities to make a difference.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Link href="/donate">
                <Button>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </Button>
              </Link>
              <Link href="/donors/settings">
                <Button variant="outline">Settings</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donorData.totalDonated}</div>
                <p className="text-xs text-muted-foreground">Across {donorData.campaigns} campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{donorData.rank}</div>
                <p className="text-xs text-muted-foreground">Top 1% of all donors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donorData.activeCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">Currently supporting</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donor Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donorData.badges.length}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {donorData.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-8 lg:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
                <CardDescription>The difference your donations have made</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {donorData.impactMetrics.map((metric, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                      <h3 className="text-lg font-medium">{metric.metric}</h3>
                      <p className="text-3xl font-bold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Campaigns you're currently supporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donorData.activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.organization}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{campaign.donated} ETH</p>
                          <p className="text-sm text-muted-foreground">Your donation</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{campaign.raised} ETH raised</span>
                          <span>{campaign.goal} ETH goal</span>
                        </div>
                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/donate" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Campaigns
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Your recent contribution history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donorData.recentDonations.map((donation) => (
                    <div key={donation.id} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{donation.campaign}</h3>
                        <p className="text-sm text-muted-foreground">{donation.organization}</p>
                        <p className="text-xs text-muted-foreground">{donation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{donation.amount}</p>
                        <Badge variant="outline" className="mt-1">
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/donors/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    <History className="mr-2 h-4 w-4" />
                    View Full History
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

