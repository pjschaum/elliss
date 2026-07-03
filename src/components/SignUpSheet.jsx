import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { sendNotification } from '../lib/sendNotification'
import s from './Sheet.module.css'

// ── Field labels for display ──────────────────────────────────
const FIELD_LABELS = {
  phone:                   'Phone number',
  date_of_birth:           'Date of birth',
  emergency_contact_name:  'Emergency contact name',
  emergency_contact_phone: 'Emergency contact phone',
}

// ── Tier label/color helper ───────────────────────────────────
const TIER_META = {
  1: { label: 'Instant confirmation', cls: s.tier1 },
  2: { label: 'Background check required', cls: s.tier2 },
  3: { label: 'Pending org approval', cls: s.tier3 },
}

export default function SignUpSheet({ event, profile, updateProfile, onClose }) {
  const [step, setStep]             = useState('review') // 'review' | 'fill' | 'success' | 'pending'
  const [missingData, setMissing]   = useState({})
  const [waiverAgreed, setWaiver]   = useState(false)
  const [bgCheckConsent, setBgCheck] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState(null)
  const [alreadySignedUp, setAlready] = useState(false)

  const tier = event.tier || 1
  const required = event.requiredProfileFields || []

  // Identify missing profile fields
  const missing = required.filter(f => !profile?.[f])

  useEffect(() => {
    if (missing.length > 0) setStep('fill')
  }, [])

  // Check for duplicate sign-up
  useEffect(() => {
    const check = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) return
      const { data } = await supabase
        .from('volunteer_signups')
        .select('id, status')
        .eq('user_id', session.session.user.id)
        .eq('event_id', event.id)
        .single()
      if (data) setAlready(true)
    }
    check()
  }, [event.id])

  const handleFillSubmit = async (e) => {
    e.preventDefault()
    const filled = {}
    for (const field of missing) {
      const val = e.target[field]?.value
      if (!val) { setError(`${FIELD_LABELS[field] || field} is required.`); return }
      filled[field] = val
    }
    setError(null)
    const { error } = await updateProfile(filled)
    if (error) { setError(error.message); return }
    setStep('review')
  }

  const handleConfirm = async () => {
    if (!waiverAgreed) { setError('Please agree to the liability waiver.'); return }
    if (tier === 2 && !bgCheckConsent) { setError('Background check consent is required for this event.'); return }

    setSubmitting(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData?.session?.user?.id
    if (!userId) { setError('Session expired. Please sign in again.'); setSubmitting(false); return }

    const status = tier === 3 ? 'waitlisted' : 'confirmed'

    const { error: insertError } = await supabase
      .from('volunteer_signups')
      .insert({
        user_id:              userId,
        event_id:             event.id,
        org_name:             event.org,
        event_title:          event.title,
        event_date:           event.date,
        status,
        tier,
        waiver_agreed:        true,
        background_check_consent: tier >= 2 ? bgCheckConsent : null,
      })

    setSubmitting(false)

    if (insertError) {
      if (insertError.code === '23505') { setAlready(true); return }
      setError(insertError.message)
      return
    }

    // For Tier 2, note that background check consent was given
    if (tier === 2) {
      await updateProfile({ background_check_consent: true })
    }

    // Send confirmation email — fire-and-forget, non-blocking
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      sendNotification('event_signup_confirmation', user.email, profile?.full_name || user.email, {
        title:   event.title,
        org:     event.org,
        date:    event.date,
        time:    event.time,
        address: event.address,
        tier,
      })
    }

    setStep(tier === 3 ? 'pending' : 'success')
  }

  // ── Already signed up ─────────────────────────────────────────
  if (alreadySignedUp) return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet}>
        <div className={s.handle} />
        <div className={s.success}>
          <div className={s.successIcon}>✓</div>
          <h2 className={s.successTitle}>You're already registered!</h2>
          <p className={s.successSub}>You've already signed up for {event.title}. Check your Activity tab for details.</p>
        </div>
        <div className={s.footer}>
          <button className={s.doneBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  )

  // ── Fill missing fields ───────────────────────────────────────
  if (step === 'fill') return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet}>
        <div className={s.handle} />
        <div className={s.header}>
          <h2 className={s.title}>A little more info</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p className={s.subtitle}>
          {event.org} needs a few more details before you can sign up. This info will be saved to your profile for future events.
        </p>
        <form className={s.body} onSubmit={handleFillSubmit}>
          {error && <p className={s.error}>{error}</p>}
          {missing.map(field => (
            <div key={field} className={s.field}>
              <label className={s.label} htmlFor={field}>
                {FIELD_LABELS[field] || field} <span className={s.req}>*</span>
              </label>
              <input
                id={field}
                name={field}
                className={s.input}
                type={field === 'date_of_birth' ? 'date' : field.includes('phone') ? 'tel' : 'text'}
                placeholder={field.includes('phone') ? '(555) 555-5555' : ''}
              />
            </div>
          ))}
          <div className={s.footer} style={{ padding: 0 }}>
            <button type="submit" className={s.saveBtn}>Continue →</button>
          </div>
        </form>
      </div>
    </>
  )

  // ── Success ───────────────────────────────────────────────────
  if (step === 'success') return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet}>
        <div className={s.handle} />
        <div className={s.success}>
          <div className={s.successIcon}>🎉</div>
          <h2 className={s.successTitle}>You're signed up!</h2>
          <p className={s.successSub}>
            You're confirmed to volunteer at <strong>{event.title}</strong> on {event.date} from {event.time}. We'll see you there!
          </p>
          {tier === 2 && (
            <p className={s.successSub} style={{ color: '#e65100' }}>
              A background check request will be sent to {profile?.phone ? 'your phone' : 'the email on file'}.
            </p>
          )}
        </div>
        <div className={s.footer}>
          <button className={s.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </>
  )

  // ── Pending (Tier 3) ─────────────────────────────────────────
  if (step === 'pending') return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet}>
        <div className={s.handle} />
        <div className={s.success}>
          <div className={s.successIcon}>📋</div>
          <h2 className={s.successTitle}>Application submitted</h2>
          <p className={s.successSub}>
            Your application to volunteer at <strong>{event.title}</strong> has been sent to {event.org} for review.
          </p>
          <p className={s.successSub}>{event.approvalNote}</p>
        </div>
        <div className={s.footer}>
          <button className={s.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </>
  )

  // ── Review & confirm ─────────────────────────────────────────
  const tierMeta = TIER_META[tier]

  return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet}>
        <div className={s.handle} />

        <div className={s.header}>
          <h2 className={s.title}>Confirm sign-up</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={s.body}>
          {/* Tier badge */}
          <div>
            <span className={`${s.tierBadge} ${tierMeta.cls}`}>{tierMeta.label}</span>
          </div>

          {/* Event info summary */}
          <div className={s.infoRow}>
            <span className={s.infoIcon}>📅</span>
            <div className={s.infoContent}>
              <div className={s.infoLabel}>Date & time</div>
              <div className={s.infoValue}>{event.date} · {event.time}</div>
            </div>
          </div>

          <div className={s.infoRow}>
            <span className={s.infoIcon}>📍</span>
            <div className={s.infoContent}>
              <div className={s.infoLabel}>Location</div>
              <div className={s.infoValue}>{event.address}</div>
            </div>
          </div>

          <div className={s.infoRow}>
            <span className={s.infoIcon}>📞</span>
            <div className={s.infoContent}>
              <div className={s.infoLabel}>Your phone</div>
              <div className={s.infoValue}>{profile?.phone || '—'}</div>
            </div>
          </div>

          {event.requiresBackgroundCheck && (
            <div className={s.bgCheckNotice}>
              <p className={s.bgCheckTitle}>Background check required</p>
              <p className={s.bgCheckText}>
                {event.org} requires a background check for this volunteer role. You'll receive instructions via email after signing up. This is a standard requirement to protect the people you'll be serving.
              </p>
            </div>
          )}

          {tier === 3 && (
            <div className={s.approvalNotice}>
              <p className={s.approvalTitle}>Application review required</p>
              <p className={s.approvalText}>{event.approvalNote}</p>
            </div>
          )}

          {/* Liability waiver */}
          <div className={s.waiverBox}>
            <p className={s.waiverText}>{event.waiverText}</p>
            <label className={s.waiverCheck}>
              <input
                type="checkbox"
                checked={waiverAgreed}
                onChange={e => setWaiver(e.target.checked)}
              />
              <span>I understand and agree</span>
            </label>
          </div>

          {/* Background check consent for Tier 2 */}
          {tier >= 2 && (
            <label className={s.waiverCheck} style={{ padding: '0 0.125rem' }}>
              <input
                type="checkbox"
                checked={bgCheckConsent}
                onChange={e => setBgCheck(e.target.checked)}
              />
              <span>I consent to a background check for this role</span>
            </label>
          )}

          {error && <p className={s.error}>{error}</p>}
        </div>

        <div className={s.footer}>
          <button
            className={s.confirmBtn}
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting
              ? 'Submitting…'
              : tier === 3
                ? 'Submit Application'
                : 'Confirm Sign-Up'}
          </button>
        </div>
      </div>
    </>
  )
}
