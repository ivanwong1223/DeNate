import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue your charitable journey</p>
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
                  <CardTitle>Donor Login</CardTitle>
                  <CardDescription>Enter your credentials to access your donor account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="donor-email">Email</Label>
                    <Input id="donor-email" type="email" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="donor-password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="donor-password" type="password" />
                  </div>
                  <Button className="w-full">Sign In</Button>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                      Sign up
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground">Or connect with your wallet</div>
                  <Button variant="outline" className="w-full">
                    Connect Wallet
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Login</CardTitle>
                  <CardDescription>Enter your credentials to access your organization account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email</Label>
                    <Input id="org-email" type="email" placeholder="organization@example.com" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="org-password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="org-password" type="password" />
                  </div>
                  <Button className="w-full">Sign In</Button>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                      Register your organization
                    </Link>
                  </div>
                  <div className="text-sm text-muted-foreground">Or connect with your wallet</div>
                  <Button variant="outline" className="w-full">
                    Connect Wallet
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

