import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import h from './Help.module.css'
import BottomNav from '../components/BottomNav'

/* ════════════════════════════════
   RESOURCES TAB
   ════════════════════════════════ */

const RESOURCE_CATS = [
  'All', 'Food & Meals', 'Housing & Shelter', 'Healthcare',
  'Mental Health', 'Clothing', 'Transportation', 'Legal Aid',
  'Child Care', 'Senior Services', 'Financial Aid', 'Disability',
]

const RESOURCES = [
  {
    id: 1,
    org: 'Greater Chicago Food Depository',
    initials: 'GC',
    color: '#1D9E75',
    category: 'Food & Meals',
    desc: 'Access to 700+ food pantries, soup kitchens, and meal programs across Chicagoland. No income verification required at many sites.',
    detail: 'Open Mon–Sat · Multiple locations',
    free: true,
  },
  {
    id: 2,
    org: 'Chicago Housing Authority',
    initials: 'CH',
    color: '#1565C0',
    category: 'Housing & Shelter',
    desc: 'Emergency shelter placement, housing vouchers, and transitional housing programs for individuals and families in need.',
    detail: 'Call 312-742-8500 for intake',
    free: true,
  },
  {
    id: 3,
    org: 'Chicago Free Clinic',
    initials: 'CF',
    color: '#C62828',
    category: 'Healthcare',
    desc: 'Free medical, dental, vision, and mental health services for uninsured and underinsured adults in the Chicago area.',
    detail: 'Walk-ins welcome · Evenings & weekends',
    free: true,
  },
  {
    id: 4,
    org: 'NAMI Chicago',
    initials: 'NA',
    color: '#6A1B9A',
    category: 'Mental Health',
    desc: 'Free mental health support groups, education programs, crisis counseling referrals, and community resources.',
    detail: 'Helpline: 833-626-4244',
    free: true,
  },
  {
    id: 5,
    org: 'Chicago ReadyMade',
    initials: 'CR',
    color: '#E07B2A',
    category: 'Clothing',
    desc: 'Free clothing boutique providing professional attire, everyday wear, and school uniforms for adults and children.',
    detail: 'By appointment · Tues–Sat',
    free: true,
  },
  {
    id: 6,
    org: 'Illinois Legal Aid Online',
    initials: 'IL',
    color: '#37474F',
    category: 'Legal Aid',
    desc: 'Free legal information, self-help forms, and referrals to legal aid attorneys for qualifying low-income Illinois residents.',
    detail: 'Online + in-person clinics',
    free: true,
  },
  {
    id: 7,
    org: 'CTA Reduced Fare Program',
    initials: 'CT',
    color: '#B71C1C',
    category: 'Transportation',
    desc: 'Reduced transit fares for low-income riders, seniors, and people with disabilities on all CTA bus and rail lines.',
    detail: 'Apply at any CTA station',
    free: false,
  },
  {
    id: 8,
    org: 'DHS Child Care Assistance',
    initials: 'DC',
    color: '#2E7D32',
    category: 'Child Care',
    desc: 'Subsidized child care for working families and those in job training or education programs through CCAP.',
    detail: 'Income-based eligibility',
    free: false,
  },
]

