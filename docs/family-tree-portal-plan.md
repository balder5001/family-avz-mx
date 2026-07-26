# Family Genealogy Portal - Full Development Plan

## Project Overview

A collaborative family genealogy platform where members can:
- Build a shared family tree with infinite generations
- Maintain individual profiles (photo, bio, education, contact info, socials)
- Propose edits about deceased/other family members with approval workflow
- View a person-centric tree (their profile = center when logged in)
- Access a contact list (alphabetical)
- Subscribe to birthday/death calendar (web + iCal)

**Key Principles**: Mobile-first, OAuth-only auth, approval workflows, async notifications, no friction

---

## Tech Stack (Final)

| Layer | Technology | Notes |
|-------|-------------|-------|
| **Frontend** | Next.js 14+ (App Router) | React 18, TypeScript |
| **Styling** | Tailwind CSS | Mobile-first utility framework |
| **Database** | Supabase (PostgreSQL) | Real-time capable, managed |
| **Auth** | Supabase Auth (OAuth) | Google, Facebook, Instagram |
| **File Storage** | Vercel Blob | One photo per person |
| **Email** | Resend (existing) | Invitations, approvals, reminders |
| **Tree Visualization** | `react-d3-tree` | Pan/zoom, person-centric |
| **Calendar Export** | `ical-generator` | iCal feed generation |
| **Hosting** | Vercel | Seamless Next.js deployment |
| **Cron Jobs** | Vercel Cron (or external service) | Auto-approve at midnight after 7 days |

---

## Database Schema (Final)

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_id TEXT UNIQUE NOT NULL,
  oauth_provider TEXT NOT NULL, -- 'google', 'facebook', 'instagram'
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### People
```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  
  -- Core
  first_name TEXT NOT NULL,
  last_name TEXT,
  bio TEXT,
  education TEXT,
  birth_date DATE,
  death_date DATE,
  is_deceased BOOLEAN DEFAULT false,
  
  -- Contact
  phone_number TEXT,
  
  -- Profile
  profile_photo_url TEXT,
  node_color TEXT DEFAULT '#3B82F6',
  
  -- Socials (optional)
  instagram_url TEXT,
  facebook_url TEXT,
  google_url TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Relationships
```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  related_to_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'parent', 'child', 'sibling', 'spouse'
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(person_id, related_to_id, relationship_type)
);
```

### Contributions (Approval Workflow)
```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL,
  proposed_by_user_id UUID NOT NULL REFERENCES users(id),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  
  -- The change
  field_name TEXT NOT NULL, -- 'bio', 'birth_date', 'phone_number', 'profile_photo_url', etc
  proposed_value TEXT,
  
  -- Approval workflow
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'auto_approved'
  needs_approval_from_user_id UUID REFERENCES users(id),
  approved_by_user_id UUID REFERENCES users(id),
  
  -- Auto-approve logic: midnight after 7 days
  created_at TIMESTAMP DEFAULT now(),
  approved_at TIMESTAMP,
  auto_approve_at TIMESTAMP, -- created_at + 7 days, midnight
  
  updated_at TIMESTAMP DEFAULT now()
);
```

### Invitations
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL,
  invite_token TEXT UNIQUE NOT NULL,
  
  -- Pre-fill relationship
  invited_email TEXT,
  relationship_to_person_id UUID REFERENCES people(id),
  relationship_type TEXT NOT NULL, -- 'child', 'parent', 'sibling', 'spouse'
  
  -- Tracking
  created_by_user_id UUID NOT NULL REFERENCES users(id),
  accepted_by_user_id UUID REFERENCES users(id),
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT now()
);
```

### Calendar Subscriptions
```sql
CREATE TABLE calendar_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL,
  calendar_type TEXT DEFAULT 'birthdays', -- 'birthdays', 'deaths', 'all'
  is_active BOOLEAN DEFAULT true,
  ical_token TEXT UNIQUE, -- Random token for feed URL
  created_at TIMESTAMP DEFAULT now()
);
```

### Notifications (Optional Log)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL,
  
  notification_type TEXT, -- 'approval_needed', 'approved', 'rejected', 'auto_approved'
  related_contribution_id UUID REFERENCES contributions(id),
  
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## Project Structure

