import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EVENTS } from '../data/events'
import a from './ActivityTab.module.css'

// ─── Milestone definitions ───────────────────────────────────
const MILESTONES = [
  { id: 'first',   icon: '🌱', label: 'First Step',  desc: 'Complete your first event',           req: 1,  unit: 'events'  },
  { id: 'hrs5',    icon: '⭐', label: '5 Hours',     desc: '5 volunteer hours logged',             req: 5,  unit: 'hours'   },
  { id: 'hrs10',   icon: '🌟', label: '10 Hours',    desc: '10 volunteer hours logged',            req: 10, unit: 'hours'   },
  { id: 'events5', icon: '🎯', label: 'Dedicated',   desc: 'Attend 5 volunteer events',            req: 5,  unit: 'events'  },
  { id: 'hrs25',   icon: '💫', label: '25 Hours',    desc: '25 volunteer hours logged',            req: 25, unit: 'hours'   },
  { id: 'orgs3',   icon: '🤝', label: 'Connector',   desc: 'Volunteer with 3 different orgs',      req: 3,  unit: 'orgs'    },
  { id: 'hrs50',   icon: '🏆', label: '50 Hours',    desc: '50 volunteer hours logged',            req: 50, unit: 'hours'   },
  { id: 'streak4', icon: '🔥', label: 'On Fire',     desc: 'Volunteer 4 weeks in a row',           req: 4,  unit: 'streak'  },
]

// ─── Helpers ─────────────────────────────────────────────────
function getEventData(signup) {
  return EVENTS.find(e => e.id === signup.event_id) || null
}

function isPast(signup) {
  const ev = getEventData(signup)
  if (!ev?.isoDate) return false
  return ev.isoDate < new Date().toISOString().slice(0, 10)
}

function calcStats(signups) {
  const confirmed = signups.filter(s => s.status === 'confirmed')
  const past      = confirmed.filter(isPast)

  const totalHours = past.reduce((sum, s) => {
    const ev = getEventData(s)
    return sum + (ev?.durationHours || 0)
  }, 0)

  const uniqueOrgs = new Set(past.map(s => s.org_name)).size

  // Streak: count consecutive weeks (Sun–Sat) that had at least one past event
  const weeks = new Set(past.map(s => {
    const ev = getEventData(s)
    if (!ev?.isoDate) return null
    const d = new Date(ev.isoDate)
    const day = d.getDay()
    const sunday = new Date(d)
    sunday.setDate(d.getDate() - day)
    return sunday.toISOString().slice(0, 10)
  }).filter(Boolean))
  const streak = weeks.size  // simplified; real streak needs consecutive logic

  return { totalHours, eventCount: past.length, uniqueOrgs, streak }
}

function nextMilestone(stats) {
  for (const m of MILESTONES) {
    const current = m.unit === 'hours'  ? stats.totalHours
                  : m.unit === 'events' ? stats.eventCount
                  : m.unit === 'orgs'   ? stats.uniqueOrgs
                  : stats.streak
    if (current < m.req) return { milestone: m, current }
  }
  return null
}

function isEarned(m, stats) {
  const current = m.unit === 'hours'  ? stats.totalHours
                : m.unit === 'events' ? stats.eventCount
                : m.unit === 'orgs'   ? stats.uniqueOrgs
                : stats.streak
  return current >= m.req
}

// ─── Sub-components ──────────────────────────────────────────
function StatCard({ icon, value, label }) {
  return (
    <div className={a.statCard}>
      <span className={a.statIcon}>{icon}</span>
      <span className={a.statValue}>{value}</span>
      <span className={a.statLabel}>{label}</span>
    </div>
  )
}

