import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create an Account</h1>
            <p className="text-muted-foreground">Join our platform to start making a difference</p>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-md gap-6 py-8">
          <Tabs defaultValue="donor" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor">Donor</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>
            <TabsContent value="donor">
              <Card>
                <CardHeader>
                  <CardTitle>Donor Registration</CardTitle>
                  <CardDescription>Create an account to track your donations and impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Smith" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline underline-offset-4">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline underline-offset-4">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                  <Button className="w-full">Create Account</Button>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                      Sign in
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground">Or register with your wallet</div>
                  <Button variant="outline" className="w-full">
                    Connect Wallet
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Registration</CardTitle>
                  <CardDescription>Register your organization to start fundraising campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" placeholder="Global Water Foundation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email</Label>
                    <Input id="org-email" type="email" placeholder="organization@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Website (Optional)</Label>
                    <Input id="org-website" type="url" placeholder="https://example.org" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-password">Password</Label>
                    <Input id="org-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-confirm-password">Confirm Password</Label>
                    <Input id="org-confirm-password" type="password" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="org-terms" />
                    <label
                      htmlFor="org-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary underline underline-offset-4">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary underline underline-offset-4">
                        privacy policy
                      </Link>
                    </label>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Note: After registration, you'll need to complete a verification process to ensure the legitimacy
                      of your organization. This includes providing documentation and proof of charitable status.
                    </p>
                  </div>
                  <Button className="w-full">Register Organization</Button>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