function ResourcesTab() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = RESOURCES.filter(r => {
    const matchesCat = activeCategory === 'All' || r.category === activeCategory
    const q = query.toLowerCase()
    const matchesQ = !q || r.org.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    return matchesCat && matchesQ
  })

  return (
    <>
      <h1 className={styles.title}>Resources</h1>
      <p className={styles.subtitle}>Find local support services near you.</p>

      <div className={h.searchBar}>
        <span className={h.searchIcon}>🔍</span>
        <input
          className={h.searchInput}
          type="text"
          placeholder="Search resources or services…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
      </div>

      <div className={h.filters}>
        {RESOURCE_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(r => (
            <div key={r.id} className={h.card}>
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: r.color }}>{r.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{r.org}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{r.category}</span>
                    {r.free
                      ? <span className={h.freeBadge}>Free</span>
                      : <span className={h.paidBadge}>Low Cost</span>}
                  </div>
                </div>
              </div>
              <p className={h.cardDesc}>{r.desc}</p>
              <div className={h.cardFooter}>
                <p className={h.cardDetail}>{r.detail}</p>
                <button className={h.actionBtn}>Get Help</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ════════════════════════════════
   PROGRAMS TAB
   ════════════════════════════════ */

const PROGRAM_CATS = [
  'All', 'Food Assistance', 'Healthcare', 'Housing', 'Financial',
  'Employment', 'Education', 'Disability', 'Veterans', 'Immigrants', 'Seniors',
]

const PROGRAMS = [
  {
    id: 1,
    name: 'SNAP — Food Assistance',
    initials: 'SN',
    color: '#2E7D32',
    agency: 'IL Dept. of Human Services',
    category: 'Food Assistance',
    eligibility: 'Income at or below 130% of federal poverty level',
    desc: 'Monthly electronic benefits to purchase groceries at authorized retailers. Average benefit is $230/person per month.',
    govt: true,
  },
  {
    id: 2,
    name: 'Medicaid / All Kids',
    initials: 'MD',
    color: '#1565C0',
    agency: 'IL Dept. of Healthcare & Family Services',
    category: 'Healthcare',
    eligibility: 'Low income families, children, pregnant women, and adults',
    desc: 'Free or low-cost health insurance covering doctor visits, hospital stays, prescriptions, mental health, and dental care.',
    govt: true,
  },
  {
    id: 3,
    name: 'Illinois Rental Payment Program',
    initials: 'IR',
    color: '#C62828',
    agency: 'IL Housing Development Authority',
    category: 'Housing',
    eligibility: 'Renters earning below 80% AMI with COVID-related hardship',
    desc: 'Emergency rental and utility assistance paid directly to landlords and utility companies on behalf of qualifying households.',
    govt: true,
  },
  {
    id: 4,
    name: 'WIC Nutrition Program',
    initials: 'WI',
    color: '#E07B2A',
    agency: 'IL Dept. of Human Services',
    category: 'Food Assistance',
    eligibility: 'Pregnant women, new mothers, infants, and children under 5',
    desc: 'Monthly food benefits, breastfeeding support, nutrition education, and referrals for women, infants, and young children.',
    govt: true,
  },
  {
    id: 5,
    name: 'LIHEAP Energy Assistance',
    initials: 'LI',
    color: '#F57F17',
    agency: 'IL Community Services',
    category: 'Financial',
    eligibility: 'Households at or below 200% federal poverty level',
    desc: 'Help paying heating and cooling bills. Benefits paid directly to energy providers to prevent disconnection.',
    govt: true,
  },
  {
    id: 6,
    name: 'Illinois Works Job Training',
    initials: 'IW',
    color: '#37474F',
    agency: 'IL Dept. of Commerce & Economic Opportunity',
    category: 'Employment',
    eligibility: 'Unemployed or underemployed Illinois residents',
    desc: 'Paid job training, apprenticeships, and placement services in high-demand industries including healthcare, tech, and skilled trades.',
    govt: true,
  },
  {
    id: 7,
    name: 'SSI / SSDI Benefits',
    initials: 'SS',
    color: '#4A148C',
    agency: 'Social Security Administration',
    category: 'Disability',
    eligibility: 'Adults and children with qualifying disabilities',
    desc: 'Monthly cash payments for individuals who are disabled, blind, or aged and have limited income and resources.',
    govt: true,
  },
  {
    id: 8,
    name: 'Earned Income Tax Credit',
    initials: 'EI',
    color: '#1B5E20',
    agency: 'IRS / IL Dept. of Revenue',
    category: 'Financial',
    eligibility: 'Workers earning low to moderate income',
    desc: 'Refundable tax credit that can put thousands of dollars back in your pocket. Average EITC refund is over $2,500.',
    govt: true,
  },
]

function ProgramsTab() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = PROGRAMS.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory
    const q = query.toLowerCase()
    const matchesQ = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.agency.toLowerCase().includes(q)
    return matchesCat && matchesQ
  })

  return (
    <>
      <h1 className={styles.title}>Programs</h1>
      <p className={styles.subtitle}>Government and community assistance programs.</p>

      <div className={h.searchBar}>
        <span className={h.searchIcon}>🔍</span>
        <input
          className={h.searchInput}
          type="text"
          placeholder="Search programs or benefits…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
      </div>

      <div className={h.filters}>
        {PROGRAM_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'program' : 'programs'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(p => (
            <div key={p.id} className={h.card}>
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: p.color }}>{p.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{p.name}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{p.category}</span>
                    {p.govt && <span className={h.govtBadge}>Gov't Program</span>}
                  </div>
                </div>
              </div>
              <p className={h.cardDesc}>{p.desc}</p>
              <p className={h.cardDetail}>✓ Eligibility: {p.eligibility}</p>
              <div className={h.cardFooter}>
                <div className={h.metaStack}>
                  <span className={h.metaLabel}>Administered by</span>
                  <span className={h.metaValue}>{p.agency}</span>
                </div>
                <button className={h.actionBtn}>Apply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ════════════════════════════════
   COURSES TAB
   ════════════════════════════════ */

const COURSE_CATS = [
  'All', 'Job Skills', 'Technology', 'Healthcare', 'Business',
  'Language', 'GED & Literacy', 'Trades', 'Creative Arts', 'Personal Development',
]

const COURSES = [
  {
    id: 1,
    title: 'Google Career Certificates',
    provider: 'Google / Coursera',
    initials: 'GG',
    color: '#4285F4',
    category: 'Technology',
    duration: '3–6 months',
    format: 'Online',
    level: 'Beginner',
    cost: 'Free w/ Aid',
    desc: 'Job-ready certificates in IT Support, Data Analytics, UX Design, Project Management, and Cybersecurity. No degree required.',
  },
  {
    id: 2,
    title: 'Khan Academy — GED Prep',
    provider: 'Khan Academy',
    initials: 'KA',
    color: '#14BF96',
    category: 'GED & Literacy',
    duration: 'Self-paced',
    format: 'Online',
    level: 'Beginner',
    cost: 'Free',
    desc: 'Completely free GED preparation covering math, science, reading, and social studies. Practice tests and personalized learning paths included.',
  },
  {
    id: 3,
    title: 'Healthcare Careers Fast Track',
    provider: 'City Colleges of Chicago',
    initials: 'CC',
    color: '#C62828',
    category: 'Healthcare',
    duration: '6–12 months',
    format: 'In-Person',
    level: 'Beginner',
    cost: 'Low Cost',
    desc: 'Accelerated training for CNA, Medical Assistant, Phlebotomy, and EMT roles. Financial aid and scholarships available.',
  },
  {
    id: 4,
    title: 'Skilled Trades Apprenticeship',
    provider: 'Chicago Cook Workforce Partnership',
    initials: 'CW',
    color: '#E07B2A',
    category: 'Trades',
    duration: '1–4 years',
    format: 'In-Person',
    level: 'Beginner',
    cost: 'Free',
    desc: 'Earn while you learn in electrician, plumbing, HVAC, and construction trades. Paid apprenticeships with union placement upon completion.',
  },
  {
    id: 5,
    title: 'Small Business Essentials',
    provider: 'SCORE Chicago',
    initials: 'SC',
    color: '#1565C0',
    category: 'Business',
    duration: '8 weeks',
    format: 'Hybrid',
    level: 'Beginner',
    cost: 'Free',
    desc: 'Learn to start and grow a small business. Topics include business planning, financing, marketing, and legal basics. One-on-one mentoring included.',
  },
  {
    id: 6,
    title: 'English as a Second Language',
    provider: 'Chicago Public Library',
    initials: 'CP',
    color: '#37474F',
    category: 'Language',
    duration: 'Ongoing',
    format: 'In-Person',
    level: 'All Levels',
    cost: 'Free',
    desc: 'Free ESL classes at library branches across Chicago. Covers reading, writing, listening, and conversational English for adult learners.',
  },
  {
    id: 7,
    title: 'LinkedIn Learning',
    provider: 'LinkedIn',
    initials: 'LI',
    color: '#0A66C2',
    category: 'Job Skills',
    duration: 'Self-paced',
    format: 'Online',
    level: 'All Levels',
    cost: 'Free w/ Aid',
    desc: 'Thousands of courses in business, technology, and creative skills. Chicago Public Library cardholders get free access.',
  },
  {
    id: 8,
    title: 'Digital Arts & Media Production',
    provider: 'After School Matters',
    initials: 'AS',
    color: '#7B1FA2',
    category: 'Creative Arts',
    duration: '10 weeks',
    format: 'In-Person',
    level: 'Beginner',
    cost: 'Free',
    desc: 'Photography, videography, graphic design, and music production for Chicago teens and young adults. Stipends available for qualifying participants.',
  },
]

function CoursesTab() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [costFilter, setCostFilter] = useState('All')

  const filtered = COURSES.filter(c => {
    const matchesCat = activeCategory === 'All' || c.category === activeCategory
    const matchesCost = costFilter === 'All' || (costFilter === 'Free' && c.cost.startsWith('Free')) || (costFilter === 'Paid' && !c.cost.startsWith('Free'))
    const q = query.toLowerCase()
    const matchesQ = !q || c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    return matchesCat && matchesCost && matchesQ
  })

  return (
    <>
      <h1 className={styles.title}>Courses</h1>
      <p className={styles.subtitle}>Free and low-cost learning opportunities.</p>

      <div className={h.searchBar}>
        <span className={h.searchIcon}>🔍</span>
        <input
          className={h.searchInput}
          type="text"
          placeholder="Search courses or providers…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && <button className={h.clearBtn} onClick={() => setQuery('')}>✕</button>}
      </div>

      {/* Cost toggle */}
      <div className={h.filters} style={{ marginBottom: '0.625rem' }}>
        {['All', 'Free', 'Paid'].map(f => (
          <button
            key={f}
            className={`${h.chip} ${costFilter === f ? h.chipActive : ''}`}
            onClick={() => setCostFilter(f)}
          >
            {f === 'All' ? 'Any Cost' : f === 'Free' ? '🆓 Free' : '💳 Paid'}
          </button>
        ))}
      </div>

      {/* Subject filters */}
      <div className={h.filters}>
        {COURSE_CATS.map(cat => (
          <button
            key={cat}
            className={`${h.chip} ${activeCategory === cat ? h.chipActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={h.resultsCount}>{filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found</p>

      {filtered.length === 0 ? <EmptyState /> : (
        <div className={h.cardList}>
          {filtered.map(c => (
            <div key={c.id} className={h.card}>
              <div className={h.cardTop}>
                <div className={h.orgLogo} style={{ background: c.color }}>{c.initials}</div>
                <div className={h.cardMeta}>
                  <h3 className={h.cardName}>{c.title}</h3>
                  <div className={h.badgeRow}>
                    <span className={h.categoryBadge}>{c.category}</span>
                    {c.cost.startsWith('Free')
                      ? <span className={h.freeBadge}>{c.cost}</span>
                      : <span className={h.paidBadge}>{c.cost}</span>}
                  </div>
                </div>
              </div>

              <p className={h.cardDesc}>{c.desc}</p>

              <div className={h.pillRow}>
                <span className={h.pill}>📅 {c.duration}</span>
                <span className={h.pill}>{c.format === 'Online' ? '💻' : c.format === 'In-Person' ? '📍' : '🔀'} {c.format}</span>
                <span className={h.pill}>📊 {c.level}</span>
              </div>

              <div className={h.cardFooter}>
                <div className={h.metaStack}>
                  <span className={h.metaLabel}>Provider</span>
                  <span className={h.metaValue}>{c.provider}</span>
                </div>
                <button className={h.actionBtn}>Enroll</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ════════════════════════════════
   SHARED EMPTY STATE
   ════════════════════════════════ */

function EmptyState() {
  return (
    <div className={h.emptyState}>
      <p className={h.emptyIcon}>🔎</p>
      <p className={h.emptyTitle}>No results found</p>
      <p className={h.emptyDesc}>Try a different search term or category.</p>
    </div>
  )
}

/* ════════════════════════════════
   PLACEHOLDER TAB
   ════════════════════════════════ */

function PlaceholderTab({ title, icon, desc }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>{icon}</div>
        <p className={styles.comingSoonTitle}>Coming soon</p>
        <p className={styles.comingSoonDesc}>{desc}</p>
      </div>
    </>
  )
}

/* ════════════════════════════════
   MAIN PAGE
   ════════════════════════════════ */

export default function Help() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('resources')

  return (
    <div className={`${styles.page} ${styles.help}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/home')}>← Back</button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={`${styles.main} ${styles.mainWithNav}`}>
        {activeTab === 'resources'     && <ResourcesTab />}
        {activeTab === 'programs'      && <ProgramsTab />}
        {activeTab === 'courses'       && <CoursesTab />}
        {activeTab === 'notifications' && (
          <PlaceholderTab
            title="Alerts"
            icon="🔔"
            desc="Updates on resources, program deadlines, and messages from organizations."
          />
        )}
        {activeTab === 'account'       && (
          <PlaceholderTab
            title="My Account"
            icon="👤"
            desc="Manage your profile, preferences, and connected accounts."
          />
        )}
      </main>

      <BottomNav variant="help" active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
