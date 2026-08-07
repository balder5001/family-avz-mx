import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPersonById, getPersonByUserId } from "@/lib/people";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { ClaimButton } from "@/components/Profile/ClaimButton";
import { EditProfileForm } from "@/components/Profile/EditProfileForm";

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const person = await getPersonById(id);
  if (!person) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Person not found.</p>
      </div>
    );
  }

  const isOwnProfile = person.userId === user.id;
  const isUnclaimed = person.userId === null;
  const viewerAlreadyHasProfile = isUnclaimed ? Boolean(await getPersonByUserId(user.id)) : false;

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-8">
      <Link href="/dashboard" className="self-start text-sm text-muted-foreground hover:underline">
        ← Back to tree
      </Link>

      <ProfileCard person={person} />

      {isOwnProfile && <EditProfileForm person={person} />}

      {isUnclaimed && !viewerAlreadyHasProfile && <ClaimButton personId={person.id} />}

      {isUnclaimed && viewerAlreadyHasProfile && (
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          You already have a profile, so you can&apos;t claim this one. Share this link with the
          person it belongs to instead.
        </p>
      )}

      {!isOwnProfile && !isUnclaimed && (
        <p className="text-sm text-muted-foreground">This profile belongs to someone else.</p>
      )}
    </div>
  );
}
