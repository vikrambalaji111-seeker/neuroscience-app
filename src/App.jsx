import { useState } from 'react'
import { CATEGORIES, getCategory, TOPICS_BY_ID } from './data/taxonomy.js'
import TopicPage from './components/TopicPage.jsx'

function TopicCard({ topic, onOpen }) {
  return (
    <button className="topic-card" onClick={() => onOpen(topic.id)}>
      {topic.name}
    </button>
  )
}

// The "scale spine" — a satisfying horizontal ladder for the levels of analysis.
function Spine({ category, onOpen }) {
  return (
    <div className="spine">
      {category.topics.map((t, i) => (
        <div className="spine-node-wrap" key={t.id}>
          <button className="spine-node" onClick={() => onOpen(t.id)}>
            <span className="spine-num">{i + 1}</span>
            <span className="spine-label">{t.name}</span>
          </button>
        </div>
      ))}
    </div>
  )
}

function CategoryView({ category, onOpen }) {
  return (
    <div className="category-view">
      <h1>{category.name}</h1>
      <p className="category-blurb">{category.blurb}</p>

      {category.layout === 'spine' && <Spine category={category} onOpen={onOpen} />}

      {category.layout === 'grid' && (
        <div className="topic-grid">
          {category.topics.map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} />)}
        </div>
      )}

      {category.layout === 'groups' &&
        category.groups.map((g) => (
          <div key={g.name} className="topic-group">
            <h2>{g.name}</h2>
            <div className="topic-grid">
              {g.topics.map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} />)}
            </div>
          </div>
        ))}
    </div>
  )
}

function Home({ onOpenCategory }) {
  return (
    <div className="home">
      <h1>Neuroscience</h1>
      <p className="lede">
        A sourced reading app for the brain — built for newcomers seeking
        foundations and for researchers tracking the frontier. Every page is
        fetched live from cited sources. Nothing here is written by the app.
      </p>
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat-card" onClick={() => onOpenCategory(c.id)}>
            <h2>{c.name}</h2>
            <p>{c.blurb}</p>
          </button>
        ))}
      </div>
      <p className="sources-note">
        Sources: article text from <strong>Wikipedia</strong> (CC BY-SA);
        studies from <strong>Europe PMC</strong>. Where a source has no matching
        content, the app shows “no references” rather than filling the gap.
      </p>
    </div>
  )
}

export default function App() {
  // Simple state-based routing: { view: 'home'|'category'|'topic', id }
  const [route, setRoute] = useState({ view: 'home' })

  const openCategory = (id) => setRoute({ view: 'category', id })
  const openTopic = (id) => setRoute({ view: 'topic', id })
  const goHome = () => setRoute({ view: 'home' })

  const activeCategoryId =
    route.view === 'category'
      ? route.id
      : route.view === 'topic'
        ? TOPICS_BY_ID[route.id]?.categoryId
        : null

  return (
    <div className="app">
      <aside className="sidebar">
        <button className="brand" onClick={goHome}>🧠 Neuroscience</button>
        <nav>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`nav-item ${activeCategoryId === c.id ? 'active' : ''}`}
              onClick={() => openCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content">
        {route.view === 'home' && <Home onOpenCategory={openCategory} />}
        {route.view === 'category' && (
          <CategoryView category={getCategory(route.id)} onOpen={openTopic} />
        )}
        {route.view === 'topic' && (
          <TopicPage
            topic={TOPICS_BY_ID[route.id]}
            onBack={() => openCategory(TOPICS_BY_ID[route.id].categoryId)}
          />
        )}
      </main>
    </div>
  )
}
