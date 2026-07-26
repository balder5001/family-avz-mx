create table contributions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  proposed_by_user_id uuid not null references users(id),
  person_id uuid not null references people(id) on delete cascade,

  -- The change
  field_name text not null, -- 'bio', 'birth_date', 'phone_number', 'profile_photo_url', etc
  proposed_value text,

  -- Approval workflow
  status text default 'pending', -- 'pending', 'approved', 'rejected', 'auto_approved'
  needs_approval_from_user_id uuid references users(id),
  approved_by_user_id uuid references users(id),

  -- Auto-approve logic: midnight after 7 days
  created_at timestamptz default now(),
  approved_at timestamptz,
  auto_approve_at timestamptz, -- created_at + 7 days, midnight

  updated_at timestamptz default now()
);

create index contributions_status_idx on contributions(status);
create index contributions_needs_approval_from_user_id_idx on contributions(needs_approval_from_user_id);
