import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import styles from '../pages/Interface.module.css'
import c from './CommunityTab.module.css'

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Events', 'Organizations', 'Volunteering', 'General']

const CATEGORY_ICONS = {
  Events:        '📅',
  Organizations: '🏢',
  Volunteering:  '🤝',
  General:       '💬',
}

const CATEGORY_COLORS = {
  Events:        '#f4c04b',
  Organizations: '#6f4997',
  Volunteering:  '#324a7d',
  General:       '#9cbf9f',
}

// Sample posts for when Supabase is not yet set up / user is not logged in
const SAMPLE_POSTS = [
  {
    id: 'sample-1',
    category: 'Events',
    author_name: 'Maria G.',
    author_initials: 'MG',
    author_color: '#6f4997',
    title: 'Rock County Habitat Build Day — July 19',
    body: 'Hey Janesville neighbors! Habitat for Humanity is hosting a community build day on Saturday July 19 at the Summit Ave site. No experience needed — they train you on everything. Lunch is provided. I\'ve done this twice and it\'s one of the most rewarding days you\'ll have. Sign up through their website or come find me and I\'ll pass along the link!',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 14,
    comments: 3,
    is_sample: true,
  },
  {
    id: 'sample-2',
    category: 'Organizations',
    author_name: 'Darnell W.',
    author_initials: 'DW',
    author_color: '#324a7d',
    title: 'Shoutout to ECHO Food Pantry',
    body: 'Just wanted to give a huge thank you to the ECHO Food Pantry team on Center Ave. They helped my family through a really tough stretch last winter with no judgment, just kindness. If you\'re looking to donate time or food, these folks are doing real good in our community. 🙏',
    created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    comments: 7,
    is_sample: true,
  },
  {
    id: 'sample-3',
    category: 'General',
    author_name: 'Teresa K.',
    author_initials: 'TK',
    author_color: '#3d8a74',
    title: 'Does anyone know of after-school programs for teens?',
    body: 'Hi all — I have a 14-year-old who has a lot of energy and I\'m looking for structured after-school activities in the Janesville area. Sports, arts, community service, anything really. He\'s been interested in volunteering but we don\'t know where to start. Any suggestions would be so appreciated!',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    comments: 12,
    is_sample: true,
  },
  {
    id: 'sample-4',
    category: 'Volunteering',
    author_name: 'James P.',
    author_initials: 'JP',
    author_color: '#e03e2d',
    title: 'Looking for volunteers — mobile food pantry route',
    body: 'The Salvation Army is looking for 2-3 volunteers to help with their Wednesday mobile food pantry route in Beloit. It\'s a 3-hour commitment (10am–1pm) and involves loading/unloading and distributing food bags to homebound seniors. Great for anyone who loves direct community impact. DM me or contact the Salvation Army office at (608) 365-4334.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 22,
    comments: 5,
    is_sample: true,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(isoString) {
  const now = new Date()
  const then = new Date(isoString)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1)  return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24)  return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 7)  return `${diffDays}d ago`
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Compose Sheet ───────────────────────────────────────────────────────────

