-- Backfill public.users for accounts that signed in before the
-- on_auth_user_created trigger (007) existed.
insert into public.users (id, oauth_id, oauth_provider, email)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'sub', au.id::text),
  coalesce(au.raw_app_meta_data->>'provider', 'unknown'),
  au.email
from auth.users au
on conflict (id) do nothing;
