import { useNavigate } from 'react-router-dom'
import styles from './Interface.module.css'

export default function Help() {
  const navigate = useNavigate()

  return (
    <div className={`${styles.page} ${styles.help}`}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className={styles.wordmark}>elliss</div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>In Need of Help</h1>
        <p className={styles.subtitle}>
          Resources, courses, and programs to help you thrive.
        </p>

        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>🌱</div>
          <p className={styles.comingSoonTitle}>Coming soon</p>
          <p className={styles.comingSoonDesc}>
            Resource hub, course library, and government program access are in development.
          </p>
        </div>
      </main>
    </div>
  )
}
