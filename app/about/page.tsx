"use client";

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Heart, BarChart3, Zap, Users, Globe, Clock, Target } from "lucide-react"
import { Typography, Button, Card, CardBody, CardHeader } from "@material-tailwind/react"

export default function AboutPage() {
  return (
    <div className="bg-gray-900">
      {/* Hero Section with Gradient Background instead of image */}
      <div className="relative min-h-[70vh] w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 h-full w-full bg-black/40" />
        <div className="grid min-h-[70vh] px-8">
          <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
            <Typography variant="h4" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              About DeNate
            </Typography>
            <Typography variant="h1" color="white" className="lg:max-w-3xl" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Our Mission
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              DeNate is dedicated to improving trust, transparency, and efficiency in charitable giving
              through secure blockchain technology and smart contracts.
            </Typography>
          </div>
        </div>
      </div>

      {/* Redesigned Our Story Section with image */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Typography variant="h6" className="text-center mb-2" color="orange" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Our Journey
            </Typography>
            <Typography variant="h3" className="text-center text-white" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Our Story
            </Typography>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
              <Image
                src="/about-us.jpg"
                width={600}
                height={500}
                alt="DeNate's Journey"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <Typography variant="h4" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Founded in 2025
                </Typography>
                <Typography color="white" className="opacity-80" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  By a group of blockchain enthusiasts and philanthropy advocates
                </Typography>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-900/50 p-3 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      The Challenge
                    </Typography>
                    <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Our founders witnessed firsthand the challenges faced by both donors and charitable organizations: donors
                      often lacked visibility into how their contributions were being used, while organizations struggled to
                      build trust and demonstrate impact.
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-start mb-4">
                  <div className="bg-green-900/50 p-3 rounded-lg mr-4">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      The Solution
                    </Typography>
                    <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      By leveraging blockchain technology, we've created a platform that provides unprecedented transparency,
                      security, and efficiency in the donation process. Smart contracts ensure that funds are only released when
                      predefined milestones are met.
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start mb-4">
                  <div className="bg-purple-900/50 p-3 rounded-lg mr-4">
                    <Globe className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Today
                    </Typography>
                    <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      DeNate connects donors with verified organizations around the world, facilitating transparent
                      giving and helping to address some of the world's most pressing challenges.
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section with Darker Gradient Background */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Typography variant="h6" className="text-center mb-2" color="orange" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              What Drives Us
            </Typography>
            <Typography variant="h3" className="text-center text-white" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Our Values
            </Typography>
            <Typography
              variant="lead"
              className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal text-gray-300"
              placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
            >
              The core principles that guide our platform and mission
            </Typography>
          </div>
          <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-blue-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Shield className="h-10 w-10 text-blue-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Transparency
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We believe in complete transparency in the donation process. Blockchain technology allows us to
                  provide an immutable record of all transactions and milestone completions.
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-red-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Heart className="h-10 w-10 text-red-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Impact
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We're committed to maximizing the impact of every donation. Our milestone-based funding approach
                  ensures that resources are used effectively to achieve meaningful outcomes.
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-purple-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Users className="h-10 w-10 text-purple-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Community
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We foster a global community of donors and organizations united by a shared commitment to making a
                  positive difference in the world.
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-green-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <BarChart3 className="h-10 w-10 text-green-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Accountability
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We hold ourselves and our partner organizations to the highest standards of accountability, ensuring
                  that promises made to donors are kept.
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-yellow-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Zap className="h-10 w-10 text-yellow-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Innovation
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We continuously explore new ways to leverage technology to improve the charitable giving experience
                  and increase impact.
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <CardHeader floated={false} className="h-16 flex items-center justify-center bg-cyan-900/50" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Globe className="h-10 w-10 text-cyan-400" />
              </CardHeader>
              <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="h5" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Global Reach
                </Typography>
                <Typography className="text-gray-300" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  We're committed to connecting donors with impactful organizations around the world, regardless of
                  geographic boundaries.
                </Typography>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Typography variant="h6" className="text-center mb-2" color="orange" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              The People Behind DeNate
            </Typography>
            <Typography variant="h3" className="text-center text-white" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Our Team
            </Typography>
            <Typography
              variant="lead"
              className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal text-gray-300"
              placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
            >
              Meet the passionate individuals behind DeNate
            </Typography>
          </div>
          <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "AidenTheinTV", role: "Co-Founder & CEO", image: "/aiden-notion.png" },
              { name: "John Paulose", role: "Co-Founder & CTO", image: "/john-notion.png" },
              { name: "Ivan Wong", role: "Head of Partnerships", image: "/my-notion-face-transparent.png" },
              // { name: "Roy Teh", role: "Blockchain Lead", image: "/roy-notion.png" },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden text-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CardHeader floated={false} className="h-60 flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  <div className="overflow-hidden rounded-full border-4 border-gray-700 shadow-md">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="aspect-square object-cover"
                    />
                  </div>
                </CardHeader>
                <CardBody placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  <Typography variant="h5" color="white" className="mb-1" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {member.name}
                  </Typography>
                  <Typography className="text-gray-400 font-medium" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {member.role}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Mission Section with Darker Gradient Background */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-950 to-indigo-950 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Typography variant="h3" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Join Our Mission
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl opacity-90"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Whether you're looking to donate or register your organization, we're here to help you make a
              difference.
            </Typography>
            <div className="flex items-center gap-4">
              <Link href="/donate">
                <Button variant="gradient" color="white" className="flex items-center" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/kyb-form">
                <Button variant="outlined" className="rounded-full bg-transparent border-white text-white hover:bg-white/10" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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

