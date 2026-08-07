import { claimPerson } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function ClaimButton({ personId }: { personId: string }) {
  return (
    <form action={claimPerson}>
      <input type="hidden" name="personId" value={personId} />
      <Button type="submit" className="rounded-full">
        This is me — claim this profile
      </Button>
    </form>
  );
}
