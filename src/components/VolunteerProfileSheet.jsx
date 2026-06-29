import { useState, useEffect } from 'react'
import s from './Sheet.module.css'

const SKILLS = [
  'Teaching / Tutoring', 'Construction / Trades', 'Healthcare',
  'Food Service', 'Animal Care', 'Administrative', 'Driving / Transport',
  'Technology', 'Languages', 'Arts & Music', 'Childcare', 'Elder Care',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function VolunteerProfileSheet({ profile, updateProfile, onClose, onComplete }) {
  const [form, setForm] = useState({
    phone: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    skills: [],
    availability: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  // Pre-fill from existing profile
  useEffect(() => {
    if (profile) {
      setForm({
        phone:                  profile.phone                  || '',
        date_of_birth:          profile.date_of_birth          || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone:profile.emergency_contact_phone|| '',
        skills:                 profile.skills                 || [],
        availability:           profile.availability           || [],
      })
    }
  }, [profile])

  const toggle = (key, value) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter(v => v !== value)
        : [...f[key], value],
    }))
  }

  const handleSave = async () => {
    if (!form.phone) { setError('Phone number is required.'); return }
    setSaving(true)
    setError(null)
    const { error } = await updateProfile({
      ...form,
      volunteer_profile_complete: true,
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    onComplete?.()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className={s.backdrop} onClick={onClose} />

      {/* Sheet */}
      <div className={s.sheet}>
        <div className={s.handle} />

        <div className={s.header}>
          <h2 className={s.title}>Volunteer Profile</h2>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <p className={s.subtitle}>
          This info is stored securely and used to pre-fill your sign-up forms. You can update it anytime from your Account.
        </p>

        <div className={s.body}>
          {error && <p className={s.error}>{error}</p>}

          {/* Phone */}
          <div className={s.field}>
            <label className={s.label}>Phone number <span className={s.req}>*</span></label>
            <input
              className={s.input}
              type="tel"
              placeholder="(555) 555-5555"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>

          {/* Date of birth */}
          <div className={s.field}>
            <label className={s.label}>Date of birth</label>
            <p className={s.hint}>Required for events with age restrictions or background checks.</p>
            <input
              className={s.input}
              type="date"
              value={form.date_of_birth}
              onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
            />
          </div>

          {/* Emergency contact */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Emergency contact</label>
            <p className={s.hint}>Required for some hands-on volunteer roles.</p>
            <input
              className={s.input}
              type="text"
              placeholder="Contact name"
              value={form.emergency_contact_name}
              onChange={e => setForm(f => ({ ...f, emergency_contact_name: e.target.value }))}
            />
            <input
              className={`${s.input} ${s.inputMt}`}
              type="tel"
              placeholder="Contact phone number"
              value={form.emergency_contact_phone}
              onChange={e => setForm(f => ({ ...f, emergency_contact_phone: e.target.value }))}
            />
          </div>

          {/* Skills */}
          <div className={s.field}>
            <label className={s.label}>Skills & interests <span className={s.optional}>(optional)</span></label>
            <p className={s.hint}>Helps us match you with the right opportunities.</p>
            <div className={s.checkGrid}>
              {SKILLS.map(skill => (
                <label key={skill} className={s.checkLabel}>
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={form.skills.includes(skill)}
                    onChange={() => toggle('skills', skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className={s.field}>
            <label className={s.label}>Availability <span className={s.optional}>(optional)</span></label>
            <div className={s.dayGrid}>
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`${s.dayBtn} ${form.availability.includes(day) ? s.dayBtnActive : ''}`}
                  onClick={() => toggle('availability', day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.footer}>
          <button
            className={s.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Volunteer Profile'}
          </button>
        </div>
      </div>
    </>
  )
}
