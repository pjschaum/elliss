import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useProfile } from '../hooks/useProfile'
import VolunteerProfileSheet from '../components/VolunteerProfileSheet'
import useInstallPrompt from '../hooks/useInstallPrompt'
import useJourney from '../hooks/useJourney'
import DocumentsSection from '../components/DocumentsSection'
import a from './AccountTab.module.css'

// ─── Cause options ───────────────────────────────────────────
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

// Format 'YYYY-MM-DD' → 'Aug 15'
function fmtDate(isoStr) {
  if (!isoStr) return null
  const [y, m, d] = isoStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Returns true if isoStr is within the next 14 days
function isUrgent(isoStr) {
  if (!isoStr) return false
  const deadline = new Date(isoStr)
  const diff = (deadline - new Date()) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 14
}

function SectionHeader({ title }) {
  return <p className={a.sectionHeader}>{title}</p>
}

// Shows previewCount items, then a "View all N" toggle
function ShowMore({ items, previewCount = 3, label = 'items', renderItem, divider = true }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, previewCount)
  const hasMore = items.length > previewCount
  return (
    <>
      {visible.map((item, i) => (
        <div key={item.id ?? item.key ?? i}>
          {renderItem(item, i)}
          {divider && i < visible.length - 1 && <div className={a.savedDivider} />}
        </div>
      ))}
      {hasMore && (
        <button className={a.showMoreBtn} onClick={() => setExpanded(v => !v)}>
          {expanded
            ? 'Show less ↑'
            : `View all ${items.length} ${label} ↓`}
        </button>
      )}
    </>
  )
}

