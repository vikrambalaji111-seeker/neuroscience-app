import { useEffect, useState } from 'react'
import { api } from '../api/backend.js'
import { useAuth } from '../auth/AuthContext.jsx'

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`
  return new Date(ts).toLocaleDateString()
}

// Per-topic community discussion. Public to read; posting needs an account.
// Hidden entirely when the community server is offline.
export default function Discussions({ topicId, onSignIn }) {
  const { user, backendUp } = useAuth()
  const [comments, setComments] = useState([])
  const [status, setStatus] = useState('loading')
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!backendUp) return
    let alive = true
    setStatus('loading')
    api.getComments(topicId)
      .then((d) => { if (alive) { setComments(d.comments); setStatus('ready') } })
      .catch(() => { if (alive) setStatus('error') })
    return () => { alive = false }
  }, [topicId, backendUp])

  if (!backendUp) return null

  const post = async () => {
    if (!draft.trim()) return
    setBusy(true)
    try {
      const { comment } = await api.postComment(topicId, draft)
      setComments((c) => [comment, ...c])
      setDraft('')
    } catch { /* surfaced inline below if needed */ }
    setBusy(false)
  }

  const remove = async (id) => {
    try { await api.deleteComment(id); setComments((c) => c.filter((x) => x.id !== id)) } catch { /* ignore */ }
  }

  return (
    <section className="topic-section discussion">
      <h3>Discussion {comments.length > 0 && <span className="count">{comments.length}</span>}</h3>
      <p className="section-note">Compare notes with other readers. Be kind, cite sources where you can.</p>

      {user ? (
        <div className="comment-compose">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share a thought, question, or source…"
            rows={3}
          />
          <button className="summarize-btn" onClick={post} disabled={busy || !draft.trim()}>
            {busy ? 'Posting…' : 'Post comment'}
          </button>
        </div>
      ) : (
        <div className="topic-actions anon">
          <span className="section-note">Sign in to join the discussion.</span>
          <button className="summarize-btn" onClick={onSignIn}>Sign in</button>
        </div>
      )}

      {status === 'loading' && <p className="loading">Loading discussion…</p>}
      {status === 'error' && <p className="no-refs">Could not load the discussion.</p>}
      {status === 'ready' && comments.length === 0 && (
        <p className="no-refs">No comments yet — start the conversation.</p>
      )}

      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment">
            <div className="comment-head">
              <span className="comment-author">{c.author}</span>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
              {user && c.userId === user.id && (
                <button className="link-btn" onClick={() => remove(c.id)}>delete</button>
              )}
            </div>
            <p className="comment-body">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
