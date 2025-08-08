import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";

// Initiate OpenAI Client with Perplexity Configuration
const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { message, model = "sonar-pro" } = await request.json();

    // Validate input
    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        { status: 400 }
      );
    }

    // Make request to perplexity API
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides accurate, well-researched answers with citations.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Return the response
    return NextResponse.json({
      response: response.choices[0].message.content,
      model: model,
      usage: response.usage,
    });
  } catch (error) {
    console.error("Perplexity API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Perplexity API" },
      { status: 500 }
    );
  }
}
