import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Heart, Clock, Users, Share2, ExternalLink } from "lucide-react"

// Mock data for a single campaign
const campaign = {
  id: 1,
  title: "Clean Water Initiative",
  organization: "Global Water Foundation",
  description: "Providing clean water access to communities in need through sustainable infrastructure projects.",
  longDescription:
    "Access to clean water is a fundamental human right, yet millions of people around the world still lack this basic necessity. The Clean Water Initiative aims to address this critical issue by implementing sustainable water infrastructure projects in underserved communities. Our approach combines innovative technology with community engagement to ensure long-term success and impact. Through this campaign, we will build water wells, install filtration systems, and provide education on water conservation and hygiene practices.",
  raised: 85,
  goal: 100,
  donors: 128,
  daysLeft: 15,
  image: "/placeholder.svg?height=400&width=800",
  categories: ["Infrastructure", "Health"],
  milestones: [
    {
      amount: 25,
      title: "Initial Assessment",
      description: "Fund initial site assessments and community consultations",
      completed: true,
    },
    {
      amount: 50,
      title: "Equipment Purchase",
      description: "Purchase water filtration systems and construction materials",
      completed: true,
    },
    {
      amount: 75,
      title: "Construction Phase",
      description: "Begin construction of water wells and distribution systems",
      completed: true,
    },
    {
      amount: 100,
      title: "Project Completion",
      description: "Complete construction and implement education programs",
      completed: false,
    },
  ],
  updates: [
    {
      date: "2023-03-15",
      title: "Project Kickoff",
      content: "We've officially launched the Clean Water Initiative with community meetings in target regions.",
    },
    {
      date: "2023-04-10",
      title: "Assessment Complete",
      content: "Our team has completed the initial assessment of water needs in 5 communities.",
    },
    {
      date: "2023-05-22",
      title: "Equipment Delivered",
      content: "All necessary equipment has been delivered to the project sites and construction will begin next week.",
    },
  ],
  recentDonors: [
    { name: "Anonymous", amount: 5, date: "2023-06-01" },
    { name: "Sarah Johnson", amount: 10, date: "2023-05-30" },
    { name: "Michael Chen", amount: 2.5, date: "2023-05-29" },
    { name: "Emma Williams", amount: 7, date: "2023-05-28" },
    { name: "David Rodriguez", amount: 3, date: "2023-05-27" },
  ],
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full aspect-video"
              />
              <div className="flex gap-2 mt-4">
                {campaign.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{campaign.title}</h1>
              <p className="text-muted-foreground">by {campaign.organization}</p>
              <p className="text-muted-foreground">{campaign.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{campaign.raised} ETH raised</span>
                  <span className="text-muted-foreground">of {campaign.goal} ETH goal</span>
                </div>
                <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{campaign.donors} donors</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{campaign.daysLeft} days left</span>
                </div>
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>Your donation will be securely processed via blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline">5 ETH</Button>
                      <Button variant="outline">10 ETH</Button>
                      <Button variant="outline">25 ETH</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Custom amount" min="0.1" step="0.1" />
                      <span>ETH</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                </CardFooter>
              </Card>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Blockchain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="donors">Donors</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About This Campaign</h2>
                <p>{campaign.longDescription}</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This project will provide clean water access to over 5,000 people across multiple communities.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Sustainability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Local communities will be trained to maintain the water systems, ensuring long-term
                        sustainability.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Transparency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        All funds are managed through smart contracts, ensuring complete transparency and
                        accountability.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="milestones" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Project Milestones</h2>
                <p className="text-muted-foreground">
                  Funds are released to the organization as each milestone is completed and verified.
                </p>
                <div className="space-y-4">
                  {campaign.milestones.map((milestone, index) => (
                    <Card key={index} className={milestone.completed ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <Badge variant={milestone.completed ? "default" : "outline"}>
                            {milestone.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        <CardDescription>{milestone.amount} ETH</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Campaign Updates</h2>
                <div className="space-y-4">
                  {campaign.updates.map((update, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{update.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="donors" className="pt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Recent Donors</h2>
                <div className="rounded-lg border">
                  <div className="p-4 grid grid-cols-3 font-medium">
                    <div>Donor</div>
                    <div className="text-center">Amount</div>
                    <div className="text-right">Date</div>
                  </div>
                  <div className="divide-y">
                    {campaign.recentDonors.map((donor, index) => (
                      <div key={index} className="p-4 grid grid-cols-3">
                        <div>{donor.name}</div>
                        <div className="text-center">{donor.amount} ETH</div>
                        <div className="text-right">{donor.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline">View All Donors</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

