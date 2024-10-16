"use client";

import React, { useState } from "react";
import { Textarea } from "@nextui-org/react";
import ButtonWithAction from "../_common/ButtonWithAction";
import Heading from "../_common/Heading";

export default function Amaryllis() {
  const [userInput, setUserInput] = useState("");
  const [phrases, setPhrases] = useState<string[]>([]);

  return (
    <>
      <Heading>Amaryllis</Heading>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Textarea
            value={userInput}
            onValueChange={(newInput) => setUserInput(newInput)}
            label="Wie fühlst du dich wegen eines Narzissten?"
            placeholder="Ich fühle mich..."
            minRows={15}
            className="mb-2"
          />
          <ButtonWithAction
            method="amaryllis"
            body={{ feeling: userInput }}
            callback={setPhrases}
          >
            Motivationssprüche generieren
          </ButtonWithAction>
        </div>
        <div className="w-full md:w-1/2">
          {phrases?.map((phrase) => (
            <div className="mb-2" key={phrase}>
              {phrase}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
