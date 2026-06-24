// Renders a set of external source links (encyclopedic or scholarly). Each is a
// real scoped search/lookup on the source's own site — read the same topic
// from a source other than Wikipedia.
export default function Sources({ heading, note, sources }) {
  if (!sources?.length) return null
  return (
    <section className="topic-section sources-section">
      <h3>{heading}</h3>
      {note && <p className="section-note">{note}</p>}
      <div className="source-list">
        {sources.map((s) => (
          <a key={s.name} className="source-card" href={s.url} target="_blank" rel="noreferrer">
            <span className="source-name">{s.name} ↗</span>
            <span className="source-type">{s.type}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
