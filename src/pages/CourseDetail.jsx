import { useParams, useNavigate } from 'react-router-dom'
import { COURSES } from '../data/courses'
import d from './Detail.module.css'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = COURSES.find(c => c.id === Number(id))

  if (!course) {
    return (
      <div className={d.page}>
        <header className={d.header}>
          <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
          <span className={d.headerTitle}>Course Not Found</span>
        </header>
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
          This course could not be found.
        </div>
      </div>
    )
  }

  const isFree = course.cost.startsWith('Free')

  return (
    <div className={d.page}>
      {/* Header */}
      <header className={d.header}>
        <button className={d.back} onClick={() => navigate(-1)}>← Back</button>
        <span className={d.headerTitle}>Course</span>
      </header>

      <div className={d.body}>
        {/* Hero */}
        <div className={d.hero}>
          <div className={d.heroLogo} style={{ background: course.color }}>
            {course.initials}
          </div>
          <div className={d.heroInfo}>
            <h1 className={d.heroName}>{course.title}</h1>
            <div className={d.heroBadges}>
              <span className={`${d.badge} ${d.badgeHelp}`}>{course.category}</span>
              {isFree
                ? <span className={`${d.badge} ${d.badgeFree}`}>{course.cost}</span>
                : <span className={`${d.badge} ${d.badgePaid}`}>{course.cost}</span>
              }
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Provider */}
        <div className={d.section}>
          <div className={d.infoRow}>
            <span className={d.infoIcon}>🏫</span>
            <div className={d.infoContent}>
              <p className={d.infoLabel}>Provider</p>
              <p className={d.infoValue}>{course.provider}</p>
            </div>
          </div>
        </div>

        <div className={d.divider} />

        {/* Format pills */}
        <div className={d.section}>
          <p className={d.sectionTitle}>At a glance</p>
          <div className={d.pillRow}>
            <span className={d.pill}>
              📅 {course.duration}
            </span>
            <span className={d.pill}>
              {course.format === 'Online' ? '💻' : course.format === 'In-Person' ? '📍' : '🔀'} {course.format}
            </span>
            <span className={d.pill}>
              📊 {course.level}
            </span>
          </div>
        </div>

        <div className={d.divider} />

        {/* Description */}
        <div className={d.section}>
          <p className={d.sectionTitle}>About this course</p>
          <p className={d.sectionText}>{course.desc}</p>
        </div>

        <div className={d.divider} />

        {/* What you'll learn */}
        <div className={d.section}>
          <p className={d.sectionTitle}>What you'll learn</p>
          <ul className={d.bulletList}>
            {course.whatYouLearn.map((item, i) => (
              <li key={i} className={d.bulletItem}>
                <span className={d.bulletDot} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={d.divider} />

        {/* Requirements */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Requirements</p>
          <p className={d.sectionText}>{course.requirements}</p>
        </div>

        <div className={d.divider} />

        {/* How to enroll */}
        <div className={d.section}>
          <p className={d.sectionTitle}>How to enroll</p>
          <p className={d.sectionText}>{course.howToEnroll}</p>
        </div>

        <div className={d.divider} />

        {/* Contact */}
        <div className={d.section}>
          <p className={d.sectionTitle}>Contact</p>
          <div className={d.infoList}>
            {course.phone && (
              <div className={d.infoRow}>
                <span className={d.infoIcon}>📞</span>
                <div className={d.infoContent}>
                  <p className={d.infoLabel}>Phone</p>
                  <a href={`tel:${course.phone}`} className={d.infoLink}>{course.phone}</a>
                </div>
              </div>
            )}
            <div className={d.infoRow}>
              <span className={d.infoIcon}>🌐</span>
              <div className={d.infoContent}>
                <p className={d.infoLabel}>Website</p>
                <span className={d.infoLink}>{course.website}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className={d.bottomBar}>
        <button className={`${d.actionBtn} ${d.actionBtnHelp}`}>
          Enroll Now
        </button>
      </div>
    </div>
  )
}
