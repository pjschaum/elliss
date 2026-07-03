/**
 * AssistanceProfileSheet
 *
 * 5-question intake bottom sheet for the Help side.
 * Appears on first visit; answers power smart ranking of
 * resources, programs, and courses.
 *
 * Views:
 *   0 — Trust disclaimer
 *   1 — Who are you finding help for?
 *   2 — Situation tags (multi-select)
 *   3 — Education level
 *   4 — Income bracket
 *   5 — Primary goal
 *   6 — Success / confirmation
 */

import { useState } from 'react'
import s from '../components/Sheet.module.css'
import p from './AssistanceProfileSheet.module.css'

const TOTAL_SCREENS = 5  // question screens only (not trust or success)

// ─── Screen 1 options ──────────────────────────────────────────
const FOR_WHOM_OPTIONS = [
  { value: 'myself',              emoji: '🙋', label: 'Just myself' },
  { value: 'my_family',           emoji: '👨‍👩‍👧', label: 'Myself and my family' },
  { value: 'my_children',         emoji: '👶', label: 'My children',            desc: 'Finding help for kids in my care' },
  { value: 'senior_family_member',emoji: '👴', label: 'A senior family member', desc: 'Parent, grandparent, or older relative' },
  { value: 'someone_else',        emoji: '🤝', label: 'Someone else',           desc: 'A friend, neighbor, or client' },
]

// ─── Screen 2 options (multi-select) ──────────────────────────
const SITUATION_OPTIONS = [
  { value: 'housing_crisis',   label: 'Housing or utility crisis' },
  { value: 'single_parents',   label: 'Single parent' },
  { value: 'veterans',         label: 'Veteran or active military' },
  { value: 'pregnant',         label: 'Pregnant or recently had a baby' },
  { value: 'disabilities',     label: 'Person with a disability' },
  { value: 'justice_involved', label: 'Recently released from incarceration' },
  { value: 'immigrants',       label: 'Immigrant or refugee' },
  { value: 'homeless',         label: 'Experiencing homelessness' },
  { value: 'women',            label: 'Looking for women\'s services' },
  { value: 'lgbtq',            label: 'LGBTQ+ services' },
]

// ─── Screen 3 options ──────────────────────────────────────────
const EDUCATION_OPTIONS = [
  { value: 'no_hs',    emoji: '📚', label: 'Did not graduate high school' },
  { value: 'hs_diploma',emoji: '🎓', label: 'GED or high school diploma' },
  { value: 'college',  emoji: '🏫', label: 'College or associate\'s degree' },
  { value: 'graduate', emoji: '🎓', label: 'Master\'s, PhD, or equivalent' },
]

// ─── Screen 4 options ──────────────────────────────────────────
const INCOME_OPTIONS = [
  { value: 'under_2k', emoji: '💚', label: 'Under $2,000 / month',   desc: 'Under $24,000/year' },
  { value: '2k_4k',    emoji: '💚', label: '$2,000 – $4,000 / month', desc: '$24,000–$48,000/year' },
  { value: '4k_6k',    emoji: '💛', label: '$4,000 – $6,000 / month', desc: '$48,000–$72,000/year' },
  { value: 'over_6k',  emoji: '🔵', label: 'Over $6,000 / month',    desc: 'Over $72,000/year' },
  { value: 'prefer_not',emoji: '🔒', label: 'Prefer not to say' },
]

// ─── Screen 5 options ──────────────────────────────────────────
const GOAL_OPTIONS = [
  { value: 'immediate_help', emoji: '🚨', label: 'Getting immediate help',    desc: 'Food, shelter, utilities, crisis support' },
  { value: 'programs',       emoji: '📋', label: 'Programs I may qualify for', desc: 'Government benefits and assistance programs' },
  { value: 'skills',         emoji: '🎯', label: 'Learning skills for a better job', desc: 'Free and low-cost courses and training' },
  { value: 'all',            emoji: '🌟', label: 'A mix of all of these' },
]

// ─── Helper sub-components ─────────────────────────────────────

