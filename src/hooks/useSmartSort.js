/**
 * useSmartSort
 *
 * Scores and re-sorts Help-side items (resources, programs, courses)
 * using the user's Assistance Profile. Items with no profile or an
 * incomplete profile are returned in their original order.
 *
 * Scoring (max 100 pts):
 *   forWhom  → ageGroups match  (0–25)
 *   situations → specialized match (0–35, 15 pts each, capped)
 *   incomeBracket → income field match (0–20)
 *   primaryGoal → item type match (0–15)
 *   educationLevel → course level match, courses only (0–5 bonus)
 *
 * @param {object[]} items        — already filtered list
 * @param {object}   profile      — from useAssistanceProfile().profile
 * @param {'resource'|'program'|'course'} type
 * @returns {{ sorted: object[], isPersonalized: boolean }}
 *   sorted  — items ordered by descending score (ties preserve original order)
 *             each item gets a `_score` property for badge rendering
 *   isPersonalized — true when profile is complete and at least one item scored > 0
 */

// Maps forWhom values to the ageGroup tags they signal
const FOR_WHOM_AGES = {
  myself:               ['adults'],
  my_family:            ['adults', 'children', 'teens'],
  my_children:          ['children', 'teens'],
  senior_family_member: ['seniors'],
  someone_else:         [],
}

function scoreItem(item, profile, type) {
  const f = item.filters || {}
  let score = 0

  // ── 1. forWhom → ageGroups (0–25) ──────────────────────────
  const rawAgeGroups = f.ageGroups
  const coversAll    = rawAgeGroups === 'all' || (Array.isArray(rawAgeGroups) && rawAgeGroups.includes('all'))
  const ageGroups    = coversAll ? ['all'] : (Array.isArray(rawAgeGroups) ? rawAgeGroups : [])
  const targetAges   = FOR_WHOM_AGES[profile.forWhom] || []

  if (coversAll) {
    score += 10  // serves everyone — mild signal
  } else if (targetAges.length && targetAges.some(a => ageGroups.includes(a))) {
    score += 25  // direct age-group match
  }

  // ── 2. situations → specialized (0–35, 15 pts each) ────────
  const itemSpecialized   = Array.isArray(f.specialized) ? f.specialized : []
  const profileSituations = Array.isArray(profile.situations) ? profile.situations : []
  const situationMatches  = profileSituations.filter(s => itemSpecialized.includes(s))
  score += Math.min(35, situationMatches.length * 15)

  // ── 3. incomeBracket → income field (0–20) ──────────────────
  if (profile.incomeBracket && profile.incomeBracket !== 'prefer_not') {
    const isLowIncome = ['under_2k', '2k_4k'].includes(profile.incomeBracket)
    if (isLowIncome && f.income === 'low_income') {
      score += 20  // low-income user, low-income resource
    } else if (isLowIncome && f.income === 'any') {
      score += 8   // resource is accessible to all incomes
    } else if (!isLowIncome && f.income === 'any') {
      score += 12  // higher income, resource still fits
    }
    // low-income resource for non-low-income user: no penalty, just no bonus
  }

  // ── 4. primaryGoal → item type (0–15) ───────────────────────
  const GOAL_TYPE = {
    immediate_help: 'resource',
    programs:       'program',
    skills:         'course',
    all:            null,
  }
  const preferredType = GOAL_TYPE[profile.primaryGoal]
  if (preferredType === type) {
    score += 15
  } else if (!preferredType) {
    score += 5   // 'all' — small boost to everything
  }

  // ── 5. educationLevel → course relevance bonus (0–5) ────────
  if (type === 'course' && profile.educationLevel) {
    const tags = item.category?.toLowerCase() || ''
    const name = item.name?.toLowerCase() || ''
    const isGED     = name.includes('ged') || name.includes('literacy') || tags.includes('adult ed')
    const isEntry   = tags.includes('workforce') || tags.includes('trade') || name.includes('certificate')
    const isAdv     = tags.includes('technology') || tags.includes('business') || tags.includes('healthcare')

    if (profile.educationLevel === 'no_hs' && isGED) score += 5
    if (profile.educationLevel === 'hs_diploma' && (isEntry || isGED)) score += 5
    if (['college', 'graduate'].includes(profile.educationLevel) && isAdv) score += 5
  }

  return score
}

export default function useSmartSort(items, profile, type) {
  if (!profile?.completed || !items?.length) {
    return { sorted: items, isPersonalized: false }
  }

  const scored = items.map((item, originalIndex) => ({
    item,
    originalIndex,
    score: scoreItem(item, profile, type),
  }))

  // Stable descending sort
  scored.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.originalIndex - b.originalIndex
  )

  const isPersonalized = scored.some(({ score }) => score > 0)

  return {
    sorted: scored.map(({ item, score }) => ({ ...item, _score: score })),
    isPersonalized,
  }
}

/** Threshold above which a card shows a "For you" badge */
export const RECOMMENDED_THRESHOLD = 25
