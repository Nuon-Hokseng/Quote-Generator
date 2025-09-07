/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import Button from "../UI/Button";

type Quote = {
  quote: string;
  author: string;
};

export default function Homepage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  async function generateQuote() {
    if (fetching) return;
    setFetching(true);
    setError(null);

    try {
      const res = await fetch("/api/random");
      if (!res.ok) throw new Error("No quotes available.");
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      setError("Opp! something went wrong, kindly try one more time.");
      setQuote(null);
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white font-sans transition-all duration-500">
      <h1 className="text-4xl font-bold mb-8 tracking-wide drop-shadow-lg">
        Quote Generator
      </h1>
      <div className="bg-white/20 rounded-xl px-8 py-6 mb-8 shadow-lg max-w-md text-center text-lg font-medium text-white backdrop-blur-md">
        {error ? (
          <p>{error}</p>
        ) : quote ? (
          <>
            <p className="text-sm xl:text-xl font-semibold">
              &quot;{quote.quote}&quot;
            </p>
            <p className="mt-2 text-sm xl:text-xl ">
              <span className="font-bold text-red-900">Author</span> -{" "}
              {quote.author}
            </p>
          </>
        ) : (
          <p>Click the button to fetch a quote.</p>
        )}
      </div>
      <Button onClick={generateQuote} disabled={fetching}>
        {fetching ? "Loading..." : "Generate Quote"}
      </Button>
      <footer className="mt-12 text-sm text-white/70">
        Made by <span className="text-red-900">♥</span> Nuon Hokseng
      </footer>
    </div>
  );
}
