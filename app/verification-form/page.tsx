"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function KYBPage() {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Simulate submission process or add API call here
        console.log("Verification submitted!")
        // Redirect after submission
        router.push("/organizations/dashboard")
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Business Verification</h1>
                        <p className="text-muted-foreground">Provide details for Know Your Business (KYB) verification</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-md gap-6 py-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>KYB Verification</CardTitle>
                            <CardDescription>Ensure your organization is verified to start receiving donations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input id="org-name" placeholder="Global Water Foundation" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-number">Registration Number</Label>
                                <Input id="reg-number" placeholder="1234567890" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-person">Contact Person</Label>
                                <Input id="contact-person" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">Contact Email</Label>
                                <Input id="contact-email" type="email" placeholder="contact@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business-address">Business Address</Label>
                                <Textarea id="business-address" placeholder="123 Business St, City, Country" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business-type">Type of Business</Label>
                                <Input id="business-type" placeholder="Non-profit / Corporation / Partnership" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="docs">Upload Documents</Label>
                                <Input id="docs" type="file" multiple required />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="kyb-terms" required />
                                <label
                                    htmlFor="kyb-terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I confirm that the information provided is accurate and I agree to the{" "}
                                    <Link href="/terms" className="text-primary underline underline-offset-4">
                                        terms of service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary underline underline-offset-4">
                                        privacy policy
                                    </Link>
                                </label>
                            </div>
                            <Button type="submit" className="w-full">Submit for Verification</Button>
                        </CardContent>
                        <CardFooter className="flex flex-col items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                                Need help?{" "}
                                <Link href="/support" className="text-primary underline-offset-4 hover:underline">
                                    Contact Support
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}