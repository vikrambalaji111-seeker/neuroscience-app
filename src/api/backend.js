// ---------------------------------------------------------------------------
// API client for the community backend.
//
// Talks to the Express + SQLite server (auth, progress sync, discussions). If
// the server is unreachable the app falls back to local-only mode, so it never
// breaks — community features simply hide until the server is up.
// ---------------------------------------------------------------------------

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'
const TOKEN_KEY = 'ns-token'

let token = localStorage.getItem(TOKEN_KEY) || null
export const getToken = () => token
export function setToken(t) {
  token = t
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

async function req(path, { method = 'GET', body, authed = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (authed && token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export async function checkHealth() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 2500)
    const res = await fetch(BASE + '/api/health', { signal: ctrl.signal })
    clearTimeout(t)
    return res.ok
  } catch {
    return false
  }
}

export const api = {
  register: (email, password, displayName) =>
    req('/api/auth/register', { method: 'POST', body: { email, password, displayName } }),
  login: (email, password) =>
    req('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => req('/api/auth/me', { authed: true }),
  getProgress: () => req('/api/progress', { authed: true }),
  putProgress: (data) => req('/api/progress', { method: 'PUT', authed: true, body: { data } }),
  getComments: (topicId) => req(`/api/topics/${encodeURIComponent(topicId)}/comments`),
  postComment: (topicId, body) =>
    req(`/api/topics/${encodeURIComponent(topicId)}/comments`, { method: 'POST', authed: true, body: { body } }),
  deleteComment: (id) => req(`/api/comments/${id}`, { method: 'DELETE', authed: true }),
}
