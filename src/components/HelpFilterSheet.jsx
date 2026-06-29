import f from './HelpFilterSheet.module.css'
import s from './Sheet.module.css'

// ─── Filter config ────────────────────────────────────────────
export const AGE_OPTIONS = [
  { key: 'children', label: 'Children (0–12)' },
  { key: 'teens',    label: 'Teens (13–17)' },
  { key: 'adults',   label: 'Adults (18–64)' },
  { key: 'seniors',  label: 'Seniors (65+)' },
]

export const SPECIALIZED_OPTIONS = [
  { key: 'veterans',          label: 'Veterans & Military' },
  { key: 'disabilities',      label: 'People with Disabilities' },
  { key: 'women',             label: 'Women' },
  { key: 'lgbtq',             label: 'LGBTQ+' },
  { key: 'immigrants',        label: 'Immigrants & Refugees' },
  { key: 'single_parents',    label: 'Single Parents' },
  { key: 'homeless',          label: 'Experiencing Homelessness' },
  { key: 'pregnant',          label: 'Pregnant / Postpartum' },
  { key: 'justice_involved',  label: 'Justice-Involved' },
]

export const COMMUNITY_OPTIONS = [
  { key: 'bipoc',    label: 'BIPOC' },
  { key: 'hispanic', label: 'Hispanic / Latino' },
  { key: 'black',    label: 'Black / African American' },
  { key: 'asian',    label: 'Asian / Pacific Islander' },
  { key: 'native',   label: 'Native American / Indigenous' },
]

export const INCOME_OPTIONS = [
  { key: 'low_income', label: 'Income-based programs' },
  { key: 'any',        label: 'No income requirement' },
]

// ─── Empty state helper ───────────────────────────────────────
export const EMPTY_FILTERS = {
  ageGroups:   [],
  specialized: [],
  community:   [],
  income:      [],
}

export function countActiveFilters(filters) {
  return (
    filters.ageGroups.length +
    filters.specialized.length +
    filters.community.length +
    filters.income.length
  )
}

// ─── Filter logic ─────────────────────────────────────────────
export function applyHelpFilters(items, activeFilters) {
  const { ageGroups, specialized, community, income } = activeFilters
  const hasFilters = ageGroups.length || specialized.length || community.length || income.length
  if (!hasFilters) return items

  return items.filter(item => {
    const fi = item.filters
    if (!fi) return true

    // Age: 'all' string means serves everyone; array means specific groups
    if (ageGroups.length > 0) {
      const itemAges = fi.ageGroups
      if (itemAges !== 'all' && !ageGroups.some(a => itemAges.includes(a))) return false
    }

    // Specialized: item must serve at least one selected population
    if (specialized.length > 0) {
      const itemSpec = fi.specialized || []
      if (!specialized.some(s => itemSpec.includes(s))) return false
    }

    // Community: if item has specific communities, at least one must match
    // If item has empty community array, it's open to all → always passes
    if (community.length > 0) {
      const itemComm = fi.community || []
      if (itemComm.length > 0 && !community.some(c => itemComm.includes(c))) return false
    }

    // Income: match on exactly selected income keys
    if (income.length > 0) {
      const itemIncome = fi.income || 'any'
      if (!income.includes(itemIncome)) return false
    }

    return true
  })
}

// ─── Section heading ──────────────────────────────────────────
function FilterSection({ title, children }) {
  return (
    <div className={f.section}>
      <p className={f.sectionTitle}>{title}</p>
      <div className={f.chips}>{children}</div>
    </div>
  )
}

function FilterChip({ label, active, onToggle }) {
  return (
    <button
      className={`${f.chip} ${active ? f.chipActive : ''}`}
      onClick={onToggle}
    >
      {active && <span className={f.checkmark}>✓ </span>}
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function HelpFilterSheet({ filters, onChange, resultCount, onClose }) {
  function toggle(group, key) {
    const current = filters[group]
    const updated = current.includes(key)
      ? current.filter(k => k !== key)
      : [...current, key]
    onChange({ ...filters, [group]: updated })
  }

  function clearAll() {
    onChange({ ...EMPTY_FILTERS })
  }

  const totalActive = countActiveFilters(filters)

  return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label="Filter options">
        <div className={s.handle} />

        <div className={s.header}>
          <h2 className={s.title}>Filter</h2>
          <div className={f.headerActions}>
            {totalActive > 0 && (
              <button className={f.clearBtn} onClick={clearAll}>Clear all</button>
            )}
            <button className={s.closeBtn} onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        <div className={s.body}>

          <FilterSection title="Age group">
            {AGE_OPTIONS.map(o => (
              <FilterChip
                key={o.key}
                label={o.label}
                active={filters.ageGroups.includes(o.key)}
                onToggle={() => toggle('ageGroups', o.key)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Specialized for">
            {SPECIALIZED_OPTIONS.map(o => (
              <FilterChip
                key={o.key}
                label={o.label}
                active={filters.specialized.includes(o.key)}
                onToggle={() => toggle('specialized', o.key)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Community">
            {COMMUNITY_OPTIONS.map(o => (
              <FilterChip
                key={o.key}
                label={o.label}
                active={filters.community.includes(o.key)}
                onToggle={() => toggle('community', o.key)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Income eligibility">
            {INCOME_OPTIONS.map(o => (
              <FilterChip
                key={o.key}
                label={o.label}
                active={filters.income.includes(o.key)}
                onToggle={() => toggle('income', o.key)}
              />
            ))}
          </FilterSection>

        </div>

        <div className={s.footer}>
          <button className={f.showResultsBtn} onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </>
  )
}
