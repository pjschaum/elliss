import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import s from './EllissAI.module.css'

// ─── Suggested prompts per side ──────────────────────────────────────────────
const SUGGESTIONS = {
  give: [
    'What volunteer events are happening this week?',
    'How do I sign up to volunteer?',
    'What organizations need the most help right now?',
    'How do I donate to a local cause?',
  ],
  help: [
    'I need help getting food for my family.',
    'What programs can help me with rent?',
    'How do I apply for BadgerCare?',
    'Are there free classes I can take?',
  ],
}

// ─── Flame icon ──────────────────────────────────────────────────────────────
function FlameIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 6 7 8.5 7 12a5 5 0 0 0 10 0c0-1.5-.5-3-1.5-4.5C14.5 9 14 10 14 11a2 2 0 0 1-4 0c0-2 2-5 2-9z"/>
    </svg>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className={s.typingRow}>
      <div className={s.typingBubble}>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
      </div>
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg, accentColor }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`${s.msgRow} ${isUser ? s.msgRowUser : s.msgRowAI}`}>
      {!isUser && (
        <div className={s.aiAvatar} style={{ background: accentColor }}>
          <FlameIcon size={14} />
        </div>
      )}
      <div
        className={`${s.bubble} ${isUser ? s.bubbleUser : s.bubbleAI}`}
        style={isUser ? { background: accentColor } : {}}
      >
        {msg.content}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function EllissAI({ side, assistanceProfile }) {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [started, setStarted]     = useState(false)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)

  const accentColor = side === 'give' ? 'var(--give)' : 'var(--help-dark)'
  const suggestions = SUGGESTIONS[side] || SUGGESTIONS.help

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when sheet opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  async function sendMessage(text) {
    const userText = text.trim()
    if (!userText || loading) return

    setStarted(true)
    setInput('')
    setError(null)

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Build user context from assistance profile
      const userContext = {
        side,
        primaryGoal:    assistanceProfile?.primaryGoal,
        situations:     assistanceProfile?.situations,
        incomeBracket:  assistanceProfile?.incomeBracket,
      }

      const { data: { session } } = await supabase.auth.getSession()
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

      const res = await fetch(`${supabaseUrl}/functions/v1/elliss-ai`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session?.access_token || anonKey}`,
          'apikey':        anonKey,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          userContext,
        }),
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Request failed')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: json.reply }])
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Elliss AI error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleClear() {
    setMessages([])
    setStarted(false)
    setError(null)
  }

  return (
    <>
      {/* ── Floating action button ── */}
      {!open && (
        <button
          className={s.fab}
          style={{ background: accentColor }}
          onClick={() => setOpen(true)}
          aria-label="Open Elliss AI chat"
        >
          <FlameIcon size={20} />
          <span className={s.fabLabel}>Elliss AI</span>
        </button>
      )}

      {/* ── Chat sheet ── */}
      {open && (
        <div className={s.overlay}>
          <div className={s.sheet}>
            {/* Header */}
            <div className={s.header} style={{ borderBottomColor: accentColor + '33' }}>
              <div className={s.headerLeft}>
                <div className={s.headerAvatar} style={{ background: accentColor }}>
                  <FlameIcon size={16} />
                </div>
                <div>
                  <p className={s.headerTitle}>Elliss AI</p>
                  <p className={s.headerSub}>Your local community guide</p>
                </div>
              </div>
              <div className={s.headerActions}>
                {started && (
                  <button className={s.clearBtn} onClick={handleClear} aria-label="Clear chat">
                    Clear
                  </button>
                )}
                <button className={s.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                  ✕
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className={s.messages}>
              {/* Welcome / suggestions */}
              {!started && (
                <div className={s.welcome}>
                  <div className={s.welcomeAvatar} style={{ background: accentColor }}>
                    <FlameIcon size={22} />
                  </div>
                  <p className={s.welcomeTitle}>Hi, I'm Elliss AI</p>
                  <p className={s.welcomeDesc}>
                    I can help you find {side === 'give'
                      ? 'volunteer events, nonprofits, and ways to give back'
                      : 'resources, programs, courses, and services'} in Rock, Dane, and Walworth County.
                  </p>
                  <div className={s.suggestions}>
                    {suggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        className={s.suggestionChip}
                        style={{ borderColor: accentColor + '55', color: accentColor }}
                        onClick={() => sendMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message history */}
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} accentColor={accentColor} />
              ))}

              {/* Typing indicator */}
              {loading && <TypingIndicator />}

              {/* Error */}
              {error && (
                <div className={s.errorNote}>{error}</div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className={s.inputBar}>
              <textarea
                ref={inputRef}
                className={s.input}
                placeholder="Ask Elliss AI anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={loading}
              />
              <button
                className={s.sendBtn}
                style={{ background: input.trim() && !loading ? accentColor : '#ddd' }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                ↑
              </button>
            </div>

            <p className={s.disclaimer}>
              Elliss AI can make mistakes. Verify important information with official sources.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
