import { useParams, useNavigate } from 'react-router-dom'
import { ORGS } from '../data/orgs'
import { EVENTS } from '../data/events'
import d from './Detail.module.css'

function StarRating({ count }) {
  return (
    <span className={d.stars} aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

export default function OrgDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const org = ORGS.find(o => o.id === Number(id))
  const orgEvents = EVENTS.filter(e => e.orgId === Number(id))

  if (!org) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Organization Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This organization could not be found.
        </div>
      </div>
    )
  }

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>Organization</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: org.color }}>
            {org.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{org.name}</h1>
            <div className={d.heroBadges}>
              <span className={`${d.badge} ${d.badgeGive}`}>{org.category}</span>
              <span className={`${d.badge} ${d.badgeVerified}`}>✓ Verified</span>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Rating + EIN */}
        <div className={d.section}>
          <div className={d.infoList}>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>⭐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Charity Rating</p>
                <StarRating count={org.rating} />
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🏛️</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>EIN</p>
                <p className={d.infoValue}>{org.ein}</p>
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📅</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Founded</p>
                <p className={d.infoValue}>{org.founded}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Mission */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Mission</p>
          <p className={d.sectionText}>{org.mission}</p>
        </div>

        <div className={d.divider} />

        {/* Impact stats */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Impact</p>
          <div className={d.statsRow}>
            {org.impact.map((stat, i) => (
              <div key={i} className={d.statCard}>
                <p className={d.statValue}>{stat.value}</p>
                <p className={d.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={d.divider} />

        {/* Contact */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Contact</p>
          <div className={d.infoList}>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📍</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Address</p>
                <p className={d.infoValue}>{org.address}</p>
              </div>
            </div>
            {org.phone && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>📞</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Phone</p>
                  <a href={`tel:${org.phone}`} className={d.infoLink}>{org.phone}</a>
                </div>
              </div>
            )}
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🌐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Website</p>
                <a
                  href={`https://${org.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={d.infoLink}
                >
                  {org.website} ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer events from this org */}
        {orgEvents.length > 0 && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>Volunteer Opportunities</p>
              <div className={d.linkedList}>
                {orgEvents.map(event => (
                  <button
                    key={event.id}
                    className={d.linkedRow}
                    onClick={() => navigate(`/give/event/${event.id}`)}
                  >
                    <div className={d.linkedInfo}>
                      <p className={d.linkedName}>{event.title}</p>
                      <p className={d.linkedSub}>📅 {event.date} · {event.time}</p>
                    </div>
                    <span className={d.linkedChevron}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom */}
      <div className={d.bottomBar}>
        <button className={`${d.actionBtn} ${d.actionBtnGive}`}>
          Donate to {org.name.split(' ')[0]}
        </button>
      </div>
    </div>
  )
}
