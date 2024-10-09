"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Textarea, Button, Slider } from "@nextui-org/react";

/**
 * A page which has "Autocomplete" as a title. Also it has a large textarea on the left for the user's notes.
 * On the right, there's another textarea which contains the template "Based on the following, output suitable suggestions
 * for the next few words:\n\n{{text}}". Below that, there's another section which just lists the obtained suggestions.
 *
 * While typing, use lodash's debounce with 5000 seconds delay to call a function which updates the
 * text below the right textarea continuously. It should create a prompt for that by using the template
 * and replacing the {{text}} with the current content of the left textarea.
 * Then it should make a backend request to the /api/autocomplete endpoint, passing the resulting prompt to it.
 * The response is an array of strings, which should be displayed below the right textarea.
 */

export default function Autocomplete() {
  const [userInput, setUserInput] = useState("");
  const [template, setTemplate] = useState(
    "Based on the following, output a suitable continuation of the line at the very end. Output nothing but the continuation:\n\n{{text}}"
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceDelay, setDebounceDelay] = useState(1000);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSuggestions = async (text: string) => {
    // If there's an ongoing request, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    const prompt = template.replace("{{text}}", text);
    try {
      const response = await fetch("/api/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error("Failed to fetch suggestions");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching suggestions:", error);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, debounceDelay),
    [template, debounceDelay]
  );

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debounceDelay]);

  const handleRegenerateSuggestions = () => {
    fetchSuggestions(userInput);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h1 className="text-2xl font-bold">Autocomplete</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Textarea
            value={userInput}
            onValueChange={(newInput) => {
              setUserInput(newInput);
              debouncedFetchSuggestions(newInput);
            }}
            label="User input"
            placeholder="Enter your notes here..."
            minRows={15}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Debounce Delay: {debounceDelay}ms
            </label>
            <Slider
              aria-label="Debounce Delay"
              step={100}
              maxValue={5000}
              minValue={100}
              value={debounceDelay}
              onChange={(value) => setDebounceDelay(value as number)}
              className="max-w-md"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Textarea
            value={template}
            onValueChange={setTemplate}
            label="Template"
            placeholder="Enter template here..."
            minRows={5}
            className="mb-4"
          />
          <Textarea
            value={loading ? "Loading suggestions..." : suggestions.join("\n")}
            label="Suggestions"
            placeholder="Suggestions will appear here..."
            minRows={5}
            readOnly
            className="mb-2"
          />
          <Button
            color="primary"
            onClick={handleRegenerateSuggestions}
            isLoading={loading}
          >
            Regenerate suggestions
          </Button>
        </div>
      </div>
    </>
  );
}
