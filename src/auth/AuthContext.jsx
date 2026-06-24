import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Local-first auth + progress.
//
// The app has no backend, so accounts and progress live in the browser
// (localStorage). This is a real, working account system — sign up, sign in,
// sign out, and per-account progress that persists across sessions.
//
// Social sign-in (Google, Facebook, Instagram, Substack, …) is wired through a
// single signIn(email, name, provider) entry point. Connecting *real* provider
// OAuth later means replacing the button handler with the provider SDK and
// calling signIn() with the verified profile — nothing else changes. We never
// pretend a provider is connected when it isn't.
// ---------------------------------------------------------------------------

const AuthCtx = createContext(null)

const USERS_KEY = 'ns-users'
const SESSION_KEY = 'ns-session'
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
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem(SESSION_KEY)
    if (!email) return null
    return readJSON(USERS_KEY, {})[email] || null
  })
  const [progress, setProgress] = useState(() =>
    user ? readJSON(progressKey(user.email), emptyProgress()) : emptyProgress()
  )

  // Persist progress whenever it changes (for the logged-in account only).
  useEffect(() => {
    if (user) localStorage.setItem(progressKey(user.email), JSON.stringify(progress))
  }, [progress, user])

  const signIn = useCallback((rawEmail, name, provider = 'email') => {
    const email = (rawEmail || '').trim().toLowerCase()
    if (!email) return
    const users = readJSON(USERS_KEY, {})
    if (!users[email]) {
      users[email] = {
        id: email, email,
        name: name?.trim() || email.split('@')[0],
        provider, createdAt: Date.now(),
      }
    } else if (name?.trim()) {
      users[email].name = name.trim()
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(SESSION_KEY, email)
    setUser(users[email])
    setProgress(readJSON(progressKey(email), emptyProgress()))
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setProgress(emptyProgress())
  }, [])

  // Apply a mutation to progress — a no-op when signed out.
  const update = useCallback((fn) => {
    setProgress((p) => {
      if (!localStorage.getItem(SESSION_KEY)) return p
      const next = structuredClone(p)
      fn(next)
      return next
    })
  }, [])

  const recordVisit = useCallback((topicId) => update((p) => {
    p.lastVisited = topicId
    p.history = [{ topicId, ts: Date.now() }, ...p.history.filter((h) => h.topicId !== topicId)].slice(0, 50)
    const t = todayStr()
    if (p.streak.last !== t) {
      p.streak = { last: t, count: p.streak.last === yesterdayStr() ? p.streak.count + 1 : 1 }
    }
  }), [update])

  const toggleRead = useCallback((topicId) => update((p) => {
    if (p.read[topicId]) delete p.read[topicId]
    else p.read[topicId] = Date.now()
  }), [update])

  const toggleBookmark = useCallback((topicId) => update((p) => {
    if (p.bookmarks[topicId]) delete p.bookmarks[topicId]
    else p.bookmarks[topicId] = Date.now()
  }), [update])

  const setNote = useCallback((topicId, text) => update((p) => {
    if (text?.trim()) p.notes[topicId] = text
    else delete p.notes[topicId]
  }), [update])

  const value = {
    user,
    progress,
    signIn,
    signOut,
    recordVisit,
    toggleRead,
    toggleBookmark,
    setNote,
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
