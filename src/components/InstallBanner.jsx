import { useState, useEffect } from 'react'
import useInstallPrompt from '../hooks/useInstallPrompt'
import s from './InstallBanner.module.css'

const STORAGE_KEY = 'elliss_install_banner_dismissed'
const DELAY_MS    = 30_000  // 30 seconds

export default function InstallBanner() {
  const { canPrompt, isIos, showInstallUI, triggerInstall } = useInstallPrompt()
  const [visible, setVisible] = useState(false)
  const [showIosSteps, setShowIosSteps] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed or no install option available
    if (!showInstallUI) return
    if (localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [showInstallUI])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    setShowIosSteps(false)
  }

  async function handleInstall() {
    if (isIos) {
      setShowIosSteps(true)
      return
    }
    const accepted = await triggerInstall()
    if (accepted !== null) dismiss()
  }

  if (!visible) return null

  return (
    <>
      <div className={s.backdrop} onClick={dismiss} />
      <div className={s.banner} role="dialog" aria-label="Install Elliss app">
        <div className={s.iconWrap}>
          <img src="/icon-192.png" alt="Elliss icon" className={s.icon} />
        </div>

        <div className={s.body}>
          {showIosSteps ? (
            <>
              <p className={s.title}>Add to Home Screen</p>
              <ol className={s.steps}>
                <li>Tap the <strong>Share</strong> button <span className={s.shareIcon}>⎋</span> at the bottom of your browser</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> in the top right</li>
              </ol>
              <button className={s.dismissBtn} onClick={dismiss}>Got it</button>
            </>
          ) : (
            <>
              <p className={s.title}>Add Elliss to your home screen</p>
              <p className={s.sub}>Get the full app experience — instant access, offline support, no browser bar.</p>
              <div className={s.actions}>
                <button className={s.dismissBtn} onClick={dismiss}>Not now</button>
                <button className={s.installBtn} onClick={handleInstall}>
                  {isIos ? 'How to install' : 'Install app'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
