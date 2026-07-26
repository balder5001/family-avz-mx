create table people (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  user_id uuid references users(id),

  -- Core
  first_name text not null,
  last_name text,
  bio text,
  education text,
  birth_date date,
  death_date date,
  is_deceased boolean default false,

  -- Contact
  phone_number text,

  -- Profile
  profile_photo_url text,
  node_color text default '#3B82F6',

  -- Socials (optional)
  instagram_url text,
  facebook_url text,
  google_url text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index people_family_id_idx on people(family_id);
