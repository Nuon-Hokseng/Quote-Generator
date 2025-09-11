"use server";

import { createClient } from "../../../utils/supabase/server";
export async function signup(formData: FormData) {
  const data = {
    username: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  if (
    [
      "vathana",
      "vong vathana",
      "Vong Vathana",
      "Vathana",
      "vath",
      "Vath",
    ].includes(data.username)
  ) {
    return {
      success: false,
      message: "what a gay name, mk late hz pherk orn tt, bach use teh",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { success: false, message: authError.message };
  }
  if (authData.user) {
    const { error: dbError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        username: data.username,
        email: data.email,
      },
    ]);

    if (dbError) {
      return { success: false, message: dbError.message };
    }
  }

  return {
    success: true,
    message: "Signup successful! You are now logged in.",
    redirect: "/",
    loggedIn: true,
  };
}
