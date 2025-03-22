import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, BarChart3, Clock, Users, FileText, Bell, Settings } from "lucide-react"

// Mock data for organization dashboard
const organizationData = {
  name: "Global Water Foundation",
  totalRaised: "320 ETH",
  campaigns: 4,
  donors: 450,
  badges: ["Verified", "Top Performer"],
  activeCampaigns: [
    {
      id: 1,
      title: "Clean Water Initiative",
      raised: 85,
      goal: 100,
      donors: 128,
      daysLeft: 15,
      milestones: [
        { title: "Initial Assessment", amount: 25, status: "completed" },
        { title: "Equipment Purchase", amount: 50, status: "completed" },
        { title: "Construction Phase", amount: 75, status: "completed" },
        { title: "Project Completion", amount: 100, status: "pending" },
      ],
    },
    {
      id: 2,
      title: "Water Purification Systems",
      raised: 45,
      goal: 150,
      donors: 72,
      daysLeft: 30,
      milestones: [
        { title: "Research & Planning", amount: 30, status: "completed" },
        { title: "Equipment Acquisition", amount: 60, status: "completed" },
        { title: "Installation Phase", amount: 90, status: "pending" },
        { title: "Training & Handover", amount: 150, status: "pending" },
      ],
    },
    {
      id: 3,
      title: "Community Wells Project",
      raised: 120,
      goal: 120,
      donors: 210,
      daysLeft: 0,
      milestones: [
        { title: "Site Selection", amount: 30, status: "completed" },
        { title: "Drilling Operations", amount: 60, status: "completed" },
        { title: "Well Construction", amount: 90, status: "completed" },
        { title: "Community Training", amount: 120, status: "completed" },
      ],
    },
  ],
  recentDonations: [
    { donor: "Anonymous", campaign: "Clean Water Initiative", amount: "5 ETH", date: "2023-06-01" },
    { donor: "Sarah Johnson", campaign: "Water Purification Systems", amount: "10 ETH", date: "2023-05-30" },
    { donor: "Michael Chen", campaign: "Clean Water Initiative", amount: "2.5 ETH", date: "2023-05-29" },
    { donor: "Emma Williams", campaign: "Community Wells Project", amount: "7 ETH", date: "2023-05-28" },
    { donor: "David Rodriguez", campaign: "Water Purification Systems", amount: "3 ETH", date: "2023-05-27" },
  ],
}

export default function OrganizationDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{organizationData.name}</h1>
                <Badge className="ml-2">Verified</Badge>
              </div>
              <p className="text-muted-foreground">
                Manage your campaigns, track donations, and view your impact metrics.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Link href="/organizations/campaigns/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
              <Link href="/organizations/settings">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
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
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.totalRaised}</div>
                <p className="text-xs text-muted-foreground">Across {organizationData.campaigns} campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.donors}</div>
                <p className="text-xs text-muted-foreground">Supporting your mission</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.activeCampaigns.length}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Organization Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organizationData.badges.length}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {organizationData.badges.map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-8 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>Status and progress of your active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {organizationData.activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-lg">{campaign.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              <span>{campaign.donors} donors</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{campaign.daysLeft} days left</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/organizations/campaigns/${campaign.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/organizations/campaigns/${campaign.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{campaign.raised} ETH raised</span>
                          <span className="text-muted-foreground">of {campaign.goal} ETH goal</span>
                        </div>
                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Milestones</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {campaign.milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-lg text-center text-xs ${
                                milestone.status === "completed"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <div className="font-medium">{milestone.title}</div>
                              <div>{milestone.amount} ETH</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/organizations/campaigns" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage All Campaigns
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest contributions to your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizationData.recentDonations.map((donation, index) => (
                    <div key={index} className="flex justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{donation.donor}</h3>
                        <p className="text-sm text-muted-foreground">{donation.campaign}</p>
                        <p className="text-xs text-muted-foreground">{donation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{donation.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/organizations/donations" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Donations
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/organizations/campaigns/new">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <PlusCircle className="h-6 w-6" />
                      <span>New Campaign</span>
                    </Button>
                  </Link>
                  <Link href="/organizations/reports">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <BarChart3 className="h-6 w-6" />
                      <span>Analytics</span>
                    </Button>
                  </Link>
                  <Link href="/organizations/updates/new">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <Bell className="h-6 w-6" />
                      <span>Post Update</span>
                    </Button>
                  </Link>
                  <Link href="/organizations/documents">
                    <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                      <FileText className="h-6 w-6" />
                      <span>Documents</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

