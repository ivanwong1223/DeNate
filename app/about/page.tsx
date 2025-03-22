import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, BarChart3, Zap, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Our Mission</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  BlockCharity is dedicated to improving trust, transparency, and efficiency in charitable giving
                  through secure blockchain technology and smart contracts.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/about-us.jpg"
                width={400}
                height={400}
                alt="BlockCharity Mission"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Story</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                BlockCharity was founded in 2022 by a group of blockchain enthusiasts and philanthropy advocates who
                recognized the potential of blockchain technology to revolutionize charitable giving.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-8 py-12">
            <p className="text-muted-foreground">
              Our founders witnessed firsthand the challenges faced by both donors and charitable organizations: donors
              often lacked visibility into how their contributions were being used, while organizations struggled to
              build trust and demonstrate impact.
            </p>
            <p className="text-muted-foreground">
              By leveraging blockchain technology, we've created a platform that provides unprecedented transparency,
              security, and efficiency in the donation process. Smart contracts ensure that funds are only released when
              predefined milestones are met, giving donors confidence that their contributions are making the intended
              impact.
            </p>
            <p className="text-muted-foreground">
              Today, BlockCharity connects donors with verified organizations around the world, facilitating transparent
              giving and helping to address some of the world's most pressing challenges.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Values</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The core principles that guide our platform and mission
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in complete transparency in the donation process. Blockchain technology allows us to
                  provide an immutable record of all transactions and milestone completions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're committed to maximizing the impact of every donation. Our milestone-based funding approach
                  ensures that resources are used effectively to achieve meaningful outcomes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We foster a global community of donors and organizations united by a shared commitment to making a
                  positive difference in the world.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Accountability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We hold ourselves and our partner organizations to the highest standards of accountability, ensuring
                  that promises made to donors are kept.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We continuously explore new ways to leverage technology to improve the charitable giving experience
                  and increase impact.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're committed to connecting donors with impactful organizations around the world, regardless of
                  geographic boundaries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Team</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet the passionate individuals behind BlockCharity
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "AidenTheinTV", role: "Co-Founder & CEO", image: "/my-notion-face-transparent.png" },
              { name: "John Paulose", role: "Co-Founder & CTO", image: "/my-notion-face-transparent.png" },
              { name: "Ivan Wong", role: "Head of Partnerships", image: "/my-notion-face-transparent.png" },
              { name: "Roy Teh", role: "Blockchain Lead", image: "/my-notion-face-transparent.png" },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="overflow-hidden rounded-full">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="aspect-square object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Mission</h2>
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

