-- Single-family app: every signed-in user is a family member, so reads are
-- broadly shared. Writes are scoped to what each user owns; editing someone
-- else's profile is deferred to the Phase 5 contributions/approval flow.

alter table users enable row level security;
alter table people enable row level security;
alter table relationships enable row level security;
alter table contributions enable row level security;
alter table invitations enable row level security;
alter table calendar_subscriptions enable row level security;
alter table notifications enable row level security;

-- users: only your own row (contains email — no reason to broadcast it)
create policy "select own user row" on users
  for select to authenticated
  using ( (select auth.uid()) = id );

-- people: whole family can read the tree; you can only create/claim your
-- own person node directly, and only edit the one linked to you
create policy "select people" on people
  for select to authenticated
  using ( true );

create policy "insert people" on people
  for insert to authenticated
  with check ( user_id is null or user_id = (select auth.uid()) );

create policy "update own person" on people
  for update to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

-- relationships: whole family can read and add edges to the tree
create policy "select relationships" on relationships
  for select to authenticated
  using ( true );

create policy "insert relationships" on relationships
  for insert to authenticated
  with check ( true );

create policy "delete relationships" on relationships
  for delete to authenticated
  using ( true );

-- contributions, invitations, calendar_subscriptions, notifications:
-- RLS enabled, no policies yet — not used until later phases.
