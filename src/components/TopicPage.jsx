import { useEffect, useState } from 'react'
import { fetchTopicContent, SECTION_ORDER } from '../api/wikipedia.js'
import { fetchStudies } from '../api/literature.js'
import { summarizeText, gatherPageText } from '../utils/summarize.js'

// On-demand summary panel. Runs ONLY when the user clicks; produces an
// extractive summary (sentences taken verbatim from the sourced text on this
// page). It never generates or rephrases content.
function SummaryPanel({ content }) {
  const [summary, setSummary] = useState(null)

  const run = () => {
    const text = gatherPageText(content)
    setSummary(summarizeText(text, 5) || '')
  }

  return (
    <section className="topic-section summary-box">
      <div className="summary-head">
        <h3>Summary</h3>
        <button className="summarize-btn" onClick={run}>
          {summary === null ? 'Summarize this page' : 'Re-summarize'}
        </button>
      </div>
      {summary === null ? (
        <p className="section-note">
          Generates an extractive summary on request — the key sentences pulled
          verbatim from the sourced text below. No new text is written.
        </p>
      ) : summary ? (
        <>
          <p className="summary-text">{summary}</p>
          <p className="section-note">
            Sentences selected verbatim from the cited content on this page.
          </p>
        </>
      ) : (
        <p className="no-refs">Not enough sourced text on this page to summarize.</p>
      )}
    </section>
  )
}

// A single sourced section. If there is no sourced content, we say so plainly
// rather than inventing anything.
function Section({ label, data }) {
  if (!data || !data.text) {
    return (
      <section className="topic-section empty">
        <h3>{label}</h3>
        <p className="no-refs">No referenced content available for this section.</p>
      </section>
    )
  }
  return (
    <section className="topic-section">
      <h3>{label}</h3>
      {data.text.split('\n\n').map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {data.anchor && (
        <a className="src-link" href={data.anchor} target="_blank" rel="noreferrer">
          Source: Wikipedia — “{data.heading}” ↗
        </a>
      )}
    </section>
  )
}

// Skeleton placeholder shown while sourced content is being fetched.
function LoadingSkeleton({ name }) {
  return (
    <div className="skeleton-wrap" aria-busy="true">
      <p className="loading">Fetching sourced content for “{name}”…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="topic-section">
          <div className="sk-line sk-title" />
          <div className="sk-line" />
          <div className="sk-line" />
          <div className="sk-line sk-short" />
        </div>
      ))}
    </div>
  )
}

function StudyList({ status, studies, query }) {
  if (status === 'loading') return <p className="loading">Searching published literature…</p>
  if (status === 'error') return <p className="no-refs">Could not reach the literature database. Try again later.</p>
  if (!studies.length) return <p className="no-refs">No referenced studies found for this topic.</p>
  return (
    <ul className="study-list">
      {studies.map((s) => (
        <li key={s.id} className="study">
          <a href={s.url} target="_blank" rel="noreferrer" className="study-title">
            {s.title}
          </a>
          <div className="study-meta">
            <span className="authors">{s.authors}</span>
            {s.journal && <span> · {s.journal}</span>}
            {s.year && <span> · {s.year}</span>}
            {s.citedBy != null && <span> · cited by {s.citedBy}</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function TopicPage({ topic, onBack }) {
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState('loading')
  const [studies, setStudies] = useState([])
  const [studyStatus, setStudyStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    setStudyStatus('loading')
    setContent(null)
    setStudies([])

    fetchTopicContent(topic.wiki)
      .then((c) => { if (alive) { setContent(c); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })

    fetchStudies(topic.query)
      .then((s) => { if (alive) { setStudies(s); setStudyStatus('ready') } })
      .catch(() => { if (alive) setStudyStatus('error') })

    return () => { alive = false }
  }, [topic.id])

  return (
    <article className="topic-page">
      <button className="back" onClick={onBack}>← Back</button>

      {status === 'loading' && <LoadingSkeleton name={topic.name} />}
      {status === 'error' && (
        <p className="no-refs">Could not load referenced content for “{topic.name}”. It may not have a matching source article.</p>
      )}

      {content && (
        <>
          <header className="topic-head">
            {content.overview.thumbnail && (
              <img src={content.overview.thumbnail} alt="" className="topic-thumb" />
            )}
            <div>
              <h1>{content.title}</h1>
              <p className="attribution">
                Content fetched live from{' '}
                <a href={content.pageUrl} target="_blank" rel="noreferrer">{content.source}</a>.
                Nothing on this page is generated by the app.
              </p>
            </div>
          </header>

          {/* On-demand summary (extractive, verbatim from sourced text) */}
          <SummaryPanel content={content} />

          {/* Overview */}
          <section className="topic-section">
            <h3>Overview</h3>
            {content.overview.text
              ? content.overview.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
              : <p className="no-refs">No overview available.</p>}
            <a className="src-link" href={content.pageUrl} target="_blank" rel="noreferrer">
              Source: Wikipedia article ↗
            </a>
          </section>

          {/* Mapped sections, always in a fixed order; missing => "no references". */}
          {SECTION_ORDER.filter((s) => s.key !== 'overview').map((s) => (
            <Section key={s.key} label={s.label} data={content.sections[s.key]} />
          ))}

          {/* Studies & experiments layer */}
          <section className="topic-section">
            <h3>Studies, experiments &amp; the scientists behind them</h3>
            <p className="section-note">Recent peer-reviewed publications from Europe PMC, newest first.</p>
            <StudyList status={studyStatus} studies={studies} query={topic.query} />
          </section>
        </>
      )}
    </article>
  )
}
