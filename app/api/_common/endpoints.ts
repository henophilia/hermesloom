import { NextResponse } from "next/server";
import { LLM } from "./llm";

export type PostWithLLMHandler<T = any> = (llm: LLM, body: T) => Promise<any>;

export function postWithLLM(handler: PostWithLLMHandler) {
  return async (req: Request) => {
    const body = await req.json();

    try {
      const llm = new LLM();
      const response = await handler(llm, body);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "An error occurred while processing your request" },
        { status: 500 }
      );
    }
  };
}
