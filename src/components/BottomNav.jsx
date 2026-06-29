import { useNavigate } from 'react-router-dom'
import s from './BottomNav.module.css'

const GIVE_TABS = [
  { id: 'volunteer',     label: 'Volunteer',     Icon: IconHandshake },
  { id: 'donate',        label: 'Donate',        Icon: IconHeart },
  { id: 'activity',      label: 'Activity',      Icon: IconList },
  { id: 'notifications', label: 'Alerts',        Icon: IconBell },
  { id: 'account',       label: 'Account',       Icon: IconPerson },
]

const HELP_TABS = [
  { id: 'resources',     label: 'Resources',     Icon: IconLeaf },
  { id: 'programs',      label: 'Programs',      Icon: IconGrid },
  { id: 'courses',       label: 'Courses',       Icon: IconBook },
  { id: 'notifications', label: 'Alerts',        Icon: IconBell },
  { id: 'account',       label: 'Account',       Icon: IconPerson },
]

export default function BottomNav({ variant, active, onChange }) {
  const navigate = useNavigate()
  const tabs = variant === 'give' ? GIVE_TABS : HELP_TABS
  const activeColor = variant === 'give' ? 'var(--give)' : 'var(--help-dark)'

  return (
    <nav
      className={s.nav}
      style={{ '--nav-active': activeColor }}
      aria-label="Main navigation"
    >
      {/* Wordmark — hidden on mobile, shown in sidebar on desktop */}
      <div className={s.navBrand}>
        <div className={s.navLockup}>
          <img
            src={variant === 'give' ? '/flame-give.svg' : '/flame-help.svg'}
            alt=""
            className={s.navFlame}
          />
          <span className={s.navWordmark} style={{ color: activeColor }}>elliss</span>
        </div>
      </div>

      {/* Tab items */}
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            className={`${s.tab} ${isActive ? s.tabActive : ''}`}
            style={isActive ? { color: activeColor } : {}}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon active={isActive} />
            <span className={s.label}>{label}</span>
          </button>
        )
      })}

      {/* Home link — only visible on desktop sidebar */}
      <button className={s.homeLink} onClick={() => navigate('/home')} aria-label="Back to home">
        <span className={s.homeLinkIcon}>←</span>
        <span>Home</span>
      </button>
    </nav>
  )
}

/* ── Icons ── */

function IconHandshake() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.78-.77a5.4 5.4 0 0 0 0-7.66z"/>
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function IconList() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2"/>
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}
