"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Button,
    Typography,
    CardFooter,
} from "@material-tailwind/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Animation variants for fade-in effect
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CreateDonorProfile() {
    const { address, isConnected } = useAccount();
    const [name, setUsername] = useState("");
    const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(7));
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const changeAvatar = () => setAvatarSeed(Math.random().toString(36).substring(7));
    const avatarUrl = `https://api.dicebear.com/7.x/croodles/svg?seed=${avatarSeed}`;

    const handleSubmit = async () => {
        if (!isConnected) {
            // You could replace this alert with a toast notification
            alert("Please connect your wallet first!");
            return;
        }

        setIsLoading(true);

        const payload = {
            name,
            avatar: avatarUrl,
            walletAddress: address,
        };

        try {
            const res = await fetch("/api/donors/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/donors/dashboard");
                }, 1500); // Redirect after 1.5 seconds
            } else {
                const error = await res.json();
                setIsLoading(false);
                // You could replace this with a toast notification
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                        Create Donor Profile
                    </Typography>
                    <Typography
                        color="gray"
                        className="font-normal text-gray-600"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        Set up your donor profile to start your charitable journey
                    </Typography>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-black"
                        >
                            Username
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full bg-white text-black"
                            disabled={isLoading || isSuccess}
                        />
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full border bg-white p-1 shadow-sm"
                        />
                        <Button
                            variant="outlined"
                            color="blue-gray"
                            onClick={changeAvatar}
                            className="rounded-md"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            disabled={isLoading || isSuccess}
                        >
                            Change Avatar
                        </Button>
                    </div>

                    <CardFooter
                        className="pt-0 flex justify-center"
                        placeholder={null}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        <Button
                            color={isSuccess ? "green" : "blue"}
                            onClick={handleSubmit}
                            className="w-full max-w-xs rounded-md flex items-center justify-center"
                            placeholder={null}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            disabled={isLoading || isSuccess}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : null}
                            {isSuccess ? "Profile Created Successfully, Redirecting..." : "Create Profile"}
                        </Button>
                    </CardFooter>
                </div>
            </motion.div>
        </div>
    );
}