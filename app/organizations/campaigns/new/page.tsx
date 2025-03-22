import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

export default function NewCampaignPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/organizations/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter">Create New Campaign</h1>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Campaign Details</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="media">Media & Documents</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details about your campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input id="title" placeholder="Enter a clear, descriptive title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-description">Short Description</Label>
                    <Textarea id="short-description" placeholder="Brief summary (150 characters max)" />
                    <p className="text-xs text-muted-foreground">This will appear in campaign listings</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full-description">Full Description</Label>
                    <Textarea
                      id="full-description"
                      placeholder="Detailed description of your campaign"
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                          <SelectItem value="humanitarian">Humanitarian</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal">Funding Goal (ETH)</Label>
                      <Input id="goal" type="number" min="1" step="1" placeholder="100" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Continue to Milestones</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="milestones" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Milestones</CardTitle>
                  <CardDescription>Define the key milestones and funding stages for your campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Milestones</Label>
                      <p className="text-xs text-muted-foreground">
                        Funds will be released as each milestone is completed
                      </p>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="flex gap-4 items-start border rounded-lg p-4">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`milestone-${index}-title`}>Milestone Title</Label>
                              <Input id={`milestone-${index}-title`} placeholder={`Milestone ${index}`} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`milestone-${index}-description`}>Description</Label>
                              <Textarea
                                id={`milestone-${index}-description`}
                                placeholder="What will be accomplished in this milestone?"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`milestone-${index}-amount`}>Funding Amount (ETH)</Label>
                              <Input id={`milestone-${index}-amount`} type="number" min="1" step="1" placeholder="25" />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="mt-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Milestone
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Continue to Media</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="media" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media & Documents</CardTitle>
                  <CardDescription>Upload images, videos, and supporting documents for your campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Campaign Banner Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">Upload Image</p>
                        <p className="text-xs text-muted-foreground">Recommended size: 1200 x 600 pixels</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Images</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">Upload Images</p>
                        <p className="text-xs text-muted-foreground">You can upload up to 5 additional images</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Supporting Documents</Label>
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">Upload Documents</p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX files (max 10MB each)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Continue to Review</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="review" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Review your campaign details before submitting for approval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Campaign Details</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm font-medium">Title</p>
                          <p className="text-sm text-muted-foreground">Clean Water Initiative</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">Infrastructure, Health</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Funding Goal</p>
                          <p className="text-sm text-muted-foreground">100 ETH</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">June 15, 2023 - July 15, 2023</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Milestones</h3>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <p>Initial Assessment</p>
                          <p>25 ETH</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p>Equipment Purchase</p>
                          <p>25 ETH</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p>Construction Phase</p>
                          <p>25 ETH</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <p>Project Completion</p>
                          <p>25 ETH</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium">Media & Documents</h3>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="aspect-video bg-muted rounded-lg"></div>
                        <div className="aspect-video bg-muted rounded-lg"></div>
                        <div className="aspect-video bg-muted rounded-lg"></div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">3 documents uploaded</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium">Important Notes</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>Your campaign will be reviewed by our team before it goes live</li>
                      <li>Review may take up to 48 hours</li>
                      <li>Funds will be released according to the milestone schedule</li>
                      <li>You will need to provide evidence of milestone completion</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Submit Campaign</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

