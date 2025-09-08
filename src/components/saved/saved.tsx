/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button_auth from "../UI/Button_auth";

type Quote = {
  id: string;
  quote: string;
  author: string;
};

export default function Saved() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    async function fetchSavedQuotes() {
      const { createClient } = await import("../../../utils/client");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
      if (!user) {
        setLoading(false);
        setQuotes([]);
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .single();
      if (profileError || !profileData) {
        setError("Profile not found.");
        setQuotes([]);
        setLoading(false);
        return;
      }
      const profileId = profileData.id;

      // Fetch saved quotes for this profileId
      const { data, error } = await supabase
        .from("saved_quotes")
        .select("id, myQuote(quote, author)")
        .eq("profileid", profileId);

      if (error) {
        setError(error.message);
        setQuotes([]);
      } else {
        setQuotes(
          (data || []).map((row: any) => ({
            id: row.id,
            quote: row.myQuote?.quote || "",
            author: row.myQuote?.author || "Unknown",
          }))
        );
      }
      setLoading(false);
    }
    fetchSavedQuotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white">
        <span>Loading saved quotes...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white">
        <h1 className="text-3xl font-bold mb-6">Saved Quotes</h1>
        <p className="mb-4">Please sign in to view your saved quotes.</p>
        <div className="flex gap-2">
          <Button_auth onClick={() => router.push("/login")}>
            Log in
          </Button_auth>
          <Button_auth onClick={() => router.push("/signup")}>
            Sign up
          </Button_auth>
        </div>
      </div>
    );
  }

  // Remove quote handler
  async function handleRemove(id: string) {
    setRemovingId(id);
    const { createClient } = await import("../../../utils/client");
    const supabase = createClient();
    const { error } = await supabase.from("saved_quotes").delete().eq("id", id);
    if (!error) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    } else {
      setError(error.message);
    }
    setRemovingId(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white font-sans transition-all duration-500">
      <h1 className="text-4xl font-bold mb-8 tracking-wide drop-shadow-lg">
        Saved Quotes
      </h1>
      {error && <p className="mb-4 text-red-200">{error}</p>}
      {quotes.length === 0 ? (
        <p className="text-lg">No saved quotes yet.</p>
      ) : (
        <div
          className="bg-white/20 rounded-xl px-8 py-6 mb-4 shadow-lg max-w-md w-full text-center text-lg font-medium text-white backdrop-blur-md"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {quotes.map((q) => (
            <div key={q.id} className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xl font-semibold">&quot;{q.quote}&quot;</p>
                <p className="mt-2">
                  <span className="font-bold text-red-900">Author</span> -{" "}
                  {q.author || "Unknown"}
                </p>
              </div>
              <button
                aria-label="Remove quote"
                className="ml-4 p-2 rounded hover:bg-red-200/30 transition"
                onClick={() => handleRemove(q.id)}
                disabled={removingId === q.id}
              >
                {/* Bin SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-red-900 hover:text-red-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7m3 4v6m4-6v6"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <footer className="mt-12 text-sm text-white/70">
        Made by <span className="text-red-900">♥</span> Nuon Hokseng
      </footer>
    </div>
  );
}
