"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateDonorProfile() {
    const [username, setUsername] = useState("");
    const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(7));
    const router = useRouter();

    const changeAvatar = () => setAvatarSeed(Math.random().toString(36).substring(7));
    const avatarUrl = `https://api.dicebear.com/7.x/croodles/svg?seed=${avatarSeed}`;

    const handleSubmit = () => {
        // Simulate profile creation (add API call if needed)
        console.log("Profile Created:", { username, avatarSeed });
        // db call to save the username and avatarSeed

        router.push("/"); // Redirect to home
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create Donor Profile</h1>
                        <p className="text-muted-foreground">Set up your donor profile to get started</p>
                    </div>
                </div>
                <div className="mx-auto grid w-full max-w-md gap-6 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Setup</CardTitle>
                            <CardDescription>Enter your username and select an avatar</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full border bg-white p-1 shadow-sm" />
                                <Button variant="outline" onClick={changeAvatar}>Change Avatar</Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center gap-2">
                            <Button className="w-full" onClick={handleSubmit}>Create Profile</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}