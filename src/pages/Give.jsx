import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import g from './Give.module.css'
import BottomNav from '../components/BottomNav'

/* ════════════════════════════════
   VOLUNTEER TAB — data & component
   ════════════════════════════════ */

const VOL_CATEGORIES = ['All', 'Food Bank', 'Environment', 'Education', 'Youth', 'Seniors', 'Animals', 'Health']

const EVENTS = [
  {
    id: 1,
    org: 'Greater Chicago Food Depository',
    initials: 'GC',
    color: '#76479c',
    title: 'Community Food Sort & Pack',
    date: 'Sat, Jul 12',
    time: '9:00 AM – 12:00 PM',
    distance: '2.3 mi',
    tags: ['Food Bank', 'Community'],
    spots: 12,
  },
  {
    id: 2,
    org: 'Lincoln Park Zoo',
    initials: 'LP',
    color: '#2D7D46',
    title: 'Conservation Habitat Cleanup',
    date: 'Sun, Jul 13',
    time: '8:00 AM – 11:00 AM',
    distance: '4.7 mi',
    tags: ['Environment', 'Animals'],
    spots: 8,
  },
  {
    id: 3,
    org: 'Literacy Works Chicago',
    initials: 'LW',
    color: '#E07B2A',
    title: 'Adult Literacy Tutoring Session',
    date: 'Tue, Jul 15',
    time: '6:00 PM – 8:00 PM',
    distance: '1.8 mi',
    tags: ['Education'],
    spots: 4,
  },
  {
    id: 4,
    org: 'Senior Care Chicago',
    initials: 'SC',
    color: '#7B5EA7',
    title: 'Companion Visits Program',
    date: 'Wed, Jul 16',
    time: '2:00 PM – 4:00 PM',
    distance: '3.1 mi',
    tags: ['Seniors', 'Health'],
    spots: 6,
  },
  {
    id: 5,
    org: 'Chicago Youth Programs',
    initials: 'CY',
    color: '#D94F3D',
    title: 'After-School Mentorship',
    date: 'Thu, Jul 17',
    time: '3:30 PM – 5:30 PM',
    distance: '0.9 mi',
    tags: ['Youth', 'Education'],
    spots: 3,
  },
]

