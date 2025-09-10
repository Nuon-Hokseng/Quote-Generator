"use client";
import React, { useState } from "react";
import Button from "../UI/Button";
import { Heart } from "lucide-react";
import Button_auth from "../UI/Button_auth";
import { useRouter } from "next/navigation";
type Quote = {
  quote: string;
  author: string;
};

export default function Homepage() {
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const [liked, setLiked] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileData, setProfileData] = useState<{ username: string } | null>(
    null
  );
  React.useEffect(() => {
    async function checkAuth() {
      const { createClient } = await import("../../../utils/client");
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsSignedIn(!!session?.user);
      setAuthLoading(false);

      // Fetch profile data if signed in
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
        if (profile && !error) {
          setProfileData(profile);
        } else {
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    }
    checkAuth();
  }, []);
  const handleLogout = async () => {
    const { createClient } = await import("../../../utils/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsSignedIn(false);
  };

  async function generateQuote() {
    if (fetching) return;
    setFetching(true);
    setError(null);
    setLiked(false);

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white font-sans transition-all duration-500 relative">
      {authLoading
        ? null
        : isSignedIn && (
            <div className="absolute top-6 left-6 z-10">
              <Button_auth onClick={handleLogout}>Log out</Button_auth>
            </div>
          )}
      <h1 className="text-4xl font-bold mb-8 tracking-wide drop-shadow-lg">
        Quote Generator
      </h1>

      <div className="bg-white/20  rounded-xl px-8 py-6 mb-4 shadow-lg max-w-md text-center text-lg font-medium text-white backdrop-blur-md">
        {error ? (
          <p>{error}</p>
        ) : quote ? (
          <>
            <p className="text-xl font-semibold">&quot;{quote.quote}&quot;</p>
            <p className="mt-2">
              <span className="font-bold text-red-900">Author</span> -{" "}
              {quote.author || "Unknown"}
            </p>
            <div className="mt-4">
              <Heart
                size={28}
                className={`
                  cursor-pointer transition-all duration-150
                  ${
                    liked
                      ? "text-red-500 scale-125"
                      : "text-white hover:scale-110"
                  }
                `}
                onClick={async () => {
                  if (!isSignedIn) {
                    setShowSignInPrompt(true);
                  } else {
                    setLiked(!liked);
                    try {
                      const { createClient } = await import(
                        "../../../utils/client"
                      );
                      const supabase = createClient();
                      const {
                        data: { user },
                      } = await supabase.auth.getUser();
                      if (!user || !quote) return;

                      // Find profileId from profiles table by user email
                      const { data: profileData, error: profileError } =
                        await supabase
                          .from("profiles")
                          .select("id")
                          .eq("email", user.email)
                          .single();
                      if (profileError || !profileData) return;
                      const profileid = profileData.id;

                      // Find quoteId from myQuote table by quote and author
                      const { data: quoteData, error: quoteError } =
                        await supabase
                          .from("myQuote")
                          .select("id")
                          .eq("quote", quote.quote)
                          .eq("author", quote.author)
                          .single();
                      if (quoteError || !quoteData) return;
                      const quoteid = quoteData.id;

                      // Insert into saved_quotes (profileId, quoteId)
                      await supabase.from("saved_quotes").insert([
                        {
                          id: crypto.randomUUID(),
                          profileid,
                          quoteid,
                        },
                      ]);
                    } catch (e) {}
                  }
                }}
              />
              {showSignInPrompt && (
                <div className="mt-2 text-sm text-red-200 bg-red-900/40 rounded p-2">
                  Please sign in to save your favouirte quote.
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Click the button to fetch a quote.</p>
        )}
      </div>

      <Button onClick={generateQuote} disabled={fetching}>
        {fetching ? "Loading..." : "Generate Quote"}
      </Button>
      <br />
      <br />
      {isSignedIn && profileData?.username ? (
        <span className="text-lg font-semibold bg-white  bg-clip-text text-transparent drop-shadow">
          Hello {profileData.username}, Motivate your day with our quotes!
        </span>
      ) : (
        <span className="text-sm text-white/70">
          Wanna save your favourite quotes?
        </span>
      )}
      <div className="mt-2 flex gap-2">
        {authLoading ? (
          <span className="text-white/70 text-sm">
            Checking authentication...
          </span>
        ) : !isSignedIn ? (
          <>
            <Button_auth onClick={() => router.push("/login")}>
              log in
            </Button_auth>
            <Button_auth onClick={() => router.push("/signup")}>
              sign up
            </Button_auth>
          </>
        ) : (
          <div>
            <br />
            <Button_auth onClick={() => router.push("/saved")}>
              Saved quotes
            </Button_auth>
          </div>
        )}
      </div>

      <footer className="mt-12 text-sm text-white/70">
        Made by <span className="text-red-900">♥</span> Nuon Hokseng
      </footer>
    </div>
  );
}
