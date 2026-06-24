import { useEffect, useState } from 'react'
import { fetchTopicContent } from '../api/wikipedia.js'
import { fetchStudies, fetchReviews } from '../api/literature.js'
import { summarizeText, gatherPageText } from '../utils/summarize.js'
import { getSiblingTopics } from '../data/taxonomy.js'
import { referenceSources, scholarlySources } from '../data/sources.js'
import Videos from './Videos.jsx'
import Sources from './Sources.jsx'

// Which sourced sections each reading level shows. The two levels are
// genuinely different views of the same cited material — beginners get the
// foundational/encyclopedic sections; researchers get mechanism, challenge and
// frontier sections (and, crucially, no basic definition).
const BEGINNER_SECTIONS = [
  { key: 'brainSignature', label: 'What it looks like in the brain' },
  { key: 'history', label: 'History & discovery' },
  { key: 'treatments', label: 'Treatments & interventions' },
]
const RESEARCHER_SECTIONS = [
  { key: 'whatWeLearned', label: 'Mechanisms & what we have learned' },
  { key: 'brainSignature', label: 'Neural substrate & pathophysiology' },
  { key: 'currentChallenges', label: 'Current challenges' },
  { key: 'openQuestions', label: 'Open questions & ongoing research' },
]

// On-demand extractive summary (beginner only). Selects sentences verbatim from
// the sourced text on the page — never generates or rephrases content.
function SummaryPanel({ content }) {
  const [summary, setSummary] = useState(null)
  const run = () => setSummary(summarizeText(gatherPageText(content), 5) || '')
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
          Generates an extractive summary on request — key sentences pulled
          verbatim from the sourced text below. No new text is written.
        </p>
      ) : summary ? (
        <>
          <p className="summary-text">{summary}</p>
          <p className="section-note">Sentences selected verbatim from the cited content on this page.</p>
        </>
      ) : (
        <p className="no-refs">Not enough sourced text on this page to summarize.</p>
      )}
    </section>
  )
}

// A single sourced section. If there is no sourced content, say so plainly.
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
      {data.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
      {data.anchor && (
        <a className="src-link" href={data.anchor} target="_blank" rel="noreferrer">
          Source: Wikipedia — “{data.heading}” ↗
        </a>
      )}
    </section>
  )
}

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

