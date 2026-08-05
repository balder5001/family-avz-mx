-- A double form submission created two people rows for the same user_id.
-- Keep the earliest row per user, drop the rest, then make it impossible
-- to happen again.
delete from people p
using people p2
where p.user_id is not null
  and p.user_id = p2.user_id
  and p.created_at > p2.created_at;

create unique index people_user_id_unique on people (user_id) where user_id is not null;
