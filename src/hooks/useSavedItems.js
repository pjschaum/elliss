import { useState, useCallback } from 'react'
import { RESOURCES } from '../data/resources'
import { PROGRAMS } from '../data/programs'
import { COURSES } from '../data/courses'

const STORAGE_KEY = 'elliss_saved_items'

// Returns 'YYYY-MM-DD' for today
function today() {
  return new Date().toISOString().slice(0, 10)
}

// Returns the "expiry" date for a saved item — the earlier of:
//   • applicationDeadline / registrationDeadline  (must act before this date)
//   • startDate on a course (no point registering after it starts)
// Returns null if the item has no deadline (save it forever until user removes)
function getItemDeadline(type, id) {
  if (type === 'resource') {
    const item = RESOURCES.find(r => r.id === id)
    return item?.applicationDeadline ?? null
  }
  if (type === 'program') {
    const item = PROGRAMS.find(p => p.id === id)
    return item?.applicationDeadline ?? null
  }
  if (type === 'course') {
    const item = COURSES.find(c => c.id === id)
    const reg = item?.registrationDeadline ?? null
    const start = item?.startDate ?? null
    // Use whichever is earlier (and non-null)
    if (reg && start) return reg < start ? reg : start
    return reg ?? start
  }
  return null
}

// Read from localStorage, strip any items whose deadline has passed
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : { resources: [], programs: [], courses: [] }
    const t = today()

    // Auto-remove expired items
    const clean = {
      resources: (data.resources || []).filter(id => {
        const d = getItemDeadline('resource', id)
        return !d || d >= t
      }),
      programs: (data.programs || []).filter(id => {
        const d = getItemDeadline('program', id)
        return !d || d >= t
      }),
      courses: (data.courses || []).filter(id => {
        const d = getItemDeadline('course', id)
        return !d || d >= t
      }),
    }

    // Write cleaned version back if anything was removed
    if (
      clean.resources.length !== (data.resources || []).length ||
      clean.programs.length  !== (data.programs  || []).length ||
      clean.courses.length   !== (data.courses   || []).length
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
    }

    return clean
  } catch {
    return { resources: [], programs: [], courses: [] }
  }
}

function persist(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* storage full / private mode — fail silently */ }
}

// type: 'resource' | 'program' | 'course'
// Returns the plural key used in state
function pluralKey(type) {
  return type === 'resource' ? 'resources'
       : type === 'program'  ? 'programs'
       : 'courses'
}

export default function useSavedItems() {
  const [saved, setSaved] = useState(() => loadSaved())

  const saveItem = useCallback((type, id) => {
    setSaved(prev => {
      const key = pluralKey(type)
      if (prev[key].includes(id)) return prev
      const next = { ...prev, [key]: [...prev[key], id] }
      persist(next)
      return next
    })
  }, [])

  const unsaveItem = useCallback((type, id) => {
    setSaved(prev => {
      const key = pluralKey(type)
      const next = { ...prev, [key]: prev[key].filter(i => i !== id) }
      persist(next)
      return next
    })
  }, [])

  const toggleSaved = useCallback((type, id) => {
    setSaved(prev => {
      const key = pluralKey(type)
      const isSaved = prev[key].includes(id)
      const next = isSaved
        ? { ...prev, [key]: prev[key].filter(i => i !== id) }
        : { ...prev, [key]: [...prev[key], id] }
      persist(next)
      return next
    })
  }, [])

  const isItemSaved = useCallback((type, id) => {
    return saved[pluralKey(type)].includes(id)
  }, [saved])

  // Returns full item objects for the Account screen
  const savedResources = saved.resources.map(id => RESOURCES.find(r => r.id === id)).filter(Boolean)
  const savedPrograms  = saved.programs.map(id  => PROGRAMS.find(p => p.id === id)).filter(Boolean)
  const savedCourses   = saved.courses.map(id   => COURSES.find(c => c.id === id)).filter(Boolean)

  return {
    saved,
    savedResources,
    savedPrograms,
    savedCourses,
    saveItem,
    unsaveItem,
    toggleSaved,
    isItemSaved,
  }
}
