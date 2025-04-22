// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { query } = await request.json();

    // Log the API key for debugging (mask most of it for security)
    const apiKey = process.env.OPENROUTER_API_KEY || '';
    console.log('OpenRouter API Key available:', apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set');
    
    // System message for the chatbot
    const systemMessage = `You are an AI assistant for a charity donation platform. You provide helpful information to charity organizations about how to use the platform, create campaigns, and understand their analytics.

IMPORTANT GUIDELINES:
1. When questions are about campaign creation, explain the steps clearly.
2. If asked about analytics, analyze the campaign data in the context and provide insights.
3. When asked about donation limits, fundraising goals, or platform policies, provide accurate information.
4. Keep responses concise, friendly, and actionable.
5. If provided with campaign data, use it to give personalized responses.
6. If asked about performance or analytics, provide numerical insights and suggestions for improvement.

You'll receive a message with a [CONTEXT] section containing information about the organization and their campaigns. Use this information to provide personalized responses.`;

    console.log('Sending request to OpenRouter API...');
    
    // Call OpenRouter API with DeepSeek R1 model
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: query
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://de-nate.vercel.app/",
          "X-Title": "DeNate Charity Platform",
          "Content-Type": "application/json"
        }
      }
    );

    console.log('OpenRouter API response status:', response.status);
    console.log('OpenRouter API response data structure:', JSON.stringify(Object.keys(response.data)));
    
    // Extract the assistant's response from the API response
    const assistantResponse = response.data.choices[0].message.content;

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Error processing chatbot request:", error);
    // Log more details about the error
    if (axios.isAxiosError(error)) {
      console.error("API Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