function SingleSelect({ options, value, onChange }) {
  return (
    <div className={p.options}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            className={`${p.optionCard} ${selected ? p.optionCardSelected : ''}`}
            onClick={() => onChange(opt.value)}
            type="button"
          >
            <span className={p.optionEmoji}>{opt.emoji}</span>
            <span className={p.optionText}>
              <span className={p.optionLabel}>{opt.label}</span>
              {opt.desc && <span className={p.optionDesc}>{opt.desc}</span>}
            </span>
            <span className={`${p.optionCheck} ${selected ? p.optionCheckSelected : ''}`}>
              {selected && '✓'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function MultiSelect({ options, values, onChange }) {
  function toggle(val) {
    if (val === 'none') {
      onChange([])
      return
    }
    const next = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val]
    onChange(next)
  }
  const noneSelected = values.length === 0
  return (
    <div className={p.chipGrid}>
      {options.map(opt => (
        <button
          key={opt.value}
          className={`${p.chip} ${values.includes(opt.value) ? p.chipSelected : ''}`}
          onClick={() => toggle(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
      <button
        className={`${p.chip} ${p.chipNone} ${noneSelected ? p.chipNoneSelected : ''}`}
        onClick={() => toggle('none')}
        type="button"
      >
        None of these apply
      </button>
    </div>
  )
}

function ProgressDots({ current }) {
  return (
    <div className={p.progress}>
      {Array.from({ length: TOTAL_SCREENS }, (_, i) => (
        <span
          key={i}
          className={`${p.dot} ${i + 1 === current ? p.dotActive : i + 1 < current ? p.dotDone : ''}`}
        />
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────

export default function AssistanceProfileSheet({ onComplete, onSkip }) {
  // view: 0=trust, 1-5=questions, 6=success
  const [view, setView] = useState(0)

  // Answers (local to this sheet — saved in bulk on complete)
  const [forWhom,        setForWhom]        = useState(null)
  const [situations,     setSituations]     = useState([])
  const [educationLevel, setEducationLevel] = useState(null)
  const [incomeBracket,  setIncomeBracket]  = useState(null)
  const [primaryGoal,    setPrimaryGoal]    = useState(null)

  function next() { setView(v => v + 1) }
  function back() { setView(v => Math.max(0, v - 1)) }

  function handleSkip() {
    onSkip?.()
  }

  function handleFinish() {
    setView(6)
    onComplete?.({
      forWhom,
      situations,
      educationLevel,
      incomeBracket,
      primaryGoal,
    })
  }

  // ── Content per view ────────────────────────────────────────

  function renderBody() {
    switch (view) {

      case 0: // Trust disclaimer
        return (
          <div className={p.trustCard}>
            <span className={p.trustIcon}>🔒</span>
            <h2 className={p.trustTitle}>Your information is protected</h2>
            <ul className={p.trustList}>
              <li className={p.trustItem}>
                <span className={p.trustCheck}>✓</span>
                Your answers are only used to find you better matches in the app.
              </li>
              <li className={p.trustItem}>
                <span className={p.trustCheck}>✓</span>
                We never share your information with government agencies, employers, landlords, or law enforcement.
              </li>
              <li className={p.trustItem}>
                <span className={p.trustCheck}>✓</span>
                You can skip any question, change your answers at any time, or delete your profile entirely.
              </li>
              <li className={p.trustItem}>
                <span className={p.trustCheck}>✓</span>
                Undocumented immigrants, domestic violence survivors, and others in sensitive situations can use Elliss safely.
              </li>
            </ul>
            <p className={p.trustNote}>
              This takes about 1 minute. You can skip it and come back later.
            </p>
          </div>
        )

      case 1:
        return (
          <>
            <h2 className={p.screenTitle}>Who are you finding help for?</h2>
            <SingleSelect options={FOR_WHOM_OPTIONS} value={forWhom} onChange={setForWhom} />
          </>
        )

      case 2:
        return (
          <>
            <h2 className={p.screenTitle}>Does any of this describe your situation?</h2>
            <p className={p.screenSub}>Select all that apply — this helps us surface relevant programs and services.</p>
            <MultiSelect options={SITUATION_OPTIONS} values={situations} onChange={setSituations} />
          </>
        )

      case 3:
        return (
          <>
            <h2 className={p.screenTitle}>Highest level of education completed</h2>
            <SingleSelect options={EDUCATION_OPTIONS} value={educationLevel} onChange={setEducationLevel} />
          </>
        )

      case 4:
        return (
          <>
            <h2 className={p.screenTitle}>Approximate monthly household income</h2>
            <p className={p.screenSub}>Used only to match you with programs you may qualify for.</p>
            <SingleSelect options={INCOME_OPTIONS} value={incomeBracket} onChange={setIncomeBracket} />
          </>
        )

      case 5:
        return (
          <>
            <h2 className={p.screenTitle}>What matters most to you right now?</h2>
            <SingleSelect options={GOAL_OPTIONS} value={primaryGoal} onChange={setPrimaryGoal} />
          </>
        )

      case 6:
        return (
          <div className={p.success}>
            <span className={p.successIcon}>🌱</span>
            <h2 className={p.successTitle}>Your results are personalized</h2>
            <p className={p.successSub}>
              We'll use your answers to surface the most relevant resources, programs, and courses for your situation.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  function renderFooter() {
    if (view === 0) {
      return (
        <>
          <button className={p.primaryBtn} onClick={next}>
            Got it — let's begin
          </button>
          <div className={p.skipRow}>
            <button className={p.skipLink} onClick={handleSkip}>
              Skip for now
            </button>
          </div>
        </>
      )
    }
    if (view === 6) {
      return (
        <button className={p.primaryBtn} onClick={() => onSkip?.()}>
          See my results
        </button>
      )
    }
    const isLast = view === 5
    return (
      <>
        <button className={p.primaryBtn} onClick={isLast ? handleFinish : next}>
          {isLast ? 'Finish' : 'Continue'}
        </button>
        <div className={p.skipRow}>
          <button className={p.skipLink} onClick={handleSkip}>
            Skip all questions
          </button>
        </div>
      </>
    )
  }

  // ── Sheet layout ─────────────────────────────────────────────
  return (
    <>
      <div className={s.backdrop} onClick={view === 0 ? handleSkip : undefined} />
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label="Assistance Profile">
        <div className={s.handle} />

        {/* Header — back arrow on question screens */}
        <div className={s.header}>
          {view > 0 && view < 6
            ? (
              <button className={s.closeBtn} onClick={back} aria-label="Go back">
                ← Back
              </button>
            )
            : <span />
          }
          <span />
          {view > 0 && view < 6 && (
            <button className={s.closeBtn} onClick={handleSkip} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        {/* Progress dots (question screens only) */}
        {view >= 1 && view <= 5 && <ProgressDots current={view} />}

        {/* Scrollable body */}
        <div className={s.body}>
          {renderBody()}
        </div>

        {/* Pinned footer */}
        <div className={s.footer}>
          {renderFooter()}
        </div>
      </div>
    </>
  )
}
