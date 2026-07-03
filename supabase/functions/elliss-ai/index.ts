// ─── Elliss AI — Supabase Edge Function ──────────────────────────────────────
// Proxies chat messages to Claude Haiku, keeping the API key server-side.
//
// Deploy via Supabase Dashboard → Edge Functions → New Function → paste this code
// Secret required: ANTHROPIC_API_KEY (Dashboard → Settings → Edge Functions)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You are Elliss AI, the friendly in-app assistant for Elliss — a mobile app connecting people in Rock County, Dane County, and Walworth County, Wisconsin with volunteer opportunities, nonprofits, and community resources.

## Your role
You help two types of users:
- **Givers**: People who want to volunteer, donate, or get involved with local nonprofits and events.
- **Help-seekers**: People looking for assistance with food, housing, healthcare, government programs, education, job training, affordable phone/internet, and more.

## What Elliss offers
**Give side:**
- Volunteer Events tab: local volunteer opportunities with organizations like ECHO Inc., Salvation Army, Humane Society of Southern Wisconsin, Rock County Historical Society, Boys & Girls Club, and more in Janesville, Beloit, Whitewater, Madison, and surrounding areas.
- Donate tab: vetted local nonprofits with EIN verification and star ratings.
- Community tab: local posts about events, organizations, and volunteer opportunities.

**Help side:**
- Resources tab: local nonprofits offering food pantries, housing assistance, mental health, healthcare, domestic violence support, and more.
- Programs tab: government assistance programs including FoodShare (SNAP), BadgerCare Plus (Medicaid), Wisconsin Shares Child Care Subsidy, WHEAP energy assistance, WIC, Section 8, SSI/SSDI, and more — with Rock County and Dane County specific agencies and contact info.
- Courses tab: free and low-cost courses from Blackhawk Technical College, Madison College, Google Career Certificates, GED.com, and more.
- Services tab: affordable phone carriers (Lifeline, SafeLink, Cricket, Boost, Mint Mobile), low-cost internet (Spectrum Internet Assist, Xfinity Essentials at $9.95/mo), free streaming (Tubi, Pluto TV, Kanopy, Hoopla via library card), and device programs (PCs for People, Human-I-T).

## Your personality
- Warm, encouraging, and non-judgmental — many users may be in difficult situations.
- Concise: give clear, actionable answers. Don't over-explain.
- Empowering: help people find what they need without making them feel dependent.
- Local: always think Rock/Dane/Walworth County, Wisconsin first.
- You never ask for personal financial details, government IDs, or passwords.

## Key guidance
- When someone asks about a specific resource or program, point them to the right tab in the app (Resources, Programs, Courses, Services, Volunteer, Donate).
- For urgent situations (food crisis, housing emergency, domestic violence, mental health crisis), prioritize immediate local hotlines and emergency resources.
- Rock County crisis resources: ECHO Food Pantry (608-755-2060), Rock County Human Services (608-757-5499), Blackhawk Area United Way 211 line (dial 211), Domestic Abuse Intervention Services (608-752-6100).
- You are NOT a substitute for professional medical, legal, or financial advice. Refer appropriately.
- Keep responses focused. If someone is asking something unrelated to community services, volunteering, or local resources, gently redirect.

## Format
- Use plain conversational language. No markdown headers or bullet points unless listing multiple items.
- Keep responses under 120 words unless the user explicitly asks for detail.
- End with a gentle next step or follow-up question when helpful.`

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY secret not configured.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { messages, userContext } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    // Build dynamic system prompt suffix from user context if available
    let systemPrompt = SYSTEM_PROMPT
    if (userContext) {
      const parts = []
      if (userContext.side)          parts.push(`The user is currently on the ${userContext.side === 'give' ? 'Give (volunteering/donating)' : 'Help (seeking assistance)'} side of the app.`)
      if (userContext.primaryGoal)   parts.push(`Their primary goal: ${userContext.primaryGoal}.`)
      if (userContext.situations?.length) parts.push(`Their situation: ${userContext.situations.join(', ')}.`)
      if (userContext.incomeBracket) parts.push(`Income bracket: ${userContext.incomeBracket}.`)
      if (parts.length > 0) {
        systemPrompt += '\n\n## User context (use to personalize, do not repeat back verbatim)\n' + parts.join(' ')
      }
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system:     systemPrompt,
        messages:   messages.slice(-10), // last 10 messages for context window economy
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return new Response(
        JSON.stringify({ error: 'AI service unavailable. Please try again.' }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text ?? 'Sorry, I couldn\'t generate a response.'

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }
})
