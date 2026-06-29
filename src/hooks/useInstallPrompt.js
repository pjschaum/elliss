import { useState, useEffect } from 'react'

/**
 * useInstallPrompt
 *
 * Handles PWA install prompt across platforms:
 *  - Android/Chrome: captures `beforeinstallprompt`, lets you defer + trigger it
 *  - iOS/Safari:     no native prompt; returns isIos=true so UI can show manual instructions
 *  - Already installed (standalone): returns isInstalled=true so UI can hide the CTA
 */
export default function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled]       = useState(false)
  const [isIos, setIsIos]                   = useState(false)

  useEffect(() => {
    // Detect if running in standalone (already installed)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (standalone) {
      setIsInstalled(true)
      return
    }

    // Detect iOS (Safari doesn't fire beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    setIsIos(ios)

    // Android/Chrome: capture the deferred prompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // If user installs via browser UI, mark as installed
    const installedHandler = () => setIsInstalled(true)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  /**
   * triggerInstall()
   * - Android: fires the native Add to Home Screen dialog
   * - Returns true if accepted, false if dismissed
   * - On iOS or if no prompt available, returns null (caller shows manual instructions)
   */
  async function triggerInstall() {
    if (!deferredPrompt) return null
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === 'accepted') setIsInstalled(true)
    return outcome === 'accepted'
  }

  const canPrompt = !!deferredPrompt  // Android native prompt available
  const showInstallUI = !isInstalled && (canPrompt || isIos)

  return { canPrompt, isIos, isInstalled, showInstallUI, triggerInstall }
}
