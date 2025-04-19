import { NextResponse } from "next/server";
import { generateCampaignPrediction } from "@/lib/predictionService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.campaignAddress) {
      return NextResponse.json({ 
        status: "error", 
        message: "Campaign address is required" 
      }, { status: 400 });
    }

    const { campaignAddress, daysToPredict = 90 } = body;
    
    // Fetching campaign data and transactions from The Graph 
    try {
      const graphQLResponse = await fetch(
        'https://api.studio.thegraph.com/query/105145/denate/version/latest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            query GetCampaignTransactions($campaignId: ID!) {
              campaign(id: $campaignId) {
                name
                totalDonated
                goal
                milestones {
                  target
                }
                charity {
                  address
                }
                donations(orderBy: timestamp, orderDirection: desc) {
                  amount
                  timestamp
                  donor {
                    address
                  }
                }
              }
            }
            `,
            variables: {
              campaignId: campaignAddress.toLowerCase(),
            },
          }),
        }
      );

      if (!graphQLResponse.ok) {
        throw new Error(`GraphQL request failed: ${graphQLResponse.statusText}`);
      }

      const result = await graphQLResponse.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      if (!result.data?.campaign) {
        return NextResponse.json({ 
          status: "error", 
          message: "Campaign not found or no data available from The Graph" 
        }, { status: 404 });
      }
      
      const campaignData = result.data.campaign;
      
      if (!campaignData.donations || campaignData.donations.length === 0) {
        return NextResponse.json({ 
          status: "error", 
          message: "No donation history available for prediction" 
        }, { status: 400 });
      }
      
      // Call function to generate prediction
      const prediction = await generateCampaignPrediction(campaignData, daysToPredict);
      
      return NextResponse.json({ 
        status: "success", 
        data: prediction,
        metadata: {
          source: "The Graph Protocol",
          campaignAddress,
          donationCount: campaignData.donations.length,
          generatedAt: new Date().toISOString(),
          adjustDates: true,
          units: "ETH",
          conversion: {
            from: "wei",
            factor: "1e18",
            originalGoal: campaignData.goal,
            convertedGoal: Number(BigInt(campaignData.goal)) / 1e18,
            originalTotalDonated: campaignData.totalDonated,
            convertedTotalDonated: Number(BigInt(campaignData.totalDonated)) / 1e18
          }
        }
      });
      
    } catch (error) {
      console.error("Error fetching data from The Graph:", error);
      return NextResponse.json({ 
        status: "error", 
        message: error instanceof Error ? 
          `Failed to fetch campaign data from The Graph: ${error.message}` : 
          "Failed to fetch campaign data from The Graph" 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Prediction API error:", error);
    
    return NextResponse.json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Failed to generate prediction" 
    }, { status: 500 });
  }
} 