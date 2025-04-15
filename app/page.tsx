"use client";

import Link from "next/link"
import Image from "next/image"
// import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, BarChart3, Zap, User } from "lucide-react"
import { IconButton, Button, Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";
import React, { useEffect, useState } from "react";
import TestimonialCarousel from "@/components/testimonial-carousel";
import { getLeaderboard } from "@/lib/mockData";
import ChatBot from "@/components/chatbot";

// Helper function to format WEI to ETH with proper decimal display
function formatToEth(wei: number): string {
  // Convert wei to ETH (1 ETH = 10^18 wei)
  const ethValue = wei / 1000000000000000000;

  // Use toLocaleString to ensure it doesn't use scientific notation
  // If the value is very small (less than 0.0001), show more decimals
  if (ethValue < 0.0001 && ethValue > 0) {
    // For tiny values, show up to 18 decimals but trim trailing zeros
    const fullDecimalStr = ethValue.toFixed(18).replace(/\.?0+$/, "");
    return fullDecimalStr + " ETH";
  }

  // For regular values, show 4 decimals
  return ethValue.toLocaleString('fullwide', {
    useGrouping: false,
    maximumFractionDigits: 4
  }) + " ETH";
}

const SPONSORS = [
  "coinbase",
  "spotify",
  "pinterest",
  "google",
  "amazon",
  "netflix",
];

const EVENT_INFO = [
  {
    title: "For Donors",
    description: (
      <ul className="space-y-2 text-left">
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Easy donation process via the platform</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Real-time tracking of donation impact</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Transparency through blockchain (smart contracts, donation milestones)</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Donor recognition with NFT badges and leaderboard visibility</span>
        </li>
      </ul>
    ),
    subTitle: "Empower Your Giving",
  },
  {
    title: "For Organizations",
    description: (
      <ul className="space-y-2 text-left">
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Register and create donation campaigns</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Set milestones and track progress</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Ensure funds are used as intended through automated fund distribution</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="mr-2 h-5 w-5 text-white shrink-0 mt-0.5" />
          <span>Showcase progress to potential donors with transparency</span>
        </li>
      </ul>
    ),
    subTitle: "Amplify Your Impact",
  },
];

export default function Home() {
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        // Get only top 4 donors for the homepage preview
        setTopDonors(leaderboardData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white">
      <div className="relative min-h-screen w-full bg-[url('/landing-page2-bg2.jpg')] bg-cover bg-no-repeat">
        {/* Hero Section */}
        <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
        <div className="grid min-h-screen px-8">
          <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
            <Typography variant="h4" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Empowering Charitable @ DeNate
            </Typography>
            <Typography variant="h1" color="white" className="lg:max-w-3xl" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Revolutionizing Charity Donations with Blockchain Transparency
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Join our mission to increase accountability, and
              efficiency in charitable giving through blockchain technology.
            </Typography>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="gradient" color="white" className="flex items-center" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/kyb-form">
                <Button variant="outlined" className="rounded-full bg-white p-4" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                  Register Organization
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored by */}
      <div>
        <section className="py-8 px-8 lg:py-20">
          <div className="container mx-auto text-center">
            <Typography variant="h6" color="blue-gray" className="mb-8" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              SPONSORED BY
            </Typography>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {SPONSORS.map((logo, key) => (
                <Image
                  width={256}
                  height={256}
                  key={key}
                  src={`/logos/logo-${logo}.svg`}
                  alt={logo}
                  className="w-40"
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* How it works */}
      <section className="container mx-auto flex flex-col items-center px-4 py-10">
        <Typography variant="h6" className="text-center mb-2" color="orange" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          About the platform
        </Typography>
        <Typography variant="h3" className="text-center" color="blue-gray" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          How It Works?
        </Typography>
        <Typography
          variant="lead"
          className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500"
          placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
        >
          At DeNate, we believe that charitable giving should be transparent, secure, and impactful. That's why we're building a platform that leverages blockchain technology to ensure that your donations are used effectively and efficiently.
        </Typography>

        <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {EVENT_INFO.map((props, idx) => (
            <AboutCard key={idx} {...props} />
          ))}
          <div className="md:col-span-2">
            <AboutCard
              title="Get to know us!"
              subTitle="Community"
              description="Learn more about our mission, vision, and values. We're excited to share our story with you!"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-12">
        <TestimonialCarousel />
      </section>

      {/* Leaderboard Preview Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/top-contributor.png')" }}
        >
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Typography variant="h3" color="white" className="mb-2" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Top Contributors
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="max-w-[900px] opacity-80"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Recognizing those who are making the biggest impact through their generous donations.
              </Typography>
            </div>
          </div>
          <div className="mx-auto max-w-3xl space-y-4 py-12">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="rounded-lg border bg-white/10 backdrop-blur-sm shadow-xl">
                <div className="p-6 border-b border-white/20">
                  <div className="grid grid-cols-3 gap-4 font-medium text-white">
                    <div>Rank</div>
                    <div>Donor</div>
                    <div className="text-center">Total Donated</div>
                  </div>
                </div>
                <div className="divide-y divide-white/20">
                  {topDonors.map((donor) => (
                    <div key={donor.rank} className="p-6">
                      <div className="grid grid-cols-3 gap-4 text-white">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-white font-bold">
                            {donor.rank}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {donor.avatar ? (
                            <Image
                              src={donor.avatar}
                              alt={donor.name || "Anonymous"}
                              width={36}
                              height={36}
                              className="rounded-full h-8 w-8 ring-2 ring-white/20"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 ring-2 ring-white/20">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <span>{donor.name}</span>
                        </div>
                        <div className="flex items-center justify-center font-medium font-mono">{formatToEth(donor.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-center">
              <Link href="/leaderboard">
                <Button
                  variant="text"
                  color="white"
                  className="flex items-center"
                  placeholder={null}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  View Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Floating ChatBot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBot />
      </div>
    </div>

  )
}
