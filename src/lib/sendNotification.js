import { supabase } from './supabase'

/**
 * Call the send-notification Edge Function.
 *
 * @param {'welcome'|'event_signup_confirmation'} type
 * @param {string} to   — recipient email address
 * @param {string} name — recipient full name
 * @param {object} [data] — extra payload for the template (event details, etc.)
 */
export async function sendNotification(type, to, name, data = {}) {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type, to, name, data }),
      }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.warn('sendNotification failed:', err)
    }
  } catch (err) {
    // Non-blocking — email failure should never break the UI flow
    console.warn('sendNotification error:', err)
  }
}
