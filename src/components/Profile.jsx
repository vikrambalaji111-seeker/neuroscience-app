import { useAuth } from '../auth/AuthContext.jsx'
import { CATEGORIES, ALL_TOPICS, TOPICS_BY_ID } from '../data/taxonomy.js'

function pct(n, d) { return d ? Math.round((n / d) * 100) : 0 }

export default function Profile({ onOpenTopic, onOpenCategory, onSignIn }) {
  const { user, progress, signOut } = useAuth()

  if (!user) {
    return (
      <div className="category-view">
        <h1>Your progress</h1>
        <p className="category-blurb">Sign in to track reading, save topics, and see your stats.</p>
        <button className="summarize-btn" onClick={onSignIn}>Sign in / Sign up</button>
      </div>
    )
  }

  const readIds = Object.keys(progress.read)
  const readCount = readIds.length
  const totalTopics = ALL_TOPICS.length
  const bookmarkIds = Object.keys(progress.bookmarks)
  const noteCount = Object.keys(progress.notes).length

  // Per-category completion.
  const perCategory = CATEGORIES.map((c) => {
    const topics = ALL_TOPICS.filter((t) => t.categoryId === c.id)
    const read = topics.filter((t) => progress.read[t.id]).length
    return { id: c.id, name: c.name, read, total: topics.length }
  })

  // Achievements — all derived from real progress.
  const ns101Topics = ALL_TOPICS.filter((t) => t.categoryId === 'ns101')
  const ns101Done = ns101Topics.length > 0 && ns101Topics.every((t) => progress.read[t.id])
  const masteredCategory = perCategory.some((c) => c.total > 0 && c.read === c.total)
  const achievements = [
    { id: 'first', icon: '🌱', label: 'First steps', earned: readCount >= 1, hint: 'Read your first topic' },
    { id: 'ten', icon: '📚', label: 'Curious mind', earned: readCount >= 10, hint: 'Read 10 topics' },
    { id: 'ns101', icon: '🎓', label: 'Neuroscience 101', earned: ns101Done, hint: 'Finish the 101 module' },
    { id: 'streak', icon: '🔥', label: 'Week streak', earned: progress.streak.count >= 7, hint: '7-day reading streak' },
    { id: 'master', icon: '🏆', label: 'Category master', earned: masteredCategory, hint: 'Complete any category' },
  ]

  const continueTopic = progress.lastVisited && TOPICS_BY_ID[progress.lastVisited]
  const recent = progress.history.slice(0, 6).map((h) => TOPICS_BY_ID[h.topicId]).filter(Boolean)

  return (
    <div className="category-view profile">
      <div className="profile-head">
        <div className="avatar">{(user.name || user.email)[0].toUpperCase()}</div>
        <div>
          <h1>{user.name}</h1>
          <p className="attribution">
            {user.email} · signed in via {user.provider}
            <button className="link-btn" onClick={signOut}>Sign out</button>
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="stat-grid">
        <div className="stat-tile"><span className="stat-num">{readCount}</span><span className="stat-label">topics read</span></div>
        <div className="stat-tile"><span className="stat-num">{pct(readCount, totalTopics)}%</span><span className="stat-label">of {totalTopics} total</span></div>
        <div className="stat-tile"><span className="stat-num">{progress.streak.count}🔥</span><span className="stat-label">day streak</span></div>
        <div className="stat-tile"><span className="stat-num">{bookmarkIds.length}</span><span className="stat-label">saved</span></div>
        <div className="stat-tile"><span className="stat-num">{noteCount}</span><span className="stat-label">notes</span></div>
      </div>

      {/* Continue reading */}
      {continueTopic && (
        <section className="topic-section">
          <h3>Continue reading</h3>
          <button className="related-chip" onClick={() => onOpenTopic(continueTopic.id)}>{continueTopic.name} →</button>
        </section>
      )}

      {/* Achievements */}
      <section className="topic-section">
        <h3>Milestones</h3>
        <div className="achv-grid">
          {achievements.map((a) => (
            <div key={a.id} className={`achv ${a.earned ? 'earned' : ''}`} title={a.hint}>
              <span className="achv-icon">{a.icon}</span>
              <span className="achv-label">{a.label}</span>
              <span className="achv-hint">{a.earned ? 'Unlocked' : a.hint}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Per-category completion */}
      <section className="topic-section">
        <h3>Completion by category</h3>
        {perCategory.map((c) => (
          <div key={c.id} className="cat-progress" onClick={() => onOpenCategory(c.id)}>
            <div className="cat-progress-top">
              <span>{c.name}</span>
              <span className="cat-progress-num">{c.read}/{c.total}</span>
            </div>
            <div className="bar"><div className="bar-fill" style={{ width: `${pct(c.read, c.total)}%` }} /></div>
          </div>
        ))}
      </section>

      {/* Reading list */}
      <section className="topic-section">
        <h3>Saved reading list</h3>
        {bookmarkIds.length === 0
          ? <p className="no-refs">Nothing saved yet — tap “Save” on any topic.</p>
          : (
            <div className="related-chips">
              {bookmarkIds.map((id) => TOPICS_BY_ID[id]).filter(Boolean).map((t) => (
                <button key={t.id} className="related-chip" onClick={() => onOpenTopic(t.id)}>{t.name}</button>
              ))}
            </div>
          )}
      </section>

      {/* Recently explored */}
      {recent.length > 0 && (
        <section className="topic-section">
          <h3>Recently explored</h3>
          <div className="related-chips">
            {recent.map((t) => (
              <button key={t.id} className="related-chip" onClick={() => onOpenTopic(t.id)}>{t.name}</button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
