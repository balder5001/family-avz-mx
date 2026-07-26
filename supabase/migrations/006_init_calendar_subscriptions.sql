create table calendar_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  family_id uuid not null,
  calendar_type text default 'birthdays', -- 'birthdays', 'deaths', 'all'
  is_active boolean default true,
  ical_token text unique, -- Random token for feed URL
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  family_id uuid not null,

  notification_type text, -- 'approval_needed', 'approved', 'rejected', 'auto_approved'
  related_contribution_id uuid references contributions(id),

  is_read boolean default false,
  created_at timestamptz default now()
);
