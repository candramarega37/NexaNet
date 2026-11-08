# NexaNet

**Learn. Practice. Troubleshoot.** NexaNet is an Indonesian learning platform concept for vocational students studying Computer and Network Engineering (TKJ).

## Purpose and features

- Responsive landing page and shared page shell.
- Database-backed TKJ materials, video catalog, and quiz catalog.
- Server-side dashboard statistics and material progress.
- Credentials login with server-signed HTTP-only session cookies; database roles are checked on the server.
- Student registration and password recovery with one-time, 30-minute tokens; login, registration, and recovery endpoints use database-backed rate limits.
- Global search across published materials, videos, quizzes, troubleshooting cases, and 3D models.
- Profile stores class and study program, and admin analytics includes six-month quiz/completion trends plus weak quiz topics.
- Admin-protected create, publish/unpublish, and delete actions for learning materials.
- Admin CRUD for video metadata, quizzes, quiz questions, troubleshooting cases, and 3D model metadata; student role management and database-backed analytics summaries.
- Quiz scoring and explanations are calculated and persisted on the server.
- Profile editing and password changes.
- Local Network Lab with topology exploration and an IPv4 subnet calculator.
- Database-backed step-by-step Troubleshooting Lab practice.
- AI Tutor, material contextual questions, quiz hints, and troubleshooting endpoints behind a provider abstraction. `mock` and server-side OpenAI Responses API modes are available.
- Learning path status, progress analytics, and per-user saved Network Lab runs.
- Database-backed 3D device catalog with local illustrations as a fallback.

The app includes local GLB assets for network devices and a lazy-loaded 3D viewer with selectable, admin-configurable learning hotspots. The viewer module loads from Google's documented CDN when a model is selected. The 3D page only displays rotatable models and does not request device-camera access. The seeded videos are mostly Indonesian YouTube tutorials (with one supplementary English CCNA video) embedded with YouTube's privacy-enhanced player; admins can replace their URLs.

## Tech stack

- Next.js 16.3.6 App Router, React 19.2.8, TypeScript 5
- Tailwind CSS 4 plus CSS design tokens
- Prisma 6.19, Neon PostgreSQL, Zod 4, bcryptjs, jose
- No API secrets are included in source files.

## Architecture and folder structure

```text
app/
  [...segments]/page.tsx         Feature pages and server-side data reads
  api/auth/                      Registration, login, logout, password recovery, and session endpoints
  api/search/                    Search published learning content across feature types
  api/materials/                 Material reads and progress updates
  api/quizzes/                   Quiz reads and server scoring
  api/ai/                        Server-side tutor, contextual, hint, and troubleshooting providers
  api/labs/                      Authenticated saved lab runs
  api/admin/                     Role-protected content, troubleshooting, 3D model, user, and analytics APIs
  globals.css                    Design tokens and responsive styles
  layout.tsx                     Indonesian root layout and metadata
  page.tsx                       Landing page
components/                      Login, quiz, progress, admin, and lab UI
lib/                              Prisma client, auth/session, validation, AI, network logic
prisma/schema.prisma              Relational data model
prisma/migrations/                Versioned PostgreSQL migration SQL
prisma/migrations_sqlite/         Legacy local SQLite migration SQL
prisma/seed.mjs                   Development demo accounts and TKJ content
```

## Installation and environment

Use Node.js 22.5 or newer, then:

```bash
npm install
```

Create a local `.env` with the pooled `DATABASE_URL` and direct `DIRECT_URL` from Neon, plus a random `AUTH_SECRET` of at least 32 characters. `.env` files are ignored by git. Do not use the demo passwords in a deployed environment.

Copy `.env.example` as a starting point. In Vercel, add `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET` to the Production environment. Use the pooled Neon URL (`-pooler`) for `DATABASE_URL` and the direct Neon URL for `DIRECT_URL`; both URLs must include `sslmode=require&schema=nexanet_app`. Use a separate Neon branch and separate values for Preview deployments so preview migrations never target production. `AUTH_SECRET` must be a unique random value of at least 32 characters. The `vercel-build` script generates Prisma Client, applies pending PostgreSQL migrations, and builds Next.js.

