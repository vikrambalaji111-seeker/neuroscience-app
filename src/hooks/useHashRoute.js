import { useEffect, useState } from 'react'

// Tiny hash-based router so pages are shareable, bookmarkable, and work with
// the browser's back/forward buttons. No external dependency.
//
// Hash grammar:
//   #/              -> { view: 'home' }
//   #/c/<id>        -> { view: 'category', id }
//   #/t/<id>        -> { view: 'topic', id }

export function parseHash(hash) {
  const h = (hash || '').replace(/^#\/?/, '')
  const [seg, id] = h.split('/')
  if (seg === 'c' && id) return { view: 'category', id }
  if (seg === 't' && id) return { view: 'topic', id }
  return { view: 'home' }
}

export function routeToHash(route) {
  if (route.view === 'category') return `#/c/${route.id}`
  if (route.view === 'topic') return `#/t/${route.id}`
  return '#/'
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  // Navigation just updates the hash; the listener above syncs state. This
  // keeps back/forward and bookmarks working for free.
  const navigate = (next) => {
    const target = routeToHash(next)
    if (window.location.hash !== target) window.location.hash = target
    else setRoute(next) // same hash (e.g. re-click) -> still ensure state
    // Scroll to top on navigation so new pages start at the top.
    window.scrollTo(0, 0)
  }

  return [route, navigate]
}
