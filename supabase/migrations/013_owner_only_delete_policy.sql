-- Narrow deletion to the app owner's account only, per request — other
-- family members shouldn't be able to remove people, even unclaimed ones.
drop policy "delete unclaimed person" on people;

create policy "owner deletes unclaimed person" on people
  for delete to authenticated
  using (
    user_id is null
    and (select auth.uid()) = '75b2e436-480f-42c7-a8dd-90891d7bf5aa'
  );
