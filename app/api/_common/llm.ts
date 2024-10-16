import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export enum LLMResponseFormat {
  String = "string",
  StringArray = "string_array",
}

export class LLM {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async ask(
    prompt: string,
    responseFormat: LLMResponseFormat = LLMResponseFormat.String
  ): Promise<string> {
    let responseFormatFinal;
    if (responseFormat === LLMResponseFormat.StringArray) {
      responseFormatFinal = zodResponseFormat(
        z.object({ items: z.array(z.string()) }),
        "string_array"
      );
    }

    const completionResponse = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: responseFormatFinal,
    });

    return completionResponse.choices[0].message.content!;
  }

  async askStringArray(prompt: string): Promise<string[]> {
    return JSON.parse(await this.ask(prompt, LLMResponseFormat.StringArray))
      .items;
  }
}