Neon Object Storage credentials can be set as `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`; keep them only in ignored `.env` locally and Vercel's server-side environment variables. Provision the bucket in Neon and use a server-side S3 client with path-style requests when adding upload functionality.

## Database setup, migration, and seed

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
npm run models:build
```

`DATABASE_URL` is the Neon pooled connection string used by the app. `DIRECT_URL` is the non-pooled Neon connection string used by Prisma migrations. Both should select the `nexanet_app` schema so the app's tables stay separate from any existing Neon tables. `npm run db:migrate` applies the checked-in PostgreSQL migrations; use `npm run db:migrate:dev` when creating migrations during development. The old SQLite migrations remain under `prisma/migrations_sqlite` and can be applied locally with `npm run db:migrate:sqlite` after setting `DATABASE_URL` to a SQLite file URL.

To populate a new Neon branch with the bundled learning content without creating demo accounts or sample student activity, run `npm run db:seed:content`. The regular `npm run db:seed` command also creates local-only demo accounts and sample student records; do not run that command against production.

The schema models users and student profile fields, one-time password reset tokens, rate-limit buckets, materials, progress, videos, troubleshooting cases, 3D models and hotspots, quizzes, questions, quiz attempts, and recent activity. Network Lab runs use the activity relation. Relations use scalar IDs, uniqueness constraints, and indexes so the logical model can be carried to PostgreSQL.

## Demo accounts

The seed creates:

- Students: `siswa@nexanet.local` / `BelajarDemo!2026`, `siswa2@nexanet.local` / `BelajarSiswa2!2026`, and `siswa3@nexanet.local` / `BelajarSiswa3!2026`
- Admin: `admin@nexanet.local` / `AdminDemo!2026`
- The seed includes ten video resources, five quizzes with 25 questions, five troubleshooting cases, six 3D models, and sample student progress/quiz attempts.

Override these with `DEMO_STUDENT_*`, `DEMO_STUDENT_2_*`, `DEMO_STUDENT_3_*`, and `DEMO_ADMIN_*` variables before seeding. Demo credentials are for local development only.

## Run development

```bash
npm run dev
```

Open http://localhost:3000.

## Account recovery email

Local development shows a reset link on the recovery page when no email provider is configured. For production, set `APP_URL`, `RESEND_API_KEY`, and `EMAIL_FROM` so reset instructions can be delivered by Resend. The API returns a generic response for unknown emails and stores only a SHA-256 hash of each reset token.

## AI and 3D viewer setup

`AI_PROVIDER=mock` selects the included deterministic demo provider. To use OpenAI, set `AI_PROVIDER=openai`, `OPENAI_API_KEY`, and optionally `OPENAI_MODEL` in the server `.env`. The key is only read in server code. The 3D catalog loads GLB models for orbit controls, without requesting device-camera access. If the 3D viewer module or a model cannot load, the local illustration remains available. Admins can replace model and thumbnail URLs.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

Run `npm test` using Node's built-in test runner. Tests cover IPv4 validation, subnet calculations, same-subnet checks, quiz scoring, role checks, recommendations, and AI provider fallback/error selection. Database and route integration tests remain future work.

## Troubleshooting

- If a database route reports a missing `DATABASE_URL` or `DIRECT_URL`, set both Neon connection strings in your local `.env`.
- If generated Prisma types are stale, run `npm run db:generate`.
- If demo content is missing, run `npm run db:seed` after migrating.
- If the development server uses another port, open the URL printed by Next.js.

## Production notes and known limitations

The login/session, registration, password recovery, persistent rate limits, profile, material progress, quiz scoring, dashboard counts, admin CRUD for materials/videos/quizzes/questions/troubleshooting cases/3D models and hotspots, student role management, six-month analytics, saved Network Lab runs, the Network Lab topology and IPv4 subnet tools, the 3D model viewer with local assets, and mock/OpenAI provider adapters are implemented. Hotspot positions should be tuned for each custom model. Current authorization protects server APIs and admin pages, but the project has not had a security audit. `npm audit` reports a high severity advisory through the Prisma CLI dependency tree; the available automated fix requires a forced Prisma downgrade, so it was not applied. Do not deploy demo accounts or secrets.
