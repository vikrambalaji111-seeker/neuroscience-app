import { useEffect, useRef, useState } from 'react'
import { searchTopics } from '../data/taxonomy.js'

// Sidebar search box. Filters all topics across every category and jumps to a
// topic on selection. Keyboard: ↑/↓ to move, Enter to open, Esc to clear.
export default function Search({ onOpenTopic }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  const results = query ? searchTopics(query) : []

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const choose = (topic) => {
    onOpenTopic(topic.id)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % results.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + results.length) % results.length) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]) }
    else if (e.key === 'Escape') { setQuery(''); setOpen(false) }
  }

  return (
    <div className="search" ref={boxRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search topics…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && query && (
        <ul className="search-results">
          {results.length === 0 && <li className="search-empty">No matching topics</li>}
          {results.map((t, i) => (
            <li
              key={t.id}
              className={`search-result ${i === active ? 'active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); choose(t) }}
            >
              <span className="sr-name">{t.name}</span>
              <span className="sr-cat">{t.categoryName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
