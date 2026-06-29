import { useNavigate } from 'react-router-dom'
import { RESOURCES } from '../data/resources'
import { PROGRAMS } from '../data/programs'
import { COURSES } from '../data/courses'
import useJourney from '../hooks/useJourney'
import p from './ProgressScreen.module.css'

// ─── helpers ────────────────────────────────────────────────────────────────

function lookupItem(type, id) {
  if (type === 'resources') return RESOURCES.find(r => r.id === id)
  if (type === 'programs')  return PROGRAMS.find(r => r.id === id)
  if (type === 'courses')   return COURSES.find(r => r.id === id)
  return null
}

function itemTitle(type, data) {
  if (!data) return 'Unknown item'
  if (type === 'resources') return data.org
  if (type === 'programs')  return data.name
  if (type === 'courses')   return data.title
  return ''
}

function itemSub(type, data) {
  if (!data) return ''
  if (type === 'resources') return data.category
  if (type === 'programs')  return data.category
  if (type === 'courses')   return `${data.provider} · ${data.duration}`
  return ''
}

function itemColor(type, data) {
  return data?.color || '#92c19d'
}

function itemInitials(type, data) {
  if (!data) return '?'
  return data.initials || ''
}

function itemRoute(type, data) {
  if (!data) return null
  if (type === 'resources') return `/help/resource/${data.id}`
  if (type === 'programs')  return `/help/program/${data.id}`
  if (type === 'courses')   return `/help/course/${data.id}`
  return null
}

function itemActionLabel(type) {
  if (type === 'programs') return 'Applied for this'
  if (type === 'courses')  return 'Enrolled in this'
  return 'Used this resource'
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ScoreCard({ score, label, doorsOpened }) {
  return (
    <div className={p.scoreCard}>
      <div className={p.scoreTop}>
        <div className={p.scoreCircle}>
          <span className={p.scoreNumber}>{doorsOpened}</span>
          <span className={p.scoreUnit}>doors{'\n'}opened</span>
        </div>
        <div className={p.scoreInfo}>
          <p className={p.scoreLabel}>{label}</p>
          <p className={p.scorePoints}>{score} progress points</p>
          <p className={p.scoreBlurb}>
            Every resource you access, every program you apply for, every course you take — it all adds up. Keep going.
          </p>
        </div>
      </div>
    </div>
  )
}

function OpportunityCard({ impact }) {
  if (!impact) return null
  return (
    <div className={p.opportunityCard}>
      <p className={p.opportunityHeading}>What this opens up for you</p>
      <p className={p.opportunitySummary}>{impact.summary}</p>
      <ul className={p.opportunityList}>
        {impact.opportunities.map((opp, i) => (
          <li key={i} className={p.opportunityItem}>
            <span className={p.opportunityDot}>✦</span>
            {opp}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TrackItem({ type, item, data, onComplete, onRemove, onNavigate }) {
  const isCompleted = item.status === 'completed'
  const color = itemColor(type, data)
  const initials = itemInitials(type, data)
  const title = itemTitle(type, data)
  const sub = itemSub(type, data)

  return (
    <div className={`${p.trackItem} ${isCompleted ? p.trackItemCompleted : ''}`}>
      {/* Row */}
      <div className={p.trackItemRow}>
        <button
          className={p.trackItemInfo}
          onClick={() => { const r = itemRoute(type, data); if (r) onNavigate(r) }}
        >
          <div className={p.trackLogo} style={{ background: color }}>
            {initials}
          </div>
          <div className={p.trackMeta}>
            <p className={p.trackTitle}>{title}</p>
            <p className={p.trackSub}>{sub}</p>
            <p className={p.trackDate}>{itemActionLabel(type)} · {formatDate(item.addedAt)}</p>
          </div>
        </button>
        <button className={p.removeBtn} onClick={() => onRemove(type, item.id)} aria-label="Remove from tracker">
          ✕
        </button>
      </div>

      {/* Pending confirmation */}
      {!isCompleted && (
        <div className={p.confirmRow}>
          <p className={p.confirmQuestion}>
            Did you follow through?
          </p>
          <div className={p.confirmBtns}>
            <button className={p.confirmYes} onClick={() => onComplete(type, item.id)}>
              Yes, I did! ✓
            </button>
            <span className={p.confirmNot}>Still working on it</span>
          </div>
        </div>
      )}

      {/* Opportunity card for completed items */}
      {isCompleted && data?.impact && (
        <OpportunityCard impact={data.impact} />
      )}
    </div>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function ProgressScreen() {
  const navigate = useNavigate()
  const { journey, score, label, doorsOpened, updateStatus, removeItem } = useJourney()

  const allItems = [
    ...journey.resources.map(item => ({ type: 'resources', item })),
    ...journey.programs.map(item => ({ type: 'programs', item })),
    ...journey.courses.map(item => ({ type: 'courses', item })),
  ]

  const inProgress = allItems.filter(({ item }) => item.status === 'in_progress')
  const completed  = allItems.filter(({ item }) => item.status === 'completed')

  return (
    <div className={p.page}>
      <header className={p.header}>
        <button className={p.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={p.headerTitle}>My Progress</span>
      </header>

      <div className={p.body}>
        {/* Score */}
        <ScoreCard score={score} label={label} doorsOpened={doorsOpened} />

        {allItems.length === 0 && (
          <div className={p.empty}>
            <p className={p.emptyEmoji}>🌱</p>
            <p className={p.emptyTitle}>Your journey starts here</p>
            <p className={p.emptyText}>
              As you explore resources, apply for programs, and enroll in courses, they'll appear here so you can track your progress and see the doors you're opening.
            </p>
            <button className={p.emptyBtn} onClick={() => navigate(-1)}>
              Explore Resources & Programs
            </button>
          </div>
        )}

        {inProgress.length > 0 && (
          <section className={p.section}>
            <p className={p.sectionHeading}>In progress</p>
            <p className={p.sectionSub}>Let us know when you've followed through — we'll show you what you've unlocked.</p>
            <div className={p.itemList}>
              {inProgress.map(({ type, item }) => {
                const data = lookupItem(type, item.id)
                return (
                  <TrackItem
                    key={`${type}-${item.id}`}
                    type={type}
                    item={item}
                    data={data}
                    onComplete={(t, id) => updateStatus(t, id, 'completed')}
                    onRemove={removeItem}
                    onNavigate={navigate}
                  />
                )
              })}
            </div>
          </section>
        )}

        {completed.length > 0 && (
          <section className={p.section}>
            <p className={p.sectionHeading}>Completed ✓</p>
            <p className={p.sectionSub}>Look at what you've already done. Every step here is a door you've opened.</p>
            <div className={p.itemList}>
              {completed.map(({ type, item }) => {
                const data = lookupItem(type, item.id)
                return (
                  <TrackItem
                    key={`${type}-${item.id}`}
                    type={type}
                    item={item}
                    data={data}
                    onComplete={(t, id) => updateStatus(t, id, 'completed')}
                    onRemove={removeItem}
                    onNavigate={navigate}
                  />
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
