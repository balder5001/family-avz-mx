"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareProfileButton({ personId }: { personId: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/dashboard/person/${personId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" className="rounded-full" onClick={share}>
      {copied ? "Link copied!" : "Share profile link"}
    </Button>
  );
}