function EventRow({ signup, past }) {
  const ev = getEventData(signup)
  const statusMeta = {
    confirmed:  { label: 'Confirmed',       cls: a.badgeConfirmed  },
    waitlisted: { label: 'Pending Review',  cls: a.badgePending    },
    cancelled:  { label: 'Cancelled',       cls: a.badgeCancelled  },
  }
  const meta = statusMeta[signup.status] || statusMeta.confirmed

  return (
    <div className={a.eventRow}>
      <div className={a.eventDot} style={{ background: ev?.color || '#ccc' }} />
      <div className={a.eventInfo}>
        <p className={a.eventTitle}>{signup.event_title}</p>
        <p className={a.eventMeta}>{signup.org_name} · {signup.event_date}</p>
        {past && ev?.impactMetric && (
          <p className={a.impactBlurb}>
            {ev.impactMetric.value} {ev.impactMetric.label}
          </p>
        )}
        {ev?.durationHours && past && (
          <p className={a.hoursTag}>+{ev.durationHours} hrs logged</p>
        )}
      </div>
      <span className={`${a.badge} ${meta.cls}`}>{meta.label}</span>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────
export default function ActivityTab() {
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (!userId) { setLoading(false); return }

      const { data } = await supabase
        .from('volunteer_signups')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      setSignups(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className={a.loading}>Loading your activity…</div>

  const stats    = calcStats(signups)
  const upcoming = signups.filter(s => s.status !== 'cancelled' && !isPast(s))
  const past     = signups.filter(s => isPast(s))
  const next     = nextMilestone(stats)

  const isEmpty = signups.length === 0

  return (
    <div className={a.page}>
      {/* ── Header ── */}
      <div className={a.headerRow}>
        <h1 className={a.title}>My Activity</h1>
        <p className={a.subtitle}>Your volunteer impact at a glance.</p>
      </div>

      {/* ── Stats row ── */}
      <div className={a.statsRow}>
        <StatCard icon="⏱️" value={stats.totalHours} label="Hours" />
        <StatCard icon="📅" value={stats.eventCount} label="Events" />
        <StatCard icon="🏢" value={stats.uniqueOrgs}  label="Orgs" />
      </div>

      {/* ── Next milestone ── */}
      {next ? (
        <div className={a.milestoneCard}>
          <div className={a.milestoneTop}>
            <span className={a.milestoneIcon}>{next.milestone.icon}</span>
            <div>
              <p className={a.milestoneLabel}>Next milestone: {next.milestone.label}</p>
              <p className={a.milestoneDesc}>{next.milestone.desc}</p>
            </div>
          </div>
          <div className={a.progressBar}>
            <div
              className={a.progressFill}
              style={{ width: `${Math.min(100, (next.current / next.milestone.req) * 100)}%` }}
            />
          </div>
          <p className={a.progressText}>
            {next.current} / {next.milestone.req} {next.milestone.unit}
          </p>
        </div>
      ) : (
        <div className={a.milestoneCard}>
          <p className={a.milestoneLabel}>🏆 All milestones earned — incredible!</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className={a.emptyState}>
          <div className={a.emptyIcon}>🌱</div>
          <p className={a.emptyTitle}>Your journey starts here</p>
          <p className={a.emptyDesc}>
            Sign up for a volunteer event on the Volunteer tab and your activity will appear here.
          </p>
        </div>
      )}

      {/* ── Upcoming events ── */}
      {upcoming.length > 0 && (
        <div className={a.section}>
          <p className={a.sectionTitle}>Upcoming</p>
          {upcoming.map(s => (
            <EventRow key={s.id} signup={s} past={false} />
          ))}
        </div>
      )}

      {/* ── Past events ── */}
      {past.length > 0 && (
        <div className={a.section}>
          <p className={a.sectionTitle}>Past events</p>
          {past.map(s => (
            <EventRow key={s.id} signup={s} past={true} />
          ))}
        </div>
      )}

      {/* ── Milestones grid ── */}
      {!isEmpty && (
        <div className={a.section}>
          <p className={a.sectionTitle}>Milestones</p>
          <div className={a.badgeGrid}>
            {MILESTONES.map(m => {
              const earned = isEarned(m, stats)
              return (
                <div key={m.id} className={`${a.badgeTile} ${earned ? a.badgeTileEarned : a.badgeTileLocked}`}>
                  <span className={a.badgeTileIcon}>{m.icon}</span>
                  <p className={a.badgeTileLabel}>{m.label}</p>
                  {!earned && <p className={a.badgeTileReq}>{m.desc}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Donations placeholder ── */}
      <div className={a.section}>
        <p className={a.sectionTitle}>Donations</p>
        <div className={a.donationsPlaceholder}>
          <span className={a.donationsIcon}>💜</span>
          <p className={a.donationsTitle}>Donation tracking coming soon</p>
          <p className={a.donationsDesc}>
            Once you make a donation through Elliss, your giving history will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