```
family-tree-portal/
├── .env.local                    # Supabase, Resend, etc.
├── supabase/
│   └── migrations/               # SQL files for schema
│       ├── 001_init_users.sql
│       ├── 002_init_people.sql
│       ├── 003_init_relationships.sql
│       ├── 004_init_contributions.sql
│       ├── 005_init_invitations.sql
│       └── 006_init_calendar_subscriptions.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage (public or redirect to /dashboard)
│   │   ├── auth/
│   │   │   └── callback/         # OAuth callback
│   │   │       └── route.ts
│   │   ├── join/
│   │   │   └── [token]/          # Invitation acceptance page
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Protected layout
│   │   │   ├── page.tsx          # Tree view (main)
│   │   │   ├── profile/
│   │   │   │   └── page.tsx      # User's own profile edit
│   │   │   ├── person/
│   │   │   │   └── [id]/page.tsx # View/edit another person
│   │   │   ├── contacts/
│   │   │   │   └── page.tsx      # Alphabetical contact list
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx      # Birthday/death calendar
│   │   │   └── approvals/
│   │   │       └── page.tsx      # Approval queue
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── people/
│   │   │   │   ├── route.ts      # POST new person, GET all for tree
│   │   │   │   └── [id]/route.ts # GET/PATCH person
│   │   │   ├── relationships/
│   │   │   │   ├── route.ts      # POST new relationship
│   │   │   │   └── [id]/route.ts # DELETE relationship
│   │   │   ├── contributions/
│   │   │   │   ├── route.ts      # GET pending, POST new
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # PATCH approve/reject
│   │   │   ├── invitations/
│   │   │   │   ├── route.ts      # POST create invite
│   │   │   │   └── [token]/
│   │   │   │       └── route.ts  # GET validate, POST accept
│   │   │   ├── calendar/
│   │   │   │   └── [token].ics   # iCal feed endpoint
│   │   │   └── uploads/
│   │   │       └── route.ts      # Photo upload to Vercel Blob
│   │   └── error.tsx             # Error boundary
│   ├── components/
│   │   ├── Tree/
│   │   │   ├── TreeViewer.tsx    # Main tree visualization
│   │   │   ├── TreeNode.tsx      # Individual node component
│   │   │   └── NodeTooltip.tsx   # On hover/click
│   │   ├── Profile/
│   │   │   ├── ProfileCard.tsx   # Display person profile
│   │   │   ├── ProfileEdit.tsx   # Edit form
│   │   │   └── PhotoUpload.tsx   # Photo selector
│   │   ├── Contributions/
│   │   │   ├── ApprovalCard.tsx  # Single pending approval
│   │   │   ├── ApprovalQueue.tsx # List of pending
│   │   │   └── ProposalForm.tsx  # Create new proposal
│   │   ├── Invitations/
│   │   │   ├── InviteForm.tsx    # Send invite
│   │   │   └── JoinFlow.tsx      # Accept invite on join
│   │   ├── Calendar/
│   │   │   ├── BirthdayCalendar.tsx # Month/list view
│   │   │   └── SubscribeModal.tsx   # iCal subscription
│   │   ├── ContactList/
│   │   │   └── ContactsList.tsx  # Alphabetical list
│   │   ├── Navigation/
│   │   │   ├── Navbar.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── Common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── NotificationBell.tsx
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── auth.ts               # Auth helpers
│   │   ├── db.ts                 # Database queries
│   │   ├── tree.ts               # Tree logic (build hierarchy)
│   │   ├── email.ts              # Resend email templates
│   │   ├── ical.ts               # iCal generation
│   │   └── utils.ts              # Helper functions
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── styles/
│       └── globals.css           # Tailwind + custom CSS
├── public/
│   ├── icons/                    # Social icons (Instagram, Facebook, Google)
│   └── images/
├── scripts/
│   └── auto-approve-cron.ts      # Midnight approval job
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## Development Phases

### Phase 1: Authentication & Foundation (Week 1)
- [ ] Supabase project setup + OAuth (Google, Facebook, Instagram)
- [ ] Database schema + migrations
- [ ] User sign-in/sign-out flow
- [ ] Protected routes (middleware)
- [ ] Basic layout (navbar, mobile menu)

**Deliverable**: User can sign in with OAuth and see a protected dashboard

---

### Phase 2: Core Tree (Week 2)
- [ ] Create person endpoint + form
- [ ] Relationships CRUD
- [ ] Tree visualization (`react-d3-tree`)
- [ ] Person-centric view (zoom to self when logging in)
- [ ] Node styling (colors, gold frame for deceased)
- [ ] Click node → show profile card (photo, name, dates, bio, socials)

**Deliverable**: You can create yourself, add your sister, and see tree structure

---

### Phase 3: Invitation + Join Flow (Week 2–3)
- [ ] Generate invite link with pre-filled relationship
- [ ] Send email via Resend
- [ ] Accept invite page (shows relationship confirmation, allows change)
- [ ] Auto-create person + link user on join
- [ ] Validate token, handle expiry

**Deliverable**: You can invite mom/sister; they join and tree updates live

---

### Phase 4: Profile Management (Week 3)
- [ ] Edit your own profile (bio, education, phone, socials, color, photo)
- [ ] Auto-save on input
- [ ] Photo upload to Vercel Blob
- [ ] Grayscale for empty fields

**Deliverable**: Each person manages their own profile with ease

---

### Phase 5: Contributions & Approval (Week 3–4)
- [ ] Propose edit about someone else (bio, photo, dates, phone)
- [ ] Approval queue (needs_approval_from sees pending)
- [ ] Approve/reject flow
- [ ] Email notification on approval/rejection
- [ ] Auto-approve at midnight after 7 days (cron job)
- [ ] Deceased additions require approval (from primary relative or auto-approve)

**Deliverable**: You can propose edits about mom; sister approves; auto-approval works

---

### Phase 6: Contact List & Calendar (Week 4)
- [ ] Contact list: alphabetical, shows name + email + phone (if present)
- [ ] Birthday calendar: web view (month/list toggle)
- [ ] iCal feed endpoint (`/api/calendar/[token].ics`)
- [ ] Calendar subscription modal (copy feed URL to Apple/Outlook)
- [ ] Resend reminders (optional: 1 day before birthday)

**Deliverable**: Contact list is alphabetical; calendar exports to Apple/Google Calendar

---

### Phase 7: Polish & Optimization (Week 4–5)
- [ ] Mobile responsiveness finalization
- [ ] Dark mode toggle (optional)
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Error boundaries & 404 pages
- [ ] Loading skeletons
- [ ] Notification center UI
- [ ] Performance: tree render optimization for large families

**Deliverable**: Production-ready, mobile-first, smooth UX

---

### Phase 8: Deployment & Monitoring (Week 5)
- [ ] Deploy to Vercel
- [ ] Supabase production setup
- [ ] Environment variables locked
- [ ] Email templates tested in production
- [ ] Cron job (auto-approve) verified
- [ ] Analytics (optional: Vercel analytics)

**Deliverable**: Live on your domain, all features working

---

## Key Implementation Details

### 1. OAuth Setup (Supabase)
```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// In dashboard, always fetch current user
const { data: { user } } = await supabase.auth.getUser();
```

### 2. Tree Visualization
```typescript
// src/components/Tree/TreeViewer.tsx
import Tree from 'react-d3-tree';

