import { postWithLLM } from "../_common/endpoints";
import { LLM } from "../_common/llm";

import amaryllis from "./_amaryllis";

export const POST = postWithLLM(async (llm, { method, payload }) => {
  const allMethods: { [key: string]: (llm: LLM, body: any) => Promise<any> } = {
    ...amaryllis,
  };

  if (!allMethods[method]) {
    throw new Error(`Method not found: ${method}`);
  }
  return allMethods[method](llm, payload);
});
