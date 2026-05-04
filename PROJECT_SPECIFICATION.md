# Entrepreneurship Support Portal

A web platform for **founders**, **mentors**, **investors**, and **admins** to discover startups, manage profiles, run mentorship and interest workflows, and keep the marketplace trustworthy through verification and moderation.

This repository is prepared as the home for the final-year project implementation. Application source code will be added here as development progresses.

## Planned technology stack

| Layer | Choice |
|--------|--------|
| Frontend & app server | Next.js (TypeScript, App Router) |
| APIs | Next.js Route Handlers / server actions |
| Runtime | Node.js (via Next.js) |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js (NextAuth) |
| Deployment | Vercel |
| File storage | Cloud object storage (documents, media) |
| Phase 2 (optional) | Redis (caching, rate limiting) |

## Core product scope (high level)

- **Authentication & roles:** sign-up, login, sessions, onboarding for Founder, Mentor, Investor, Admin.
- **Startup listings:** create, edit, draft/publish, structured fields (industry, stage, model, geography, ask, etc.).
- **Discovery:** search, filters, sort, bookmarks.
- **Profiles:** mentor and investor profiles with expertise and preferences.
- **Communication:** interest requests, message threads, request status (e.g. pending / accepted / closed).
- **Trust:** document upload, admin review, verification badges, audit trail for sensitive actions.
- **Admin:** moderation, flags, user/listing governance, basic platform metrics.
- **Analytics:** founder dashboards (views, requests); admin summaries and simple exports.

---

## Modules overview

The MVP is organized into **8 modules**. They build on each other: start with **Module 1**, then **2–4** (core data), then **5–6** (communication and trust), then **7–8** (operations and insight).

| # | Module | One-line purpose |
|---|--------|------------------|
| 1 | Authentication & user management | Who can sign in, which role they have, and safe sessions. |
| 2 | Founder & startup listings | Structured startup pages and publish lifecycle. |
| 3 | Discovery & search | Find and sort listings; save favourites. |
| 4 | Mentor & investor profiles | Rich profiles for mentors and investors. |
| 5 | Communication & requests | Interest flow + messaging tied to requests. |
| 6 | Verification & trust | Documents, admin decisions, badges, audit trail. |
| 7 | Admin control panel | Moderation, flags, users/listings governance. |
| 8 | Analytics & reporting | Dashboards and simple exports for founders and admins. |

### Module 1 — Authentication & user management

**Goal:** Secure access and clear roles for Founder, Mentor, Investor, Admin.

**Work to deliver:**

- Sign up, login, logout; password reset and email flows (as required by Auth.js).
- Role assignment at onboarding (or admin-assigned role if your policy requires it).
- Session handling (secure cookies, protected routes).
- Profile shell: display name, avatar, basic settings per role.
- Middleware / server checks so APIs and pages enforce **role-based access** consistently.

---

### Module 2 — Founder & startup listings

**Goal:** Founders can create and maintain startup listings with structured business data.

**Work to deliver:**

- CRUD for listings: title, summary, industry, stage, business model, geography, revenue band, funding ask, links, tags.
- **Draft / published** states; only published listings appear in public discovery (unless you add "preview" for admins).
- Listing ownership (founder-only edit); optional soft-delete or archive.
- Upload or link to pitch deck / logo via **cloud storage** (integrate with Module 6 for sensitive docs if needed).

---

### Module 3 — Discovery & search

**Goal:** Users can find relevant startups quickly.

**Work to deliver:**

- Public listing index with **pagination**.
- **Search** (keyword on title/summary/tags).
- **Filters:** category/industry, stage, geography, rough budget/ask range (as you define in schema).
- **Sort:** newest first, relevance (simple scoring optional for MVP).
- **Saved listings** (bookmarks) for logged-in users.
- Database **indexes** on fields you filter/sort often.

---

### Module 4 — Mentor & investor profiles

**Goal:** Mentors and investors present expertise and preferences so discovery is meaningful.

**Work to deliver:**

- Extended profile models: bio, focus areas, years of experience, availability notes, preferred stages, sectors.
- Investor-specific: cheque size band, geography, stage preferences.
- Profile visibility rules (public vs logged-in only, if required).
- List/detail pages for mentors and investors; optional link from listings to "interested mentors/investors" later via Module 5.

---

### Module 5 — Communication & requests

**Goal:** Controlled introductions and conversations between roles.

**Work to deliver:**

- **Interest request** entity: who requests, which listing (or profile), message, status **pending → accepted / declined → closed**.
- **Message threads** tied to a request (or listing) so chat stays in context.
- Notifications (in-app first; email optional) when a request or message arrives.
- Rate limiting / abuse basics on messaging endpoints (Redis in phase 2 is fine for throttling).

---

### Module 6 — Verification & trust

**Goal:** Increase trust via documents and admin-reviewed decisions.

**Work to deliver:**

- Upload verification documents to object storage; metadata in DB.
- Admin queue: approve / reject with reason.
- **Verification badge** on user or listing when approved.
- **Audit log** rows for verification and other sensitive actions (who, what, when).

---

### Module 7 — Admin control panel

**Goal:** Operators can keep the platform safe and consistent.

**Work to deliver:**

- User management: view users, suspend or role-change (within your policy).
- Listing moderation: unpublish, flag, or remove content.
- Report/flag queue from users (if you add user-submitted reports in MVP).
- Platform health **snapshot**: counts of users, listings, pending verifications (deeper metrics in Module 8).

---

### Module 8 — Analytics & reporting

**Goal:** Founders and admins see impact and health without building a full BI product.

**Work to deliver:**

- **Founder dashboard:** listing views (if you track views), incoming requests, response rates.
- **Admin dashboard:** active users, new listings, verification funnel, basic charts or tables.
- **Export:** CSV (or similar) for a subset of admin reports for the FYP demo.

---

### Suggested build order (for scheduling)

1. **Module 1** → foundation for everything.  
2. **Module 2** + **Module 4** (parallel possible after schemas exist) → real content in the system.  
3. **Module 3** → makes the product demoable.  
4. **Module 5** → completes the "connect" story.  
5. **Module 6** + **Module 7** → trust and governance.  
6. **Module 8** → polish for evaluation and stakeholder demos.

## Repository status

- Previous placeholder documentation files were removed to start clean.
- **Next step:** initialize the Next.js app, Prisma schema, and environment configuration when you begin implementation.

## Getting started (after the app is scaffolded)

Typical steps once the codebase exists:

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set database URL, Auth.js secrets, and storage keys.
3. Run migrations: `npx prisma migrate dev`
4. Start development: `npm run dev`

Exact commands may vary slightly depending on the package manager and folder layout you choose.

## License

Specify your institution's or your own license when you publish the project.
