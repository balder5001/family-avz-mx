"use client";

import { createClient } from "@/lib/supabase/client";

export type OAuthProvider = "google" | "facebook";

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
