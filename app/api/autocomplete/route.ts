import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 50,
      n: 3,
      stop: null,
      temperature: 0.7,
    });

    const suggestions = completionResponse.choices.map(
      (choice) => choice.message.content?.trim() ?? ""
    );

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error processing autocomplete request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
