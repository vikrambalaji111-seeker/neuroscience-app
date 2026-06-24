// ---------------------------------------------------------------------------
// External reference sources.
//
// The app's article text comes from Wikipedia, but users shouldn't be limited
// to one source. These functions return per-topic deep links into other
// authoritative references so a reader can study the same topic elsewhere.
//
// Every link is a real, scoped search/lookup URL on the source's own site —
// nothing is fabricated, and a scoped search never 404s. Split into two sets so
// the Beginner and Researcher views can surface the right kind of source.
// ---------------------------------------------------------------------------

// Encyclopedic / educational references — beginner-friendly, explanatory.
export function referenceSources(term) {
  const q = encodeURIComponent(term)
  return [
    { name: 'Encyclopædia Britannica', type: 'Encyclopedia', url: `https://www.britannica.com/search?query=${q}` },
    { name: 'Scholarpedia', type: 'Peer-reviewed encyclopedia', url: `http://www.scholarpedia.org/w/index.php?search=${q}` },
    { name: 'BrainFacts.org', type: 'Public neuroscience · SfN', url: `https://www.brainfacts.org/search?q=${q}` },
    { name: 'NCBI Bookshelf', type: 'Open textbooks · NIH', url: `https://www.ncbi.nlm.nih.gov/books/?term=${q}` },
    { name: 'MedlinePlus', type: 'Health reference · NIH', url: `https://medlineplus.gov/search/?query=${q}` },
    { name: 'Khan Academy', type: 'Guided learning', url: `https://www.khanacademy.org/search?page_search_query=${q}` },
  ]
}

// Scholarly / primary literature — researcher-focused, frontier.
export function scholarlySources(term) {
  const q = encodeURIComponent(term)
  return [
    { name: 'PubMed', type: 'Biomedical literature · NIH', url: `https://pubmed.ncbi.nlm.nih.gov/?term=${q}` },
    { name: 'Europe PMC', type: 'Life-science literature', url: `https://europepmc.org/search?query=${q}` },
    { name: 'Google Scholar', type: 'Scholarly search', url: `https://scholar.google.com/scholar?q=${q}` },
    { name: 'Semantic Scholar', type: 'AI-assisted scholarly search', url: `https://www.semanticscholar.org/search?q=${q}&sort=relevance` },
    { name: 'bioRxiv', type: 'Preprints', url: `https://www.biorxiv.org/search/${q}` },
    { name: 'Nature', type: 'Journals', url: `https://www.nature.com/search?q=${q}` },
  ]
}
