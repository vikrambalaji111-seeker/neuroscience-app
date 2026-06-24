// ---------------------------------------------------------------------------
// Europe PMC live fetch — real published studies/papers.
//
// This is the "studies, experiments, scientists & labs" layer. Every item is
// a real publication record returned by the Europe PMC REST API, shown with
// authors, journal, year, and a link to the source. Nothing is fabricated.
//
// Topic precision: we search the TITLE field for the topic's core term, so a
// page about the hypothalamus returns papers that are *primarily* about the
// hypothalamus — not ones that merely mention it. If a strict title search is
// too sparse, we top up with a broader query so the section is never empty.
//
// API docs: https://europepmc.org/RestfulWebService  (CORS-enabled)
// ---------------------------------------------------------------------------

const BASE = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'

function articleUrl(r) {
  if (r.doi) return `https://doi.org/${r.doi}`
  if (r.source && r.id) return `https://europepmc.org/article/${r.source}/${r.id}`
  if (r.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`
  return null
}

// Drop a parenthetical qualifier so e.g. "Glutamate (neurotransmitter)" becomes
// a clean title term "Glutamate".
function coreTerm(term) {
  return term.replace(/\s*\([^)]*\)/g, '').trim()
}

function mapResult(r) {
  return {
    id: r.id,
    title: r.title.replace(/\.$/, ''),
    authors: r.authorString || 'Authors not listed',
    journal: r.journalTitle || r.bookOrReportDetails?.publisher || '',
    year: r.pubYear || '',
    citedBy: r.citedByCount ?? null,
    url: articleUrl(r),
    source: r.source,
  }
}

async function request(query, pageSize, sort) {
  const sortParam = sort ? `&sort=${encodeURIComponent(sort)}` : ''
  const url = `${BASE}?query=${encodeURIComponent(query)}&format=json&pageSize=${pageSize}${sortParam}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Europe PMC ${res.status}`)
  const data = await res.json()
  return (data.resultList?.result || []).filter((r) => r.title).map(mapResult)
}

// In-memory cache for instant revisits within a session.
const studyCache = new Map()

// Fetch topic-specific studies. `term` is the precise concept (e.g. the
// Wikipedia title); `fallbackQuery` is the broader search used only to top up
// sparse results. `sort` is 'recent' (default) or 'cited'.
export async function fetchStudies(term, fallbackQuery, { pageSize = 12, sort = 'recent' } = {}) {
  const t = coreTerm(term)
  const sortKey = sort === 'cited' ? 'CITED desc' : 'P_PDATE_D desc'
  const cacheKey = `${t}|${pageSize}|${sortKey}`
  if (studyCache.has(cacheKey)) return studyCache.get(cacheKey)

  // Primary: title must contain the term -> paper is primarily about it.
  let results = await request(`(TITLE:"${t}") AND (HAS_ABSTRACT:Y)`, pageSize, sortKey)

  // Top up only if the strict search is sparse.
  if (results.length < 4 && fallbackQuery) {
    const seen = new Set(results.map((r) => r.id))
    const extra = await request(`(${fallbackQuery}) AND (HAS_ABSTRACT:Y)`, pageSize, sortKey)
    results = [...results, ...extra.filter((r) => !seen.has(r.id))].slice(0, pageSize)
  }

  studyCache.set(cacheKey, results)
  return results
}
