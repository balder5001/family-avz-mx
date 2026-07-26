create table invitations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  invite_token text unique not null,

  -- Pre-fill relationship
  invited_email text,
  relationship_to_person_id uuid references people(id),
  relationship_type text not null, -- 'child', 'parent', 'sibling', 'spouse'

  -- Tracking
  created_by_user_id uuid not null references users(id),
  accepted_by_user_id uuid references users(id),
  accepted_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz default now()
);

create index invitations_invite_token_idx on invitations(invite_token);