function ComposeSheet({ onClose, onSubmit, userId }) {
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [category, setCategory] = useState('General')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ title: title.trim(), body: body.trim(), category })
      onClose()
    } catch (err) {
      setError('Could not post. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className={c.sheetOverlay} onClick={onClose}>
      <div className={c.sheet} onClick={e => e.stopPropagation()}>
        <div className={c.sheetHeader}>
          <h2 className={c.sheetTitle}>New Post</h2>
          <button className={c.sheetClose} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={c.composeForm}>
          {/* Category */}
          <div className={c.fieldGroup}>
            <label className={c.fieldLabel}>Category</label>
            <div className={c.categoryGrid}>
              {CATEGORIES.filter(cat => cat !== 'All').map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`${c.catOption} ${category === cat ? c.catOptionActive : ''}`}
                  style={category === cat ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
                  onClick={() => setCategory(cat)}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={c.fieldGroup}>
            <label className={c.fieldLabel} htmlFor="post-title">Title</label>
            <input
              id="post-title"
              className={c.titleInput}
              type="text"
              placeholder="Give your post a short headline…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              required
            />
            <span className={c.charCount}>{120 - title.length} remaining</span>
          </div>

          {/* Body */}
          <div className={c.fieldGroup}>
            <label className={c.fieldLabel} htmlFor="post-body">Message</label>
            <textarea
              id="post-body"
              className={c.bodyInput}
              placeholder="Share details, ask a question, or post event info…"
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={5}
              maxLength={2000}
              required
            />
            <span className={c.charCount}>{2000 - body.length} remaining</span>
          </div>

          {!userId && (
            <p className={c.loginNote}>
              ℹ️ You need to be signed in to post. Your post will be saved as a draft.
            </p>
          )}

          {error && <p className={c.errorNote}>{error}</p>}

          <div className={c.composeActions}>
            <button type="button" className={c.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className={c.submitBtn}
              disabled={!title.trim() || !body.trim() || submitting}
            >
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Post Card ───────────────────────────────────────────────────────────────

function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes || 0)

  function handleLike() {
    if (liked) return
    setLiked(true)
    setLocalLikes(n => n + 1)
    onLike?.(post.id)
  }

  return (
    <div className={c.card}>
      <div className={c.cardTop}>
        <div className={c.avatar} style={{ background: post.author_color || '#324a7d' }}>
          {post.author_initials || post.author_name?.slice(0, 2).toUpperCase() || '??'}
        </div>
        <div className={c.cardMeta}>
          <span className={c.authorName}>{post.author_name || 'Community Member'}</span>
          <span className={c.timestamp}>{timeAgo(post.created_at)}</span>
        </div>
        <span
          className={c.categoryChip}
          style={{ background: CATEGORY_COLORS[post.category] || '#9cbf9f' }}
        >
          {CATEGORY_ICONS[post.category] || '💬'} {post.category}
        </span>
      </div>

      {post.title && <h3 className={c.postTitle}>{post.title}</h3>}
      <p className={c.postBody}>{post.body}</p>

      <div className={c.cardFooter}>
        <button
          className={`${c.reactionBtn} ${liked ? c.reactionBtnActive : ''}`}
          onClick={handleLike}
          aria-label={`Like this post (${localLikes} likes)`}
        >
          {liked ? '♥' : '♡'} {localLikes}
        </button>
        <button className={c.commentBtn} aria-label={`${post.comments || 0} comments`}>
          💬 {post.comments || 0}
        </button>
        {post.is_sample && (
          <span className={c.sampleBadge}>Sample post</span>
        )}
      </div>
    </div>
  )
}

// ─── Main CommunityTab ───────────────────────────────────────────────────────

export default function CommunityTab({ userId }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [posts, setPosts]                   = useState(SAMPLE_POSTS)
  const [loading, setLoading]               = useState(false)
  const [showCompose, setShowCompose]       = useState(false)
  const [usingSample, setUsingSample]       = useState(true)

  // Load posts from Supabase if available
  const loadPosts = useCallback(async () => {
    if (!supabase) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50)
      if (!error && data && data.length > 0) {
        setPosts(data)
        setUsingSample(false)
      }
    } catch {
      // Fall through to sample posts
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  async function handleSubmitPost({ title, body, category }) {
    if (!supabase || !userId) {
      // Optimistic local add (not persisted — user needs to sign in)
      const newPost = {
        id: `local-${Date.now()}`,
        category,
        author_name: 'You',
        author_initials: 'YO',
        author_color: '#324a7d',
        title,
        body,
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        is_sample: true,
      }
      setPosts(prev => [newPost, ...prev])
      return
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{
        user_id: userId,
        category,
        title,
        body,
        status: 'published',
      }])
      .select()
      .single()

    if (error) throw error

    setPosts(prev => [data, ...prev])
    setUsingSample(false)
  }

  async function handleLike(postId) {
    if (!supabase || postId.startsWith('sample-') || postId.startsWith('local-')) return
    try {
      await supabase.rpc('increment_post_likes', { post_id: postId })
    } catch {
      // Non-critical
    }
  }

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <>
      <div className={c.headerRow}>
        <div>
          <h1 className={styles.title}>Community</h1>
          <p className={styles.subtitle}>Share events, ask questions, and connect locally.</p>
        </div>
        <button className={c.composeBtn} onClick={() => setShowCompose(true)} aria-label="New post">
          ✏️ Post
        </button>
      </div>

      {/* Category filter pills */}
      <div className={c.pills}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${c.pill} ${activeCategory === cat ? c.pillActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat !== 'All' && <span>{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {usingSample && (
        <div className={c.sampleNote}>
          📝 These are example posts. Sign in to see and join real community conversations.
        </div>
      )}

      {loading ? (
        <div className={c.loading}>Loading posts…</div>
      ) : filtered.length === 0 ? (
        <div className={c.empty}>
          <p className={c.emptyIcon}>💬</p>
          <p className={c.emptyTitle}>No posts yet in {activeCategory}</p>
          <p className={c.emptyDesc}>Be the first to start a conversation.</p>
          <button className={c.emptyComposeBtn} onClick={() => setShowCompose(true)}>
            ✏️ Write a Post
          </button>
        </div>
      ) : (
        <div className={c.feed}>
          {filtered.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}

      {showCompose && (
        <ComposeSheet
          onClose={() => setShowCompose(false)}
          onSubmit={handleSubmitPost}
          userId={userId}
        />
      )}
    </>
  )
}
