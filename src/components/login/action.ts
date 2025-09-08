"use server";

import { createClient } from "../../../utils/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };

  // Check if email is verified
  if (data.user && !data.user.email_confirmed_at) {
    return {
      success: false,
      message: "Please confirm your email before signing in.",
    };
  }

  return { success: true, user: data.user };
}
