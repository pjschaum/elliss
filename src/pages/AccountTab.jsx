import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfile } from '../hooks/useProfile'
import VolunteerProfileSheet from '../components/VolunteerProfileSheet'
import useInstallPrompt from '../hooks/useInstallPrompt'
import a from './AccountTab.module.css'

// ─── All available causes ────────────────────────────────────
const ALL_CAUSES = [
  'Food & Hunger', 'Youth & Education', 'Seniors & Elderly', 'Animals & Pets',
  'Environment', 'Health & Wellness', 'Housing & Poverty', 'Veterans',
  'Disaster Relief', 'Mental Health', 'Disabilities', 'Community',
  'Arts & Culture', 'Racial Justice',
]

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase()
  }
  return email ? email.slice(0, 2).toUpperCase() : '??'
}

function SectionHeader({ title }) {
  return <p className={a.sectionHeader}>{title}</p>
}

function Row({ icon, label, value, onPress, danger, chevron = true }) {
  return (
    <button className={`${a.row} ${danger ? a.rowDanger : ''}`} onClick={onPress}>
      {icon && <span className={a.rowIcon}>{icon}</span>}
      <span className={a.rowLabel}>{label}</span>
      {value && <span className={a.rowValue}>{value}</span>}
      {chevron && <span className={a.rowChevron}>›</span>}
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────
export default function AccountTab() {
  const navigate = useNavigate()
  const { user, profile, loading, updateProfile } = useProfile()
  const [showVolProfile, setShowVolProfile] = useState(false)
  const [editingCauses, setEditingCauses]   = useState(false)
  const [pwResetSent, setPwResetSent]       = useState(false)
  const [signingOut, setSigningOut]         = useState(false)
  const [showIosSteps, setShowIosSteps]     = useState(false)
  const { canPrompt, isIos, isInstalled, showInstallUI, triggerInstall } = useInstallPrompt()

  const handleToggleCause = async (cause) => {
    const current = profile?.favorite_causes || []
    const updated = current.includes(cause)
      ? current.filter(c => c !== cause)
      : [...current, cause]
    await updateProfile({ favorite_causes: updated })
  }

  const handleChangePassword = async () => {
    if (!user?.email) return
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + '/reset-password',
    })
    setPwResetSent(true)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div className={a.loading}>Loading…</div>

  const displayName    = profile?.full_name || user?.user_metadata?.full_name || ''
  const email          = user?.email || ''
  const initials       = getInitials(displayName, email)
  const volComplete    = profile?.volunteer_profile_complete
  const favCauses      = profile?.favorite_causes || []

  // Volunteer profile summary line
  const volSummaryParts = []
  if (profile?.phone) volSummaryParts.push('Phone')
  if (profile?.date_of_birth) volSummaryParts.push('DOB')
  if (profile?.emergency_contact_name) volSummaryParts.push('Emergency contact')
  if ((profile?.skills || []).length > 0) volSummaryParts.push(`${profile.skills.length} skill${profile.skills.length > 1 ? 's' : ''}`)

  return (
    <div className={a.page}>

      {/* ── Profile header ── */}
      <div className={a.profileHeader}>
        <div className={a.avatar}>
          <span className={a.avatarInitials}>{initials}</span>
        </div>
        <div className={a.profileInfo}>
          <p className={a.profileName}>{displayName || 'Your Account'}</p>
          <p className={a.profileEmail}>{email}</p>
        </div>
      </div>

      {/* ── Volunteer Profile ── */}
      <div className={a.cardGroup}>
        <SectionHeader title="Volunteer Profile" />
        <div className={a.card}>
          <div className={a.profileStatusRow}>
            <div>
              <span className={`${a.statusBadge} ${volComplete ? a.statusComplete : a.statusIncomplete}`}>
                {volComplete ? '✓ Complete' : '○ Incomplete'}
              </span>
              {volSummaryParts.length > 0 && (
                <p className={a.profileSummary}>{volSummaryParts.join(' · ')}</p>
              )}
              {!volComplete && (
                <p className={a.profileSummary}>
                  Add your info once to pre-fill volunteer sign-ups.
                </p>
              )}
            </div>
            <button className={a.editBtn} onClick={() => setShowVolProfile(true)}>
              {volComplete ? 'Edit' : 'Set up'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Assistance Profile (placeholder for Help side) ── */}
      <div className={a.cardGroup}>
        <SectionHeader title="Assistance Profile" />
        <div className={a.card}>
          <div className={a.profileStatusRow}>
            <div>
              <span className={`${a.statusBadge} ${a.statusIncomplete}`}>○ Not set up</span>
              <p className={a.profileSummary}>
                Pre-fill program applications and course enrollments on the Help side.
              </p>
            </div>
            <button className={a.editBtn} disabled style={{ opacity: 0.4 }}>
              Coming soon
            </button>
          </div>
        </div>
      </div>

      {/* ── Favorite Causes ── */}
      <div className={a.cardGroup}>
        <SectionHeader title="Favorite Causes" />
        <div className={a.card}>
          {!editingCauses ? (
            <>
              {favCauses.length === 0 ? (
                <p className={a.emptyHint}>No causes selected yet. Tap Edit to choose what matters to you.</p>
              ) : (
                <div className={a.causeChips}>
                  {favCauses.map(c => (
                    <span key={c} className={a.causeChip}>{c}</span>
                  ))}
                </div>
              )}
              <button className={a.editCausesBtn} onClick={() => setEditingCauses(true)}>
                {favCauses.length === 0 ? 'Choose causes →' : 'Edit causes →'}
              </button>
            </>
          ) : (
            <>
              <p className={a.causesEditHint}>Tap causes to select or deselect. Changes save automatically.</p>
              <div className={a.causesGrid}>
                {ALL_CAUSES.map(cause => {
                  const selected = favCauses.includes(cause)
                  return (
                    <button
                      key={cause}
                      className={`${a.causeTile} ${selected ? a.causeTileSelected : ''}`}
                      onClick={() => handleToggleCause(cause)}
                    >
                      {selected && <span className={a.causeTileCheck}>✓ </span>}
                      {cause}
                    </button>
                  )
                })}
              </div>
              <button className={a.doneEditBtn} onClick={() => setEditingCauses(false)}>
                Done
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Favorite Organizations ── */}
      <div className={a.cardGroup}>
        <SectionHeader title="Favorite Organizations" />
        <div className={`${a.card} ${a.favOrgsCard}`}>
          <span className={a.favOrgsIcon}>🤝</span>
          <p className={a.favOrgsTitle}>No favorites yet</p>
          <p className={a.favOrgsDesc}>
            Tap the heart icon on any organization or volunteer event to save it here.
          </p>
        </div>
      </div>

      {/* ── Install App ── */}
      {!isInstalled && (
        <div className={a.cardGroup}>
          <SectionHeader title="Get the App" />
          <div className={a.card}>
            <div className={a.installRow}>
              <img src="/icon-192.png" alt="Elliss icon" className={a.installIcon} />
              <div className={a.installInfo}>
                <p className={a.installTitle}>Add Elliss to your home screen</p>
                <p className={a.installSub}>Instant access, offline support, no browser bar.</p>
              </div>
            </div>

            {showIosSteps ? (
              <div className={a.iosStepsWrap}>
                <ol className={a.iosSteps}>
                  <li>Tap the <strong>Share</strong> button <span className={a.shareIcon}>⎋</span> at the bottom of Safari</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right</li>
                </ol>
                <button className={a.iosStepsDone} onClick={() => setShowIosSteps(false)}>Done</button>
              </div>
            ) : (
              <button
                className={a.installBtn}
                onClick={async () => {
                  if (isIos) { setShowIosSteps(true); return }
                  await triggerInstall()
                }}
              >
                {isIos ? 'How to install on iPhone' : 'Install app'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Account settings ── */}
      <div className={a.cardGroup}>
        <SectionHeader title="Account" />
        <div className={a.cardList}>
          <Row icon="✉️" label="Email" value={email} onPress={() => {}} chevron={false} />
          <div className={a.separator} />
          {pwResetSent ? (
            <div className={a.row}>
              <span className={a.rowIcon}>✅</span>
              <span className={a.rowLabel} style={{ color: '#2e7d32' }}>Reset email sent — check your inbox</span>
            </div>
          ) : (
            <Row icon="🔑" label="Change password" onPress={handleChangePassword} />
          )}
        </div>
      </div>

      {/* ── Sign out ── */}
      <div className={a.cardGroup}>
        <div className={a.cardList}>
          <Row
            icon="🚪"
            label={signingOut ? 'Signing out…' : 'Sign out'}
            onPress={handleSignOut}
            danger
            chevron={false}
          />
        </div>
      </div>

      {/* ── App version ── */}
      <p className={a.version}>Elliss · v0.1 beta</p>

      {/* ── Volunteer Profile sheet ── */}
      {showVolProfile && (
        <VolunteerProfileSheet
          profile={profile}
          updateProfile={updateProfile}
          onClose={() => setShowVolProfile(false)}
        />
      )}
    </div>
  )
}