function CollapsibleSection({ title, description, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={a.cardGroup}>
      <SectionHeader title={title} />
      <button className={`${a.card} ${a.collapsibleCard}`} onClick={() => setOpen(v => !v)}>
        <div className={a.collapsibleCardTop}>
          {icon && <span className={a.collapsibleCardIcon}>{icon}</span>}
          <p className={a.collapsibleCardDesc}>{description}</p>
          <span className={`${a.collapsibleChevron} ${open ? a.collapsibleChevronOpen : ''}`}>›</span>
        </div>
      </button>
      {open && <div className={a.card}>{children}</div>}
    </div>
  )
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

// ─── Saved item row (Help side) ───────────────────────────────
function SavedItemRow({ name, sub, deadline, startDate, renewalDate, onRemove, onNavigate }) {
  const deadlineLabel = deadline
    ? (isUrgent(deadline)
        ? `⚠️ Deadline ${fmtDate(deadline)}`
        : `Deadline ${fmtDate(deadline)}`)
    : null
  const startLabel    = startDate   ? `Starts ${fmtDate(startDate)}`   : null
  const renewalLabel  = renewalDate ? `Renewal ${fmtDate(renewalDate)}` : null

  const urgentDeadline = deadline && isUrgent(deadline)

  return (
    <div className={a.savedRow} onClick={onNavigate}>
      <div className={a.savedInfo}>
        <p className={a.savedName}>{name}</p>
        {sub && <p className={a.savedSub}>{sub}</p>}
        <div className={a.savedBadges}>
          {deadlineLabel && (
            <span className={`${a.savedBadge} ${urgentDeadline ? a.savedBadgeUrgent : a.savedBadgeDeadline}`}>
              {deadlineLabel}
            </span>
          )}
          {startLabel && (
            <span className={`${a.savedBadge} ${a.savedBadgeStart}`}>{startLabel}</span>
          )}
          {renewalLabel && (
            <span className={`${a.savedBadge} ${a.savedBadgeRenewal}`}>{renewalLabel}</span>
          )}
        </div>
      </div>
      <button
        className={a.savedRemoveBtn}
        onClick={e => { e.stopPropagation(); onRemove() }}
        aria-label="Remove from saved"
      >
        ♥
      </button>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────
// side: 'give' (default) | 'help'
// savedHook:    returned value of useSavedItems()   — required when side='help'
// favoriteHook: returned value of useFavoriteOrgs() — required when side='give'
export default function AccountTab({ side = 'give', savedHook, favoriteHook, assistanceProfile }) {
  const navigate = useNavigate()
  const { user, profile, loading, updateProfile } = useProfile()
  const [showVolProfile, setShowVolProfile] = useState(false)
  const [editingCauses, setEditingCauses]   = useState(false)
  const [causesExpanded, setCausesExpanded] = useState(false)
  const CAUSE_PREVIEW = 6
  const [pwResetSent, setPwResetSent]       = useState(false)
  const journeyHook = useJourney() // used on Help side only; harmless on Give side
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

  const displayName = profile?.full_name || user?.user_metadata?.full_name || ''
  const email       = user?.email || ''
  const initials    = getInitials(displayName, email)
  const volComplete = profile?.volunteer_profile_complete
  const favCauses   = profile?.favorite_causes || []

  const volSummaryParts = []
  if (profile?.phone) volSummaryParts.push('Phone')
  if (profile?.date_of_birth) volSummaryParts.push('DOB')
  if (profile?.emergency_contact_name) volSummaryParts.push('Emergency contact')
  if ((profile?.skills || []).length > 0) volSummaryParts.push(`${profile.skills.length} skill${profile.skills.length > 1 ? 's' : ''}`)

  // Help-side saved items
  const savedResources = savedHook?.savedResources || []
  const savedPrograms  = savedHook?.savedPrograms  || []
  const savedCourses   = savedHook?.savedCourses   || []
  const totalSaved     = savedResources.length + savedPrograms.length + savedCourses.length

  // Give-side favorited orgs
  const favoriteOrgs   = favoriteHook?.favoriteOrgs || []

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

      {/* ════ GIVE-SIDE SECTIONS ════ */}
      {side === 'give' && (
        <>
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
                    <p className={a.profileSummary}>Add your info once to pre-fill volunteer sign-ups.</p>
                  )}
                </div>
                <button className={a.editBtn} onClick={() => setShowVolProfile(true)}>
                  {volComplete ? 'Edit' : 'Set up'}
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
                    <>
                      <div className={a.causeChips}>
                        {(causesExpanded ? favCauses : favCauses.slice(0, CAUSE_PREVIEW)).map(c => (
                          <span key={c} className={a.causeChip}>{c}</span>
                        ))}
                      </div>
                      {favCauses.length > CAUSE_PREVIEW && (
                        <button className={a.showMoreBtn} onClick={() => setCausesExpanded(v => !v)}>
                          {causesExpanded ? 'Show less ↑' : `View all ${favCauses.length} causes ↓`}
                        </button>
                      )}
                    </>
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
            {favoriteOrgs.length === 0 ? (
              <div className={`${a.card} ${a.favOrgsCard}`}>
                <span className={a.favOrgsIcon}>🤝</span>
                <p className={a.favOrgsTitle}>No favorites yet</p>
                <p className={a.favOrgsDesc}>Tap ♡ on any organization or volunteer event to save it here.</p>
              </div>
            ) : (
              <div className={a.card}>
                <ShowMore
                  items={favoriteOrgs}
                  previewCount={3}
                  label="organizations"
                  renderItem={org => (
                    <div className={a.savedRow}>
                      <div className={a.orgLogoSmall} style={{ background: org.color }}>
                        {org.initials}
                      </div>
                      <div className={a.savedInfo}>
                        <p className={a.savedName}>{org.name}</p>
                        {org.category && <p className={a.savedSub}>{org.category}</p>}
                      </div>
                      <button
                        className={a.savedRemoveBtn}
                        style={{ color: 'var(--give-dark)' }}
                        onClick={() => favoriteHook.removeFavoriteOrg(org.key)}
                        aria-label="Remove from favorites"
                      >♥</button>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          {/* ── My Documents (Give) ── */}
          <CollapsibleSection
            title="My Documents"
            icon="📁"
            description="Upload your documents once and share them with any organization you volunteer with. Many orgs require IDs, certifications, and background check authorization before you can start."
          >
            <DocumentsSection side="give" />
          </CollapsibleSection>
        </>
      )}

      {/* ════ HELP-SIDE SECTIONS ════ */}
      {side === 'help' && (
        <>
          {/* ── My Progress / Journey ── */}
          <div className={a.cardGroup}>
            <SectionHeader title="My Journey" />
            <div className={a.journeyCard} onClick={() => navigate('/help/progress')}>
              <div className={a.journeyLeft}>
                <div className={a.journeyCircle}>
                  <span className={a.journeyNum}>{journeyHook.doorsOpened}</span>
                  <span className={a.journeyUnit}>doors{'\n'}opened</span>
                </div>
              </div>
              <div className={a.journeyInfo}>
                <p className={a.journeyLabel}>{journeyHook.label}</p>
                <p className={a.journeySub}>
                  {journeyHook.score === 0
                    ? 'Track programs, resources & courses you explore'
                    : `${journeyHook.score} progress points · tap to see what you've unlocked`
                  }
                </p>
              </div>
              <span className={a.journeyChevron}>›</span>
            </div>
          </div>

          {/* ── Assistance Profile ── */}
          <div className={a.cardGroup}>
            <SectionHeader title="Assistance Profile" />
            <div className={a.card}>
              <div className={a.profileStatusRow}>
                <div>
                  {assistanceProfile?.profile?.completed ? (
                    <>
                      <span className={`${a.statusBadge} ${a.statusComplete}`}>● Complete</span>
                      <p className={a.profileSummary}>
                        {[
                          assistanceProfile.profile.forWhom === 'myself' ? 'For myself'
                            : assistanceProfile.profile.forWhom === 'someone_else' ? 'For someone else'
                            : assistanceProfile.profile.forWhom === 'my_family' ? 'For my family'
                            : null,
                          assistanceProfile.profile.primaryGoal === 'find_work' ? 'Finding work'
                            : assistanceProfile.profile.primaryGoal === 'housing' ? 'Housing'
                            : assistanceProfile.profile.primaryGoal === 'food' ? 'Food assistance'
                            : assistanceProfile.profile.primaryGoal === 'healthcare' ? 'Healthcare'
                            : assistanceProfile.profile.primaryGoal === 'education' ? 'Education'
                            : null,
                        ].filter(Boolean).join(' · ') || 'Profile complete'}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className={`${a.statusBadge} ${a.statusIncomplete}`}>○ Not set up</span>
                      <p className={a.profileSummary}>Help us personalize resources for your situation.</p>
                    </>
                  )}
                </div>
                <button
                  className={a.editBtn}
                  onClick={() => assistanceProfile?.resetProfile?.()}
                >
                  {assistanceProfile?.profile?.completed ? 'Edit' : 'Set up'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Saved Resources ── */}
          <div className={a.cardGroup}>
            <SectionHeader title="Saved Resources" />
            {savedResources.length === 0 ? (
              <div className={`${a.card} ${a.savedEmptyCard}`}>
                <span className={a.savedEmptyIcon}>🌱</span>
                <p className={a.savedEmptyTitle}>No saved resources</p>
                <p className={a.savedEmptyDesc}>Tap ♡ on any resource to save it for later.</p>
              </div>
            ) : (
              <div className={a.card}>
                <ShowMore
                  items={savedResources}
                  previewCount={3}
                  label="resources"
                  renderItem={r => (
                    <SavedItemRow
                      name={r.org}
                      sub={r.category}
                      deadline={r.applicationDeadline}
                      renewalDate={r.renewalDate}
                      onRemove={() => savedHook.unsaveItem('resource', r.id)}
                      onNavigate={() => navigate(`/help/resource/${r.id}`)}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* ── Saved Programs ── */}
          <div className={a.cardGroup}>
            <SectionHeader title="Saved Programs" />
            {savedPrograms.length === 0 ? (
              <div className={`${a.card} ${a.savedEmptyCard}`}>
                <span className={a.savedEmptyIcon}>📋</span>
                <p className={a.savedEmptyTitle}>No saved programs</p>
                <p className={a.savedEmptyDesc}>Tap ♡ on any program to track application deadlines and renewals.</p>
              </div>
            ) : (
              <div className={a.card}>
                <ShowMore
                  items={savedPrograms}
                  previewCount={3}
                  label="programs"
                  renderItem={p => (
                    <SavedItemRow
                      name={p.name}
                      sub={p.agency}
                      deadline={p.applicationDeadline}
                      renewalDate={p.renewalDate}
                      onRemove={() => savedHook.unsaveItem('program', p.id)}
                      onNavigate={() => navigate(`/help/program/${p.id}`)}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* ── Saved Courses ── */}
          <div className={a.cardGroup}>
            <SectionHeader title="Saved Courses" />
            {savedCourses.length === 0 ? (
              <div className={`${a.card} ${a.savedEmptyCard}`}>
                <span className={a.savedEmptyIcon}>🎓</span>
                <p className={a.savedEmptyTitle}>No saved courses</p>
                <p className={a.savedEmptyDesc}>Tap ♡ on any course to get registration and start date reminders.</p>
              </div>
            ) : (
              <div className={a.card}>
                <ShowMore
                  items={savedCourses}
                  previewCount={3}
                  label="courses"
                  renderItem={c => (
                    <SavedItemRow
                      name={c.title}
                      sub={c.provider}
                      deadline={c.registrationDeadline}
                      startDate={c.startDate}
                      onRemove={() => savedHook.unsaveItem('course', c.id)}
                      onNavigate={() => navigate(`/help/course/${c.id}`)}
                    />
                  )}
                />
              </div>
            )}
          </div>

          {/* ── My Documents (Help) ── */}
          <CollapsibleSection
            title="My Documents"
            icon="📁"
            description="Upload your documents here so they're ready when you need them. Many programs ask for the same documents — having them saved saves you time. Your documents are private and secure."
          >
            <DocumentsSection side="help" />
          </CollapsibleSection>
        </>
      )}

      {/* ── Install App (both sides) ── */}
      {!isInstalled && (
        <div className={a.cardGroup}>
          <SectionHeader title="Get the App" />
          <div className={a.card}>
            <div className={a.installRow}>
              <img src="/icon-192x192.png" alt="Elliss icon" className={a.installIcon} />
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

      {/* ── Account settings (both sides) ── */}
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

      {/* ── Sign out (both sides) ── */}
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

      <p className={a.legalLinks}>
        <Link to="/terms" className={a.legalLink}>Terms of Service</Link>
        {' · '}
        <Link to="/privacy" className={a.legalLink}>Privacy Policy</Link>
      </p>

      <p className={a.version}>Elliss · v0.1 beta</p>

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
