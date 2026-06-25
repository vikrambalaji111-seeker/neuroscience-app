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

```js
{
  id: 'parkinsons',                // globally unique across ALL categories
  name: "Parkinson's disease",     // display label
  wiki: "Parkinson's disease",     // EXACT English Wikipedia article title (content source)
  query: 'Parkinson disease',      // Europe PMC / video search string
}
```

- `id` must be unique app-wide (it keys `TOPICS_BY_ID` and the URL). Neuroscience 101 topics are prefixed `ns101-` to avoid colliding with the same concept elsewhere.
- `wiki` must be a real article title (redirects are followed, but verify it resolves — a bad title yields an honest "could not load" page, never invented content).
- `query` should be specific enough that title-matched literature is on-topic.

## The categories (7)

1. **Neuroscience 101** (`ns101`, featured) — the comprehensive 8-group foundation (65 topics): Cellular & Molecular · Neuroanatomy · Sensory · Motor · Higher Cognitive · Development/Plasticity/Ageing · Disorders · Methods & History.
2. **Anatomy / Structure** (`anatomy`, grid) — ~20 regions/cells/circuits.
3. **Level of Analysis / Scale** (`scale`, spine) — molecular → … → social.
4. **Functions** (`functions`, grid).
5. **Disorders / Clinical** (`disorders`, groups).
6. **Neurochemistry / Signalling** (`neurochemistry`, grid).
7. **Lifespan / Development** (`lifespan`, grid).

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
