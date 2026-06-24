// ---------------------------------------------------------------------------
// Verified video seeds.
//
// Every ID here was confirmed real via YouTube's oEmbed endpoint during the
// build (a wrong ID returns 404 and would have been dropped). At runtime the
// app re-validates each ID through oEmbed and displays YouTube's own returned
// title/author — so nothing shown is asserted from memory or fabricated.
//
// Keyed by topic id (or category id for foundational/landing videos). The same
// video may appear under multiple topics where genuinely relevant.
// ---------------------------------------------------------------------------

export const VIDEO_SEEDS = {
  // Foundational — shown on the Neuroscience 101 landing.
  ns101: ['vHrmiy4W9C0', 'qPix_X-9t7E', 'NNnIGh9g6fA'],

  // Neuroscience 101 leaves.
  'ns101-cns-pns': ['qPix_X-9t7E'],
  'ns101-neurons-glia': ['qPix_X-9t7E'],

  // Cross-listed onto matching topics elsewhere in the app.
  behaviour: ['NNnIGh9g6fA'],
  social: ['NNnIGh9g6fA'],
  cognition: ['vHrmiy4W9C0'],
}

export function seedsFor(id) {
  return VIDEO_SEEDS[id] || []
}
