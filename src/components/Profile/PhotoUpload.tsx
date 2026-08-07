"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { uploadProfilePhoto } from "@/lib/actions";

export function PhotoUpload({
  currentPhotoUrl,
  initials,
}: {
  currentPhotoUrl: string | null;
  initials: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.set("photo", file);
    startTransition(async () => {
      try {
        await uploadProfilePhoto(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  const displayUrl = previewUrl ?? currentPhotoUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="relative h-20 w-20 overflow-hidden rounded-full bg-muted disabled:opacity-60"
      >
        {displayUrl ? (
          <Image src={displayUrl} alt="Profile photo" fill sizes="80px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-[11px] font-medium text-transparent transition-colors hover:bg-black/50 hover:text-white">
          {isPending ? "Uploading…" : "Change"}
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
