import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM = 'Elliss <hello@elliss.app>'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Brand colors ──────────────────────────────────────────────
const BLUE    = '#324a7d'
const PURPLE  = '#6f4997'
const GREEN   = '#9cbf9f'
const GOLD    = '#f4c04b'
const BG      = '#f4f6fb'
const WHITE   = '#ffffff'
const DARK    = '#1a1a2e'
const MUTED   = '#6b7280'

// ─── Base email wrapper ────────────────────────────────────────
function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elliss</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${BLUE};border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <span style="font-size:26px;">🔥</span>
                <span style="color:${WHITE};font-size:28px;font-weight:700;letter-spacing:-0.5px;">elliss</span>
              </div>
              <p style="color:rgba(255,255,255,0.75);font-size:12px;margin:6px 0 0;letter-spacing:1px;text-transform:uppercase;">kind hearts · better lives</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:${WHITE};padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${WHITE};border-top:1px solid #e8edf5;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="color:${MUTED};font-size:12px;margin:0 0 8px;">
                You're receiving this because you have an Elliss account.
              </p>
              <p style="color:${MUTED};font-size:12px;margin:0;">
                Rock &amp; Dane County, Wisconsin ·
                <a href="https://elliss.app" style="color:${BLUE};text-decoration:none;">elliss.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Template: Welcome ─────────────────────────────────────────
function welcomeTemplate(name: string): string {
  const firstName = name?.split(' ')[0] || 'there'
  return baseTemplate(`
    <h1 style="color:${DARK};font-size:24px;font-weight:700;margin:0 0 8px;">
      Welcome to Elliss, ${firstName}! 🎉
    </h1>
    <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">
      We're glad you're here. Elliss is your one-stop shop for volunteering, local resources, and community in Rock and Dane County.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="background:${BG};border-radius:10px;padding:20px 24px;">
          <p style="color:${DARK};font-size:15px;font-weight:600;margin:0 0 16px;">Here's what you can do:</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="36" valign="top" style="padding-bottom:14px;">
                <div style="width:32px;height:32px;background:${PURPLE};border-radius:8px;text-align:center;line-height:32px;font-size:16px;">💜</div>
              </td>
              <td style="padding-left:12px;padding-bottom:14px;vertical-align:top;">
                <strong style="color:${DARK};font-size:14px;">Give side</strong>
                <p style="color:${MUTED};font-size:13px;margin:2px 0 0;">Find volunteer events, donate to local nonprofits, and connect with your community.</p>
              </td>
            </tr>
            <tr>
              <td width="36" valign="top" style="padding-bottom:4px;">
                <div style="width:32px;height:32px;background:${GREEN};border-radius:8px;text-align:center;line-height:32px;font-size:16px;">🌿</div>
              </td>
              <td style="padding-left:12px;vertical-align:top;">
                <strong style="color:${DARK};font-size:14px;">Help side</strong>
                <p style="color:${MUTED};font-size:13px;margin:2px 0 0;">Access local resources, government programs, free courses, and affordable services.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin:0 0 24px;">
      <a href="https://elliss.app"
         style="display:inline-block;background:${BLUE};color:${WHITE};font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:8px;">
        Open Elliss →
      </a>
    </div>

    <p style="color:${MUTED};font-size:13px;margin:0;text-align:center;">
      Questions? Just reply to this email — we read every message.
    </p>
  `)
}

// ─── Template: Event signup confirmation ───────────────────────
function eventSignupTemplate(name: string, event: {
  title: string
  org: string
  date: string
  time: string
  address?: string
  tier?: number
}): string {
  const firstName = name?.split(' ')[0] || 'there'
  const isPending = event.tier === 3

  const statusColor  = isPending ? '#e65100' : '#2e7d32'
  const statusBg     = isPending ? '#fff3e0' : '#e8f5e9'
  const statusLabel  = isPending ? '📋 Application submitted — pending approval' : '✅ You\'re confirmed!'

  return baseTemplate(`
    <h1 style="color:${DARK};font-size:24px;font-weight:700;margin:0 0 8px;">
      ${isPending ? 'Application submitted!' : 'You\'re signed up!'}
    </h1>
    <p style="color:${MUTED};font-size:14px;margin:0 0 24px;">
      Hi ${firstName}, here are your details for <strong>${event.title}</strong>.
    </p>

    <!-- Status badge -->
    <div style="background:${statusBg};border-radius:8px;padding:12px 16px;margin:0 0 24px;text-align:center;">
      <span style="color:${statusColor};font-size:14px;font-weight:600;">${statusLabel}</span>
    </div>

    <!-- Event card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:10px;margin:0 0 28px;overflow:hidden;">
      <tr>
        <td style="background:${PURPLE};padding:16px 24px;">
          <p style="color:${WHITE};font-size:16px;font-weight:700;margin:0;">${event.title}</p>
          <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">${event.org}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:12px;">
                <span style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Date &amp; Time</span><br/>
                <span style="color:${DARK};font-size:14px;font-weight:600;">📅 ${event.date} · ${event.time}</span>
              </td>
            </tr>
            ${event.address ? `
            <tr>
              <td style="padding-bottom:12px;">
                <span style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Location</span><br/>
                <span style="color:${DARK};font-size:14px;">📍 ${event.address}</span>
              </td>
            </tr>` : ''}
            <tr>
              <td>
                <span style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Organization</span><br/>
                <span style="color:${DARK};font-size:14px;">🏢 ${event.org}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${isPending
      ? `<p style="color:${MUTED};font-size:13px;text-align:center;margin:0 0 24px;">
           ${event.org} will review your application and reach out with next steps.
         </p>`
      : `<p style="color:${MUTED};font-size:13px;text-align:center;margin:0 0 24px;">
           See you there! Check your <strong>Activity tab</strong> in Elliss for updates.
         </p>`
    }

    <div style="text-align:center;">
      <a href="https://elliss.app/give?tab=activity"
         style="display:inline-block;background:${PURPLE};color:${WHITE};font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:8px;">
        View My Activity →
      </a>
    </div>
  `)
}

// ─── Main handler ──────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { type, to, name, data } = await req.json()

    if (!type || !to) {
      return new Response(JSON.stringify({ error: 'Missing required fields: type, to' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    let subject = ''
    let html = ''

    switch (type) {
      case 'welcome':
        subject = `Welcome to Elliss, ${name?.split(' ')[0] || 'there'}! 🎉`
        html = welcomeTemplate(name)
        break

      case 'event_signup_confirmation':
        subject = data?.tier === 3
          ? `Application submitted — ${data?.title}`
          : `You're signed up for ${data?.title}! ✅`
        html = eventSignupTemplate(name, data)
        break

      default:
        return new Response(JSON.stringify({ error: `Unknown notification type: ${type}` }), {
          status: 400,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })

    const result = await res.json()

    if (!res.ok) {
      console.error('Resend error:', result)
      return new Response(JSON.stringify({ error: result }), {
        status: res.status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ id: result.id }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-notification error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
