# CLAUDE.md — Neuroscience App

Guidance for AI agents (and humans) working in this repo. Read this first; it is
the hub. Deeper references live in [`docs/`](docs/).

## What this is

A browse-first **neuroscience reading app** for two audiences — newcomers
building foundations and researchers/clinicians tracking the frontier — plus a
community layer (accounts, progress, discussions). Being prepared for public
release.

- **Frontend:** React 18 + Vite (plain JS/JSX, **no TypeScript**). Lives in `src/`.
- **Backend:** Express + Node's built-in `node:sqlite` (zero native deps). Lives in `server/`.
- Repo: `vikrambalaji111-seeker/neuroscience-app`. Active branch: `build-neuroscience-app` (PR #1). Main branch: `main`.

## ⛔ The cardinal rule: NO HALLUCINATION

This is the product's defining constraint. **Never author, invent, paraphrase-to-
distortion, or generate neuroscience facts** — in code, content, or tests.

- All displayed knowledge is **fetched live from real, citable sources** and shown with attribution + links.
- When a source has nothing, the UI shows **“No referenced content available”** / “no references” — it never fills the gap.
- Video IDs are **verified against YouTube (oEmbed)** before display; a wrong ID 404s and is dropped. Display YouTube's own returned title/author, never a claimed one.
- Summarize is **extractive only** — it selects sentences verbatim from already-cited on-page text.
- `src/data/taxonomy.js` holds **no facts** — only browse structure + where to fetch each topic.

If you add a feature that surfaces information, it must trace to a real source or say it has none.

## Run it

```bash
# Frontend (port 5173)
npm install && npm run dev

# Backend (port 8787) — separate terminal
cd server && npm install && npm start
```

Node is via **nvm** (`v24.18.0`); `node`/`npm` are not on the default PATH —
`source ~/.nvm/nvm.sh` first in non-interactive shells. `.claude/launch.json`
has both servers wired with the absolute node path (the preview tooling uses it).

Env vars (all optional): `VITE_API_URL` (default `http://localhost:8787`),
`VITE_YOUTUBE_API_KEY` (enables live video search), and backend `JWT_SECRET`,
`DB_PATH`, `PORT`.

## Architecture in one screen

```
Browser (React SPA, hash routing)
├── Content (no backend needed, all CORS-friendly public APIs):
│   ├── Wikipedia REST+Action API ...... overview + article sections → conceptual buckets
│   ├── Europe PMC API ................. title-matched studies + review abstracts
│   ├── YouTube oEmbed + Data API ...... verified videos, ranked by authenticity tier
│   └── Reference/scholarly site links . Britannica, PubMed, etc. (scoped search URLs)
└── Community (Express + SQLite backend):
    ├── Auth ........... email+password, bcrypt, JWT
    ├── Progress ....... cloud-synced per user (read/bookmarks/notes/streak/history)
    └── Discussions .... per-topic comments (public read, auth post)
```

The frontend **degrades gracefully**: if the backend is unreachable it falls
back to local-only accounts/progress (localStorage) and hides community features.

## File map

| Path | Role |
|---|---|
| `src/main.jsx` | Entry. Wraps `<App>` in `ErrorBoundary` + `AuthProvider`. |
| `src/App.jsx` | Layout, sidebar, hash routing, level toggle, account box, auth modal host. |
| `src/hooks/useHashRoute.js` | Hash router: `#/`, `#/c/:id`, `#/t/:id`, `#/me`. |
| `src/data/taxonomy.js` | **Browse structure only** — categories/topics, each with `wiki` title + `query`. Helpers: `getCategory`, `getSiblingTopics`, `searchTopics`, `ALL_TOPICS`, `TOPICS_BY_ID`. |
| `src/data/sources.js` | Per-topic deep-link search URLs: `referenceSources` (beginner) / `scholarlySources` (researcher). |
| `src/data/videoSeeds.js` | oEmbed-verified YouTube IDs keyed by topic/category id. |
| `src/api/wikipedia.js` | Live Wikipedia fetch; maps headings → conceptual buckets. In-memory cache. |
| `src/api/literature.js` | Europe PMC: `fetchStudies` (title-matched), `fetchReviews` (abstracts). Cache. |
| `src/api/youtube.js` | Authenticity tiers, `fetchOEmbed`, `resolveSeeds`, `searchVideos`, `trustedSearchLinks`. |
| `src/api/backend.js` | Community API client + token mgmt + `checkHealth`. |
| `src/auth/AuthContext.jsx` | Auth + progress state; backend-first with local fallback; debounced sync. |
| `src/components/TopicPage.jsx` | The topic page — assembles all sections per reading level. Largest file. |
| `src/components/Videos.jsx` | Video section (seeds + API + links); filters Tier 3 for researchers. |
| `src/components/Sources.jsx` | Renders a list of external source links. |
| `src/components/Discussions.jsx` | Per-topic comment thread. |
| `src/components/Profile.jsx` | `#/me` dashboard: stats, streak, completion, milestones, reading list. |
| `src/components/AuthModal.jsx` | Sign up / log in (email+password) + provider buttons + 10 benefits. |
| `src/components/Search.jsx` | Sidebar typeahead over all topics. |
| `src/components/ErrorBoundary.jsx` | App-wide render-error fallback. |
| `src/utils/summarize.js` | Extractive summariser (verbatim sentence selection). |
| `src/styles.css` | All styles (single dark-theme stylesheet, CSS variables). |
| `server/server.js` | Express API: auth, progress, comments. |
| `server/db.js` | SQLite schema (users, progress, comments). |

## Reading levels (core UX)

`level` (`'beginner'` | `'researcher'`) is stored in `localStorage` (`ns-level`)
and toggled in the sidebar. It changes **what content shows**, not just styling:

- **Beginner:** Overview + Summarize + `BEGINNER_SECTIONS` (what it looks like in
  the brain, history, treatments) + intro videos + encyclopedic source links.
- **Researcher:** no definition — `RESEARCHER_SECTIONS` (mechanisms, neural
  substrate, current challenges, open questions) + Key Reviews + topic-specific
  studies (sortable) + academic lectures (Tier 1–2 only) + scholarly source links.

Section sets are defined at the top of `TopicPage.jsx`; the heading→bucket map is
in `wikipedia.js`.

## Conventions & gotchas

- **No TypeScript, no router lib, minimal deps.** Keep it that way unless asked.
- Match the existing comment style: a short header comment explaining *why* a module exists, especially how it upholds the no-hallucination rule.
- Each content API has an **in-memory cache** (`Map`) for instant revisits.
- React state updates are async — when verifying via injected scripts, measure *after* a tick, not synchronously after a click.
- Screenshots of long topic pages can come back blank (a preview-tool capture quirk on tall scrolled pages) — prefer DOM assertions to confirm behavior.
- DB files (`server/data.db*`) and `node_modules` are gitignored. `.claude/settings.local.json` is local-only — keep it out of commits/PRs.
- Commit messages end with the `Co-Authored-By: Claude` trailer; PRs target `main`.

## Where to read more

- [`docs/CONTENT-SOURCES.md`](docs/CONTENT-SOURCES.md) — every data source, the section-mapping, video authenticity tiers, and the no-hallucination mechanics.
- [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) — taxonomy shape + how to add a category/topic/video seed.
- [`docs/FRONTEND.md`](docs/FRONTEND.md) — component-by-component reference + state/routing.
- [`docs/BACKEND.md`](docs/BACKEND.md) — API endpoints, DB schema, auth, deployment notes.
