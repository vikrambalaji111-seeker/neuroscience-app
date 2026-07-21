// Neuroscience app API — auth, cloud-synced progress, and community discussions.
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')

const PORT = process.env.PORT || 8787
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
const TOKEN_TTL = '30d'

const app = express()
app.use(cors())
app.use(express.json({ limit: '256kb' }))

// --- helpers ---------------------------------------------------------------
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.display_name, provider: u.provider })

function sign(user) {
  return jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: TOKEN_TTL })
}

// Auth middleware. `required` -> 401 when missing/invalid; otherwise attaches
// req.user when a valid token is present and continues regardless.
function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) {
      if (required) return res.status(401).json({ error: 'Authentication required' })
      return next()
    }
    try {
      const { uid } = jwt.verify(token, JWT_SECRET)
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(uid)
      if (!user) return required ? res.status(401).json({ error: 'Invalid session' }) : next()
      req.user = user
      next()
    } catch {
      if (required) return res.status(401).json({ error: 'Invalid session' })
      next()
    }
  }
}

// --- health ----------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// --- auth ------------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  let { email, password, displayName } = req.body || {}
  email = (email || '').trim().toLowerCase()
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email and a password of 6+ characters are required.' })
  }
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with that email already exists. Try logging in.' })
  }
  const hash = bcrypt.hashSync(password, 10)
  const name = (displayName || '').trim() || email.split('@')[0]
  const info = db.prepare(
    'INSERT INTO users (email, password_hash, display_name, provider, created_at) VALUES (?,?,?,?,?)'
  ).run(email, hash, name, 'email', Date.now())
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid)
  res.json({ token: sign(user), user: publicUser(user) })
})

app.post('/api/auth/login', (req, res) => {
  let { email, password } = req.body || {}
  email = (email || '').trim().toLowerCase()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Wrong email or password.' })
  }
  res.json({ token: sign(user), user: publicUser(user) })
})

app.get('/api/auth/me', auth(), (req, res) => res.json({ user: publicUser(req.user) }))

// --- progress sync ---------------------------------------------------------
app.get('/api/progress', auth(), (req, res) => {
  const row = db.prepare('SELECT data FROM progress WHERE user_id = ?').get(req.user.id)
  res.json({ data: row ? JSON.parse(row.data) : null })
})

app.put('/api/progress', auth(), (req, res) => {
  const data = JSON.stringify(req.body?.data ?? {})
  db.prepare(`
    INSERT INTO progress (user_id, data, updated_at) VALUES (?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run(req.user.id, data, Date.now())
  res.json({ ok: true })
})

// --- community discussions -------------------------------------------------
// Public read so anonymous visitors can see the conversation.
app.get('/api/topics/:topicId/comments', (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.body, c.created_at AS createdAt, c.user_id AS userId, u.display_name AS author
    FROM comments c JOIN users u ON u.id = c.user_id
    WHERE c.topic_id = ? ORDER BY c.created_at DESC LIMIT 200
  `).all(req.params.topicId)
  res.json({ comments: rows })
})

app.post('/api/topics/:topicId/comments', auth(), (req, res) => {
  const body = (req.body?.body || '').trim()
  if (!body) return res.status(400).json({ error: 'Comment cannot be empty.' })
  if (body.length > 4000) return res.status(400).json({ error: 'Comment is too long.' })
  const info = db.prepare(
    'INSERT INTO comments (topic_id, user_id, body, created_at) VALUES (?,?,?,?)'
  ).run(req.params.topicId, req.user.id, body, Date.now())
  const row = db.prepare(`
    SELECT c.id, c.body, c.created_at AS createdAt, c.user_id AS userId, u.display_name AS author
    FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?
  `).get(info.lastInsertRowid)
  res.json({ comment: row })
})

app.delete('/api/comments/:id', auth(), (req, res) => {
  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  if (row.user_id !== req.user.id) return res.status(403).json({ error: 'Not your comment' })
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`Neuroscience API listening on http://localhost:${PORT}`))