// Topic-specific studies (researcher view). Title-matched in the API layer, so
// results are primarily about this topic. Sortable by recency or citations.
function ResearcherStudies({ term, fallbackQuery }) {
  const [studies, setStudies] = useState([])
  const [status, setStatus] = useState('loading')
  const [sort, setSort] = useState('recent')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchStudies(term, fallbackQuery, { sort })
      .then((s) => { if (alive) { setStudies(s); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [term, fallbackQuery, sort])

  return (
    <section className="topic-section">
      <div className="summary-head">
        <h3>Recent studies on {term}</h3>
        <div className="sort-toggle">
          <button className={sort === 'recent' ? 'active' : ''} onClick={() => setSort('recent')}>Newest</button>
          <button className={sort === 'cited' ? 'active' : ''} onClick={() => setSort('cited')}>Most cited</button>
        </div>
      </div>
      <p className="section-note">
        Peer-reviewed papers from Europe PMC whose title is about {term} — primary literature, not passing mentions.
      </p>
      {status === 'loading' && <p className="loading">Searching published literature…</p>}
      {status === 'error' && <p className="no-refs">Could not reach the literature database. Try again later.</p>}
      {status === 'ready' && !studies.length && <p className="no-refs">No referenced studies found for this topic.</p>}
      {status === 'ready' && studies.length > 0 && (
        <ul className="study-list">
          {studies.map((s) => (
            <li key={s.id} className="study">
              <a href={s.url} target="_blank" rel="noreferrer" className="study-title">{s.title}</a>
              <div className="study-meta">
                <span className="authors">{s.authors}</span>
                {s.journal && <span> · {s.journal}</span>}
                {s.year && <span> · {s.year}</span>}
                {s.citedBy != null && <span> · cited by {s.citedBy}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// Second content provider: title-matched review abstracts (verbatim) that
// synthesise mechanisms, challenges and open questions — densifies the
// researcher view where Wikipedia's own sections are thin.
function ReviewCard({ review }) {
  const [open, setOpen] = useState(false)
  const preview = review.abstract.length > 320 && !open
    ? review.abstract.slice(0, 320).trimEnd() + '…'
    : review.abstract
  return (
    <li className="review">
      <a href={review.url} target="_blank" rel="noreferrer" className="study-title">{review.title}</a>
      <div className="study-meta">
        <span className="authors">{review.authors}</span>
        {review.journal && <span> · {review.journal}</span>}
        {review.year && <span> · {review.year}</span>}
        {review.citedBy != null && <span> · cited by {review.citedBy}</span>}
      </div>
      <p className="review-abstract">{preview}</p>
      {review.abstract.length > 320 && (
        <button className="collapse-btn" onClick={() => setOpen((o) => !o)}>
          {open ? 'Show less' : 'Read full abstract'}
        </button>
      )}
    </li>
  )
}

function KeyReviews({ term }) {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchReviews(term)
      .then((r) => { if (alive) { setReviews(r); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [term])

  if (status === 'ready' && !reviews.length) return null // stay quiet if none

  return (
    <section className="topic-section">
      <h3>Key reviews on {term}</h3>
      <p className="section-note">
        Most-cited review articles from Europe PMC. Abstracts shown verbatim — reviews
        synthesise the mechanisms, challenges and open questions in a field.
      </p>
      {status === 'loading' && <p className="loading">Finding key reviews…</p>}
      {status === 'error' && <p className="no-refs">Could not load reviews. Try again later.</p>}
      {status === 'ready' && (
        <ul className="study-list">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </ul>
      )}
    </section>
  )
}

function RelatedTopics({ topicId, onOpenTopic }) {
  const siblings = getSiblingTopics(topicId)
  if (!siblings.length) return null
  return (
    <section className="topic-section related">
      <h3>Related topics</h3>
      <p className="section-note">More in {siblings[0].categoryName}.</p>
      <div className="related-chips">
        {siblings.map((t) => (
          <button key={t.id} className="related-chip" onClick={() => onOpenTopic(t.id)}>{t.name}</button>
        ))}
      </div>
    </section>
  )
}

export default function TopicPage({ topic, onBack, level = 'beginner', onOpenTopic }) {
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState('loading')
  const isResearcher = level === 'researcher'
  const term = topic.wiki

  useEffect(() => {
    let alive = true
    setStatus('loading')
    setContent(null)
    fetchTopicContent(topic.wiki)
      .then((c) => { if (alive) { setContent(c); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })
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
              <p className={`level-pill level-${level}`}>
                {isResearcher ? 'Researcher view — mechanisms, frontier & primary literature' : 'Beginner view — foundations & plain-language explanations'}
              </p>
              <p className="attribution">
                Content fetched live from{' '}
                <a href={content.pageUrl} target="_blank" rel="noreferrer">{content.source}</a>.
                Nothing on this page is generated by the app.
              </p>
            </div>
          </header>

          {isResearcher ? (
            /* ---------------- Researcher: no definition; mechanism + frontier + literature ---------------- */
            <>
              {RESEARCHER_SECTIONS.map((s) => (
                <Section key={s.key} label={s.label} data={content.sections[s.key]} />
              ))}

              <KeyReviews term={term} />

              <ResearcherStudies term={term} fallbackQuery={topic.query} />

              <Videos id={topic.id} query={topic.query} level={level} heading="Academic lectures & talks" />

              <Sources
                heading="Primary literature & scholarly sources"
                note={`Search ${term} across major scholarly databases.`}
                sources={scholarlySources(term)}
              />
            </>
          ) : (
            /* ---------------- Beginner: definition + foundations + explainers ---------------- */
            <>
              <SummaryPanel content={content} />

              <section className="topic-section">
                <h3>Overview</h3>
                {content.overview.text
                  ? content.overview.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
                  : <p className="no-refs">No overview available.</p>}
                <a className="src-link" href={content.pageUrl} target="_blank" rel="noreferrer">
                  Source: Wikipedia article ↗
                </a>
              </section>

              {BEGINNER_SECTIONS.map((s) => (
                <Section key={s.key} label={s.label} data={content.sections[s.key]} />
              ))}

              <Videos id={topic.id} query={topic.query} level={level} heading="Intro videos & explainers" />

              <Sources
                heading="Read this topic elsewhere"
                note={`The same topic from other trusted references — not just Wikipedia. Searches ${term}.`}
                sources={referenceSources(term)}
              />
            </>
          )}

          {onOpenTopic && <RelatedTopics topicId={topic.id} onOpenTopic={onOpenTopic} />}
        </>
      )}
    </article>
  )
}
