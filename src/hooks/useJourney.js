import { useState, useCallback } from 'react'

const STORAGE_KEY = 'elliss_journey'

// item shape: { id: number, status: 'in_progress' | 'completed', addedAt: string }
// journey shape: { resources: [...], programs: [...], courses: [...] }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { resources: [], programs: [], courses: [] }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function journeyScore(state) {
  let score = 0
  for (const r of state.resources) {
    score += r.status === 'completed' ? 3 : 1
  }
  for (const p of state.programs) {
    score += p.status === 'completed' ? 5 : 2
  }
  for (const c of state.courses) {
    score += c.status === 'completed' ? 8 : 3
  }
  return score
}

function journeyLabel(score) {
  if (score === 0) return 'Your journey starts here'
  if (score < 5) return 'Taking the first steps'
  if (score < 12) return 'Building momentum'
  if (score < 25) return 'Making it happen'
  return 'Changing your story'
}

function doorsOpened(state) {
  return (
    state.resources.filter(r => r.status === 'completed').length +
    state.programs.filter(p => p.status === 'completed').length +
    state.courses.filter(c => c.status === 'completed').length
  )
}

export default function useJourney() {
  const [journey, setJourney] = useState(() => load())

  const updateJourney = useCallback((updater) => {
    setJourney(prev => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [])

  const addItem = useCallback((type, id) => {
    updateJourney(prev => {
      const list = prev[type] || []
      if (list.some(item => item.id === id)) return prev // already tracked
      return {
        ...prev,
        [type]: [...list, { id, status: 'in_progress', addedAt: new Date().toISOString() }],
      }
    })
  }, [updateJourney])

  const updateStatus = useCallback((type, id, status) => {
    updateJourney(prev => ({
      ...prev,
      [type]: (prev[type] || []).map(item =>
        item.id === id ? { ...item, status } : item
      ),
    }))
  }, [updateJourney])

  const removeItem = useCallback((type, id) => {
    updateJourney(prev => ({
      ...prev,
      [type]: (prev[type] || []).filter(item => item.id !== id),
    }))
  }, [updateJourney])

  const getItem = useCallback((type, id) => {
    return (journey[type] || []).find(item => item.id === id) || null
  }, [journey])

  const isTracked = useCallback((type, id) => {
    return (journey[type] || []).some(item => item.id === id)
  }, [journey])

  const score = journeyScore(journey)
  const label = journeyLabel(score)
  const opened = doorsOpened(journey)

  return {
    journey,
    score,
    label,
    doorsOpened: opened,
    addItem,
    updateStatus,
    removeItem,
    getItem,
    isTracked,
  }
}
