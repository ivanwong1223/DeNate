import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WalletConnect from "@/components/custom/connect-wallet"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 mt-8">
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
                  <CardDescription>Connect your wallet to access your donor account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <WalletConnect />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Login</CardTitle>
                  <CardDescription>Connect your wallet to access your organization account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <WalletConnect />
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                      Register your organization
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