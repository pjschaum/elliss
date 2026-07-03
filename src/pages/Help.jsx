import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Interface.module.css'
import h from './Help.module.css'
import BottomNav from '../components/BottomNav'
import useSavedItems from '../hooks/useSavedItems'
import HelpAlertsTab from './HelpAlertsTab'
import AccountTab from './AccountTab'
import HelpFilterSheet, {
  EMPTY_FILTERS,
  countActiveFilters,
  applyHelpFilters,
  AGE_OPTIONS,
  SPECIALIZED_OPTIONS,
  COMMUNITY_OPTIONS,
  INCOME_OPTIONS,
  EMPTY_COURSE_FILTERS,
  countActiveCourseFilters,
  applyCourseFilters,
  COURSE_SUBJECT_OPTIONS,
  COURSE_FORMAT_OPTIONS,
  COURSE_COST_OPTIONS,
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
  ...COURSE_SUBJECT_OPTIONS,
  ...COURSE_FORMAT_OPTIONS,
  ...COURSE_COST_OPTIONS,
].map(o => [o.key, o.label]))

function ActivePills({ filters, onChange }) {
  // Works for both service filters (ageGroups/specialized/etc.) and course filters (subject/format/cost)
  const pills = Object.entries(filters).flatMap(([group, val]) =>
    Array.isArray(val) ? val.map(key => ({ group, key })) : []
  )
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

// ─── Heart / save button ─────────────────────────────────────
function SaveButton({ saved, onToggle }) {
  return (
    <button
      className={`${h.saveBtn} ${saved ? h.saveBtnActive : ''}`}
      onClick={e => { e.stopPropagation(); onToggle() }}
      aria-label={saved ? 'Remove from saved' : 'Save for later'}
    >
      {saved ? '♥' : '♡'}
    </button>
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

function ResourcesTab({ savedHook }) {
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
                <div
                  className={h.orgLogo}
                  style={{ background: r.color, cursor: r.orgId ? 'pointer' : 'default' }}
                  onClick={e => { if (r.orgId) { e.stopPropagation(); navigate(`/help/org/${r.orgId}`) } }}
                  title={r.orgId ? `About ${r.org}` : undefined}
                >
                  {r.initials}
                </div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{r.org}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{r.category}</span>
                    {r.free
                      ? <span className={h.freeBadge}>Free</span>
                      : <span className={h.paidBadge}>Low Cost</span>}
                  </div>
                </div>
                {savedHook && (
                  <SaveButton
                    saved={savedHook.isItemSaved('resource', r.id)}
                    onToggle={() => savedHook.toggleSaved('resource', r.id)}
                  />
                )}
              </div>
              <p className={h.cardDesc}>{r.desc}</p>
              <div className={h.cardFooter}>
                <div className={h.metaStack}>
                  {r.address && <span className={h.metaLabel}>📍 {r.address.split(',')[0]}</span>}
                  {r.hours && <span className={h.metaValue}>{r.hours.split('|')[0].trim()}</span>}
                </div>
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

function ProgramsTab({ savedHook }) {
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
                <div
                  className={h.orgLogo}
                  style={{ background: p.color, cursor: p.orgId ? 'pointer' : 'default' }}
                  onClick={e => { if (p.orgId) { e.stopPropagation(); navigate(`/help/org/${p.orgId}`) } }}
                  title={p.orgId ? `About ${p.agency}` : undefined}
                >
                  {p.initials}
                </div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{p.name}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{p.category}</span>
                    {p.govt && <span className={h.govtBadge}>Gov't Program</span>}
                  </div>
                </div>
                {savedHook && (
                  <SaveButton
                    saved={savedHook.isItemSaved('program', p.id)}
                    onToggle={() => savedHook.toggleSaved('program', p.id)}
                  />
                )}
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

function CoursesTab({ savedHook }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ ...EMPTY_COURSE_FILTERS })
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = countActiveCourseFilters(filters)

  const filtered = applyCourseFilters(
    COURSES.filter(c => {
      const q = query.toLowerCase()
      return !q || c.name.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
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
                <div
                  className={h.orgLogo}
                  style={{ background: c.color, cursor: c.orgId ? 'pointer' : 'default' }}
                  onClick={e => { if (c.orgId) { e.stopPropagation(); navigate(`/help/org/${c.orgId}`) } }}
                  title={c.orgId ? `About ${c.provider}` : undefined}
                >
                  {c.initials}
                </div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{c.name}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{c.category}</span>
                    {(() => {
                      const costLabel = c.cost.split(/[—(]/)[0].trim()
                      return costLabel === '$0'
                        ? <span className={h.freeBadge}>Free</span>
                        : <span className={h.paidBadge}>{costLabel}</span>
                    })()}
                  </div>
                </div>
                {savedHook && (
                  <SaveButton
                    saved={savedHook.isItemSaved('course', c.id)}
                    onToggle={() => savedHook.toggleSaved('course', c.id)}
                  />
                )}
              </div>

              <p className={h.cardDesc}>{c.desc}</p>

              <div className={h.pillRow}>
                <span className={h.pill}>📅 {c.duration}</span>
                <span className={h.pill}>
                  {c.format.toLowerCase().startsWith('online') ? '💻' : c.format.toLowerCase().startsWith('in-person') ? '📍' : '🔀'} {c.format}
                </span>
                {c.certType && <span className={h.pill}>🏅 {c.certType.split('+')[0].trim()}</span>}
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
          type="course"
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
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'resources'
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true })
  const savedHook = useSavedItems()

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
        {activeTab === 'resources'     && <ResourcesTab savedHook={savedHook} />}
        {activeTab === 'programs'      && <ProgramsTab savedHook={savedHook} />}
        {activeTab === 'courses'       && <CoursesTab savedHook={savedHook} />}
        {activeTab === 'notifications' && <HelpAlertsTab />}
        {activeTab === 'account'       && <AccountTab side="help" savedHook={savedHook} />}
      </main>

      <BottomNav variant="help" active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
