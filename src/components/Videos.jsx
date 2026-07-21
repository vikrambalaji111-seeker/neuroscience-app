import { useEffect, useState } from 'react'
import {
  resolveSeeds, searchVideos, trustedSearchLinks, youtubeConfigured,
} from '../api/youtube.js'
import { seedsFor } from '../data/videoSeeds.js'

// A single video card. Shows the thumbnail + an authenticity badge; clicking
// plays it inline (lite-embed pattern) so we don't load N iframes up front.
function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={`video-card tier-${video.tier}`}>
      {playing ? (
        <div className="video-embed">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button className="video-thumb" onClick={() => setPlaying(true)}>
          {video.thumbnail && <img src={video.thumbnail} alt="" />}
          <span className="video-play">▶</span>
        </button>
      )}
      <div className="video-meta">
        <span className={`tier-badge tier-${video.tier}`}>{video.tierLabel}</span>
        <a className="video-title" href={video.url} target="_blank" rel="noreferrer">
          {video.title}
        </a>
        <span className="video-author">{video.author}</span>
      </div>
    </div>
  )
}

// Videos section for a topic (or the Neuroscience 101 landing). Combines
// verified seeds with live API results (when a key is configured), ranked by
// authenticity. Always offers trusted-channel search links.
export default function Videos({ id, query, heading = 'Lectures & videos', level = 'beginner' }) {
  const [videos, setVideos] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    setVideos([])

    async function load() {
      const seedIds = seedsFor(id)
      const [seeds, api] = await Promise.all([
        seedIds.length ? resolveSeeds(seedIds) : Promise.resolve([]),
        query ? searchVideos(query) : Promise.resolve({ videos: [] }),
      ])
      if (!alive) return
      // Merge, de-dupe by id (seeds win), keep authenticity order.
      const seen = new Set(seeds.map((v) => v.id))
      let merged = [...seeds, ...api.videos.filter((v) => !seen.has(v.id))]
      // Researchers want academic/educator content — drop Tier 3 when there are
      // enough higher-authenticity options.
      if (level === 'researcher') {
        const higher = merged.filter((v) => v.tier <= 2)
        if (higher.length >= 2) merged = higher
      }
      setVideos(merged)
      setStatus('ready')
    }
    load().catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [id, query, level])

  const links = query ? trustedSearchLinks(query) : []

  return (
    <section className="topic-section videos-section">
      <h3>{heading}</h3>
      <p className="section-note">
        Ranked by source authenticity — academic and research institutions first.
        Every video is verified against YouTube before it appears.
      </p>

      {status === 'loading' && <p className="loading">Finding verified videos…</p>}

      {status !== 'loading' && videos.length > 0 && (
        <div className="video-grid">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}

      {status !== 'loading' && videos.length === 0 && (
        <p className="no-refs">No verified videos to show yet.</p>
      )}

      {!youtubeConfigured && (
        <p className="section-note yt-note">
          Tip: add a free <code>VITE_YOUTUBE_API_KEY</code> to enable live,
          ranked video search for every topic. Until then, browse trusted
          channels directly:
        </p>
      )}

      {links.length > 0 && (
        <div className="related-chips yt-links">
          {links.map((l) => (
            <a key={l.name} className="related-chip" href={l.url} target="_blank" rel="noreferrer">
              {l.name} ↗
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
