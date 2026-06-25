# Frontend Reference

React 18 + Vite, plain JS/JSX. No TypeScript, no router library, minimal deps.
Single dark-theme stylesheet (`src/styles.css`, CSS variables).

## Boot & composition

```
main.jsx
  └─ <ErrorBoundary>            // app-wide render-error fallback
       └─ <AuthProvider>        // auth + progress context (backend-first, local fallback)
            └─ <App>            // layout, routing, sidebar
```

## Routing (`src/hooks/useHashRoute.js`)

Hash-based, no dependency. `useHashRoute()` returns `[route, navigate]`.

| Hash | Route | View |
|---|---|---|
| `#/` | `{view:'home'}` | category grid |
| `#/c/:id` | `{view:'category', id}` | category (grid/groups/spine) |
| `#/t/:id` | `{view:'topic', id}` | `TopicPage` |
| `#/me` | `{view:'profile'}` | `Profile` dashboard |

`navigate` updates `window.location.hash` (so back/forward + bookmarks work) and
scrolls to top. Unknown ids resolve to a `NotFound` view (no crash).

## `App.jsx`

Owns the sidebar (brand, `AccountBox`, `Search`, level toggle, category nav), the
`MainView` switch, and the `AuthModal` host (shown via `showAuth` state). The
reading `level` lives here (persisted to `localStorage` `ns-level`) and is passed
down to `TopicPage`.

## `TopicPage.jsx` (largest file — read it when touching topic content)

Fetches Wikipedia content for `topic.wiki`, records a visit (for logged-in
users), then renders **by reading level**:

- Header: thumbnail, title, a level pill, and the live-source attribution line.
- `TopicActions`: Read / Save / Notes (or a sign-in prompt for anonymous users).
- **Beginner:** `SummaryPanel` → Overview → `BEGINNER_SECTIONS` → intro `Videos` → `Sources(referenceSources)`.
- **Researcher:** `RESEARCHER_SECTIONS` → `KeyReviews` → `ResearcherStudies` (sortable) → academic `Videos` (Tier ≤2) → `Sources(scholarlySources)`.
- Always: `Discussions` + `RelatedTopics`.

Internal components defined in-file: `TopicActions`, `SummaryPanel`, `Section`,
`LoadingSkeleton`, `ResearcherStudies`, `ReviewCard`, `KeyReviews`,
`RelatedTopics`. Section sets (`BEGINNER_SECTIONS`, `RESEARCHER_SECTIONS`) are
constants near the top.

## Auth + progress (`src/auth/AuthContext.jsx`)

`useAuth()` exposes: `user`, `progress`, `ready`, `backendUp`, `authError`,
`register`, `login`, `signOut`, and progress ops `recordVisit`, `toggleRead`,
`toggleBookmark`, `setNote`, plus selectors `isRead/isBookmarked/getNote`.

- On boot: `checkHealth()`. If backend up + token present → restore via `/me` + `/progress`. Else restore a local session from `localStorage`.
- Progress writes are **optimistic** (local state) then **debounced-synced** to the backend (~800ms), or cached to `localStorage` in local-only mode.
- Progress shape: `{ read:{id:ts}, bookmarks:{id:ts}, notes:{id:text}, history:[{topicId,ts}], streak:{last,count}, lastVisited }`.
- Mutators are no-ops when signed out (content stays fully usable; tracking is the only gated thing).

## Other components

- **`Videos.jsx`** — merges verified seeds + API results, dedupes (seeds win), and for `level==='researcher'` drops Tier 3 when ≥2 higher-tier exist. Lite-embed cards (thumbnail → click → iframe). Always shows trusted-channel search links.
- **`Sources.jsx`** — renders a titled list of external link chips.
- **`Discussions.jsx`** — fetches/posts comments; hidden entirely if `backendUp` is false; public read, auth-gated posting, authors can delete own.
- **`Profile.jsx`** (`#/me`) — stats tiles, continue-reading, milestones (derived from real progress), per-category completion bars, saved reading list, recent history.
- **`AuthModal.jsx`** — Sign up / Log in tabs (email+password), provider buttons (flagged "at launch" until real OAuth), and the 10 benefits.
- **`Search.jsx`** — sidebar typeahead over `ALL_TOPICS` with keyboard nav.
- **`ErrorBoundary.jsx`** — class component; recoverable "return home" fallback.

## Verifying changes

Use the preview tooling (`preview_*`). Reading content is observable in-browser,
so verify per the harness workflow. Notes:
- React state is async — assert *after* a tick, not synchronously after a click.
- Long topic pages sometimes screenshot blank (capture quirk on tall scrolled pages); rely on DOM assertions (`preview_eval`) to confirm behavior.
- Stale console errors can linger in the buffer across HMR reloads; check timestamps / capture fresh errors before concluding there's a regression.
