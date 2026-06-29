import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PROGRAMS } from '../data/programs'
import useJourney from '../hooks/useJourney'
import d from './Detail.module.css'

export default function ProgramDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const program = PROGRAMS.find(p => p.id === Number(id))
  const { addItem, isTracked } = useJourney()
  const [snackbar, setSnackbar] = useState(false)

  function handleApply() {
    if (program && !isTracked('programs', program.id)) {
      addItem('programs', program.id)
      setSnackbar(true)
      setTimeout(() => setSnackbar(false), 3000)
    }
    if (program?.website) {
      window.open(`https://${program.website}`, '_blank', 'noopener,noreferrer')
    }
  }

  if (!program) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Program Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This program could not be found.
        </div>
      </div>
    )
  }

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>Program</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: program.color }}>
            {program.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{program.name}</h1>
            <div className={d.heroBadges}>
              <span className={`${d.badge} ${d.badgeHelp}`}>{program.category}</span>
              {program.govt && <span className={`${d.badge} ${d.badgeGovt}`}>Gov't Program</span>}
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Agency */}
        <div className={d.section}>
          <div className={d.infoRow}>
            <span className={d.infoIcon}>🏛️</span>
            <div className={d.infoContent}>
              <p className={d.infoLabel}>Administered by</p>
              <p className={d.infoValue}>{program.agency}</p>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Description */}
        <div className={d.section}>
          <p className={d.sectionTitle}>About this program</p>
          <p className={d.sectionText}>{program.desc}</p>
        </div>

        <div className={d.divider} />

        {/* Benefit amount */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Benefit amount</p>
          <p className={d.sectionText}>{program.benefitAmount}</p>
        </div>

        <div className={d.divider} />

        {/* Eligibility */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Who qualifies</p>
          <p className={d.sectionText}>{program.eligibility}</p>
        </div>

        <div className={d.divider} />

        {/* How to apply */}
        <div className={d.section}>
          <p className={d.sectionTitle}>How to apply</p>
          <p className={d.sectionText}>{program.howToApply}</p>
        </div>

        <div className={d.divider} />

        {/* Required documents */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Documents you'll need</p>
          <ul className={d.bulletList}>
            {program.requiredDocs.map((doc, i) => (
              <li key={i} className={d.bulletItem}>
                <span className={d.bulletDot} />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        <div className={d.divider} />

        {/* Processing time */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Processing time</p>
          <p className={d.sectionText}>{program.processingTime}</p>
        </div>

        <div className={d.divider} />

        {/* Contact */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Contact</p>
          <div className={d.infoList}>
            {program.phone && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>📞</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Phone</p>
                  <a href={`tel:${program.phone}`} className={d.infoLink}>{program.phone}</a>
                </div>
              </div>
            )}
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🌐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Website</p>
                <a
                  href={`https://${program.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={d.infoLink}
                >
                  {program.website} ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* About the organization */}
        {program.orgId && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>About the Agency</p>
              <div className={d.linkedList}>
                <button
                  className={d.linkedRow}
                  onClick={() => navigate(`/help/org/${program.orgId}`)}
                >
                  <div className={d.linkedInfo}>
                    <p className={d.linkedName}>{program.agency}</p>
                    <p className={d.linkedSub}>View mission, other programs, and contact info</p>
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
        <button className={`${d.actionBtn} ${d.actionBtnHelp}`} onClick={handleApply}>
          {isTracked('programs', program.id) ? 'Return to Application ↗' : 'Apply Now ↗'}
        </button>
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
