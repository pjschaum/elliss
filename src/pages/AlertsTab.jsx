import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProfile } from '../hooks/useProfile'
import a from './AlertsTab.module.css'

// ─── Delivery method options ─────────────────────────────────
const DELIVERY_OPTIONS = [
  { value: 'email',  icon: '✉️',  label: 'Email'   },
  { value: 'sms',    icon: '💬',  label: 'SMS'     },
  { value: 'both',   icon: '🔔',  label: 'Both'    },
  { value: 'in_app', icon: '📲',  label: 'In-App'  },
]

// ─── Alert type definitions ──────────────────────────────────
const ALERT_TYPES = [
  {
    key:   'alert_upcoming_events',
    icon:  '📅',
    title: 'Upcoming event reminders',
    desc:  'Reminders before volunteer events you\'ve signed up for.',
  },
  {
    key:   'alert_new_events_fav_orgs',
    icon:  '🏢',
    title: 'New events from favorited orgs',
    desc:  'When organizations you follow post new volunteer opportunities.',
  },
  {
    key:   'alert_new_events_fav_causes',
    icon:  '💜',
    title: 'New events for favorited causes',
    desc:  'New volunteer events matching your cause preferences in your area.',
  },
  {
    key:   'alert_donation_drives_fav_orgs',
    icon:  '💛',
    title: 'Donation drives from favorited orgs',
    desc:  'When organizations you follow launch new donation campaigns.',
  },
  {
    key:   'alert_donation_drives_fav_causes',
    icon:  '🎗️',
    title: 'Donation drives for favorited causes',
    desc:  'New donation drives supporting causes you care about.',
  },
]

// ─── Toggle switch ───────────────────────────────────────────
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`${a.toggle} ${checked ? a.toggleOn : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className={a.toggleThumb} />
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────
export default function AlertsTab() {
  const { profile, updateProfile, loading: profileLoading } = useProfile()
  const [notifications, setNotifications] = useState([])
  const [notifsLoading, setNotifsLoading] = useState(true)
  const [saving, setSaving]               = useState(null) // key of field being saved

  // Load in-app notifications
  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (!userId) { setNotifsLoading(false); return }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      setNotifications(data || [])
      setNotifsLoading(false)
    }
    load()
  }, [])

  const handleDelivery = async (value) => {
    setSaving('delivery')
    await updateProfile({ alert_delivery: value })
    setSaving(null)
  }

  const handleToggle = async (key, value) => {
    setSaving(key)
    await updateProfile({ [key]: value })
    setSaving(null)
  }

  const markRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read).map(n => n.id)
    if (!unread.length) return
    await supabase.from('notifications').update({ read: true }).in('id', unread)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (profileLoading) return <div className={a.loading}>Loading…</div>

  const delivery = profile?.alert_delivery || 'in_app'

  return (
    <div className={a.page}>

      {/* ── Header ── */}
      <div>
        <h1 className={a.title}>Alerts</h1>
        <p className={a.subtitle}>Stay in the loop on what matters to you.</p>
      </div>

      {/* ── Delivery method ── */}
      <div className={a.card}>
        <p className={a.cardTitle}>How would you like to receive alerts?</p>
        <div className={a.deliveryGrid}>
          {DELIVERY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${a.deliveryOption} ${delivery === opt.value ? a.deliveryOptionActive : ''}`}
              onClick={() => handleDelivery(opt.value)}
              disabled={saving === 'delivery'}
            >
              <span className={a.deliveryIcon}>{opt.icon}</span>
              <span className={a.deliveryLabel}>{opt.label}</span>
              {delivery === opt.value && <span className={a.deliveryCheck}>✓</span>}
            </button>
          ))}
        </div>
        {delivery === 'email' || delivery === 'both' ? (
          <p className={a.deliveryNote}>📧 Alerts will be sent to the email on your account.</p>
        ) : null}
        {delivery === 'sms' || delivery === 'both' ? (
          <p className={a.deliveryNote}>📱 SMS alerts will be sent to the phone number in your Volunteer Profile.</p>
        ) : null}
        {delivery === 'in_app' ? (
          <p className={a.deliveryNote}>📲 Alerts will appear here in the app. No emails or texts.</p>
        ) : null}
      </div>

      {/* ── Alert types ── */}
      <div className={a.card}>
        <p className={a.cardTitle}>Alert types</p>
        <div className={a.alertList}>
          {ALERT_TYPES.map((type, i) => (
            <div key={type.key}>
              <div className={a.alertRow}>
                <span className={a.alertIcon}>{type.icon}</span>
                <div className={a.alertText}>
                  <p className={a.alertTitle}>{type.title}</p>
                  <p className={a.alertDesc}>{type.desc}</p>
                </div>
                <Toggle
                  checked={profile?.[type.key] ?? true}
                  onChange={(val) => handleToggle(type.key, val)}
                  disabled={saving === type.key}
                />
              </div>
              {i < ALERT_TYPES.length - 1 && <div className={a.divider} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Notifications feed ── */}
      <div className={a.section}>
        <div className={a.feedHeader}>
          <p className={a.sectionTitle}>
            Recent alerts
            {unreadCount > 0 && (
              <span className={a.unreadBadge}>{unreadCount}</span>
            )}
          </p>
          {unreadCount > 0 && (
            <button className={a.markAllBtn} onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>

        {notifsLoading ? (
          <div className={a.feedEmpty}>
            <p className={a.emptyDesc}>Loading…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className={a.feedEmpty}>
            <div className={a.emptyIcon}>🔔</div>
            <p className={a.emptyTitle}>No alerts yet</p>
            <p className={a.emptyDesc}>
              Alerts about your upcoming events, favorited organizations, and causes will appear here.
            </p>
          </div>
        ) : (
          <div className={a.feedList}>
            {notifications.map(n => (
              <div
                key={n.id}
                className={`${a.notifRow} ${!n.read ? a.notifUnread : ''}`}
                onClick={() => !n.read && markRead(n.id)}
              >
                <div className={a.notifDot} style={{ opacity: n.read ? 0 : 1 }} />
                <div className={a.notifContent}>
                  <p className={a.notifTitle}>{n.title}</p>
                  {n.body && <p className={a.notifBody}>{n.body}</p>}
                  <p className={a.notifTime}>
                    {new Date(n.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
