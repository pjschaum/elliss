import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import h from './Help.module.css'
import BottomNav from '../components/BottomNav'
import HelpFilterSheet, {
  EMPTY_FILTERS,
  countActiveFilters,
  applyHelpFilters,
  AGE_OPTIONS,
  SPECIALIZED_OPTIONS,
  COMMUNITY_OPTIONS,
  INCOME_OPTIONS,
} from '../components/HelpFilterSheet'
import { RESOURCES } from '../data/resources'
import { PROGRAMS } from '../data/programs'
import { COURSES } from '../data/courses'

// ─── Shared active filter pills ──────────────────────────────
// Maps filter key → human label across all option groups
const ALL_FILTER_LABELS = Object.fromEntries([
  ...AGE_OPTIONS,
  ...SPECIALIZED_OPTIONS,
  ...COMMUNITY_OPTIONS,
  ...INCOME_OPTIONS,
].map(o => [o.key, o.label]))

function ActivePills({ filters, onChange }) {
  const pills = [
    ...filters.ageGroups.map(k => ({ group: 'ageGroups', key: k })),
    ...filters.specialized.map(k => ({ group: 'specialized', key: k })),
    ...filters.community.map(k => ({ group: 'community', key: k })),
    ...filters.income.map(k => ({ group: 'income', key: k })),
  ]
  if (pills.length === 0) return null

  function removePill(group, key) {
    onChange({ ...filters, [group]: filters[group].filter(k => k !== key) })
  }

  return (
    <div className={h.activePillRow}>
      {pills.map(({ group, key }) => (
        <span key={`${group}-${key}`} className={h.activePill}>
          {ALL_FILTER_LABELS[key] || key}
          <button
            className={h.activePillX}
            onClick={() => removePill(group, key)}
            aria-label={`Remove ${key} filter`}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  )
}

/* ════════════════════════════════
   RESOURCES TAB
   ════════════════════════════════ */

const RESOURCE_CATS = [
  'All', 'Food & Meals', 'Housing & Shelter', 'Healthcare',
  'Mental Health', 'Clothing', 'Transportation', 'Legal Aid',
  'Child Care', 'Senior Services', 'Financial Aid', 'Disability',
]

function ResourcesTab() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS })
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = countActiveFilters(filters)

  const filtered = applyHelpFilters(
    RESOURCES.filter(r => {
      const matchesCat = activeCategory === 'All' || r.category === activeCategory
      const q = query.toLowerCase()
      const matchesQ = !q || r.org.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
      return matchesCat && matchesQ
    }),
    filters
  )

  return (
    <>
      <h1 className={styles.title}>Resources</h1>
      <p className={styles.subtitle}>Find local support services near you.</p>

      <div className={h.searchRow}>
        <div className={h.searchBar}>
          <span className={h.searchIcon}>🔍</span>
          <input
            className={h.searchInput}
            type="text"
            placeholder="Search resources or services…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
        </div>
        <button
          className={`${h.filterBtn} ${activeCount > 0 ? h.filterBtnActive : ''}`}
          onClick={() => setShowFilters(true)}
        >
          ⚙ Filters
          {activeCount > 0 && <span className={h.filterBadge}>{activeCount}</span>}
        </button>
      </div>

      <ActivePills filters={filters} onChange={setFilters} />

      <div className={h.filters}>
        {RESOURCE_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(r => (
            <div
              key={r.id}
              className={h.card}
              onClick={() => navigate(`/help/resource/${r.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: r.color }}>{r.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{r.org}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{r.category}</span>
                    {r.free
                      ? <span className={h.freeBadge}>Free</span>
                      : <span className={h.paidBadge}>Low Cost</span>}
                  </div>
                </div>
              </div>
              <p className={h.cardDesc}>{r.desc}</p>
              <div className={h.cardFooter}>
                <p className={h.cardDetail}>{r.detail}</p>
                <button
                  className={h.actionBtn}
                  onClick={e => { e.stopPropagation(); navigate(`/help/resource/${r.id}`) }}
                >
                  Get Help
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFilters && (
        <HelpFilterSheet
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          onClose={() => setShowFilters(false)}
        />
      )}
    </>
  )
}

/* ════════════════════════════════
   PROGRAMS TAB
   ════════════════════════════════ */

const PROGRAM_CATS = [
  'All', 'Food Assistance', 'Healthcare', 'Housing', 'Financial',
  'Employment', 'Education', 'Disability', 'Veterans', 'Immigrants', 'Seniors',
]

function ProgramsTab() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS })
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = countActiveFilters(filters)

  const filtered = applyHelpFilters(
    PROGRAMS.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory
      const q = query.toLowerCase()
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.agency.toLowerCase().includes(q)
      return matchesCat && matchesQ
    }),
    filters
  )

  return (
    <>
      <h1 className={styles.title}>Programs</h1>
      <p className={styles.subtitle}>Government and community assistance programs.</p>

      <div className={h.searchRow}>
        <div className={h.searchBar}>
          <span className={h.searchIcon}>🔍</span>
          <input
            className={h.searchInput}
            type="text"
            placeholder="Search programs or benefits…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
        </div>
        <button
          className={`${h.filterBtn} ${activeCount > 0 ? h.filterBtnActive : ''}`}
          onClick={() => setShowFilters(true)}
        >
          ⚙ Filters
          {activeCount > 0 && <span className={h.filterBadge}>{activeCount}</span>}
        </button>
      </div>

      <ActivePills filters={filters} onChange={setFilters} />

      <div className={h.filters}>
        {PROGRAM_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'program' : 'programs'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(p => (
            <div
              key={p.id}
              className={h.card}
              onClick={() => navigate(`/help/program/${p.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: p.color }}>{p.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{p.name}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{p.category}</span>
                    {p.govt && <span className={h.govtBadge}>Gov't Program</span>}
                  </div>
                </div>
              </div>
              <p className={h.cardDesc}>{p.desc}</p>
              <p className={h.cardDetail}>✓ Eligibility: {p.eligibility}</p>
              <div className={h.cardFooter}>
                <div className={h.metaStack}>
                  <span className={h.metaLabel}>Administered by</span>
                  <span className={h.metaValue}>{p.agency}</span>
                </div>
                <button
                  className={h.actionBtn}
                  onClick={e => { e.stopPropagation(); navigate(`/help/program/${p.id}`) }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFilters && (
        <HelpFilterSheet
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          onClose={() => setShowFilters(false)}
        />
      )}
    </>
  )
}

/* ════════════════════════════════
   COURSES TAB
   ════════════════════════════════ */

const COURSE_CATS = [
  'All', 'Job Skills', 'Technology', 'Healthcare', 'Business',
  'Language', 'GED & Literacy', 'Trades', 'Creative Arts', 'Personal Development',
]

function CoursesTab() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [costFilter, setCostFilter] = useState('All')
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS })
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = countActiveFilters(filters)

  const filtered = applyHelpFilters(
    COURSES.filter(c => {
      const matchesCat = activeCategory === 'All' || c.category === activeCategory
      const matchesCost = costFilter === 'All' || (costFilter === 'Free' && c.cost.startsWith('Free')) || (costFilter === 'Paid' && !c.cost.startsWith('Free'))
      const q = query.toLowerCase()
      const matchesQ = !q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      return matchesCat && matchesCost && matchesQ
    }),
    filters
  )

  return (
    <>
      <h1 className={styles.title}>Courses</h1>
      <p className={styles.subtitle}>Free and low-cost learning opportunities.</p>

      <div className={h.searchRow}>
        <div className={h.searchBar}>
          <span className={h.searchIcon}>🔍</span>
          <input
            className={h.searchInput}
            type="text"
            placeholder="Search courses or providers…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
        </div>
        <button
          className={`${h.filterBtn} ${activeCount > 0 ? h.filterBtnActive : ''}`}
          onClick={() => setShowFilters(true)}
        >
          ⚙ Filters
          {activeCount > 0 && <span className={h.filterBadge}>{activeCount}</span>}
        </button>
      </div>

      <ActivePills filters={filters} onChange={setFilters} />

      {/* Cost toggle */}
      <div className={h.filters} style={{ marginBottom: '0.625rem' }}>
        {['All', 'Free', 'Paid'].map(cf => (
          <button
            key={cf}
            className={`${h.chip} ${costFilter === cf ? h.chipActive : ''}`}
            onClick={() => setCostFilter(cf)}
          >
            {cf === 'All' ? 'Any Cost' : cf === 'Free' ? '🆓 Free' : '💳 Paid'}
          </button>
        ))}
      </div>

      {/* Subject filters */}
      <div className={h.filters}>
        {COURSE_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(c => (
            <div
              key={c.id}
              className={h.card}
              onClick={() => navigate(`/help/course/${c.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: c.color }}>{c.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{c.title}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{c.category}</span>
                    {c.cost.startsWith('Free')
                      ? <span className={h.freeBadge}>{c.cost}</span>
                      : <span className={h.paidBadge}>{c.cost}</span>}
                  </div>
                </div>
              </div>

              <p className={h.cardDesc}>{c.desc}</p>

              <div className={h.pillRow}>
                <span className={h.pill}>📅 {c.duration}</span>
                <span className={h.pill}>{c.format === 'Online' ? '💻' : c.format === 'In-Person' ? '📍' : '🔀'} {c.format}</span>
                <span className={h.pill}>📊 {c.level}</span>
              </div>

              <div className={h.cardFooter}>
                <div className={h.metaStack}>
                  <span className={h.metaLabel}>Provider</span>
                  <span className={h.metaValue}>{c.provider}</span>
                </div>
                <button
                  className={h.actionBtn}
                  onClick={e => { e.stopPropagation(); navigate(`/help/course/${c.id}`) }}
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFilters && (
        <HelpFilterSheet
          filters={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          onClose={() => setShowFilters(false)}
        />
      )}
    </>
  )
}

/* ════════════════════════════════
   SHARED EMPTY STATE
   ════════════════════════════════ */

function EmptyState() {
  return (
    <div className={h.emptyState}>
      <p className={h.emptyIcon}>🔎</p>
      <p className={h.emptyTitle}>No results found</p>
      <p className={h.emptyDesc}>Try adjusting your filters or search term.</p>
    </div>
  )
}

/* ════════════════════════════════
   PLACEHOLDER TAB
   ════════════════════════════════ */

function PlaceholderTab({ title, icon, desc }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>{icon}</div>
        <p className={styles.comingSoonTitle}>Coming soon</p>
        <p className={styles.comingSoonDesc}>{desc}</p>
      </div>
    </>
  )
}

/* ════════════════════════════════
   MAIN PAGE
   ════════════════════════════════ */

export default function Help() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resources')

  return (
    <div className={`${styles.page} ${styles.help} ${styles.hasSidebar}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/home')}>← Back</button>
        <div className={styles.wordmark}>
          <img src="/flame-help.svg" alt="" className={styles.headerFlame} />
          <span style={{ color: 'var(--help-dark)' }}>elliss</span>
        </div>
      </header>

      <main className={`${styles.main} ${styles.mainWithNav}`}>
        {activeTab === 'resources'     && <ResourcesTab />}
        {activeTab === 'programs'      && <ProgramsTab />}
        {activeTab === 'courses'       && <CoursesTab />}
        {activeTab === 'notifications' && (
          <PlaceholderTab
            title="Alerts"
            icon="🔔"
            desc="Updates on resources, program deadlines, and messages from organizations."
          />
        )}
        {activeTab === 'account'       && (
          <PlaceholderTab
            title="My Account"
            icon="👤"
            desc="Manage your profile, preferences, and connected accounts."
          />
        )}
      </main>

      <BottomNav variant="help" active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
