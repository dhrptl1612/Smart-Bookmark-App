# 🔖 Realtime Bookmark Manager

A secure, full-stack realtime bookmark management application built with Next.js (App Router) and Supabase.

This project demonstrates production-level authentication, database security using Row Level Security (RLS), and realtime UI synchronization without page refresh.

---

# 📌 What I Built

I built a multi-user bookmark manager where:

- Users authenticate using Google OAuth
- Each user can create bookmarks
- Each user can delete bookmarks
- Users only see their own data
- UI updates instantly using Supabase Realtime
- Security is enforced at the database level using RLS

This is secure, realtime, multi-user CRUD.

---

# 🚀 Features

- 🔐 Google OAuth authentication
- ➕ Create bookmarks
- 🗑 Delete bookmarks
- ⚡ Realtime updates (INSERT + DELETE)
- 🔒 Secure Row Level Security (RLS)
- 📱 Responsive UI
- 🌙 Dark mode support

---

# 🛠 Tech Stack

- Next.js 16 (App Router)
- React
- Tailwind CSS
- Supabase (Database + Auth + Realtime)
- PostgreSQL
- TypeScript

---

# 🏗 Database Schema

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  user_id uuid not null,
  created_at timestamp with time zone default now()
);
```

---

# 🔐 Row Level Security Policies

```sql
alter table bookmarks enable row level security;

create policy "Select own bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);

create policy "Insert own bookmarks"
on bookmarks
for insert
with check (auth.uid() = user_id);

create policy "Delete own bookmarks"
on bookmarks
for delete
using (auth.uid() = user_id);
```

---

# ⚡ Realtime Configuration

```sql
alter table bookmarks replica identity full;
```

Then enable the `bookmarks` table under:

Supabase Dashboard → Database → Replication

---

# 🔥 Problems I Faced & How I Solved Them

This project involved several real-world debugging challenges.

---

## 1️⃣ INSERT Realtime Event Not Firing

### Problem

- DELETE events were received successfully.
- INSERT events were not triggering in the client.
- Subscription status showed "SUBSCRIBED".
- No errors appeared in console.

This made debugging difficult because everything looked correct.

### Root Cause

Supabase Realtime only sends events for rows that pass the SELECT RLS policy.

Even though INSERT succeeded, the inserted row was not visible to the current session due to an RLS mismatch.

Specifically:
- `user_id` column type was UUID
- Inserted value type mismatch caused RLS check to fail silently

Because the row failed:

```
auth.uid() = user_id
```

Realtime did not emit the INSERT event.

DELETE worked because the row already existed and passed RLS.

### Solution

- Verified `user_id` column type was `uuid`
- Ensured inserted `user_id` matched `auth.uid()`
- Retrieved user session using:

```js
const { data: { user } } = await supabase.auth.getUser()
```

- Confirmed inserted rows contained correct UUID
- Verified RLS SELECT policy was correct
- Ensured table replication was enabled
- Restarted development server after environment variable changes

After fixing the UUID mismatch, INSERT events worked immediately.

---

## 2️⃣ Replica Identity Not Set

### Problem

Realtime payloads were incomplete for DELETE operations.

### Cause

PostgreSQL requires:

```sql
alter table bookmarks replica identity full;
```

Without it, Realtime cannot emit full row data.

### Solution

Set replica identity to FULL and enabled replication in Supabase dashboard.

---

## 3️⃣ Environment Variable Misconfiguration

### Problem

App threw:

"Your project's URL and API key are required"

### Cause

Incorrect variable name:

```
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Instead of:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Solution

- Corrected variable name
- Restarted development server

---

## 4️⃣ Multiple Supabase Client Instances

### Problem

Realtime behaved inconsistently.

### Cause

Supabase client was being initialized in multiple places.

This can cause subscription inconsistencies.

### Solution

Standardized a single `createClient()` implementation and reused it across components.

---

## 5️⃣ TypeScript State Type Error

### Problem

```
Type '{}' is not assignable to type 'any[]'
```

### Cause

State expected an array but defaulted to an object:

```js
setBookmarks(data || {})
```

### Solution

```js
setBookmarks(data ?? [])
```

---

# 🧠 Key Technical Learnings

- Supabase Realtime strictly respects SELECT RLS policies
- If a row fails RLS visibility, no realtime event is emitted
- UUID mismatches silently break RLS logic
- Replica identity is required for full payloads
- Environment variables require server restart
- Subscription status being "SUBSCRIBED" does not guarantee row visibility
- Database-level security is more reliable than frontend filtering

---

# 📦 Installation

1. Clone repository

```bash
git clone <repo-url>
cd project-name
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run development server

```bash
npm run dev
```

---

# 🎯 What This Project Demonstrates

This project demonstrates:

- Full-stack integration
- Secure multi-user architecture
- Realtime systems
- Debugging complex RLS issues
- Strong understanding of PostgreSQL policies
- Production-level Supabase configuration
- Modern React + App Router architecture

---

# 🚀 Future Improvements

- Optimistic UI updates
- Toast notifications
- Bookmark categories
- Pagination
- Search & filtering
- Unit testing
- End-to-end testing

---

# 📄 License

MIT
