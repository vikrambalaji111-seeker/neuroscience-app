import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api, checkHealth, getToken, setToken } from '../api/backend.js'

// ---------------------------------------------------------------------------
// Auth + progress.
//
// Primary mode: the community backend (real multi-user accounts, JWT sessions,
// cloud-synced progress that follows you across devices). If the backend is
// unreachable, the app transparently falls back to a local-only account so it
// keeps working offline — progress is then stored in this browser and the
// community features hide until the server is back.
// ---------------------------------------------------------------------------

const AuthCtx = createContext(null)

const SESSION_KEY = 'ns-session'
const USERS_KEY = 'ns-users'
const progressKey = (email) => `ns-progress-${email}`

const todayStr = () => new Date().toISOString().slice(0, 10)
const yesterdayStr = () => new Date(Date.now() - 86400000).toISOString().slice(0, 10)

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function emptyProgress() {
  return { read: {}, bookmarks: {}, notes: {}, history: [], streak: { last: null, count: 0 }, lastVisited: null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [progress, setProgress] = useState(emptyProgress)
  const [backendUp, setBackendUp] = useState(false)
  const [ready, setReady] = useState(false)
  const [authError, setAuthError] = useState('')
  const syncTimer = useRef(null)

  // Boot: detect the backend, then restore a session (cloud or local).
  useEffect(() => {
    let alive = true
    ;(async () => {
      const up = await checkHealth()
      if (!alive) return
      setBackendUp(up)
      if (up && getToken()) {
        try {
          const { user } = await api.me()
          const { data } = await api.getProgress()
          if (!alive) return
          setUser(user)
          setProgress(data || emptyProgress())
        } catch {
          setToken(null)
        }
      } else if (!up) {
        const email = localStorage.getItem(SESSION_KEY)
        if (email) {
          const u = readJSON(USERS_KEY, {})[email]
          if (u) { setUser(u); setProgress(readJSON(progressKey(email), emptyProgress())) }
        }
      }
      if (alive) setReady(true)
    })()
    return () => { alive = false }
  }, [])

  // Persist progress: debounced cloud sync when signed in to the backend,
  // otherwise cache to localStorage.
  useEffect(() => {
    if (!user) return
    if (backendUp && getToken()) {
      clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => { api.putProgress(progress).catch(() => {}) }, 800)
    } else {
      localStorage.setItem(progressKey(user.email), JSON.stringify(progress))
    }
  }, [progress, user, backendUp])

  // ---- local-only fallback sign-in ----
  const localSignIn = useCallback((rawEmail, name, provider = 'email') => {
    const email = (rawEmail || '').trim().toLowerCase()
    if (!email) return
    const users = readJSON(USERS_KEY, {})
    if (!users[email]) {
      users[email] = { id: email, email, name: name?.trim() || email.split('@')[0], provider, createdAt: Date.now() }
    } else if (name?.trim()) users[email].name = name.trim()
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(SESSION_KEY, email)
    setUser(users[email])
    setProgress(readJSON(progressKey(email), emptyProgress()))
  }, [])

  // ---- backend auth ----
  const register = useCallback(async (email, password, displayName) => {
    setAuthError('')
    if (!backendUp) { localSignIn(email, displayName); return true }
    try {
      const { token, user } = await api.register(email, password, displayName)
      setToken(token); setUser(user)
      try { const { data } = await api.getProgress(); setProgress(data || emptyProgress()) }
      catch { setProgress(emptyProgress()) }
      return true
    } catch (e) { setAuthError(e.message); return false }
  }, [backendUp, localSignIn])

  const login = useCallback(async (email, password) => {
    setAuthError('')
    if (!backendUp) { localSignIn(email); return true }
    try {
      const { token, user } = await api.login(email, password)
      setToken(token); setUser(user)
      const { data } = await api.getProgress()
      setProgress(data || emptyProgress())
      return true
    } catch (e) { setAuthError(e.message); return false }
  }, [backendUp, localSignIn])

  const signOut = useCallback(() => {
    setToken(null)
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setProgress(emptyProgress())
  }, [])

  // ---- progress mutators (no-op when signed out) ----
  const update = useCallback((fn) => {
    setProgress((p) => {
      const next = structuredClone(p)
      fn(next)
      return next
    })
  }, [])

  const recordVisit = useCallback((topicId) => { if (!user) return; update((p) => {
    p.lastVisited = topicId
    p.history = [{ topicId, ts: Date.now() }, ...p.history.filter((h) => h.topicId !== topicId)].slice(0, 50)
    const t = todayStr()
    if (p.streak.last !== t) p.streak = { last: t, count: p.streak.last === yesterdayStr() ? p.streak.count + 1 : 1 }
  }) }, [update, user])

  const toggleRead = useCallback((id) => { if (!user) return; update((p) => {
    if (p.read[id]) delete p.read[id]; else p.read[id] = Date.now()
  }) }, [update, user])

  const toggleBookmark = useCallback((id) => { if (!user) return; update((p) => {
    if (p.bookmarks[id]) delete p.bookmarks[id]; else p.bookmarks[id] = Date.now()
  }) }, [update, user])

  const setNote = useCallback((id, text) => { if (!user) return; update((p) => {
    if (text?.trim()) p.notes[id] = text; else delete p.notes[id]
  }) }, [update, user])

  const value = {
    user, progress, ready, backendUp, authError,
    register, login, signOut,
    recordVisit, toggleRead, toggleBookmark, setNote,
    isRead: (id) => Boolean(progress.read[id]),
    isBookmarked: (id) => Boolean(progress.bookmarks[id]),
    getNote: (id) => progress.notes[id] || '',
  }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
