import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import g from './Give.module.css'

const CATEGORIES = ['All', 'Food Bank', 'Environment', 'Education', 'Youth', 'Seniors', 'Animals', 'Health']

const EVENTS = [
  {
    id: 1,
    org: 'Greater Chicago Food Depository',
    initials: 'GC',
    color: '#1D9E75',
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

export default function Give() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(e => e.tags.includes(activeCategory))

  return (
    <div className={`${styles.page} ${styles.give}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Volunteer Events</h1>
        <p className={styles.subtitle}>Find opportunities near you.</p>

        {/* Search */}
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

        {/* Category filters */}
        <div className={g.filters}>
          {CATEGORIES.map(cat => (
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
      </main>
    </div>
  )
}
