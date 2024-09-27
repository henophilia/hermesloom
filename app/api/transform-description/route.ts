import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { MongoClient } from "mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const mongoClient = new MongoClient(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
  const { projectDescription, saveDescription } = await req.json();

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

    // Save the description if requested
    if (saveDescription) {
      await mongoClient.connect();
      const db = mongoClient.db("henophilia");
      const descriptionsCollection = db.collection("project-descriptions");
      await descriptionsCollection.insertOne({
        description: projectDescription,
        timestamp: new Date(),
      });
    }

    return NextResponse.json({ transformedPurpose });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  } finally {
    await mongoClient.close();
  }
}
