import { useState } from 'react'
import { SERVICES } from '../data/services'
import styles from '../pages/Interface.module.css'
import s from './ServicesTab.module.css'

const CATEGORIES = ['All', 'Phone', 'Internet', 'Streaming', 'Devices']

const CATEGORY_ICONS = {
  Phone:     '📱',
  Internet:  '🌐',
  Streaming: '🎬',
  Devices:   '💻',
}

const CATEGORY_DESCRIPTIONS = {
  All:       'Affordable connectivity options for phone, internet, streaming, and devices.',
  Phone:     'Free and low-cost cell phone plans, including Lifeline-approved carriers.',
  Internet:  'Low-cost home internet programs and free Wi-Fi access points.',
  Streaming: 'Free ad-supported or library-card streaming services.',
  Devices:   'Refurbished computers, tablets, and free device access.',
}

export default function ServicesTab() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = SERVICES.filter(svc => {
    const matchesCat = activeCategory === 'All' || svc.category === activeCategory
    const q = query.toLowerCase()
    const matchesQuery =
      q === '' ||
      svc.name.toLowerCase().includes(q) ||
      svc.provider.toLowerCase().includes(q) ||
      svc.tagline.toLowerCase().includes(q) ||
      svc.desc.toLowerCase().includes(q) ||
      svc.tags.some(t => t.toLowerCase().includes(q))
    return matchesCat && matchesQuery
  })

  return (
    <>
      <h1 className={styles.title}>Affordable Services</h1>
      <p className={styles.subtitle}>
        {CATEGORY_DESCRIPTIONS[activeCategory]}
      </p>

      {/* Search */}
      <div className={s.searchRow}>
        <span className={s.searchIcon}>🔍</span>
        <input
          className={s.searchInput}
          type="text"
          placeholder="Search phone, internet, streaming…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={s.clearBtn} onClick={() => setQuery('')} aria-label="Clear">✕</button>
        )}
      </div>

      {/* Category pills */}
      <div className={s.pills}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${s.pill} ${activeCategory === cat ? s.pillActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat !== 'All' && <span className={s.pillIcon}>{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      <p className={s.count}>{filtered.length} {filtered.length === 1 ? 'service' : 'services'} available</p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyIcon}>🔎</p>
          <p className={s.emptyTitle}>No results</p>
          <p className={s.emptyDesc}>Try a different search or category.</p>
        </div>
      ) : (
        <div className={s.list}>
          {filtered.map(svc => {
            const isOpen = expanded === svc.id
            return (
              <div key={svc.id} className={`${s.card} ${isOpen ? s.cardOpen : ''}`}>
                {/* Card header — always visible */}
                <div className={s.cardTop}>
                  <div className={s.logo} style={{ background: svc.color }}>
                    {svc.initials}
                  </div>
                  <div className={s.cardMeta}>
                    <div className={s.cardTitleRow}>
                      <span className={s.cardName}>{svc.name}</span>
                      <span className={s.costBadge}>{svc.costBadge}</span>
                    </div>
                    <p className={s.tagline}>{svc.tagline}</p>
                    <div className={s.tagRow}>
                      <span className={s.categoryPill}>{CATEGORY_ICONS[svc.category]} {svc.category}</span>
                      {svc.tags.slice(0, 2).map(t => (
                        <span key={t} className={s.tag}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expand/collapse body */}
                <p className={s.desc}>{svc.desc}</p>

                {isOpen && (
                  <div className={s.details}>
                    <div className={s.detailSection}>
                      <span className={s.detailLabel}>Who qualifies</span>
                      <p className={s.detailText}>{svc.eligibility}</p>
                    </div>
                    <div className={s.detailSection}>
                      <span className={s.detailLabel}>How to apply</span>
                      <p className={s.detailText}>{svc.howToApply}</p>
                    </div>
                    {svc.features && (
                      <div className={s.detailSection}>
                        <span className={s.detailLabel}>What's included</span>
                        <ul className={s.featureList}>
                          {svc.features.map(f => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {svc.availability && (
                      <div className={s.detailSection}>
                        <span className={s.detailLabel}>Availability</span>
                        <p className={s.detailText}>📍 {svc.availability}</p>
                      </div>
                    )}
                    {svc.impact && (
                      <div className={s.impactBanner}>
                        💚 {svc.impact}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer actions */}
                <div className={s.cardFooter}>
                  <button
                    className={s.expandBtn}
                    onClick={() => setExpanded(isOpen ? null : svc.id)}
                  >
                    {isOpen ? '▲ Less info' : '▾ More info'}
                  </button>
                  <div className={s.actions}>
                    {svc.phone && (
                      <a href={`tel:${svc.phone}`} className={s.callBtn}>
                        📞 Call
                      </a>
                    )}
                    {svc.website && (
                      <a
                        href={svc.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.learnBtn}
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
