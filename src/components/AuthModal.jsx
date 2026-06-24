import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'

// 10 reasons to create an account — aimed at people who like to read and learn.
export const BENEFITS = [
  { icon: '📊', title: 'Track your progress', text: 'See completion bars across all categories and watch your knowledge grow.' },
  { icon: '🔥', title: 'Build a reading streak', text: 'A daily streak counter keeps the learning habit going.' },
  { icon: '🔖', title: 'Save a reading list', text: 'Bookmark topics and papers to come back to whenever you like.' },
  { icon: '↩️', title: 'Continue where you left off', text: 'Jump straight back to the last topic you were reading.' },
  { icon: '✅', title: 'Mark as read & revisit', text: 'Track what you’ve mastered and flag topics to revisit later.' },
  { icon: '📝', title: 'Private notes & takeaways', text: 'Jot your own notes on any topic — saved to your profile.' },
  { icon: '🏆', title: 'Earn milestones', text: 'Unlock achievements like “Completed Neuroscience 101”.' },
  { icon: '⚙️', title: 'Preferences that follow you', text: 'Your Beginner/Researcher level and choices are remembered.' },
  { icon: '📈', title: 'Personal stats dashboard', text: 'Topics read, recent activity, and categories mastered at a glance.' },
  { icon: '🔒', title: 'Yours & private', text: 'Sign in with email or a social profile; your data stays in your browser.' },
]

const PROVIDERS = [
  { id: 'google', label: 'Google', glyph: 'G', color: '#ea4335' },
  { id: 'facebook', label: 'Facebook', glyph: 'f', color: '#1877f2' },
  { id: 'instagram', label: 'Instagram', glyph: '📷', color: '#e1306c' },
  { id: 'substack', label: 'Substack', glyph: 'S', color: '#ff6719' },
  { id: 'x', label: 'X', glyph: '𝕏', color: '#000' },
  { id: 'apple', label: 'Apple', glyph: '', color: '#aaa' },
]

export default function AuthModal({ onClose }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [provider, setProvider] = useState('email')

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    signIn(email, name, provider)
    onClose()
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal auth-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="auth-grid">
          {/* Left: value proposition */}
          <div className="auth-benefits">
            <h2>Create your free account</h2>
            <p className="section-note">
              Everything in the app is free for everyone. An account just lets you
              track and personalise your reading.
            </p>
            <ul className="benefit-list">
              {BENEFITS.map((b) => (
                <li key={b.title}>
                  <span className="benefit-icon">{b.icon}</span>
                  <span>
                    <strong>{b.title}</strong>
                    <span className="benefit-text">{b.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: sign-in */}
          <div className="auth-form">
            <h3>{provider === 'email' ? 'Sign up or log in' : `Continue with ${provider}`}</h3>
            <div className="provider-grid">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  className={`provider-btn ${provider === p.id ? 'active' : ''}`}
                  style={{ '--prov': p.color }}
                  onClick={() => setProvider(p.id)}
                >
                  <span className="provider-glyph">{p.glyph || p.label[0]}</span>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="auth-divider"><span>then enter your details</span></div>

            <form onSubmit={submit}>
              <input
                type="email"
                className="search-input"
                placeholder={provider === 'email' ? 'Email address' : `Email linked to your ${provider}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                className="search-input"
                placeholder="Display name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="summarize-btn auth-submit">
                {provider === 'email' ? 'Continue' : `Continue with ${provider}`}
              </button>
            </form>

            <p className="section-note auth-fineprint">
              {provider === 'email'
                ? 'No password needed for this local demo. Your account and progress are stored privately in this browser.'
                : `Social sign-in is simulated locally. Connecting your real ${provider} account needs OAuth credentials + a backend — the app is wired so that’s a drop-in later.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
