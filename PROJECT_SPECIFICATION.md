# Aspire Entrepreneur — Project specification

A web platform (**Aspire**) for **founders**, **mentors**, **investors**, and **admins** to complete profiles, discover members, share updates on a feed, follow others, and keep quality through profile approval and admin tools.

This document describes the **technology stack**, **what is implemented today**, and **what remains** relative to the original eight-module plan.

---

## Technology stack (as implemented)

| Layer | Technology | Notes |
|--------|------------|--------|
| **Frontend language** | **TypeScript** | All UI and shared app code. |
| **Frontend framework** | **React 19** | UI components and client interactivity. |
| **App framework** | **Next.js 16** (App Router) | File-based routes, layouts, Server Components, Route Handlers where used. |
| **Styling** | **Tailwind CSS 4** | Utility-first UI (`@tailwindcss/postcss`). |
| **Backend language** | **TypeScript** (same codebase) | No separate Java/Python service; server logic lives in Next.js. |
| **Backend execution** | **Node.js** | Via Next.js server runtime. |
| **Data access** | **Prisma ORM 7** + **`@prisma/adapter-pg`** | Type-safe queries; PostgreSQL driver. |
| **Database** | **PostgreSQL** | Primary datastore (`DATABASE_URL`). |
| **Authentication** | **Auth.js (NextAuth v5 beta)** | JWT strategy, credentials + flows in `auth.ts` / `auth.config.ts`. |
| **Password hashing** | **bcryptjs** | Stored as `passwordHash` on `User`. |
| **Validation** | **Zod 4** | Forms and server actions. |
| **Email (optional)** | **Resend** | Available for transactional email when configured. |
| **File storage (profiles / uploads)** | **Vercel Blob** (`@vercel/blob`) | Profile and media uploads when Blob env is set; local/API fallbacks in code paths as applicable. |
| **Other libraries** | **Effect**, **Firebase / Firebase Admin** | Present in dependencies for integrations or future use; core flows are Prisma + Next.js. |
| **Tooling** | **ESLint** (Next config), **tsx** | Linting; Prisma seed runner. |
| **Deployment** | **Vercel** (typical) | `npm run build` = `prisma generate && next build`. |

**Summary:** Single **TypeScript** monolith: **React + Next.js** on the client and server, **PostgreSQL + Prisma** for data, **NextAuth** for sessions, **Tailwind** for design.

---

## Repository status

- **Application code is present and runnable** (not a placeholder repo).
- **Database schema** is defined in `prisma/schema.prisma` with migrations under `prisma/migrations`.
- **Seed script** (`npm run db:seed`): admin user + **50 demo personas** (founders / mentors / investors) with filled profiles, avatars, and cover image URLs for local/demo use.

---

## Major features implemented

### Authentication & access

- Register, login, logout; protected routes via middleware (`auth.config.ts`).
- Role-based experience: **FOUNDER**, **MENTOR**, **INVESTOR**, **ADMIN**.
- Onboarding wizard (`/onboarding`) driven by server actions and Prisma.
- Email / phone verification flows (verification codes model + actions) as implemented in codebase.

### User profiles & onboarding data

- **User** fields: name, email, phone, location, country, goals, bio, experience, LinkedIn, avatar (`image`), cover (`coverImageUrl`), onboarding status, profile approval status.
- **FounderProfile**, **MentorProfile**, **InvestorProfile** with structured fields (startup/firm, stage, industry, funding text, team size, mentor years/domain, investor cheque range / sectors, etc.).
- **Extended profile** page and actions for post-onboarding sections.
- **Public member profile** (`/members/[id]`) and **own profile** (`/members/me`).
- **Settings** for account/profile updates.

### Dashboard & navigation

- **Home dashboard** (`/dashboard`): feed composer, post stream, role sidebar, right rail (prompts, trending links, suggested members + follow).
- **Discover** (`/dashboard/discover`): signed-in member search with filters (contact/name-email-phone, company, location, investment range, team size, entity type chips).
- **Member network** (`/dashboard/network`): grid of completed-onboarding members.
- **Ideas workspace** (`/dashboard/ideas`): ideas/validation cards + **Founder & SME toolkit** cards (funding, mentorship, new business, business spotlight).
- **Business workspace** (`/dashboard/business`): hub links; legacy `/dashboard/startups` redirects here.
- **Role dashboards**: founder / mentor / investor summary pages under `/dashboard/...`.
- **Admin**: user listing, per-user detail, profile approval (approve/reject with note), and related server actions.

