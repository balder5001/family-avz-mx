import { claimPerson } from "@/lib/actions";

export function ClaimButton({ personId }: { personId: string }) {
  return (
    <form action={claimPerson}>
      <input type="hidden" name="personId" value={personId} />
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        This is me — claim this profile
      </button>
    </form>
  );
}
