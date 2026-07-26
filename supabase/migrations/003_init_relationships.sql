create table relationships (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  related_to_id uuid not null references people(id) on delete cascade,
  relationship_type text not null, -- 'parent', 'child', 'sibling', 'spouse'
  created_at timestamptz default now(),

  unique(person_id, related_to_id, relationship_type)
);

create index relationships_person_id_idx on relationships(person_id);
create index relationships_related_to_id_idx on relationships(related_to_id);
