# Content Sources & the No-Hallucination Model

Every piece of information in the app traces to a real, external, citable source.
This doc explains each provider and how the cardinal rule (see `CLAUDE.md`) is
enforced in code.

## 1. Wikipedia — article prose (`src/api/wikipedia.js`)

- **Overview:** REST summary `GET /api/rest_v1/page/summary/{title}` → intro extract + thumbnail + canonical URL.
- **Sections:** Action API `?action=parse&prop=sections` lists top-level headings; `&prop=text&section=N` fetches each section's HTML, cleaned by `htmlToText` (strips citation markers, tables, edit links, infoboxes; keeps the first ~6 paragraphs).
- **Heading → bucket mapping** (`SECTION_MAP`): Wikipedia headings are matched by keyword into six conceptual buckets:

  | bucket key | shown as | matched headings (keywords) |
  |---|---|---|
  | `brainSignature` | "What it looks like in the brain" / "Neural substrate & pathophysiology" | signs and symptoms, pathophysiology, pathology, anatomy, structure, mechanism, … |
  | `history` | "History & discovery" | history, discovery, etymology |
  | `whatWeLearned` | "What we have learned" / "Mechanisms & what we have learned" | causes, function, mechanisms, risk factors, genetics, physiology |
  | `treatments` | "Treatments & interventions" | treatment, management, therapy, prevention, prognosis |
  | `currentChallenges` | "Current challenges" | controversies, limitations, challenges, diagnosis, epidemiology |
  | `openQuestions` | "Open questions & ongoing research" | research, future, society and culture |

- Each rendered bucket links back to the **exact source section** (`#anchor`). Unmatched/absent buckets render "No referenced content available" — they are never filled.
- Text is **CC BY-SA**; attribution is shown on every topic page.
- Result is cached per title in an in-memory `Map`.

## 2. Europe PMC — studies & reviews (`src/api/literature.js`)

Two functions, both CORS-friendly, HTTPS, cached:

- **`fetchStudies(term, fallbackQuery, {sort})`** — *topic-specific* by design: the primary query is `(TITLE:"<term>") AND (HAS_ABSTRACT:Y)` so papers are *about* the topic, not passing mentions. Only if that returns <4 results does it top up with the broader `fallbackQuery` (the topic's `query` field). `sort` is `recent` (`P_PDATE_D desc`) or `cited` (`CITED desc`). `coreTerm()` strips parenthetical qualifiers from the Wikipedia title.
- **`fetchReviews(term)`** — `(TITLE:"<term>") AND (PUB_TYPE:"review") AND (HAS_ABSTRACT:Y)`, most-cited first, `resultType=core` to get abstracts. Abstracts are shown **verbatim** (markup stripped by `cleanAbstract`). Reviews are where mechanisms/challenges/open-questions are synthesised, so this densifies the researcher view.

Each result links to the paper (DOI → Europe PMC → PubMed fallback in `articleUrl`).

## 3. YouTube — lectures & videos (`src/api/youtube.js`, `src/data/videoSeeds.js`)

Two honest paths, never fabrication:

1. **oEmbed (keyless, CORS-ok)** validates a known video ID and returns YouTube's real title/author/thumbnail. Used for **verified seeds** (`videoSeeds.js`) and to authenticate everything before display. A bad ID returns 404 → dropped.
2. **YouTube Data API v3** (`searchVideos`) — live topic search, **only when `VITE_YOUTUBE_API_KEY` is set**. Results ranked by authenticity.

**Authenticity tiers** (`tierFor`):
- **Tier 1 — Academic / research:** MIT, Stanford, Harvard, Yale, NIH/NINDS/NIMH, HHMI BioInteractive, Allen Institute, Society for Neuroscience, Nature, Cell Press, Max Planck, Salk, etc.
- **Tier 2 — Reputable educator:** Khan Academy, TED/TED-Ed, Royal Institution, CrashCourse, SciShow, Big Think, Neuroscientifically Challenged, etc.
- **Tier 3 — Other.** In the researcher view, Tier 3 is dropped when ≥2 higher-tier videos exist (`Videos.jsx`).

**`trustedSearchLinks`** (keyless fallback) links to topic-scoped searches on
channels verified to exist *and* publish neuroscience: MIT OpenCourseWare,
Stanford, HHMI BioInteractive, Allen Institute, Khan Academy, TED-Ed, Neuro
Transmissions. (NIH's `@NIHOD` was deliberately removed — it has no neuroscience
lectures. If adding channels, verify the `@handle` resolves to the right channel.)

## 4. Reference & scholarly site links (`src/data/sources.js`)

Per-topic **scoped search URLs** into other authoritative sites so readers aren't
limited to Wikipedia. A scoped search URL never 404s and nothing is fabricated.

- `referenceSources(term)` (beginner): Encyclopædia Britannica, Scholarpedia, BrainFacts.org (SfN), NCBI Bookshelf, MedlinePlus, Khan Academy.
- `scholarlySources(term)` (researcher): PubMed, Europe PMC, Google Scholar, Semantic Scholar, bioRxiv, Nature.

## 5. Summarize (`src/utils/summarize.js`)

On-demand, beginner view. **Extractive only:** `summarizeText` scores sentences
by term-frequency and returns the top few **verbatim**, in reading order, from
`gatherPageText(content)` (the already-fetched, cited text). It never writes new
prose. Orphan fragments (sentences not starting like a real sentence) are dropped.

## Checklist when adding a content feature

1. Does every shown fact come from a fetched source with a link? If not, stop.
2. Is there a clear "no references" state when the source is empty?
3. Is anything derived/guessed (an ID, a label, a date)? Verify it against the source or drop it.
4. Cache the fetch if it's idempotent per session.
