import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = new URL(process.env.POSTGRES_URL_NON_POOLING);
url.searchParams.delete("sslmode");
url.searchParams.delete("supa");

const client = new Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: false } });
await client.connect();

const { rows: users } = await client.query("select id, email, oauth_provider from public.users");
console.log("public.users:", users);

const { rows: rls } = await client.query(`
  select relname, relrowsecurity
  from pg_class
  where relname in ('users', 'people', 'relationships', 'contributions', 'invitations', 'calendar_subscriptions', 'notifications')
  order by relname;
`);
console.log("RLS status:", rls);

await client.end();
