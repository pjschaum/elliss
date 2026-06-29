import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import g from './Give.module.css'
import BottomNav from '../components/BottomNav'
import VolunteerProfileBanner from '../components/VolunteerProfileBanner'
import VolunteerProfileSheet from '../components/VolunteerProfileSheet'
import { EVENTS } from '../data/events'
import { ORGS } from '../data/orgs'
import { useProfile } from '../hooks/useProfile'

/* ════════════════════════════════
   VOLUNTEER TAB
   ════════════════════════════════ */

const VOL_CATEGORIES = ['All', 'Food Bank', 'Environment', 'Education', 'Youth', 'Seniors', 'Animals', 'Health']

function VolunteerTab({ profile, updateProfile }) {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showProfileSheet, setShowProfileSheet] = useState(false)

  const filtered = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.tags.includes(activeCategory))

  return (
    <>
      {/* Volunteer Profile Banner — subtle, dismissable */}
      <VolunteerProfileBanner
        profile={profile}
        updateProfile={updateProfile}
        onGetStarted={() => setShowProfileSheet(true)}
      />

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
          <div
            key={event.id}
            className={g.eventCard}
            onClick={() => navigate(`/give/event/${event.id}`)}
            style={{ cursor: 'pointer' }}
          >
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

      {/* Volunteer Profile bottom sheet */}
      {showProfileSheet && (
        <VolunteerProfileSheet
          profile={profile}
          updateProfile={updateProfile}
          onClose={() => setShowProfileSheet(false)}
          onComplete={() => setShowProfileSheet(false)}
        />
      )}
    </>
  )
}

/* ════════════════════════════════
   DONATE TAB
   ════════════════════════════════ */

const DONATE_CATEGORIES = [
  'All', 'Food & Hunger', 'Animals & Pets', 'Poverty', 'Education',
  'Health', 'Environment', 'Youth', 'Elderly', 'Housing', 'Veterans', 'Disaster Relief',
]

function StarRating({ count }) {
  return (
    <span className={g.stars} aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function DonateTab() {
  const navigate = useNavigate()
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
            <div
              key={org.id}
              className={g.orgCard}
              onClick={() => navigate(`/give/org/${org.id}`)}
              style={{ cursor: 'pointer' }}
            >
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
                <button
                  className={g.donateBtn}
                  onClick={e => {
                    e.stopPropagation()
                    navigate(`/give/org/${org.id}`)
                  }}
                >
                  Donate
                </button>
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
  const { profile, updateProfile } = useProfile()

  return (
    <div className={`${styles.page} ${styles.give}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/home')}>← Back</button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={`${styles.main} ${styles.mainWithNav}`}>
        {activeTab === 'volunteer'     && (
          <VolunteerTab profile={profile} updateProfile={updateProfile} />
        )}
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
