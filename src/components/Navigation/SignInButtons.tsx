"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/auth";

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="outline" className="rounded-full" onClick={() => signInWithOAuth("google")}>
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="rounded-full"
        disabled
        title="Facebook sign-in is pending Meta's app review"
      >
        Continue with Facebook (pending review)
      </Button>
    </div>
  );
}
