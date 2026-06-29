import { useState, useCallback } from 'react'

const STORAGE_KEY = 'elliss_favorite_orgs'

// Each saved org is:
// { key: string, name: string, initials: string, color: string, category: string | null }
// key:
//   'org-{id}'         — from Donate tab (org has a numeric id in ORGS)
//   'event-{orgName}'  — from Volunteer tab (event.org is a display name string)

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* fail silently */ }
}

export default function useFavoriteOrgs() {
  const [favoriteOrgs, setFavoriteOrgs] = useState(() => loadFavorites())

  const isOrgFavorited = useCallback((key) => {
    return favoriteOrgs.some(o => o.key === key)
  }, [favoriteOrgs])

  const addFavoriteOrg = useCallback((orgData) => {
    // orgData: { key, name, initials, color, category }
    setFavoriteOrgs(prev => {
      if (prev.some(o => o.key === orgData.key)) return prev
      const next = [...prev, orgData]
      persist(next)
      return next
    })
  }, [])

  const removeFavoriteOrg = useCallback((key) => {
    setFavoriteOrgs(prev => {
      const next = prev.filter(o => o.key !== key)
      persist(next)
      return next
    })
  }, [])

  const toggleFavoriteOrg = useCallback((orgData) => {
    // orgData: { key, name, initials, color, category }
    setFavoriteOrgs(prev => {
      const exists = prev.some(o => o.key === orgData.key)
      const next = exists
        ? prev.filter(o => o.key !== orgData.key)
        : [...prev, orgData]
      persist(next)
      return next
    })
  }, [])

  // Build org data shapes from a Donate tab org card
  function orgToFav(org) {
    return {
      key:      `org-${org.id}`,
      name:     org.name,
      initials: org.initials,
      color:    org.color,
      category: org.category,
    }
  }

  // Build org data shapes from a Volunteer tab event card
  function eventOrgToFav(event) {
    return {
      key:      `event-${event.org.replace(/\s+/g, '_')}`,
      name:     event.org,
      initials: event.initials,
      color:    event.color,
      category: null,
    }
  }

  return {
    favoriteOrgs,
    isOrgFavorited,
    addFavoriteOrg,
    removeFavoriteOrg,
    toggleFavoriteOrg,
    orgToFav,
    eventOrgToFav,
  }
}
