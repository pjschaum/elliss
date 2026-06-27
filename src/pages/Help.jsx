import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'
import g from './Give.module.css'
import BottomNav from '../components/BottomNav'

function PlaceholderTab({ title, icon, desc }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={g.placeholder}>
        <div className={g.placeholderIcon}>{icon}</div>
        <p className={g.placeholderTitle}>Coming soon</p>
        <p className={g.placeholderDesc}>{desc}</p>
      </div>
    </>
  )
}

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
        {activeTab === 'resources' && (
          <PlaceholderTab
            title="Resources"
            icon="🌱"
            desc="Food, housing, clothing, and community support resources near you."
          />
        )}
        {activeTab === 'programs' && (
          <PlaceholderTab
            title="Programs"
            icon="📋"
            desc="Government assistance programs, financial aid, and community initiatives."
          />
        )}
        {activeTab === 'courses' && (
          <PlaceholderTab
            title="Courses"
            icon="📚"
            desc="Free and low-cost online courses to build skills and expand opportunities."
          />
        )}
        {activeTab === 'notifications' && (
          <PlaceholderTab
            title="Alerts"
            icon="🔔"
            desc="Updates on resources, program deadlines, and messages from organizations."
          />
        )}
        {activeTab === 'account' && (
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
