/**
 * useAssistanceProfile
 *
 * Manages the user's Assistance Profile — the intake answers that power
 * smart ranking on the Help side (resources, programs, courses).
 *
 * Storage strategy:
 *   - localStorage ('elliss_assistance_profile') → instant, works without login
 *   - Supabase profiles table (ap_* columns) → persists across devices when signed in
 *
 * On mount: load from localStorage immediately (no flash), then attempt
 * a Supabase sync if the user is logged in (Supabase wins if both exist
 * and Supabase version is more complete).
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const LS_KEY = 'elliss_assistance_profile'

const EMPTY_PROFILE = {
  forWhom:      null,   // 'myself'|'my_family'|'my_children'|'senior_family_member'|'someone_else'
  situations:   [],     // string[] of specialized tags
  educationLevel: null, // 'no_hs'|'hs_diploma'|'college'|'graduate'
  incomeBracket: null,  // 'under_2k'|'2k_4k'|'4k_6k'|'over_6k'|'prefer_not'
  primaryGoal:  null,   // 'immediate_help'|'programs'|'skills'|'all'
  completed:    false,
  skipped:      false,
  completedAt:  null,
}

function readLocalProfile() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) }
  } catch {
    return null
  }
}

function writeLocalProfile(profile) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(profile))
  } catch { /* storage quota exceeded — ignore */ }
}

async function loadSupabaseProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('ap_for_whom,ap_situations,ap_education,ap_income,ap_primary_goal,ap_completed,ap_skipped,ap_completed_at')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  if (!data.ap_for_whom && !data.ap_situations?.length) return null // never filled in
  return {
    forWhom:        data.ap_for_whom,
    situations:     data.ap_situations || [],
    educationLevel: data.ap_education,
    incomeBracket:  data.ap_income,
    primaryGoal:    data.ap_primary_goal,
    completed:      data.ap_completed || false,
    skipped:        data.ap_skipped   || false,
    completedAt:    data.ap_completed_at,
  }
}

async function saveSupabaseProfile(userId, profile, language) {
  await supabase
    .from('profiles')
    .update({
      ap_for_whom:     profile.forWhom,
      ap_situations:   profile.situations,
      ap_education:    profile.educationLevel,
      ap_income:       profile.incomeBracket,
      ap_primary_goal: profile.primaryGoal,
      ap_language:     language || 'en',
      ap_completed:    profile.completed,
      ap_skipped:      profile.skipped,
      ap_completed_at: profile.completedAt,
    })
    .eq('id', userId)
}

export default function useAssistanceProfile() {
  const [profile, setProfile]     = useState(() => readLocalProfile() || { ...EMPTY_PROFILE })
  const [userId,  setUserId]      = useState(null)
  const [synced,  setSynced]      = useState(false)

  // On mount: get current user + attempt Supabase sync
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setSynced(true); return }
      setUserId(user.id)
      loadSupabaseProfile(user.id).then(remote => {
        if (remote && (remote.completed || remote.skipped)) {
          // Remote has a finished profile — use it as the source of truth
          setProfile(remote)
          writeLocalProfile(remote)
        }
        setSynced(true)
      })
    })
  }, [])

  // Whether to show the intake sheet:
  // Show if profile is neither completed nor skipped.
  const shouldShowIntake = synced && !profile.completed && !profile.skipped

  const saveProfile = useCallback(async (updates) => {
    const language = localStorage.getItem('elliss_language') || 'en'
    const next = { ...profile, ...updates }
    setProfile(next)
    writeLocalProfile(next)
    if (userId) {
      await saveSupabaseProfile(userId, next, language)
    }
  }, [profile, userId])

  const completeProfile = useCallback(async (finalAnswers) => {
    const completed = {
      ...profile,
      ...finalAnswers,
      completed:   true,
      skipped:     false,
      completedAt: new Date().toISOString(),
    }
    setProfile(completed)
    writeLocalProfile(completed)
    if (userId) {
      const language = localStorage.getItem('elliss_language') || 'en'
      await saveSupabaseProfile(userId, completed, language)
    }
  }, [profile, userId])

  const skipProfile = useCallback(async () => {
    const skipped = { ...profile, skipped: true, completed: false }
    setProfile(skipped)
    writeLocalProfile(skipped)
    if (userId) {
      await supabase.from('profiles').update({ ap_skipped: true }).eq('id', userId)
    }
  }, [profile, userId])

  const resetProfile = useCallback(async () => {
    const empty = { ...EMPTY_PROFILE }
    setProfile(empty)
    writeLocalProfile(empty)
    if (userId) {
      await supabase.from('profiles').update({
        ap_for_whom: null, ap_situations: [], ap_education: null,
        ap_income: null, ap_primary_goal: null,
        ap_completed: false, ap_skipped: false, ap_completed_at: null,
      }).eq('id', userId)
    }
  }, [userId])

  return {
    profile,
    synced,
    shouldShowIntake,
    saveProfile,
    completeProfile,
    skipProfile,
    resetProfile,
  }
}
