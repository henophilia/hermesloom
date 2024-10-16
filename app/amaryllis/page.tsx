"use client";

import React, { useState } from "react";
import { Textarea, Button } from "@nextui-org/react";

export default function Autocomplete() {
  const [userInput, setUserInput] = useState("");
  const [phrases, setPhrases] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhrases = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/amaryllis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeling: userInput }),
      });
      if (response.ok) {
        const data = await response.json();
        setPhrases(data);
      } else {
        console.error("Failed to fetch phrases");
      }
    } catch (error: unknown) {
      console.error("Error fetching phrases:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">Amaryllis</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Textarea
            value={userInput}
            onValueChange={(newInput) => setUserInput(newInput)}
            label="Wie fühlst du dich?"
            placeholder="Ich fühle mich..."
            minRows={15}
            className="mb-2"
          />
          <Button
            color="primary"
            onClick={() => fetchPhrases()}
            isLoading={loading}
          >
            Motivationssprüche generieren
          </Button>
        </div>
        <div className="w-full md:w-1/2">
          {phrases?.map((phrase) => <div key={phrase}>{phrase}</div>)}
        </div>
      </div>
    </>
  );
}
