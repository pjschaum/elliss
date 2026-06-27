import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'

export default function Give() {
  const navigate = useNavigate()

  return (
    <div className={`${styles.page} ${styles.give}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Looking to Give</h1>
        <p className={styles.subtitle}>
          Find volunteer events, donate to causes, and make a difference.
        </p>

        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>🤝</div>
          <p className={styles.comingSoonTitle}>Coming soon</p>
          <p className={styles.comingSoonDesc}>
            Volunteer event search, donation portal, and org directory are in development.
          </p>
        </div>
      </main>
    </div>
  )
}
