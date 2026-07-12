import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { RESOURCES } from '../data/resources'
import useJourney from '../hooks/useJourney'
import d from './Detail.module.css'

export default function ResourceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const resource = RESOURCES.find(r => r.id === Number(id))
  const { addItem, isTracked } = useJourney()
  const [snackbar, setSnackbar] = useState(false)

  function handleTrack() {
    if (resource && !isTracked('resources', resource.id)) {
      addItem('resources', resource.id)
      setSnackbar(true)
      setTimeout(() => setSnackbar(false), 3000)
    }
  }

  if (!resource) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Resource Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This resource could not be found.
        </div>
      </div>
    )
  }

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>Resource</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: resource.color }}>
            {resource.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{resource.org}</h1>
            <div className={d.heroBadges}>
              <span className={`${d.badge} ${d.badgeHelp}`}>{resource.category}</span>
              {resource.free
                ? <span className={`${d.badge} ${d.badgeFree}`}>Free</span>
                : <span className={`${d.badge} ${d.badgePaid}`}>Low Cost</span>
              }
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Description */}
        <div className={d.section}>
          <p className={d.sectionTitle}>About</p>
          <p className={d.sectionText}>{resource.desc}</p>
        </div>

        <div className={d.divider} />

        {/* Hours & Contact */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Hours & Contact</p>
          <div className={d.infoList}>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🕐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Hours</p>
                <p className={d.infoValue}>{resource.hours}</p>
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📞</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Phone</p>
                <a href={`tel:${resource.phone}`} className={d.infoLink}>{resource.phone}</a>
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📍</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Address</p>
                <p className={d.infoValue}>{resource.address}</p>
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🌐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Website</p>
                <a href={`https://${resource.website}`} target="_blank" rel="noopener noreferrer" className={d.infoLink}>{resource.website} ↗</a>
              </div>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Eligibility */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Who can use this</p>
          <p className={d.sectionText}>{resource.eligibility}</p>
        </div>

        <div className={d.divider} />

        {/* How to access */}
        <div className={d.section}>
          <p className={d.sectionTitle}>How to get help</p>
          <p className={d.sectionText}>{resource.howToGet}</p>
        </div>

        {/* About the organization */}
        {resource.orgId && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>About the Organization</p>
              <div className={d.linkedList}>
                <button
                  className={d.linkedRow}
                  onClick={() => navigate(`/help/org/${resource.orgId}`)}
                >
                  <div className={d.linkedInfo}>
                    <p className={d.linkedName}>{resource.org}</p>
                    <p className={d.linkedSub}>View mission, contact info, and more</p>
                  </div>
                  <span className={d.linkedChevron}>›</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom */}
      <div className={d.bottomBar}>
        <a
          href={resource.website ? `https://${resource.website}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`${d.actionBtn} ${d.actionBtnHelp}`}
          onClick={handleTrack}
        >
          {isTracked('resources', resource.id) ? 'Return to Website ↗' : 'Get Help ↗'}
        </a>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className={d.snackbar}>
          Added to your Progress Tracker ✓
        </div>
      )}
    </div>
  )
}
