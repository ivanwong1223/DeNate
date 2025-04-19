import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface CampaignData {
  name: string;
  totalDonated: string;
  goal: string;
  milestones: { target: string }[];
  donations: {
    amount: string;
    timestamp: string;
    donor: { address: string };
  }[];
}

interface PredictionPoint {
  date: string;
  amount: number;
  isProjected: boolean;
}

interface PredictionResult {
  predictedDonations: PredictionPoint[];
  goalCompletionDate: string | null;
  confidenceScore: number;
}

export async function generateCampaignPrediction(
  campaignData: CampaignData, 
  daysToPredict: number = 90
): Promise<PredictionResult> {
  try {
    // Prepare historical data for the model
    const historicalDonations = campaignData.donations.map(donation => {
      const amountWei = BigInt(donation.amount);
      const amountEth = Number(amountWei) / 1e18;
      
      return {
        timestamp: parseInt(donation.timestamp),
        amount: amountEth,
        date: new Date(parseInt(donation.timestamp) * 1000).toISOString().split('T')[0]
      };
    });

    // Sort by timestamp (oldest first)
    historicalDonations.sort((a, b) => a.timestamp - b.timestamp);

    let cumulativeDonations = [];
    let runningTotal = 0;
    
    for (const donation of historicalDonations) {
      runningTotal += donation.amount;
      cumulativeDonations.push({
        date: donation.date,
        amount: runningTotal,
      });
    }

    const totalDonatedWei = BigInt(campaignData.totalDonated);
    const goalWei = BigInt(campaignData.goal);
    
    const totalDonated = Number(totalDonatedWei) / 1e18; 
    const goal = Number(goalWei) / 1e18; 
    
    const campaignName = campaignData.name;
    
    // Log conversion for debugging
    console.log("Converted values:", {
      rawTotalDonated: campaignData.totalDonated,
      convertedTotalDonated: totalDonated,
      rawGoal: campaignData.goal,
      convertedGoal: goal
    });

    // Generate prediction prompt
    const prompt = `
      I need a funding projection for a blockchain charity campaign named "${campaignName}".

      Current stats:
      - Total donated so far: ${totalDonated} eth
      - Funding goal: ${goal} eth

      Historical donation data (date, cumulative amount):
      ${cumulativeDonations.map((d) => `${d.date}: ${d.amount}`).join('\n')}

      IMPORTANT REQUIREMENTS:
      1. Generate a projection that MUST show the campaign reaching its FULL GOAL of ${goal} eth
      2. The projection must show significant growth - NOT just tiny incremental increases
      3. Use patterns from historical data, but scale them to ensure the goal is reached
      4. If historical data shows a large jump (like from 0.000002 to 0.000072), incorporate similar jumps but just in the middle
      5. The goal MUST be reached within ${daysToPredict} days (or fewer if data suggests faster growth)

      Please provide:
      - Daily cumulative donation amounts showing realistic, goal-reaching growth
      - An exact date when the goal will be reached (must be a specific date)
      - A confidence score for your prediction (0-100)

      Return ONLY a valid JSON object with this exact structure:
      {
        "dailyPredictions": [
          {"date": "YYYY-MM-DD", "amount": number},
          ...
        ],
        "goalCompletionDate": "YYYY-MM-DD",
        "confidenceScore": number
      }
    `;

    console.log("Prompt: ", prompt)

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from AI response");
    }
    
    const predictionData = JSON.parse(jsonMatch[0]);
    
    // Format the prediction results
    const today = new Date();
    const actualData = cumulativeDonations.map(d => ({
      date: d.date,
      amount: d.amount,
      isProjected: false
    }));
    
    const projectedData = predictionData.dailyPredictions.map((d: { date: any; amount: any; }) => ({
      date: d.date,
      amount: d.amount,
      isProjected: true
    }));
    
    const allData = [...actualData, ...projectedData];
    
    return {
      predictedDonations: allData,
      goalCompletionDate: predictionData.goalCompletionDate,
      confidenceScore: predictionData.confidenceScore
    };
  } catch (error) {
    console.error("Error generating prediction:", error);
    throw error;
  }
} 