# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Indonesian vocational (SMK) TKJ — Computer and Network Engineering — students learning in and out of class. Job: measure baseline via pretest, study materials and videos, prove gain via posttest, then consolidate with hands-on labs.

Secondary (confirmed): teachers and admins who create, publish/unpublish, and delete learning content, manage videos, quizzes, questions, troubleshooting cases, 3D models and hotspots, manage student roles, and review analytics summaries and trends.

## Product Purpose

NexaNet structures network learning into one guided loop: 25-question pretest → 6 concise materials plus videos → parallel 25-question posttest → Network Lab and Troubleshooting Lab practice. It exists to make TKJ fundamentals learnable, practicable, and measurably improved. Success means a student completes the loop with a valid pretest-to-posttest gain and demonstrated lab practice, with progress persisted per user.

## Positioning

A measured-gain TKJ loop, not a generic content library: parallel pretest and posttest item sets make score improvement valid evidence of learning, and the same loop closes in Network Lab (topology and IPv4 subnetting) and step-by-step Troubleshooting Lab practice rather than ending at content consumption. A neighboring playlist or LMS without parallel pre/post sets tied to the same TKJ scope and lab close-out could not truthfully copy this claim.

## Operating Context

Indonesian-language (`lang="id"`) web use in school and self-study settings. Core workflow is Pretest Jaringan Dasar → Materi (6 modules: dasar jaringan, OSI, TCP/IP, IPv4 addressing, subnetting, troubleshooting) plus video catalog → Posttest Jaringan Dasar → Network Lab (topology star/bus/mesh exploration, IPv4 subnet calculator, saved runs) → Troubleshooting Lab (5 seeded cases). Supporting workflows: credentials login, student registration, password recovery with 30-minute one-time tokens, global search across materials/videos/quizzes/cases/3D models, profile with class and study program, dashboard statistics and material progress, learning-path status and progress analytics, per-user saved lab runs, AI Tutor plus contextual questions/quiz hints/troubleshooting assistance, and 3D device catalog viewing.

## Capabilities and Constraints

Confirmed capabilities: responsive landing page and shared page shell; database-backed TKJ materials, video catalog, and quiz catalog; server-side dashboard statistics and material progress; credentials login with server-signed HTTP-only session cookies and server-checked database roles; student registration and password recovery with persistent SQLite rate limits; global search; profile class/program storage and six-month quiz/completion trends plus weak quiz topics in admin analytics; admin-protected material publish/unpublish/create/delete; admin CRUD for video metadata, quizzes, questions, troubleshooting cases, 3D models and hotspots; student role management; server-calculated and persisted quiz scoring with explanations; profile editing and password changes; Network Lab topology exploration and IPv4 subnet calculator; database-backed step-by-step troubleshooting practice; AI Tutor endpoints behind a provider abstraction (`mock` deterministic demo and server-side OpenAI Responses API); learning-path status and saved Network Lab runs; database-backed 3D catalog with local illustrations for fallback; local GLB assets with a lazy-loaded 3D viewer and selectable admin-configurable learning hotspots (viewer module from documented CDN when a model is selected); seeded videos as Indonesian YouTube tutorials plus one supplementary English CCNA video via privacy-enhanced embeds, replaceable by admins.

Technical constraints: Next.js 16.3.6 App Router, React 19.2.8, TypeScript 5, Tailwind CSS 4 plus CSS design tokens, Prisma 6.19, SQLite, Zod 4, bcryptjs, jose; Node.js 22.5+ for local SQLite migration bootstrap; no API secrets in source; `DATABASE_URL` SQLite path required; SQLite migrations are provider-specific for any PostgreSQL move; the 3D viewer loads its custom-element module from a CDN and uses local illustrations when unavailable; project has not had a security audit; `npm audit` high-severity advisory via Prisma CLI tree left unapplied to avoid forced Prisma downgrade; demo accounts and demo passwords are local-development only and must not be deployed.

Terminology: TKJ (Teknik Komputer dan Jaringan); pretest/posttest; materi; Network Lab; Troubleshooting Lab; 3D models and learning hotspots.

Explicitly undecided: classroom orchestration expectations beyond guided self-study; any production email/deliverability, deployment target, and PostgreSQL migration specifics beyond the documented Resend/`APP_URL` notes.

## Brand Commitments

Name NexaNet (wordmark NEXA/NET); tagline "Learn. Practice. Troubleshoot."; Indonesian product voice; footer claim "PRETEST → MATERI → POSTTEST → LAB". No binding palette, type, or style direction was set during init.

## Evidence on Hand

Real seeded content via `prisma/seed.mjs` after `prisma/bootstrap.mjs` migrations: 6 materials, 10 video resources, 5 quizzes with 25 questions (including pretest/posttest 25-soal sets), 5 troubleshooting cases, 6 3D models, sample student progress and quiz attempts. Schema at `prisma/schema.prisma`; demo accounts are local-only (`siswa@nexanet.local`, `siswa2@nexanet.local`, `siswa3@nexanet.local`, `admin@nexanet.local` with seed defaults overridable via `DEMO_*` env). Local GLB assets and lazy 3D viewer; YouTube privacy-enhanced embeds. No real testimonials, customers, benchmarks, pricing, licensing, or press on hand — future work must not fabricate them.

## Product Principles

1. Gain must be measurable — pretest to parallel posttest is the proof, not completion alone.
2. Guided independence — a student can run the loop alone, with teachers and admins supporting content quality and oversight.
3. Practice proves theory — every concept closes in a lab, calculator, explorer, or diagnosis, not at the last paragraph.
4. Server authority preserves trust — scoring, roles, progress, and rate limits are enforced server-side.
5. Indonesian TKJ first — language, examples, and scope stay bound to the TKJ curriculum before any expansion.