// Build hierarchical data from relationships
// Center node = current user
// Parents go up, children go down
// Siblings at same level
```

### 3. Contribution Workflow
```typescript
// When editing someone else's profile
1. Get current user
2. Check if user === person_id
   - If yes: write directly to people table
   - If no: create contribution record + notify person
3. Email goes to needs_approval_from_user_id
4. Approval button updates status + writes to people table
```

### 4. Auto-Approve Cron
```typescript
// scripts/auto-approve-cron.ts
// Run daily at midnight UTC
// SELECT * FROM contributions WHERE status='pending' AND auto_approve_at < now()
// UPDATE to status='auto_approved', approved_by=NULL
// Send email to proposed_by_user about auto-approval
```

### 5. iCal Feed
```typescript
// src/app/api/calendar/[token].ics
// GET token from URL
// Validate token matches user
// Query all birthdays + death_dates from family
// Generate .ics file with VEVENT entries
// Set Content-Type: text/calendar
```

### 6. Photo Upload
```typescript
// src/lib/blob.ts
import { put } from '@vercel/blob';

export async function uploadPhoto(file: File, personId: string) {
  const blob = await put(`photos/${personId}`, file, { access: 'public' });
  return blob.url;
}
```

### 7. Mobile-First CSS (Tailwind)
```typescript
// Use sm:, md:, lg: prefixes sparingly
// Default = mobile, then enhance upward
// Touch-friendly: buttons 44px min, adequate spacing
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Initiate OAuth |
| GET | `/api/auth/callback` | OAuth redirect |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/people` | Fetch all family members + tree |
| POST | `/api/people` | Create new person |
| PATCH | `/api/people/[id]` | Update own profile (direct) |
| POST | `/api/relationships` | Add relationship |
| DELETE | `/api/relationships/[id]` | Remove relationship |
| POST | `/api/contributions` | Propose edit |
| GET | `/api/contributions` | Get pending approvals for user |
| PATCH | `/api/contributions/[id]` | Approve/reject |
| POST | `/api/invitations` | Create invite link |
| GET | `/api/invitations/[token]` | Validate token |
| POST | `/api/invitations/[token]/accept` | Accept invite + create user |
| POST | `/api/uploads` | Upload photo to Blob |
| GET | `/api/calendar/[token].ics` | iCal feed |

---

## Environment Variables

```
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OAuth Credentials (Supabase dashboard handles these)
NEXT_PUBLIC_OAUTH_PROVIDERS=google,facebook,instagram

