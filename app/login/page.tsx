"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Button,
  Typography,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnect from "@/components/custom/connect-wallet";
import WalletConnectDonor from "@/components/custom/connect-wallet-donor";

// Animation variants for fade-in effect
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <IconButton
          variant="text"
          color="blue-gray"
          size="lg"
          onClick={() => router.push("/")}
          className="rounded-full"
          placeholder={null}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <ArrowLeft className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Typography
            variant="h4"
            color="blue-gray"
            className="mb-2 font-bold"
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Welcome Back
          </Typography>
          <Typography
            color="gray"
            className="font-normal text-gray-600"
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Sign in to your account to continue your charitable journey
          </Typography>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="donor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-lg p-1">
            <TabsTrigger
              value="donor"
              className="py-2 text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black rounded-md"
            >
              Donor
            </TabsTrigger>
            <TabsTrigger
              value="organization"
              className="py-2 text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black rounded-md"
            >
              Organization
            </TabsTrigger>
          </TabsList>

          {/* Donor Tab */}
          <TabsContent value="donor" className="space-y-6">
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-semibold"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Donor Login
              </Typography>
              <Typography
                color="gray"
                className="mb-4 text-gray-600"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Connect your wallet to access your donor account
              </Typography>
              <WalletConnectDonor />
            </div>
            <CardFooter
              className="pt-0 text-center"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="small"
                className="mt-4 text-gray-900 whitespace-nowrap"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Don’t have an account? Connect wallet now to create a new profile
              </Typography>
            </CardFooter>
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization" className="space-y-6">
            <div>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-semibold"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Organization Login
              </Typography>
              <Typography
                color="gray"
                className="mb-4 text-gray-600"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Connect your wallet to access your organization account
              </Typography>
              <WalletConnect />
            </div>
            <CardFooter
              className="pt-0 text-center"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography
                variant="small"
                className="mt-4 text-gray-900"
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                Don’t have an account?{" "}
                <Link
                  href="/kyb-form"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Register your organization
                </Link>
              </Typography>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}