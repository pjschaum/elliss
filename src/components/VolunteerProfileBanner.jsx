import { useState } from 'react'
import s from './VolunteerProfileBanner.module.css'

export default function VolunteerProfileBanner({ profile, onGetStarted, updateProfile }) {
  const [dismissed, setDismissed] = useState(false)

  // Don't show if: already dismissed this session, dismissed in DB, or profile complete
  if (dismissed) return null
  if (!profile) return null
  if (profile.volunteer_prompt_dismissed) return null
  if (profile.volunteer_profile_complete) return null

  const handleDismiss = async () => {
    setDismissed(true)
    await updateProfile({ volunteer_prompt_dismissed: true })
  }

  return (
    <div className={s.banner}>
      <div className={s.icon}>✦</div>
      <div className={s.text}>
        <p className={s.title}>Save time on sign-ups</p>
        <p className={s.sub}>Complete your Volunteer Profile once and we'll pre-fill your applications.</p>
      </div>
      <button className={s.cta} onClick={onGetStarted}>
        Get started
      </button>
      <button className={s.dismiss} onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  )
}