# Resend (for emails)
RESEND_API_KEY=xxx

# Vercel Blob
BLOB_READ_WRITE_TOKEN=xxx

# Optional
NEXT_PUBLIC_SITE_URL=https://yourfamily.com
```

---

## Testing Strategy

1. **Unit**: Utility functions (tree building, iCal generation)
2. **Integration**: API endpoints (with Supabase test instance)
3. **E2E**: 
   - Sign in → create person → invite → join → approve edit
   - Calendar export → add to Apple Calendar
   - Contact list sort → verify alphabetical
4. **Manual**: 
   - Mobile (iOS Safari, Android Chrome)
   - Deceased node visual (gold frame)
   - 7-day auto-approve (set clock forward locally)

---

## Deployment Checklist

- [ ] Supabase production DB (backed up)
- [ ] Vercel environment variables set
- [ ] OAuth redirect URIs updated in providers
- [ ] Resend API key active
- [ ] Vercel Blob token active
- [ ] Cron job configured (Vercel Cron or external service)
- [ ] Custom domain DNS configured
- [ ] SSL certificate provisioned
- [ ] First user (you) created manually in Supabase Auth
- [ ] Test end-to-end: sign in → tree → invite → approvals → calendar
- [ ] Monitoring: error tracking (optional Sentry)

---

## Future Enhancements (Post-MVP)

- [ ] Photo gallery per person (multiple photos, sorted)
- [ ] Timeline: milestones/events with dates + photos
- [ ] DNA/health info (private, encrypted)
- [ ] Family stories/audio recordings
- [ ] Export tree to PDF/image
- [ ] Dark mode theme toggle
- [ ] Notifications in-app bell icon (real-time with Supabase subscriptions)
- [ ] Search across family tree
- [ ] Private notes (only visible to you)
- [ ] Backup/import from Ancestry/FamilyTree DNA

---

## Estimated Timeline

- **Total**: 4–5 weeks (working part-time)
- **Weeks 1–2**: Auth + Core tree + Basic profiles
- **Weeks 2–3**: Invitations + Profile editing
- **Weeks 3–4**: Contributions approval + Contact list + Calendar
- **Weeks 4–5**: Polish + Deploy

---

## Notes for Developer

1. **Assume mobile users** — Make every interaction touch-friendly
2. **Async-first** — Approvals happen via email; web UI is optional
3. **Auto-save** — Never make users click "save"; write on blur/change
4. **Error handling** — Network failures happen; graceful fallbacks
5. **Data validation** — Dates, phone, URLs on input; server-side again on API
6. **Deceased visual** — Gold frame around node, grayed out text in profile
7. **Family ID** — All records belong to family_id; use Row-Level Security (RLS) in Supabase
8. **Cron precision** — Auto-approve must run midnight UTC consistently

---

## Questions Before Starting

1. What's your family_id? (UUID you generate once, used for all data)
2. Should notifications show in a bell icon (with unread count), or email-only?
3. Do you want to send a reminder email the day before a birthday?
4. Should deceased people be creatable only by admins, or anyone?
5. Want a "family settings" page (name, description, custom colors)?