### Social feed (implemented scope)

- **FeedPost** with body, timestamps; **FeedAttachment** (image / video / link); **FeedComment**.
- Composer and post cards; admin-aware display where wired.
- **UserFollow** follow/unfollow from UI where implemented (e.g. rail / profile patterns in codebase).

### Trust & moderation (partial)

- **ProfileApprovalStatus** (`PENDING` / `APPROVED` / `REJECTED`) on users; admin workflow to approve or reject with notes.
- Not a full separate “document verification queue + audit log” as in the original Module 6 spec (see gaps below).

### Developer experience

- TypeScript strictness; Prisma client generation on install/build.
- `PROJECT_SPECIFICATION.md` (this file) maintained to reflect reality vs plan.

---

## Modules vs implementation (done / partial / not started)

Original plan had **8 modules**. Mapped status:

| # | Module | Status | What exists | Main gaps |
|---|--------|--------|-------------|-----------|
| **1** | Authentication & user management | **Largely done** | Auth.js, sessions, register/login, roles, onboarding, settings, protected layouts | Password reset UX polish; any institution-specific SSO |
| **2** | Founder & startup listings | **Partial / model differs** | Founder data lives on **User + FounderProfile**, not a separate “listing” table with draft/publish | Standalone listing CRUD, draft vs published listings, public index separate from members |
| **3** | Discovery & search | **Partial** | **Discover members** (filters, types, ~48 results), network page | Saved searches, email alerts, dedicated **startup listing** discovery with pagination as originally spec’d |
| **4** | Mentor & investor profiles | **Largely done** | Schema + onboarding + extended profile + member pages | “Directory” marketing pages if required beyond in-app discover |
| **5** | Communication & requests | **Not implemented** | — | Interest requests, message threads, in-app notifications, rate limiting |
| **6** | Verification & trust | **Partial** | Profile approval; optional uploads via Blob paths | Document queue, verification badges from docs, full audit log |
| **7** | Admin control panel | **Partial** | Users list, user detail, approval actions | Flags/reports queue, suspend user, bulk ops, platform-wide metrics dashboard |
| **8** | Analytics & reporting | **Minimal** | Per-role dashboard stubs / copy | Tracked listing views, CSV exports, charts, funnel metrics |

---

## UI / product decisions (recent)

- **Terminology:** “Business” used in navigation and several labels where “Startups” appeared before; discover chip “Business & companies” (URL param may still use internal `startups` type where applicable).
- **Hub layout:** Founder & SME toolkit consolidated on **Ideas** page; member grid on **Network** page; home feed simplified (no duplicate toolkit block).
- **Header / sidebar:** Removed non-functional “coming soon” social shortcuts and disabled header icon buttons for a cleaner production feel.
- **Stories strip:** Compact shortcuts only for working routes; TypeScript-safe `StoryShortcut` type for optional hash links.

---

## What remains (recommended priorities)

1. **Module 5 — Messaging / requests:** interest entity, threads, basic notifications (even email-digest optional).
2. **Module 6 — Trust:** optional document upload + admin queue; audit table for sensitive actions.
3. **Module 3 — Discovery polish:** saved filters/bookmarks; align copy with whether you keep “members only” vs future public listings.
4. **Module 7 — Admin:** flags, suspend, metrics snapshot.
5. **Module 8 — Analytics:** lightweight counters + CSV export for FYP demo.
6. **Module 2 (if required):** separate published “listing” entity only if the FYP requires it distinct from profiles.

---

## Getting started (developers)

1. **Install:** `npm install`
2. **Environment:** copy `.env.example` to `.env` / `.env.local` and set at least `DATABASE_URL`, Auth secrets (`AUTH_SECRET`, etc.), and optional `DATABASE_URL` for Prisma, Blob, Resend as needed.
3. **Database:** `npx prisma migrate dev` (or deploy migrations in CI/production).
4. **Seed (optional):** `npm run db:seed` — creates admin + demo personas (see console for emails; demo password documented in seed output).
5. **Dev server:** `npm run dev`
6. **Production build:** `npm run build` then `npm run start`

---

## Suggested build order (original — adjusted)

Original order still makes sense for **remaining** work:

1. Keep **Module 1** stable while adding features.  
2. **Module 5** next if the story is “connect people.”  
3. **Modules 6–7** for trust and operations.  
4. **Module 8** last for demo polish.  
5. Revisit **Module 2** only if listings must be a separate product surface from profiles.

---

## License

Specify your institution’s or your own license when you publish the project.
