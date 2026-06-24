// ---------------------------------------------------------------------------
// YouTube integration with an authenticity-rating system.
//
// Two honest data paths, never fabrication:
//   1. oEmbed (keyless, CORS-ok): validates a known video ID and returns
//      YouTube's real title/author/thumbnail. Used for verified seeds and to
//      authenticate every video before display.
//   2. YouTube Data API v3 (needs a free key in VITE_YOUTUBE_API_KEY): live
//      search for a topic, results ranked by source authenticity.
//
// If no API key is configured, the app shows the verified seeds plus links to
// searches scoped to trusted institutional channels — it never invents videos.
// ---------------------------------------------------------------------------

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || ''

// Authenticity tiers by channel. Tier 1 = academic / research institutions;
// Tier 2 = reputable science educators; anything else = Tier 3 (other).
const TIER1 = [
  'mit opencourseware', 'mit', 'massachusetts institute of technology',
  'stanford', 'stanford university', 'harvard university', 'harvard',
  'harvard medical school', 'yale', 'yalecourses', 'university of oxford',
  'oxford', 'university of cambridge', 'cambridge university',
  'national institutes of health', 'nih', 'ninds', 'nimh',
  'howard hughes medical institute', 'hhmi biointeractive',
  'allen institute', 'society for neuroscience', 'cold spring harbor laboratory',
  'nature video', 'cell press', 'science magazine', 'aaas',
  'max planck society', 'salk institute', 'mcgovern institute',
  'kavli foundation', 'ucl', 'university college london', 'caltech', 'princeton university',
]
const TIER2 = [
  'khan academy', 'khan academy medicine', 'ted', 'ted-ed', 'teded',
  'the royal institution', 'world science festival', 'crashcourse',
  'scishow', 'big think', 'wellcome', 'wellcome collection',
  'neuroscientifically challenged', 'osmosis', 'medlife crisis', 'kurzgesagt – in a nutshell',
]

const TIER_META = {
  1: { label: 'Academic / research', rank: 100 },
  2: { label: 'Reputable educator', rank: 70 },
  3: { label: 'Other source', rank: 30 },
}

export function tierFor(author) {
  const a = (author || '').toLowerCase().trim()
  if (TIER1.some((t) => a === t || a.includes(t))) return 1
  if (TIER2.some((t) => a === t || a.includes(t))) return 2
  return 3
}

export function tierLabel(tier) {
  return TIER_META[tier]?.label || 'Other source'
}

export const youtubeConfigured = Boolean(API_KEY)

// Validate a single video ID and return real YouTube metadata, or null.
export async function fetchOEmbed(id) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    )
    if (!res.ok) return null
    const d = await res.json()
    const tier = tierFor(d.author_name)
    return {
      id,
      title: d.title,
      author: d.author_name,
      authorUrl: d.author_url,
      thumbnail: d.thumbnail_url,
      tier,
      tierLabel: tierLabel(tier),
      url: `https://www.youtube.com/watch?v=${id}`,
    }
  } catch {
    return null
  }
}

// Resolve a list of seed IDs into verified, display-ready videos (best
// authenticity first). Anything that fails validation is dropped.
export async function resolveSeeds(ids) {
  const resolved = await Promise.all(ids.map(fetchOEmbed))
  return resolved
    .filter(Boolean)
    .sort((a, b) => TIER_META[b.tier].rank - TIER_META[a.tier].rank)
}

// Live search via the YouTube Data API, ranked by authenticity then relevance.
export async function searchVideos(query, { max = 8 } = {}) {
  if (!API_KEY) return { configured: false, videos: [] }
  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video` +
    `&maxResults=${max}&relevanceLanguage=en&safeSearch=strict` +
    `&q=${encodeURIComponent(query)}&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return { configured: true, error: true, videos: [] }
  const data = await res.json()
  const videos = (data.items || [])
    .filter((it) => it.id?.videoId)
    .map((it, i) => {
      const author = it.snippet.channelTitle
      const tier = tierFor(author)
      return {
        id: it.id.videoId,
        title: it.snippet.title,
        author,
        thumbnail: it.snippet.thumbnails?.medium?.url,
        tier,
        tierLabel: tierLabel(tier),
        url: `https://www.youtube.com/watch?v=${it.id.videoId}`,
        // Authenticity dominates; original relevance order breaks ties.
        score: TIER_META[tier].rank * 1000 - i,
      }
    })
    .sort((a, b) => b.score - a.score)
  return { configured: true, videos }
}

// Honest keyless fallback: searches scoped to trusted institutional channels.
export function trustedSearchLinks(query) {
  const q = encodeURIComponent(query)
  return [
    { name: 'MIT OpenCourseWare', url: `https://www.youtube.com/@mitocw/search?query=${q}` },
    { name: 'Stanford', url: `https://www.youtube.com/@stanford/search?query=${q}` },
    { name: 'HHMI BioInteractive', url: `https://www.youtube.com/@biointeractive/search?query=${q}` },
    { name: 'Khan Academy', url: `https://www.youtube.com/@khanacademymedicine/search?query=${q}` },
    { name: 'NIH', url: `https://www.youtube.com/@NIHOD/search?query=${q}` },
  ]
}
