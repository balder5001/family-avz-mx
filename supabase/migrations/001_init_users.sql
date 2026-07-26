create table users (
  id uuid primary key default gen_random_uuid(),
  oauth_id text unique not null,
  oauth_provider text not null, -- 'google', 'facebook', 'instagram'
  email text unique not null,
  created_at timestamptz default now()
);
