// ---------------------------------------------------------------------------
// Europe PMC live fetch — real published studies/papers.
//
// This is the "studies, experiments, scientists & labs" layer. Every item is
// a real publication record returned by the Europe PMC REST API, shown with
// authors, journal, year, and a link to the source. Nothing is fabricated.
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

// Fetch recent + relevant studies for a query.
export async function fetchStudies(query, { pageSize = 12 } = {}) {
  const q = encodeURIComponent(`${query} AND (HAS_ABSTRACT:Y)`)
  const url = `${BASE}?query=${q}&format=json&pageSize=${pageSize}&sort=P_PDATE_D%20desc`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Europe PMC ${res.status}`)
  const data = await res.json()
  const results = data.resultList?.result || []
  return results
    .filter((r) => r.title)
    .map((r) => ({
      id: r.id,
      title: r.title.replace(/\.$/, ''),
      authors: r.authorString || 'Authors not listed',
      journal: r.journalTitle || r.bookOrReportDetails?.publisher || '',
      year: r.pubYear || '',
      citedBy: r.citedByCount ?? null,
      url: articleUrl(r),
      source: r.source,
    }))
}
