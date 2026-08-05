"use client";

import { useState } from "react";

export function ShareProfileButton({ personId }: { personId: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/dashboard/person/${personId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={share}
      className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
    >
      {copied ? "Link copied!" : "Share profile link"}
    </button>
  );
}
