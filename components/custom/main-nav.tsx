"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Navbar as MTNavbar,
    Collapse,
    Button as MTButton,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import {
    XMarkIcon,
    Bars3Icon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// NavItem component for rendering each menu item (adapted from the template)
interface NavItemProps {
    children: React.ReactNode;
    href?: string;
}

export function MainNav() {
    const { isConnected } = useAccount();
    const [open, setOpen] = React.useState(false);
    const [isScrolling, setIsScrolling] = React.useState(false);
    const router = useRouter();

    // Redirect to home when disconnected
    useEffect(() => {
        if (!isConnected) {
            router.push("/");
        }
    }, [isConnected, router]);

    // Toggle the mobile menu
    const handleOpen = () => setOpen((cur) => !cur);

    // Close the mobile menu on resize (for larger screens)
    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpen(false)
        );
    }, []);

    // Handle scrolling effect (changes navbar color when scrolling)
    React.useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 0) {
                setIsScrolling(true);
            } else {
                setIsScrolling(false);
            }
        }

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <MTNavbar
            shadow={false}
            fullWidth
            blurred={false}
            color={isScrolling ? "white" : "transparent"}
            className="fixed top-0 z-50 border-0"
            placeholder={null}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo (retained from your current navbar) */}
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src={isScrolling ? "/denate-logo-black.png" : "/DeNate-logo.png"}
                        alt="DeNate Logo"
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>

                {/* Navigation Links (About Us, Donate, Leaderboard) */}
                <ul
                    className={`ml-16 hidden items-center gap-6 lg:flex ${isScrolling ? "text-gray-900" : "text-white"
                        }`}
                >
                </ul>

                {/* Wallet Connection (retained from your current navbar) */}
                <div className="hidden items-center gap-4 lg:flex">
                    {isConnected ? (
                        <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    color={isScrolling ? "gray" : "white"}
                                    variant="outline"
                                    className="hidden sm:flex"
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <MTButton color={isScrolling ? "gray" : "white"} placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Sign Up</MTButton>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <IconButton
                    variant="text"
                    color={isScrolling ? "gray" : "white"}
                    onClick={handleOpen}
                    className="ml-auto inline-block lg:hidden"
                    placeholder={null}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    {open ? (
                        <XMarkIcon strokeWidth={2} className="h-6 w-6" />
                    ) : (
                        <Bars3Icon strokeWidth={2} className="h-6 w-6" />
                    )}
                </IconButton>
            </div>

            {/* Mobile Menu Collapse */}
            <Collapse open={open}>
                <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
                    <ul className="flex flex-col gap-4 text-gray-900">
                    </ul>
                    <div className="mt-6 flex items-center gap-4">
                        {isConnected ? (
                            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="outline">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button color="gray">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Collapse>
        </MTNavbar>
    );
}
export default MainNav;
