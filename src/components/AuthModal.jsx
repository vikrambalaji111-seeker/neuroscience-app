import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

// 10 reasons to create an account — aimed at people who like to read and learn.
export const BENEFITS = [
  { icon: '📊', title: 'Track your progress', text: 'Completion bars across every category, synced to your account.' },
  { icon: '☁️', title: 'Sync across devices', text: 'Your reading, notes, and saves follow you everywhere you log in.' },
  { icon: '🔥', title: 'Build a reading streak', text: 'A daily streak counter keeps the learning habit going.' },
  { icon: '🔖', title: 'Save a reading list', text: 'Bookmark topics and papers to come back to whenever you like.' },
  { icon: '↩️', title: 'Continue where you left off', text: 'Jump straight back to the last topic you were reading.' },
  { icon: '💬', title: 'Join the discussion', text: 'Comment and compare notes with other neuroscience enthusiasts.' },
  { icon: '📝', title: 'Private notes & takeaways', text: 'Jot your own notes on any topic — saved to your profile.' },
  { icon: '🏆', title: 'Earn milestones', text: 'Unlock achievements like “Completed Neuroscience 101”.' },
  { icon: '📈', title: 'Personal stats dashboard', text: 'Topics read, recent activity, and categories mastered at a glance.' },
  { icon: '🧠', title: 'Help the community grow', text: 'Build a shared, well-sourced knowledge base for everyone.' },
]

const PROVIDERS = [
  { id: 'google', label: 'Google', color: '#ea4335' },
  { id: 'facebook', label: 'Facebook', color: '#1877f2' },
  { id: 'instagram', label: 'Instagram', color: '#e1306c' },
  { id: 'substack', label: 'Substack', color: '#ff6719' },
  { id: 'x', label: 'X', color: '#000' },
  { id: 'apple', label: 'Apple', color: '#888' },
]

export default function AuthModal({ onClose }) {
  const { register, login, backendUp, ready } = useAuth()
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [social, setSocial] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email.')
    if (backendUp && password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    const ok = mode === 'signup'
      ? await register(email, password, name)
      : await login(email, password)
    setBusy(false)
    if (ok) onClose()
    else setError((cur) => cur || 'Something went wrong. Please try again.')
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal auth-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="auth-grid">
          <div className="auth-benefits">
            <h2>Join the community</h2>
            <p className="section-note">
              Everything in the app is free for everyone. An account adds
              cross-device sync, progress tracking, and community discussion.
            </p>
            <ul className="benefit-list">
              {BENEFITS.map((b) => (
                <li key={b.title}>
                  <span className="benefit-icon">{b.icon}</span>
                  <span><strong>{b.title}</strong><span className="benefit-text">{b.text}</span></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-form">
            <div className="auth-tabs">
              <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError('') }}>Sign up</button>
              <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError('') }}>Log in</button>
            </div>

            <div className="provider-grid">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="provider-btn"
                  style={{ '--prov': p.color }}
                  onClick={() => setSocial(`${p.label} sign-in arrives at public launch — use email for now.`)}
                >
                  <span className="provider-glyph">{p.label[0]}</span>{p.label}
                </button>
              ))}
            </div>
            {social && <p className="section-note social-note">{social}</p>}

            <div className="auth-divider"><span>or with email</span></div>

            <form onSubmit={submit}>
              {mode === 'signup' && (
                <input className="search-input" type="text" placeholder="Display name (optional)"
                  value={name} onChange={(e) => setName(e.target.value)} />
              )}
              <input className="search-input" type="email" placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
              <input className="search-input" type="password"
                placeholder={backendUp ? 'Password (6+ characters)' : 'Password (not required offline)'}
                value={password} onChange={(e) => setPassword(e.target.value)} />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="summarize-btn auth-submit" disabled={busy}>
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
              </button>
            </form>

            <p className="section-note auth-fineprint">
              {!ready
                ? 'Connecting to the community server…'
                : backendUp
                  ? 'Connected to the community server — your account syncs across devices.'
                  : 'Community server offline — you can still sign in locally; data stays in this browser until the server is reachable.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
