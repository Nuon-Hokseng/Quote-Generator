"use client";
import { signup } from "./action";
import { useRouter } from "next/navigation";
import Button_Auth from "../UI/Button_auth";
import { useState } from "react";
export default function Homepage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await signup(formData);

    if (result.success) {
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/"); 
      }, 3000);
    } else {
      setMessage(`Signup failed: ${result.message}`);
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-300 via-pink-400 to-red-500 text-white font-sans transition-all duration-500">
      <h1 className="text-4xl font-bold mb-8 tracking-wide drop-shadow-lg">
        Quote Generator
      </h1>

      <div className="bg-white/20  rounded-xl px-8 py-6 mb-4 shadow-lg max-w-md text-center text-lg font-medium text-white backdrop-blur-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="name">Username</label>
          <input
            className="border-2 rounded-lg text-sm"
            id="name"
            name="name"
            type="name"
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            className="border-2 rounded-lg text-sm"
            id="email"
            name="email"
            type="email"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            className="border-2 rounded-lg text-sm"
            id="password"
            name="password"
            type="password"
            required
          />
          <Button_Auth type="submit">SignUp</Button_Auth>
           {message && <p>{message}</p>}
        </form>
      </div>

      <footer className="mt-12 text-sm text-white/70">
        Made by <span className="text-red-900">♥</span> Nuon Hokseng
      </footer>
    </div>
  );
}
