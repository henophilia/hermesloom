import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { MongoClient } from "mongodb";
import { Foundation } from "../../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});
const mongoClient = new MongoClient(process.env.MONGODB_URI as string);

export async function POST(req: Request) {
  const { foundationPurpose } = await req.json();
  const startTime = Date.now();
  console.log(
    `[${new Date().toISOString()}] Received request for foundation purpose: ${foundationPurpose}`
  );

  try {
    // Calculate embedding vector
    console.log(`[${new Date().toISOString()}] Calculating embedding vector`);
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: foundationPurpose,
      encoding_format: "float",
    });
    const embedding = embeddingResponse.data[0].embedding;
    console.log(
      `[${new Date().toISOString()}] Embedding vector calculated successfully`
    );

    // Get Pinecone index stats
    console.log(`[${new Date().toISOString()}] Fetching Pinecone index stats`);
    const index = pinecone.Index("foundations-de-index");
    const indexStats = await index.describeIndexStats();
    const totalVectors = indexStats.totalRecordCount;
    console.log(
      `[${new Date().toISOString()}] Total vectors in Pinecone index: ${totalVectors}`
    );

    // Find suitable matches using Pinecone
    console.log(`[${new Date().toISOString()}] Querying Pinecone for matches`);
    const queryResponse = await index
      .namespace("main")
      .query({ vector: embedding, topK: 300 });
    console.log(
      `[${new Date().toISOString()}] Found ${
        queryResponse.matches.length
      } matches in Pinecone`
    );

    // Query MongoDB for foundation details
    console.log(`[${new Date().toISOString()}] Connecting to MongoDB`);
    await mongoClient.connect();
    const db = mongoClient.db("henophilia");
    const foundationsCollection = db.collection("foundations-de");
    const foundationIds = queryResponse.matches.map((match) => match.id);
    console.log(
      `[${new Date().toISOString()}] Querying MongoDB for ${
        foundationIds.length
      } foundations`
    );
    const foundations = await foundationsCollection
      .find({ internalId: { $in: foundationIds } })
      .toArray();
    console.log(
      `[${new Date().toISOString()}] Retrieved ${
        foundations.length
      } foundations from MongoDB`
    );

    const foundationsByInternalId = new Map<string, Foundation>();
    foundations.forEach((f) => {
      foundationsByInternalId.set(f.internalId, f as unknown as Foundation);
    });

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000; // Convert to seconds
    console.log(
      `[${new Date().toISOString()}] Request processed in ${executionTime} seconds`
    );

    // Send foundation details back to frontend
    return NextResponse.json({
      foundations: queryResponse.matches.map(({ id, score }) => ({
        ...foundationsByInternalId.get(id),
        score,
      })),
      executionTime,
      totalVectors,
    });
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error processing request:`,
      error
    );
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  } finally {
    await mongoClient.close();
    console.log(`[${new Date().toISOString()}] MongoDB connection closed`);
  }
}
