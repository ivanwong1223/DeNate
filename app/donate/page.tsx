import Link from "next/link"
// This is donate page
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Clock, Users } from "lucide-react"
import { getActiveCampaigns } from "@/lib/mockData"
import { charityCentral_CA } from "@/config/contractABI"

// Get campaigns data from mockData
const campaigns = getActiveCampaigns()

export default function DonatePage() {
  // Check if the contract address is been fetched
  console.log("Charity Central Contract Address:", charityCentral_CA);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Make a Difference Today</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse active campaigns and donate to causes you care about. Track your impact in real-time with
                blockchain transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Active Campaigns</h2>
              <p className="text-muted-foreground">
                Support these verified organizations and track your impact through blockchain.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </div>
          <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
                    alt={campaign.title}
                    width={400}
                    height={200}
                    className="w-full object-cover h-[200px]"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {campaign.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.organization}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
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
                </CardContent>
                <CardFooter>
                  <Link href={`/donate/${campaign.id}`} className="w-full">
                    <Button className="w-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

