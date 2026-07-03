import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import s from './Auth.module.css'
import EllissLogo from '../components/EllissLogo'
import { supabase } from '../lib/supabase'

function getInitialStep() {
  const lang = localStorage.getItem('elliss_language')
  const age = localStorage.getItem('elliss_age_verified')

  if (!lang) return 'language'
  if (!age) return 'age'
  if (age === 'minor') return 'minor'
  return 'auth'
}

export default function Auth() {
  const navigate = useNavigate()
  const [step, setStep] = useState(getInitialStep)

  // Language step state
  const [selectedLang, setSelectedLang] = useState(null)

  // Auth step state (unchanged)
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Language step handlers ──
  const handleLangContinue = () => {
    const langValue = selectedLang === 'en' ? 'en' : selectedLang === 'es' ? 'es' : 'en'
    localStorage.setItem('elliss_language', selectedLang)
    document.documentElement.lang = langValue

    const age = localStorage.getItem('elliss_age_verified')
    if (!age) {
      setStep('age')
    } else if (age === 'minor') {
      setStep('minor')
    } else {
      setStep('auth')
    }
  }

  // ── Age step handlers ──
  const handleAgeYes = () => {
    localStorage.setItem('elliss_age_verified', 'adult')
    setStep('auth')
  }

  const handleAgeNo = () => {
    localStorage.setItem('elliss_age_verified', 'minor')
    setStep('minor')
  }

  const handleResetAge = () => {
    localStorage.removeItem('elliss_age_verified')
    setStep('age')
  }

  // ── Auth step handlers (unchanged) ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        })
        if (error) throw error
      }
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider) => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/home` },
    })
    if (error) setError(error.message)
  }

  // ── Step: Language Selection ──
  if (step === 'language') {
    return (
      <div className={s.page}>
        <div className={s.top}>
          <EllissLogo size={44} />
          <p className={s.tagline}>Kind Hearts. Better Lives.</p>
        </div>

        <div className={s.card}>
          <h2 className={s.gateHeading}>Choose your language</h2>
          <p className={s.gateSubheading}>Elige tu idioma</p>

          <div className={s.langOptions}>
            <button
              type="button"
              className={`${s.optionCard} ${selectedLang === 'en' ? s.optionCardSelected : ''}`}
              onClick={() => setSelectedLang('en')}
            >
              <span className={s.optionFlag}>🇺🇸</span>
              <span className={s.optionLabel}>English</span>
            </button>

            <button
              type="button"
              className={`${s.optionCard} ${selectedLang === 'es' ? s.optionCardSelected : ''}`}
              onClick={() => setSelectedLang('es')}
            >
              <span className={s.optionFlag}>🇪🇸</span>
              <span className={s.optionLabel}>Español</span>
            </button>

            <button
              type="button"
              className={`${s.optionCard} ${selectedLang === 'other' ? s.optionCardSelected : ''}`}
              onClick={() => setSelectedLang('other')}
            >
              <span className={s.optionFlag}>🌐</span>
              <span className={s.optionLabel}>Other language</span>
            </button>
          </div>

          {selectedLang === 'other' && (
            <p className={s.otherLangNote}>
              We're adding more languages soon. Continuing in English.
            </p>
          )}

          <button
            type="button"
            className={s.primaryBtn}
            disabled={!selectedLang}
            onClick={handleLangContinue}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // ── Step: Age Verification ──
  if (step === 'age') {
    return (
      <div className={s.page}>
        <div className={s.top}>
          <EllissLogo size={44} />
          <p className={s.tagline}>Kind Hearts. Better Lives.</p>
        </div>

        <div className={s.card}>
          <h2 className={s.gateHeading}>Before we continue</h2>
          <p className={s.gateQuestion}>Are you 18 or older?</p>
          <p className={s.gateNote}>
            Some features require you to be an adult. Younger users can still access emergency resources.
          </p>

          <div className={s.ageOptions}>
            <button
              type="button"
              className={s.ageBtn}
              onClick={handleAgeYes}
            >
              Yes, I'm 18 or older
            </button>
            <button
              type="button"
              className={`${s.ageBtn} ${s.ageBtnMinor}`}
              onClick={handleAgeNo}
            >
              No, I'm under 18
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Minor Restricted Screen ──
  if (step === 'minor') {
    return (
      <div className={s.page}>
        <div className={s.top}>
          <EllissLogo size={44} />
          <p className={s.tagline}>Kind Hearts. Better Lives.</p>
        </div>

        <div className={s.card}>
          <h2 className={s.gateHeading}>Welcome to Elliss</h2>
          <p className={s.gateNote} style={{ marginBottom: '1.5rem' }}>
            You can still access emergency resources without an account.
          </p>

          <Link to="/quick-resources" className={s.primaryBtn} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            📞 View Quick Resources
          </Link>

          <button
            type="button"
            className={s.resetAgeLink}
            onClick={handleResetAge}
          >
            I'm actually 18 or older
          </button>
        </div>
      </div>
    )
  }

  // ── Step: Auth (Sign In / Sign Up) — unchanged ──
  return (
    <div className={s.page}>
      <div className={s.top}>
        <EllissLogo size={44} />
        <p className={s.tagline}>Kind Hearts. Better Lives.</p>
      </div>

      <div className={s.card}>
        <div className={s.modeTabs}>
          <button
            className={`${s.modeTab} ${mode === 'signin' ? s.modeTabActive : ''}`}
            onClick={() => { setMode('signin'); setError(null) }}
          >
            Sign In
          </button>
          <button
            className={`${s.modeTab} ${mode === 'signup' ? s.modeTabActive : ''}`}
            onClick={() => { setMode('signup'); setError(null) }}
          >
            Sign Up
          </button>
        </div>

        {error && <p className={s.errorMsg}>{error}</p>}

        <form className={s.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={s.field}>
              <label className={s.label}>Full Name</label>
              <input
                className={s.input}
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input
              className={s.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={s.field}>
            <label className={s.label}>Password</label>
            <input
              className={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {mode === 'signin' && (
            <button type="button" className={s.forgot}>Forgot password?</button>
          )}

          <button type="submit" className={s.primaryBtn} disabled={loading}>
            {loading
              ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <div className={s.divider}>
          <span className={s.dividerLine} />
          <span className={s.dividerText}>or continue with</span>
          <span className={s.dividerLine} />
        </div>

        <div className={s.socialBtns}>
          <button className={s.socialBtn} onClick={() => handleSocial('google')} type="button">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button className={s.socialBtn} onClick={() => handleSocial('apple')} type="button">
            <AppleIcon />
            <span>Apple</span>
          </button>
          <button className={s.socialBtn} onClick={() => handleSocial('facebook')} type="button">
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      <p className={s.terms}>
        By continuing, you agree to our{' '}
        <Link to="/terms" className={s.link}>Terms of Service</Link> and{' '}
        <Link to="/privacy" className={s.link}>Privacy Policy</Link>.
      </p>

      <Link to="/quick-resources" className={s.quickResourcesLink}>
        📞 Quick Resources — Local phone numbers &amp; directions
      </Link>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
