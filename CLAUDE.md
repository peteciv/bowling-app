# CLAUDE.md — Office 10's Bowling Availability App

## Project overview

Mobile-first PWA for tracking the Office 10's bowling team's weekly Thursday availability with an automatic 5-week bye rotation. Status is shown via a traffic-light banner (red/yellow/green based on player count). Deployed app, active recurring use.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL on Railway (via `pg` library)
- **Styling**: Tailwind CSS + class-variance-authority + tailwind-merge
- **Icons**: Lucide React
- **PWA**: Web App Manifest + Service Worker + offline fallback
- **Hosting**: Vercel-ready

## Files

| File | Role |
|---|---|
| `README.md` | Full setup + deploy guide |
| `PRD.md` | Product requirements (rotation rules, traffic light, DoD) |
| `DATABASE_SCHEMA.md` | SQL setup for Railway PostgreSQL |
| `app/api/auth/` | Password verification |
| `app/api/players/` | Player list |
| `app/api/availability/` | Get/update availability |
| `app/page.tsx` | Main dashboard |
| `lib/db.ts` | PostgreSQL connection (pg) |
| `lib/rotation.ts` | Bye calculation logic |
| `lib/types.ts` | TypeScript types |
| `components/PasswordGate.tsx` | Login screen |
| `components/PlayerCard.tsx` | Per-player availability card |
| `components/StatusBanner.tsx` | Traffic-light banner |
| `public/manifest.json`, `public/sw.js`, `public/offline.html` | PWA assets |
| `.env.example` | Template for `DATABASE_URL` + `TEAM_PASSWORD` |

## Run / build

```bash
npm install
cp .env.example .env.local       # fill in DATABASE_URL + TEAM_PASSWORD
npm run dev                      # http://localhost:3000
npm run build
npm start
```

## Core rules (from PRD)

**Bye rotation** — start date `2025-02-06` (Thursday). Order: Jeff (initial bye, week 0) → Neil → Peter → Tim → Jay → Jeff... `bye_index = weeks_since_start % 5`.

**Availability rules:**
- 4 active players can freely toggle In/Out
- Bye player is locked Out by default
- If ANY active player marks Out, the bye player unlocks and can sub In
- Goal is exactly 4 players In to bowl

**Traffic light** (player count → color → message):
- 4 → green → "Ready to Bowl!"
- 2–3 → yellow → "Almost There…"
- 0–1 → red → "Need More Players!"

## Critical gotchas

- **The 2025-02-06 anchor date is foundational.** Changing it shifts every historical week's bye assignment. Don't drift this constant without intent.
- **Railway internal vs. public DATABASE_URL**: for local dev, use Railway's **public** URL (e.g. `switchback.proxy.rlwy.net`), NOT `postgres.railway.internal`. (Same Railway pattern as `estimators-edge`.)
- **No user accounts** — single shared `TEAM_PASSWORD` env var, persistence via LocalStorage. Don't bolt on per-user auth without a real reason.
- **PWA icons** (`public/icon-192.png`, `public/icon-512.png`) must exist for installability — see `public/ICONS_README.txt`.
- **Service worker caches** — when shipping a UI change, bump the SW cache version or users on home-screen-installed PWAs may see stale UI.

## Plan files

If a plan file exists for active work, it's in `~/.claude/plans/` matching this project's name.
