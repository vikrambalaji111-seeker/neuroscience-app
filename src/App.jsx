import { useState, useEffect } from 'react'
import { CATEGORIES, getCategory, TOPICS_BY_ID } from './data/taxonomy.js'
import TopicPage from './components/TopicPage.jsx'
import Search from './components/Search.jsx'
import Videos from './components/Videos.jsx'
import Profile from './components/Profile.jsx'
import AuthModal from './components/AuthModal.jsx'
import { useAuth } from './auth/AuthContext.jsx'
import { useHashRoute } from './hooks/useHashRoute.js'

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

      {category.featured && (
        <Videos id={category.id} query="human brain introduction neuroscience" heading="Start here — foundational videos" />
      )}

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

function Home({ onOpenCategory, categories, level }) {
  const researcher = level === 'researcher'
  return (
    <div className="home">
      <span className="home-eyebrow">{researcher ? 'Researcher workspace' : 'Welcome'}</span>
      <h1>{researcher ? 'Track the frontier' : 'Understand the brain'}</h1>
      <p className="lede">
        {researcher
          ? 'Mechanisms, open questions, key reviews and primary literature — the advanced view, without the 101 basics. Everything traces to a cited source.'
          : 'A sourced reading app for the brain. Start with Neuroscience 101, then explore by anatomy, function, disorders and more. Nothing here is written by the app — every page is cited.'}
      </p>
      <div className="cat-grid">
        {categories.map((c) => (
          <button
            key={c.id}
            className={`cat-card ${c.featured ? 'featured' : ''}`}
            onClick={() => onOpenCategory(c.id)}
          >
            {c.featured && <span className="featured-tag">Start here</span>}
            <h2>{c.name}</h2>
            <p>{c.blurb}</p>
          </button>
        ))}
      </div>
      <p className="sources-note">
        Two reading levels: <strong>Beginner</strong> (definitions &amp;
        foundations) and <strong>Researcher</strong> (mechanisms, open questions
        &amp; primary literature). Article text from <strong>Wikipedia</strong>
        (CC BY-SA); topic-matched studies from <strong>Europe PMC</strong>;
        deep links to <strong>Britannica, Scholarpedia, PubMed, Google Scholar,
        bioRxiv, Nature</strong> and more; authenticity-ranked lectures from
        YouTube. Where a source has no matching content, the app shows “no
        references” rather than filling the gap.
      </p>
    </div>
  )
}

// Resolves the current route to a view, tolerating unknown ids from a
// hand-edited or stale URL.
function MainView({ route, openCategory, openTopic, goHome, level, onSignIn, categories }) {
  if (route.view === 'category') {
    const category = getCategory(route.id)
    if (!category) return <NotFound goHome={goHome} />
    return <CategoryView category={category} onOpen={openTopic} />
  }
  if (route.view === 'topic') {
    const topic = TOPICS_BY_ID[route.id]
    if (!topic) return <NotFound goHome={goHome} />
    return (
      <TopicPage
        topic={topic}
        level={level}
        onBack={() => openCategory(topic.categoryId)}
        onOpenTopic={openTopic}
        onSignIn={onSignIn}
      />
    )
  }
  if (route.view === 'profile') {
    return <Profile onOpenTopic={openTopic} onOpenCategory={openCategory} onSignIn={onSignIn} />
  }
  return <Home onOpenCategory={openCategory} categories={categories} level={level} />
}

// Sidebar account area — sign-in prompt for anonymous users, or a chip linking
// to the progress dashboard for logged-in users.
function AccountBox({ onSignIn, onOpenProfile }) {
  const { user } = useAuth()
  if (!user) {
    return (
      <button className="account-box signin" onClick={onSignIn}>
        <span className="account-cta">Sign in / Sign up</span>
        <span className="account-sub">Track progress &amp; save topics</span>
      </button>
    )
  }
  return (
    <button className="account-box" onClick={onOpenProfile}>
      <span className="avatar sm">{(user.name || user.email)[0].toUpperCase()}</span>
      <span className="account-info">
        <span className="account-name">{user.name}</span>
        <span className="account-sub">My progress →</span>
      </span>
    </button>
  )
}

// Beginner vs Researcher reading level. This does NOT rewrite any content
// (that would be generating text). It controls how much sourced material is
// emphasised: beginners get the encyclopedic sections with the technical
// literature collapsed; researchers get the studies panel expanded up front.
const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'researcher', label: 'Researcher' },
]

function LevelToggle({ level, setLevel }) {
  return (
    <div className="level-toggle" role="group" aria-label="Reading level">
      {LEVELS.map((l) => (
        <button
          key={l.id}
          className={`level-btn ${level === l.id ? 'active' : ''}`}
          onClick={() => setLevel(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

function NotFound({ goHome }) {
  return (
    <div className="category-view">
      <h1>Not found</h1>
      <p className="category-blurb">That page doesn’t exist.</p>
      <button className="back" onClick={goHome}>← Home</button>
    </div>
  )
}

export default function App() {
  // Hash-based routing: shareable URLs + browser back/forward support.
  const [route, navigate] = useHashRoute()

  // Reading level, persisted across sessions.
  const [level, setLevelState] = useState(
    () => localStorage.getItem('ns-level') || 'beginner'
  )
  const setLevel = (l) => { setLevelState(l); localStorage.setItem('ns-level', l) }

  // Light / dark appearance, persisted. Applied as a data-attribute on <html>
  // so it can drive the page background too.
  const [theme, setTheme] = useState(() => localStorage.getItem('ns-theme') || 'light')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ns-theme', theme)
  }, [theme])

  const [showAuth, setShowAuth] = useState(false)

  const openCategory = (id) => navigate({ view: 'category', id })
  const openTopic = (id) => navigate({ view: 'topic', id })
  const goHome = () => navigate({ view: 'home' })
  const openProfile = () => navigate({ view: 'profile' })

  const activeCategoryId =
    route.view === 'category'
      ? route.id
      : route.view === 'topic'
        ? TOPICS_BY_ID[route.id]?.categoryId
        : null

  // Beginner vs Researcher see different categories. Neuroscience 101 (the
  // foundations) is a beginner thing — researchers don't need it.
  const visibleCategories =
    level === 'researcher' ? CATEGORIES.filter((c) => c.id !== 'ns101') : CATEGORIES

  return (
    <div className={`app level-${level}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <button className="brand" onClick={goHome}>🧠 Neuroscience</button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <AccountBox onSignIn={() => setShowAuth(true)} onOpenProfile={openProfile} />
        <Search onOpenTopic={openTopic} />
        <LevelToggle level={level} setLevel={setLevel} />
        <nav>
          {visibleCategories.map((c) => (
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
        <MainView
          route={route}
          openCategory={openCategory}
          openTopic={openTopic}
          goHome={goHome}
          level={level}
          categories={visibleCategories}
          onSignIn={() => setShowAuth(true)}
        />
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
