import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './QuickResources.module.css'
import { UNIVERSAL_SERVICES, AREA_SERVICES } from '../data/quickResourcesData'

// Reverse geocode lat/lng → county string via Nominatim (free, no API key)
async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
  if (!res.ok) return null
  const data = await res.json()
  return data?.address?.county || data?.address?.city || null
}

function ServiceCard({ item, accent }) {
  const phoneHref = `tel:${item.phone.replace(/\D/g, '')}`
  const mapsHref = item.mapsQuery
    ? `https://maps.google.com/?q=${encodeURIComponent(item.mapsQuery)}`
    : item.address
    ? `https://maps.google.com/?q=${encodeURIComponent(item.address)}`
    : null

  return (
    <div className={s.serviceCard}>
      <div className={s.cardMain}>
        <p className={s.serviceName}>{item.name}</p>
        {item.desc && <p className={s.serviceDesc}>{item.desc}</p>}
        {item.address && <p className={s.serviceAddr}>📍 {item.address}</p>}
      </div>
      <div className={s.cardActions}>
        <a
          href={phoneHref}
          className={s.callBtn}
          style={{ background: accent || '#324a7d' }}
        >
          📞 {item.phoneDisplay || item.phone}
        </a>
        {mapsHref && (
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={s.mapBtn}>
            🗺️ Directions
          </a>
        )}
        {item.website && (
          <a href={item.website} target="_blank" rel="noopener noreferrer" className={s.webBtn}>
            🌐 Website
          </a>
        )}
      </div>
    </div>
  )
}

function CategorySection({ category, icon, accent, items }) {
  return (
    <div className={s.categorySection}>
      <div className={s.categoryHeader} style={{ borderColor: accent }}>
        <span className={s.categoryIcon}>{icon}</span>
        <h2 className={s.categoryTitle}>{category}</h2>
      </div>
      <div className={s.cardList}>
        {items.map((item, i) => (
          <ServiceCard key={i} item={item} accent={accent} />
        ))}
      </div>
    </div>
  )
}

export default function QuickResources() {
  const navigate = useNavigate()
  const [locationState, setLocationState] = useState('detecting') // detecting | found | denied | error
  const [areaData, setAreaData] = useState(null)
  const [locationLabel, setLocationLabel] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState('error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const county = await reverseGeocode(latitude, longitude)
          if (county && AREA_SERVICES[county]) {
            setAreaData(AREA_SERVICES[county])
            setLocationLabel(AREA_SERVICES[county].label)
          } else {
            // County detected but no data for it yet
            setLocationLabel(county || 'Your Area')
            setAreaData(null)
          }
          setLocationState('found')
        } catch {
          setLocationState('error')
        }
      },
      () => {
        setLocationState('denied')
      },
      { timeout: 10000 }
    )
  }, [])

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
          ‹ Back
        </button>
        <div className={s.headerText}>
          <h1 className={s.title}>Quick Resources</h1>
          <p className={s.subtitle}>Local services, one tap away.</p>
        </div>
      </div>

      {/* Location badge */}
      <div className={s.locationBar}>
        {locationState === 'detecting' && (
          <span className={s.locationBadge}>📍 Detecting your location…</span>
        )}
        {locationState === 'found' && (
          <span className={`${s.locationBadge} ${s.locationFound}`}>
            📍 Showing services for <strong>{locationLabel}</strong>
          </span>
        )}
        {locationState === 'denied' && (
          <span className={`${s.locationBadge} ${s.locationWarn}`}>
            📍 Location access denied — showing universal resources only
          </span>
        )}
        {locationState === 'error' && (
          <span className={`${s.locationBadge} ${s.locationWarn}`}>
            📍 Couldn't detect location — showing universal resources only
          </span>
        )}
      </div>

      {/* Universal services — always shown */}
      <div className={s.content}>
        {UNIVERSAL_SERVICES.map((cat, i) => (
          <CategorySection key={i} {...cat} />
        ))}

        {/* Area-specific services */}
        {locationState === 'found' && areaData && (
          <>
            <div className={s.areaLabel}>
              <span>Local services for {locationLabel}</span>
            </div>
            {areaData.categories.map((cat, i) => (
              <CategorySection key={i} {...cat} />
            ))}
          </>
        )}

        {locationState === 'found' && !areaData && (
          <div className={s.noAreaCard}>
            <p className={s.noAreaTitle}>We don't have local data for {locationLabel} yet.</p>
            <p className={s.noAreaDesc}>
              Dial <strong>211</strong> to reach a local resource specialist who can connect you
              with services in your area.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className={s.disclaimer}>
          ⚠️ For life-threatening emergencies, always call 911. Phone numbers and addresses are
          provided for reference — verify with the organization for the most current information.
        </p>
      </div>
    </div>
  )
}
