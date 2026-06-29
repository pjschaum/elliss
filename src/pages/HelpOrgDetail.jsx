import { useParams, useNavigate } from 'react-router-dom'
import { HELP_ORGS } from '../data/helpOrgs'
import { RESOURCES } from '../data/resources'
import { PROGRAMS } from '../data/programs'
import { COURSES } from '../data/courses'
import d from './Detail.module.css'

export default function HelpOrgDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const orgId = Number(id)
  const org = HELP_ORGS.find(o => o.id === orgId)

  if (!org) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Organization Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This organization could not be found.
        </div>
      </div>
    )
  }

  const orgResources = RESOURCES.filter(r => r.orgId === orgId)
  const orgPrograms  = PROGRAMS.filter(p => p.orgId === orgId)
  const orgCourses   = COURSES.filter(c => c.orgId === orgId)

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>About this Organization</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: org.color }}>
            {org.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{org.name}</h1>
            <div className={d.heroBadges}>
              <span className={`${d.badge} ${d.badgeHelp}`}>{org.category}</span>
              {org.type && (
                <span className={`${d.badge} ${d.badgeNeutral}`}>{org.type}</span>
              )}
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* About */}
        <div className={d.section}>
          <p className={d.sectionTitle}>About</p>
          <p className={d.sectionText}>{org.desc}</p>
        </div>

        <div className={d.divider} />

        {/* Mission */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Mission</p>
          <p className={d.sectionText}>{org.mission}</p>
        </div>

        <div className={d.divider} />

        {/* Impact stats */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Impact</p>
          <div className={d.statsRow}>
            {org.impact.map((stat, i) => (
              <div key={i} className={d.statCard}>
                <p className={d.statValue}>{stat.value}</p>
                <p className={d.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={d.divider} />

        {/* Contact */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Contact & Hours</p>
          <div className={d.infoList}>
            {org.address && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>📍</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Location</p>
                  <p className={d.infoValue}>{org.address}</p>
                </div>
              </div>
            )}
            {org.hours && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>🕐</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Hours</p>
                  <p className={d.infoValue}>{org.hours}</p>
                </div>
              </div>
            )}
            {org.phone && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>📞</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Phone</p>
                  <a href={`tel:${org.phone}`} className={d.infoLink}>{org.phone}</a>
                </div>
              </div>
            )}
            {org.website && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>🌐</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Website</p>
                  <a
                    href={`https://${org.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={d.infoLink}
                  >
                    {org.website} ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resources from this org */}
        {orgResources.length > 0 && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>Resources Offered</p>
              <div className={d.linkedList}>
                {orgResources.map(r => (
                  <button
                    key={r.id}
                    className={d.linkedRow}
                    onClick={() => navigate(`/help/resource/${r.id}`)}
                  >
                    <div className={d.linkedInfo}>
                      <p className={d.linkedName}>{r.category}</p>
                      <p className={d.linkedSub}>{r.desc.slice(0, 80)}…</p>
                    </div>
                    <span className={d.linkedChevron}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Programs from this org */}
        {orgPrograms.length > 0 && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>Programs Administered</p>
              <div className={d.linkedList}>
                {orgPrograms.map(p => (
                  <button
                    key={p.id}
                    className={d.linkedRow}
                    onClick={() => navigate(`/help/program/${p.id}`)}
                  >
                    <div className={d.linkedInfo}>
                      <p className={d.linkedName}>{p.name}</p>
                      <p className={d.linkedSub}>{p.category}</p>
                    </div>
                    <span className={d.linkedChevron}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Courses from this org */}
        {orgCourses.length > 0 && (
          <>
            <div className={d.divider} />
            <div className={d.section}>
              <p className={d.sectionTitle}>Courses & Training</p>
              <div className={d.linkedList}>
                {orgCourses.map(c => (
                  <button
                    key={c.id}
                    className={d.linkedRow}
                    onClick={() => navigate(`/help/course/${c.id}`)}
                  >
                    <div className={d.linkedInfo}>
                      <p className={d.linkedName}>{c.title}</p>
                      <p className={d.linkedSub}>{c.category} · {c.format} · {c.cost}</p>
                    </div>
                    <span className={d.linkedChevron}>›</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky bottom — website CTA */}
      <div className={d.bottomBar}>
        <a
          href={`https://${org.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${d.actionBtn} ${d.actionBtnHelp}`}
          style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
        >
          Visit {org.name.split(' ').slice(0, 2).join(' ')} Website ↗
        </a>
      </div>
    </div>
  )
}
