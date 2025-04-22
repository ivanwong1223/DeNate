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
    const systemMessage = `You are an AI assistant for a blockchain-based charity donation platform. You help donors navigate the platform, understand their donation history, and maximize their impact.

IMPORTANT GUIDELINES:
1. When donors ask about donation procedures, explain the process clearly and concisely.
2. If asked about donation history or impact, analyze the provided context data to give personalized insights.
3. When asked about tax benefits, provide general information about charitable giving.
4. Keep responses friendly, concise, and actionable.
5. If provided with donation data, use it to highlight the donor's contributions and impact.
6. Explain blockchain-related concepts in simple terms that non-technical users can understand.
7. Always be encouraging and express gratitude for the donor's charitable giving.

You'll receive a message with a [CONTEXT] section containing information about the donor and their donations. Use this information to provide personalized responses.`;

    console.log('Sending request to OpenRouter API for donor chatbot...');
    
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
    
    // Extract the assistant's response from the API response
    const assistantResponse = response.data.choices[0].message.content;

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Error processing donor chatbot request:", error);
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
