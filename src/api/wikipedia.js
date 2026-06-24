// ---------------------------------------------------------------------------
// Wikipedia live fetch.
//
// Everything returned here is content fetched verbatim from English Wikipedia
// at runtime. We do not author, paraphrase-to-distortion, or synthesise facts.
// We only (a) pull the intro summary, (b) pull whole article sections, and
// (c) map section headings into our conceptual buckets. Each bucket carries a
// link back to the exact source section.
//
// License note: Wikipedia text is CC BY-SA. We surface attribution in the UI.
// ---------------------------------------------------------------------------

const REST = 'https://en.wikipedia.org/api/rest_v1'
const ACTION = 'https://en.wikipedia.org/w/api.php'

// Conceptual buckets -> Wikipedia heading keywords that should fill them.
// Order matters: first matching bucket wins for a given heading.
const SECTION_MAP = [
  { key: 'brainSignature', label: 'What it looks like in the brain', keywords: ['signs and symptoms', 'symptoms', 'pathophysiology', 'pathology', 'anatomy', 'structure', 'mechanism', 'neuropathology', 'presentation'] },
  { key: 'history', label: 'History & discovery', keywords: ['history', 'discovery', 'etymology'] },
  { key: 'whatWeLearned', label: 'What we have learned', keywords: ['causes', 'cause', 'function', 'mechanisms', 'risk factors', 'genetics', 'physiology'] },
  { key: 'treatments', label: 'Treatments & interventions', keywords: ['treatment', 'management', 'therapy', 'prevention', 'prognosis'] },
  { key: 'currentChallenges', label: 'Current challenges', keywords: ['controversies', 'limitations', 'challenges', 'diagnosis', 'epidemiology'] },
  { key: 'openQuestions', label: 'Open questions & ongoing research', keywords: ['research', 'research directions', 'future', 'open questions', 'society and culture'] },
]

export const SECTION_ORDER = [
  { key: 'overview', label: 'Overview' },
  ...SECTION_MAP,
]

function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  // Remove citation markers, edit links, tables, figures, references list.
  doc.querySelectorAll(
    'sup.reference, .mw-editsection, table, .hatnote, .thumb, .reflist, style, .navbox, .mbox-text, .ambox'
  ).forEach((el) => el.remove())
  const paras = [...doc.querySelectorAll('p')]
    .map((p) => p.textContent.replace(/\[\d+\]/g, '').trim())
    .filter((t) => t.length > 40)
  return paras.slice(0, 6).join('\n\n').trim()
}

function matchBucket(heading) {
  const h = heading.toLowerCase().trim()
  for (const bucket of SECTION_MAP) {
    if (bucket.keywords.some((k) => h === k || h.startsWith(k) || h.includes(k))) {
      return bucket.key
    }
  }
  return null
}

// Fetch the intro summary (overview) for a topic.
async function fetchSummary(title) {
  const res = await fetch(`${REST}/page/summary/${encodeURIComponent(title)}`)
  if (!res.ok) throw new Error(`Wikipedia summary ${res.status}`)
  const data = await res.json()
  return {
    title: data.title,
    extract: data.extract || '',
    pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    thumbnail: data.thumbnail?.source || null,
  }
}

// Fetch the list of top-level sections for the article.
async function fetchSectionList(title) {
  const url = `${ACTION}?action=parse&page=${encodeURIComponent(title)}&prop=sections&format=json&redirects=1&origin=*`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Wikipedia sections ${res.status}`)
  const data = await res.json()
  return data.parse?.sections || []
}

// Fetch and clean the HTML of a single section by index.
async function fetchSectionText(title, index) {
  const url = `${ACTION}?action=parse&page=${encodeURIComponent(title)}&prop=text&section=${index}&format=json&redirects=1&origin=*`
  const res = await fetch(url)
  if (!res.ok) return ''
  const data = await res.json()
  const html = data.parse?.text?.['*'] || ''
  return htmlToText(html)
}

// Top-level: build the full sourced page for a topic.
export async function fetchTopicContent(title) {
  const summary = await fetchSummary(title)
  const sections = await fetchSectionList(title)

  // Pick the first top-level (toclevel 1) section that maps to each bucket.
  const chosen = {}
  for (const s of sections) {
    if (String(s.toclevel) !== '1') continue
    const bucket = matchBucket(s.line)
    if (bucket && !chosen[bucket]) {
      chosen[bucket] = { index: s.index, heading: s.line }
    }
  }

  // Fetch text for each chosen bucket in parallel.
  const buckets = {}
  await Promise.all(
    Object.entries(chosen).map(async ([key, { index, heading }]) => {
      const text = await fetchSectionText(title, index)
      if (text) buckets[key] = { text, heading, anchor: `${summary.pageUrl}#${encodeURIComponent(heading.replace(/ /g, '_'))}` }
    })
  )

  return {
    overview: {
      text: summary.extract,
      pageUrl: summary.pageUrl,
      thumbnail: summary.thumbnail,
    },
    title: summary.title,
    pageUrl: summary.pageUrl,
    sections: buckets, // keyed by bucket key; missing keys => "no references"
    source: 'Wikipedia (CC BY-SA)',
  }
}
