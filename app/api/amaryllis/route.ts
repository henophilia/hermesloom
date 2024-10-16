import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const StringArraySchema = z.object({
  items: z.array(z.string()),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Ich habe bereits folgende motivierende Sätze zum "Growth Mindset":
- Ich kann das noch nicht. Ich versuche es nochmal!
- Ich gehe diese Herausforderung an und übe fleißig!
- Ich lasse mir helfen. Zusammen klappt es bestimmt!
- Ich suche nach einer Lösung und probiere Neues aus!
- Ich probiere neue Dinge aus und lerne etwas Neues!
- Ich bin stark, neugierig und mutig!
- Ich bleibe geduldig und versuche es nochmal!
- Ich nutze Fehler und lerne aus ihnen!
- Ich kann alles lernen! Manchmal braucht es etwas Zeit.
- Ich gebe mein Bestes und bin stolz darauf!
- Ich glaube fest an mich!
- Ich feiere meinen Fortschritt!

Gib mir weitere ähnlich motivierende Sätze, die aber implizit den Umgang mit folgendem Gefühl betreffen, das durch einen Narzissten ausgelöst wurde: ${prompt}`,
        },
      ],
      response_format: zodResponseFormat(StringArraySchema, "string-array"),
    });

    const phrases = JSON.parse(
      completionResponse.choices[0].message.content!
    ).items;

    return NextResponse.json(phrases);
  } catch (error) {
    console.error("Error processing autocomplete request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
