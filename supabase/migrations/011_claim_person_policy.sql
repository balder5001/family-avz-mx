-- The existing "update own person" policy requires user_id = auth.uid() on
-- the CURRENT row, which blocks claiming — an unclaimed person has
-- user_id IS NULL. This policy covers that one specific transition:
-- null -> your own uid, and nothing else.
create policy "claim unclaimed person" on people
  for update to authenticated
  using ( user_id is null )
  with check ( user_id = (select auth.uid()) );
