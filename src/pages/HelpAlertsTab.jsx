import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProfile } from '../hooks/useProfile'
import a from './AlertsTab.module.css'   // reuse the same styles

// ─── Delivery method options ─────────────────────────────────
const DELIVERY_OPTIONS = [
  { value: 'email',  icon: '✉️',  label: 'Email'   },
  { value: 'sms',    icon: '💬',  label: 'SMS'     },
  { value: 'both',   icon: '🔔',  label: 'Both'    },
  { value: 'in_app', icon: '📲',  label: 'In-App'  },
]

// ─── Help-side alert type definitions ────────────────────────
// DB keys use the help_ namespace to stay separate from give-side prefs
const HELP_ALERT_TYPES = [
  {
    key:   'alert_help_new_resources',
    icon:  '🌱',
    title: 'New resources based on your profile',
    desc:  'When new support services that match your profile or saved interests become available.',
  },
  {
    key:   'alert_help_resource_deadlines',
    icon:  '📋',
    title: 'Resource registration deadlines',
    desc:  'Reminders before saved resources reach their enrollment or registration deadline.',
  },
  {
    key:   'alert_help_program_deadlines',
    icon:  '🗓️',
    title: 'Program application deadlines',
    desc:  'Upcoming deadlines for programs you\'ve saved or are enrolled in.',
  },
  {
    key:   'alert_help_program_renewals',
    icon:  '🔄',
    title: 'Program renewal reminders',
    desc:  'Reminders when an approved program benefit is expiring and needs to be renewed or reapplied for.',
  },
  {
    key:   'alert_help_course_deadlines',
    icon:  '✏️',
    title: 'Course registration deadlines',
    desc:  'Upcoming registration closing dates for courses you\'ve saved.',
  },
  {
    key:   'alert_help_course_starts',
    icon:  '🎓',
    title: 'Upcoming course start dates',
    desc:  'Reminders before a saved course begins so you can confirm your enrollment.',
  },
  {
    key:   'alert_help_org_messages',
    icon:  '💬',
    title: 'Messages from organizations',
    desc:  'Direct messages from resource and program providers regarding your application or enrollment.',
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
export default function HelpAlertsTab() {
  const { profile, updateProfile, loading: profileLoading } = useProfile()
  const [notifications, setNotifications] = useState([])
  const [notifsLoading, setNotifsLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  // Load in-app notifications (same table, filtered by notification_type prefix)
  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      if (!userId) { setNotifsLoading(false); return }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .like('notification_type', 'help_%')
        .order('created_at', { ascending: false })
        .limit(30)

      setNotifications(data || [])
      setNotifsLoading(false)
    }
    load()
  }, [])

  const handleDelivery = async (value) => {
    setSaving('delivery')
    // help_alert_delivery is a separate preference from the Give-side alert_delivery
    await updateProfile({ help_alert_delivery: value })
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

  const delivery = profile?.help_alert_delivery || 'in_app'

  return (
    <div className={a.page}>

      {/* ── Header ── */}
      <div>
        <h1 className={a.title}>Alerts</h1>
        <p className={a.subtitle}>Stay on top of deadlines, renewals, and new opportunities.</p>
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
        {(delivery === 'email' || delivery === 'both') && (
          <p className={a.deliveryNote}>📧 Alerts will be sent to the email on your account.</p>
        )}
        {(delivery === 'sms' || delivery === 'both') && (
          <p className={a.deliveryNote}>📱 SMS alerts will be sent to the phone number in your profile.</p>
        )}
        {delivery === 'in_app' && (
          <p className={a.deliveryNote}>📲 Alerts will appear here in the app. No emails or texts.</p>
        )}
      </div>

      {/* ── Alert types ── */}
      <div className={a.card}>
        <p className={a.cardTitle}>Alert types</p>
        <div className={a.alertList}>
          {HELP_ALERT_TYPES.map((type, i) => (
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
              {i < HELP_ALERT_TYPES.length - 1 && <div className={a.divider} />}
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
              Deadline reminders, renewal notices, and messages from organizations will appear here.
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
