-- Lets any family member clean up unclaimed people (e.g. duplicates created
-- by an accidental double form submission). Claimed profiles — including
-- your own — can't be deleted this way; that stays deferred to a future
-- moderation flow.
create policy "delete unclaimed person" on people
  for delete to authenticated
  using ( user_id is null );
