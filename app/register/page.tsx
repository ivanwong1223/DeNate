"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Typography,
  Input,
  Textarea,
  Checkbox,
  IconButton,
  CardFooter,
} from "@material-tailwind/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

// Animation variants for fade-in effect
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Animation for error/success messages
const messageAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    description: "",
    walletAddress: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!agreeToTerms) {
      setError("You must agree to the terms of service and privacy policy");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/organizations/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          agreeToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful
      setSuccess("Organization registered successfully! Redirecting...");
      // Store the wallet address in session storage
      window.sessionStorage.setItem("walletAddress", formData.walletAddress);

      // 2. Verify the charity on-chain (Blockchain)
      const verifyResponse = await fetch("/api/organizations/verify-charity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          walletAddress: formData.walletAddress,
        }),
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Verification failed");
      }

      console.log("Charity verified on-chain:", verifyData.txHash);

      setTimeout(() => {
        router.push("/organizations/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Register Your Organization
          </Typography>
          <Typography
            color="gray"
            className="font-normal text-gray-600"
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Join DeNate to start creating impactful campaigns
          </Typography>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={messageAnimation}
            >
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              className="flex items-center gap-2 p-4 bg-green-50 text-green-600 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={messageAnimation}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            <Input
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              icon={<i className="pi pi-building text-gray-400" />}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              icon={<i className="pi pi-envelope text-gray-400" />}
            />

            <Input
              label="Wallet Address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              icon={<i className="pi pi-wallet text-gray-400" />}
            />

            <Input
              label="Website (optional)"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              icon={<i className="pi pi-globe text-gray-400" />}
            />

            <Textarea
              label="Description (optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />

            <div className="flex items-center gap-3">
              <Checkbox
                id="agree-terms"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                className="border-gray-300 checked:bg-blue-500"
              />
              <label htmlFor="agree-terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                <Link href="/terms" className="text-blue-500 hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                <Link href="/privacy" className="text-blue-500 hover:underline">
                    privacy policy
                  </Link>
                </label>
              </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 transition-all"
                disabled={loading}
                placeholder={null}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Registering...
              </div>
                ) : (
                  "Register Organization"
                )}
              </Button>
            </motion.div>

            <CardFooter
              className="pt-0 text-center"
              placeholder={null}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Typography variant="small" className="mt-4 text-gray-900" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 font-medium hover:underline">
                  Sign In
                </Link>
              </Typography>
            </CardFooter>
        </div>
        </form>
      </motion.div>
    </div>
  );
} 