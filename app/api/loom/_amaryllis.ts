import { LLM } from "../_common/llm";

const methods = {
  amaryllis: async (llm: LLM, { feeling }: { feeling: string }) => {
    // originally from https://www.akademie-lernpaedagogik.de/wp-content/uploads/2024/01/Growth-Mindset_Akademie-fu%CC%88r-Lernpa%CC%88dagogik.pdf
    return llm.askStringArray(`Ich habe bereits folgende motivierende Sätze zum "Growth Mindset":
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
  
  Gib mir weitere ähnlich motivierende Sätze, die aber implizit den Umgang mit folgendem Gefühl betreffen, das durch einen Narzissten ausgelöst wurde: ${feeling}`);
  },
};

export default methods;
