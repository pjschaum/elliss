import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'
import EllissLogo from '../components/EllissLogo'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <EllissLogo size={48} />
        <p className={styles.tagline}>Kind Hearts. Better Lives.</p>
      </header>

      <main className={styles.main}>
        <p className={styles.prompt}>What brings you here today?</p>

        <div className={styles.cards}>
          <button
            className={`${styles.card} ${styles.cardGive}`}
            onClick={() => navigate('/give')}
          >
            <div className={styles.cardIcon}>🤝</div>
            <h2 className={styles.cardTitle}>Looking to Give</h2>
            <p className={styles.cardDesc}>
              Find volunteer events near you, donate to causes you care about, and discover how you can make a difference.
            </p>
            <span className={styles.cardArrow}>→</span>
          </button>

          <button
            className={`${styles.card} ${styles.cardHelp}`}
            onClick={() => navigate('/help')}
          >
            <div className={styles.cardIcon}>🌱</div>
            <h2 className={styles.cardTitle}>In Need of Help</h2>
            <p className={styles.cardDesc}>
              Access resources, online courses, government programs, and community support to help you thrive.
            </p>
            <span className={styles.cardArrow}>→</span>
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>elliss.app &middot; Kind Hearts. Better Lives.</p>
      </footer>
    </div>
  )
}