function VolunteerTab() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.tags.includes(activeCategory))

  return (
    <>
      <h1 className={styles.title}>Volunteer Events</h1>
      <p className={styles.subtitle}>Find opportunities near you.</p>

      <div className={g.searchCard}>
        <div className={g.searchRow}>
          <span className={g.searchIcon}>📍</span>
          <input
            className={g.searchInput}
            type="text"
            placeholder="Enter zip code or city"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <select
            className={g.radiusSelect}
            value={radius}
            onChange={e => setRadius(e.target.value)}
          >
            <option value="5">5 mi</option>
            <option value="10">10 mi</option>
            <option value="25">25 mi</option>
            <option value="50">50 mi</option>
          </select>
        </div>
        <button className={g.searchBtn}>Search</button>
      </div>

      <div className={g.filters}>
        {VOL_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${g.chip} ${activeCategory === cat ? g.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={g.resultsCount}>{filtered.length} opportunities near you</p>

      <div className={g.eventList}>
        {filtered.map(event => (
          <div key={event.id} className={g.eventCard}>
            <div className={g.orgLogo} style={{ background: event.color }}>
              {event.initials}
            </div>
            <div className={g.eventInfo}>
              <div className={g.eventHeader}>
                <span className={g.orgName}>{event.org}</span>
                <span className={g.distance}>📍 {event.distance}</span>
              </div>
              <h3 className={g.eventTitle}>{event.title}</h3>
              <p className={g.eventMeta}>📅 {event.date} · {event.time}</p>
              <div className={g.tagRow}>
                {event.tags.map(tag => (
                  <span key={tag} className={g.tag}>{tag}</span>
                ))}
                <span className={g.spots}>{event.spots} spots left</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ════════════════════════════════
   DONATE TAB — data & component
   ════════════════════════════════ */

const DONATE_CATEGORIES = [
  'All', 'Food & Hunger', 'Animals & Pets', 'Poverty', 'Education',
  'Health', 'Environment', 'Youth', 'Elderly', 'Housing', 'Veterans', 'Disaster Relief',
]

const ORGS = [
  {
    id: 1,
    name: 'Greater Chicago Food Depository',
    initials: 'GC',
    color: '#76479c',
    category: 'Food & Hunger',
    desc: 'Fighting hunger across Chicagoland, distributing food to 800,000+ people every year through a network of 700+ pantries and programs.',
    ein: '36-2554726',
    rating: 4,
  },
  {
    id: 2,
    name: 'Anti-Cruelty Society',
    initials: 'AC',
    color: '#E07B2A',
    category: 'Animals & Pets',
    desc: "Chicago's oldest and most comprehensive animal welfare organization, providing shelter, adoption services, and humane education.",
    ein: '36-2167760',
    rating: 4,
  },
  {
    id: 3,
    name: 'Habitat for Humanity Chicago',
    initials: 'HH',
    color: '#1565C0',
    category: 'Housing',
    desc: 'Building strength, stability, and self-reliance through affordable homeownership across Chicago and Cook County.',
    ein: '36-3363171',
    rating: 4,
  },
  {
    id: 4,
    name: 'After School Matters',
    initials: 'AS',
    color: '#D94F3D',
    category: 'Youth',
    desc: 'Providing Chicago teens with high-quality after-school and summer programs in the arts, science, sports, and communications.',
    ein: '36-3945972',
    rating: 5,
  },
  {
    id: 5,
    name: 'Chicago Coalition for the Homeless',
    initials: 'CC',
    color: '#5C6BC0',
    category: 'Poverty',
    desc: 'Advocating for policies and practices that prevent and end homelessness in Chicago through research, organizing, and direct services.',
    ein: '36-3150560',
    rating: 4,
  },
  {
    id: 6,
    name: 'Misericordia Heart of Mercy',
    initials: 'MH',
    color: '#7B5EA7',
    category: 'Health',
    desc: 'Supporting adults and children with developmental disabilities through residential care, day programs, and community integration.',
    ein: '36-2167222',
    rating: 5,
  },
  {
    id: 7,
    name: 'The Conservation Foundation',
    initials: 'CF',
    color: '#2D7D46',
    category: 'Environment',
    desc: 'Protecting natural lands and clean water in the greater Chicago region for current and future generations.',
    ein: '36-6109783',
    rating: 4,
  },
  {
    id: 8,
    name: 'Illinois Veterans Foundation',
    initials: 'IV',
    color: '#37474F',
    category: 'Veterans',
    desc: 'Providing emergency financial assistance, housing support, and resources to Illinois veterans and their families in need.',
    ein: '20-1345678',
    rating: 4,
  },
]

function StarRating({ count }) {
  return (
    <span className={g.stars} aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function DonateTab() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = ORGS.filter(org => {
    const matchesCategory = activeCategory === 'All' || org.category === activeCategory
    const matchesQuery = query === '' ||
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.desc.toLowerCase().includes(query.toLowerCase()) ||
      org.category.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <>
      <h1 className={styles.title}>Donate</h1>
      <p className={styles.subtitle}>Find verified nonprofits and causes to support.</p>

      {/* Search bar */}
      <div className={g.donateSearch}>
        <span className={g.searchIcon}>🔍</span>
        <input
          className={g.searchInput}
          type="text"
          placeholder="Search organizations or causes…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={g.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className={g.filters}>
        {DONATE_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${g.chip} ${activeCategory === cat ? g.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className={g.resultsCount}>
        {filtered.length} {filtered.length === 1 ? 'organization' : 'organizations'} found
      </p>

      {filtered.length === 0 ? (
        <div className={g.emptyState}>
          <p className={g.emptyIcon}>🔎</p>
          <p className={g.emptyTitle}>No results found</p>
          <p className={g.emptyDesc}>Try a different search term or category.</p>
        </div>
      ) : (
        <div className={g.orgList}>
          {filtered.map(org => (
            <div key={org.id} className={g.orgCard}>
              <div className={g.orgCardTop}>
                <div className={g.orgLogo} style={{ background: org.color }}>
                  {org.initials}
                </div>
                <div className={g.orgMeta}>
                  <h3 className={g.orgCardName}>{org.name}</h3>
                  <div className={g.orgBadgeRow}>
                    <span className={g.categoryBadge}>{org.category}</span>
                    <span className={g.verifiedBadge}>✓ Verified</span>
                  </div>
                </div>
              </div>

              <p className={g.orgDesc}>{org.desc}</p>

              <div className={g.orgCardFooter}>
                <div className={g.orgRating}>
                  <StarRating count={org.rating} />
                  <span className={g.einLabel}>EIN {org.ein}</span>
                </div>
                <button className={g.donateBtn}>Donate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ════════════════════════════════
   PLACEHOLDER TAB
   ════════════════════════════════ */

function PlaceholderTab({ title, icon, desc }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={g.placeholder}>
        <div className={g.placeholderIcon}>{icon}</div>
        <p className={g.placeholderTitle}>Coming soon</p>
        <p className={g.placeholderDesc}>{desc}</p>
      </div>
    </>
  )
}

/* ════════════════════════════════
   MAIN PAGE
   ════════════════════════════════ */

export default function Give() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('volunteer')

  return (
    <div className={`${styles.page} ${styles.give}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/home')}>← Back</button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={`${styles.main} ${styles.mainWithNav}`}>
        {activeTab === 'volunteer'     && <VolunteerTab />}
        {activeTab === 'donate'        && <DonateTab />}
        {activeTab === 'activity'      && (
          <PlaceholderTab
            title="My Activity"
            icon="📋"
            desc="Track your volunteer hours, past events, and impact over time."
          />
        )}
        {activeTab === 'notifications' && (
          <PlaceholderTab
            title="Alerts"
            icon="🔔"
            desc="Stay updated on upcoming events, reminders, and messages from organizations."
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

      <BottomNav variant="give" active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
