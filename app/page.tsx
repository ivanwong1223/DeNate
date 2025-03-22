import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, BarChart3, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transparent Charity Donations Powered by Blockchain
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Improving trust, transparency, and efficiency in charitable giving through secure blockchain
                  technology and smart contracts.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/donate">
                  <Button size="lg" className="bg-primary text-primary-foreground">
                    Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/organizations/register">
                  <Button size="lg" variant="outline" className="border-primary">
                    Register Organization
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/landing-page.jpg"
                width={400}
                height={400}
                alt="Blockchain Charity Platform"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform leverages blockchain technology to ensure complete transparency and security in the
                donation process.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2">
            {/* For Donors */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">For Donors</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Easy donation process via the platform</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Real-time tracking of donation impact</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Transparency through blockchain (smart contracts, donation milestones)</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Donor recognition with NFT badges and leaderboard visibility</span>
                </li>
              </ul>
              <Link href="/donors/register" className="mt-auto">
                <Button className="w-full">Become a Donor</Button>
              </Link>
            </div>

            {/* For Organizations */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">For Organizations</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Register and create donation campaigns</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Set milestones and track progress</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Ensure funds are used as intended through automated fund distribution</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Showcase progress to potential donors with transparency</span>
                </li>
              </ul>
              <Link href="/organizations/register" className="mt-auto">
                <Button className="w-full">Register Organization</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers unique features for both donors and organizations to enhance the charitable giving
                experience.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Secure & Transparent</h3>
                <p className="text-muted-foreground">
                  Blockchain-powered donation tracking ensures complete transparency and security for all transactions.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor donation impact in real-time with detailed reports and milestone tracking.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Smart Contracts</h3>
                <p className="text-muted-foreground">
                  Automated fund distribution based on predefined milestones ensures funds are used as intended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Success Stories</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from donors and organizations who have experienced the impact of our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col space-y-2">
                <p className="text-muted-foreground">
                  "As a donor, I love being able to see exactly how my contributions are making a difference. The
                  transparency provided by the blockchain technology gives me confidence that my donations are reaching
                  those in need."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Regular Donor</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="flex flex-col space-y-2">
                <p className="text-muted-foreground">
                  "Our organization has seen a 40% increase in donations since joining this platform. The
                  milestone-based funding approach has helped us better plan our projects and demonstrate our impact to
                  donors."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Michael Chen</p>
                    <p className="text-xs text-muted-foreground">Education First Foundation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Top Contributors</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Recognizing those who are making the biggest impact through their generous donations.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-12">
            <div className="rounded-lg border bg-card shadow-sm">
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 font-medium">
                  <div>Donor</div>
                  <div className="text-center">Total Donated</div>
                  <div className="text-right">Campaigns Supported</div>
                </div>
              </div>
              <div className="divide-y">
                {[
                  { name: "John Smith", amount: "120 ETH", campaigns: 8 },
                  { name: "Emily Davis", amount: "85 ETH", campaigns: 5 },
                  { name: "Robert Wilson", amount: "62 ETH", campaigns: 4 },
                  { name: "Lisa Thompson", amount: "45 ETH", campaigns: 3 },
                ].map((donor, index) => (
                  <div key={index} className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10" />
                        <span>{donor.name}</span>
                      </div>
                      <div className="flex items-center justify-center font-medium">{donor.amount}</div>
                      <div className="flex items-center justify-end">{donor.campaigns}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/leaderboard">
                <Button variant="outline">View Full Leaderboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Us in Making an Impact</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you're looking to donate or register your organization, we're here to help you make a
                difference.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/donate">
                <Button size="lg" variant="secondary">
                  Donate Now
                </Button>
              </Link>
              <Link href="/organizations/register">
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

