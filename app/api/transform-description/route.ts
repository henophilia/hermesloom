import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { projectDescription } = await req.json();

  try {
    const purposeResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Wandle das folgende in einen prägnant formulierten Stiftungszweck um, der mit "Zweck der Stiftung" beginnt:\n${projectDescription}`,
        },
      ],
    });
    const transformedPurpose =
      purposeResponse.choices[0].message.content?.trim() ?? "";

    return NextResponse.json({ transformedPurpose });
  } catch (error) {
    console.error("Error transforming description:", error);
    return NextResponse.json(
      { error: "An error occurred while transforming the description" },
      { status: 500 }
    );
  }
}
