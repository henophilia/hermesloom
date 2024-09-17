import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Translate the given German text to English.",
        },
        { role: "user", content: text },
      ],
    });

    const translatedText = response.choices[0].message.content;
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
