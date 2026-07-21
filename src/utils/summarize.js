// ---------------------------------------------------------------------------
// Extractive summariser.
//
// This does NOT generate or rephrase any text. It selects the most salient
// sentences *verbatim* from content that was already fetched from cited
// sources and shown on the page. That keeps the no-hallucination guarantee:
// every word in a summary is a word that came from the source.
//
// Method: classic frequency-based extractive scoring. Score each sentence by
// the summed normalised frequency of its non-stopword terms, then return the
// top-ranked sentences in their original reading order.
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
  ('a an the and or but of to in on at for with by from as is are was were be been being ' +
    'this that these those it its their his her they them he she we you i which who whom whose ' +
    'has have had do does did can could may might will would shall should must not no nor so than ' +
    'then also such into over under between within about more most other some any all each both ' +
    'while when where what why how there here').split(/\s+/)
)

function splitSentences(text) {
  // Split on sentence boundaries while avoiding common abbreviations / decimals.
  const raw = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?]+(?:[.!?]+["')\]]*|$)/g)
    ?.map((s) => s.trim()) || []

  // Drop orphan fragments left by splitting inside parentheticals/abbreviations
  // (e.g. "425–221 BC) of a disease…"). A real sentence starts with a capital
  // letter or an opening quote/bracket — not a digit, lowercase, or ")".
  return raw.filter((s) => s.length > 0 && /^["'(\[]?[A-Z]/.test(s))
}

function tokenize(s) {
  return s.toLowerCase().match(/[a-z][a-z'-]+/g) || []
}

// Build a faithful extractive summary from already-fetched source text.
// `count` = target number of sentences.
export function summarizeText(text, count = 5) {
  const sentences = splitSentences(text)
  if (sentences.length <= count) return sentences.join(' ')

  // Term frequencies across the whole document.
  const freq = {}
  for (const s of sentences) {
    for (const w of tokenize(s)) {
      if (STOPWORDS.has(w) || w.length < 3) continue
      freq[w] = (freq[w] || 0) + 1
    }
  }
  const maxFreq = Math.max(1, ...Object.values(freq))

  // Score sentences; lightly favour earlier sentences and penalise very short
  // or very long ones so the result reads coherently.
  const scored = sentences.map((s, i) => {
    const words = tokenize(s).filter((w) => !STOPWORDS.has(w) && w.length >= 3)
    if (!words.length) return { i, s, score: 0 }
    const raw = words.reduce((sum, w) => sum + (freq[w] || 0) / maxFreq, 0)
    const positionBoost = 1 + (sentences.length - i) / (sentences.length * 8)
    const lengthPenalty = words.length < 4 || words.length > 45 ? 0.6 : 1
    return { i, s, score: (raw / words.length) * positionBoost * lengthPenalty }
  })

  // Take top `count`, then restore original order for readability.
  const top = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)

  return top.join(' ')
}

// Assemble the page's sourced text (overview + mapped sections) into one
// document for summarisation. Only fetched, cited text is included.
export function gatherPageText(content) {
  const parts = []
  if (content.overview?.text) parts.push(content.overview.text)
  for (const key of Object.keys(content.sections || {})) {
    const sec = content.sections[key]
    if (sec?.text) parts.push(sec.text)
  }
  return parts.join('\n\n')
}
