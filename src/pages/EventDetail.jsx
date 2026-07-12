import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EVENTS } from '../data/events'
import { useProfile } from '../hooks/useProfile'
import SignUpSheet from '../components/SignUpSheet'
import VolunteerProfileSheet from '../components/VolunteerProfileSheet'
import d from './Detail.module.css'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const event = EVENTS.find(e => e.id === Number(id))
  const { profile, updateProfile } = useProfile()
  const [showSignUp, setShowSignUp]           = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  if (!event) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Event Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This event could not be found.
        </div>
      </div>
    )
  }

  const spotsFilled = event.totalSpots - event.spots
  const fillPct = Math.round((spotsFilled / event.totalSpots) * 100)
  const almostFull = event.spots <= 3

  const handleSignUpTap = () => {
    // If volunteer profile isn't started, nudge them to fill it first
    if (!profile?.phone) {
      setShowProfileSetup(true)
    } else {
      setShowSignUp(true)
    }
  }

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>Volunteer Event</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: event.color }}>
            {event.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{event.title}</h1>
            <div className={d.heroBadges}>
              {event.tags.map(tag => (
                <span key={tag} className={`${d.badge} ${d.badgeGive}`}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Org name */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Organization</p>
          <button
            className={d.infoLink}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit' }}
            onClick={() => event.orgId && navigate(`/give/org/${event.orgId}`)}
          >
            {event.org} {event.orgId ? '›' : ''}
          </button>
        </div>

        <div className={d.divider} />

        {/* Event details */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Details</p>
          <div className={d.infoList}>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📅</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Date & Time</p>
                <p className={d.infoValue}>{event.date} · {event.time}</p>
              </div>
            </div>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>📍</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Location</p>
                <p className={d.infoValue}>{event.address}</p>
                <p className={d.infoValue} style={{ color: '#888', fontSize: '0.8rem' }}>{event.distance} from you</p>
              </div>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Spots */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Volunteer Spots</p>
          <div className={d.spotsRow}>
            <div className={d.spotsBar}>
              <div className={d.spotsBarFill} style={{ width: `${fillPct}%` }} />
            </div>
            <span className={`${d.spotsText} ${almostFull ? d.spotsTextFull : ''}`}>
              {event.spots} spot{event.spots !== 1 ? 's' : ''} left
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.375rem' }}>
            {spotsFilled} of {event.totalSpots} spots filled
          </p>
        </div>

        <div className={d.divider} />

        {/* Description */}
        <div className={d.section}>
          <p className={d.sectionTitle}>About this event</p>
          <p className={d.sectionText}>{event.desc}</p>
        </div>

        <div className={d.divider} />

        {/* What to bring */}
        <div className={d.section}>
          <p className={d.sectionTitle}>What to bring</p>
          <ul className={d.bulletList}>
            {event.whatToBring.map((item, i) => (
              <li key={i} className={d.bulletItem}>
                <span className={`${d.bulletDot} ${d.bulletDotGive}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={d.divider} />

        {/* Coordinator */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Contact</p>
          <div className={d.infoList}>
            <div className={d.infoRow}>
              <span className={d.infoIcon}>👤</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Volunteer Coordinator</p>
                <p className={d.infoValue}>{event.coordinator}</p>
              </div>
            </div>
            {event.coordinatorEmail ? (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>{event.coordinatorEmail.includes('@') ? '✉️' : '🌐'}</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>{event.coordinatorEmail.includes('@') ? 'Email' : 'Volunteer Signup'}</p>
                  {event.coordinatorEmail.includes('@') ? (
                    <a href={`mailto:${event.coordinatorEmail}`} className={d.infoLink}>{event.coordinatorEmail}</a>
                  ) : (
                    <a href={`https://${event.coordinatorEmail}`} target="_blank" rel="noopener noreferrer" className={d.infoLink}>{event.coordinatorEmail} ↗</a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className={d.bottomBar}>
        <button
          className={`${d.actionBtn} ${d.actionBtnGive}`}
          onClick={handleSignUpTap}
        >
          Sign Up to Volunteer
        </button>
      </div>

      {/* Volunteer profile setup (if profile is blank) */}
      {showProfileSetup && (
        <VolunteerProfileSheet
          profile={profile}
          updateProfile={updateProfile}
          onClose={() => setShowProfileSetup(false)}
          onComplete={() => {
            setShowProfileSetup(false)
            setShowSignUp(true)
          }}
        />
      )}

      {/* Tiered sign-up sheet */}
      {showSignUp && (
        <SignUpSheet
          event={event}
          profile={profile}
          updateProfile={updateProfile}
          onClose={() => setShowSignUp(false)}
        />
      )}
    </div>
  )
}
