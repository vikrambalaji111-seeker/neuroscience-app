# Data Model — Taxonomy, Topics & Seeds

The browse structure is the backbone of the app. It lives in
`src/data/taxonomy.js` and contains **no neuroscience facts** — only labels and
pointers to where content is fetched.

## Category shape

```js
{
  id: 'disorders',                 // unique slug, used in URLs (#/c/disorders)
  name: 'Disorders / Clinical',
  blurb: 'One-line description shown on the category page.',
  layout: 'grid' | 'groups' | 'spine',
  featured: true,                  // optional — highlighted on home + shows landing videos
  // EITHER a flat topic list (grid/spine):
  topics: [ /* Topic[] */ ],
  // OR grouped (groups layout):
  groups: [ { name: '1 · Cellular …', topics: [ /* Topic[] */ ] } ],
}
```

- `grid` — responsive card grid (most categories).
- `groups` — labelled sections, each a grid (Neuroscience 101, Disorders).
- `spine` — horizontal numbered ladder (Level of Analysis / Scale).

## Topic shape

A topic is either **book-backed** (Neuroscience 101) or **wiki-backed** (every
other category):

```js
// Book-backed (Neuroscience 101) — primary content from the textbook:
{ id: 'oni-4-4', name: 'The action potential', section: '4.4', query: 'action potential' }

// Wiki-backed (other categories) — Wikipedia is the fallback content source:
{ id: 'parkinsons', name: "Parkinson's disease", wiki: "Parkinson's disease", query: 'Parkinson disease' }
```

- `section` → key into `src/data/oniContent.js` (verbatim textbook excerpt). `TopicPage` renders the book path when `topic.section` is present, else the Wikipedia path.
- `wiki` → exact English Wikipedia article title (followed redirects; verify it resolves).
- `query` → Europe PMC / video / curated-source search string (used by both).

- `id` must be unique app-wide (it keys `TOPICS_BY_ID` and the URL). Neuroscience 101 topics are prefixed `ns101-` to avoid colliding with the same concept elsewhere.
- `wiki` must be a real article title (redirects are followed, but verify it resolves — a bad title yields an honest "could not load" page, never invented content).
- `query` should be specific enough that title-matched literature is on-topic.

## The categories (7)

1. **Neuroscience 101** (`ns101`, featured, **book-backed**) — mirrors the textbook's 16 chapters as groups (64 topics, ids `oni-<ch>-<sec>`). Content from `oniContent.js`.
2. **Anatomy / Structure** (`anatomy`, grid) — ~20 regions/cells/circuits.
3. **Level of Analysis / Scale** (`scale`, spine) — molecular → … → social.
4. **Functions** (`functions`, grid).
5. **Disorders / Clinical** (`disorders`, groups).
6. **Branches of Neuroscience** (`branches`, grid) — ~17 subfields (cognitive, molecular, computational, …). *Replaced the former Neurochemistry category.*
7. **Lifespan / Development** (`lifespan`, grid).

Categories 2–7 are wiki-backed and feature the curated secondary sources first.

## Derived helpers (same file)

- `TOPICS_BY_ID` — flat `{ id → topic (+categoryId) }` lookup; used by routing.
- `ALL_TOPICS` — flat list with `categoryName`; used by search + profile stats.
- `getCategory(id)`, `getSiblingTopics(id, limit)`, `searchTopics(query, limit)`.

## How to add things

**A topic:** add a `Topic` object to a category's `topics`/`groups[i].topics`
with a unique `id`, a real `wiki` title, and a `query`. Nothing else needed —
the page, search, related-links, and stats pick it up automatically.

**A category:** add a `Category` object to `CATEGORIES`. It appears in the
sidebar, home grid, and routing automatically. Use `featured: true` for a "start
here" highlight + landing videos.

**A verified video seed** (`src/data/videoSeeds.js`): add the YouTube **video id**
to `VIDEO_SEEDS` under a topic id (or a category id for landing videos). **Verify
it first** via oEmbed:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json"
# 200 + JSON (title/author) = real; 404 = drop it.
```

The same id may appear under multiple topics where genuinely relevant. At runtime
each seed is re-validated and shown with YouTube's own title/author.
