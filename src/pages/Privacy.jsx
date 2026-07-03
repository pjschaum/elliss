import { useNavigate } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fb',
    padding: '0 0 60px',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e8eaed',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '22px',
    color: '#324a7d',
    padding: '4px 8px 4px 0',
    lineHeight: 1,
  },
  wordmark: {
    fontFamily: 'Georgia, serif',
    fontSize: '22px',
    fontWeight: '700',
    color: '#324a7d',
    letterSpacing: '0.5px',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '36px 24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '6px',
    lineHeight: 1.2,
  },
  lastUpdated: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '36px',
  },
  section: {
    marginBottom: '36px',
  },
  h2: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#324a7d',
    marginBottom: '10px',
    marginTop: 0,
  },
  p: {
    fontSize: '15px',
    lineHeight: '1.75',
    color: '#374151',
    marginBottom: '14px',
    marginTop: 0,
  },
  highlight: {
    backgroundColor: '#eef1f8',
    borderLeft: '4px solid #324a7d',
    padding: '14px 18px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '14px',
  },
  highlightText: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#1a1a2e',
    margin: 0,
    fontWeight: '500',
  },
  warnHighlight: {
    backgroundColor: '#f0faf2',
    borderLeft: '4px solid #2E7D32',
    padding: '14px 18px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '14px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e8eaed',
    margin: '12px 0 36px',
  },
  contactLink: {
    color: '#324a7d',
    textDecoration: 'underline',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '14px',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    backgroundColor: '#eef1f8',
    color: '#324a7d',
    fontWeight: '600',
    borderBottom: '2px solid #d1d9ef',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #e8eaed',
    color: '#374151',
    verticalAlign: 'top',
    lineHeight: '1.5',
  },
}

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
          &#8592;
        </button>
        <span style={styles.wordmark}>elliss</span>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last updated: July 2026</p>

        <div style={styles.highlight}>
          <p style={styles.highlightText}>
            We built Elliss for people who need help. We will never use your data against you.
            This policy explains, in plain language, what we collect, why we collect it, and the
            protections you have.
          </p>
        </div>

        {/* Section 1 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>1. Our Commitment to You</h2>
          <p style={styles.p}>
            Privacy is not a legal checkbox for us — it's core to what Elliss is. Many of our
            users are in situations where their privacy is a matter of personal safety: immigrants
            navigating complex systems, domestic violence survivors seeking a fresh start, people
            experiencing homelessness, veterans in crisis. We designed this app knowing that, and
            every decision about data starts there.
          </p>
          <p style={styles.p}>
            We collect only what we need. We keep it secure. We never sell it. We never share it
            with government agencies, employers, landlords, or law enforcement unless legally
            compelled — and even then, we fight for your rights first.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 2 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>2. What We Collect</h2>

          <p style={styles.p}><strong>Account information</strong></p>
          <p style={styles.p}>
            When you create an account, we collect your name and email address. If you sign in
            with Google, Apple, or Facebook, we receive only the name and email your provider
            shares — we never receive your social media password.
          </p>

          <p style={styles.p}><strong>Profile data you choose to provide</strong></p>
          <p style={styles.p}>
            Elliss has two optional profile areas. A Volunteer Profile lets you share your
            skills, availability, and interests so we can surface relevant opportunities. A Help
            Profile lets you note what types of assistance you're looking for. Both are entirely
            optional — the app works without them — and you control what you share.
          </p>

          <p style={styles.p}><strong>Usage data</strong></p>
          <p style={styles.p}>
            We collect basic information about how you use the app: which screens you visit, what
            searches you run, and which filters you use. This helps us understand what's useful
            and what needs improvement. This data is not tied to your identity for advertising
            purposes.
          </p>

          <p style={styles.p}><strong>Device and connection data</strong></p>
          <p style={styles.p}>
            We collect your device type, operating system, and general geographic region (county
            level) so we can show you local resources. We do not track your precise GPS location
            unless you explicitly grant that permission for a specific feature.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 3 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>3. What We Never Collect</h2>
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              We never collect Social Security numbers, government-issued ID numbers (such as
              passport or driver's license numbers), immigration status details, criminal history,
              or payment card numbers. We never ask for these and you should never enter them.
            </p>
          </div>
          <p style={styles.p}>
            When you make a donation, your card number is entered directly into Stripe's secure
            system. It never touches Elliss servers. We see only a masked summary (last four
            digits and card brand) after the transaction completes.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 4 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>4. How We Use Your Data</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Why we use it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>Name and email</td>
                <td style={styles.td}>To create and maintain your account; to send you account-related messages (not marketing without consent)</td>
              </tr>
              <tr>
                <td style={styles.td}>Profile preferences</td>
                <td style={styles.td}>To personalize resource recommendations and volunteer matches to your situation</td>
              </tr>
              <tr>
                <td style={styles.td}>Usage data</td>
                <td style={styles.td}>To improve the app, fix bugs, and prioritize which features to build next</td>
              </tr>
              <tr>
                <td style={styles.td}>Region / county</td>
                <td style={styles.td}>To show you local organizations and programs, not national listings irrelevant to you</td>
              </tr>
              <tr>
                <td style={styles.td}>Donation records</td>
                <td style={styles.td}>To show you your giving history and provide donation confirmation</td>
              </tr>
            </tbody>
          </table>
          <p style={styles.p}>
            We do not use your data to serve you advertising. We do not build behavioral profiles
            for sale to anyone.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 5 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>5. Who We Share Your Data With</h2>
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              Nobody. We do not sell, rent, or trade your personal data. We do not share it with
              government agencies, employers, landlords, law enforcement, advertisers, or data
              brokers.
            </p>
          </div>
          <p style={styles.p}>
            We do use two technology service providers who process data on our behalf:
          </p>
          <p style={styles.p}>
            <strong>Supabase</strong> provides our database, authentication, and file storage
            infrastructure. Your data is stored on Supabase's servers with row-level security,
            meaning each user can only access their own records. Supabase is contractually
            prohibited from using your data for any purpose other than operating our service.
            See their privacy policy at supabase.com/privacy.
          </p>
          <p style={styles.p}>
            <strong>Stripe</strong> processes payments. When you donate through the app, your
            payment details go directly to Stripe's system. Stripe is a PCI-compliant payment
            processor. See their privacy policy at stripe.com/privacy.
          </p>
          <p style={styles.p}>
            These companies are service providers, not data brokers. They act under our
            instructions and have no right to use your data independently.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 6 — Vulnerable populations */}
        <div style={styles.section}>
          <h2 style={styles.h2}>6. Special Protections for Vulnerable Users</h2>
          <div style={styles.warnHighlight}>
            <p style={styles.highlightText}>
              If you are an immigrant, a domestic violence survivor, a minor, a person experiencing
              homelessness, a veteran, or anyone else in a situation where your data could put you
              at risk — this section is especially for you.
            </p>
          </div>
          <p style={styles.p}>
            We do not cooperate with informal requests for user data from law enforcement,
            immigration authorities, employers, landlords, or any other party. We require a valid
            court order, warrant, or subpoena for any disclosure of user data.
          </p>
          <p style={styles.p}>
            When we receive a legal demand for data, we will:
          </p>
          <p style={styles.p}>
            — Review the demand carefully and push back if we believe it is overbroad, legally
            deficient, or issued by a court without proper jurisdiction.
          </p>
          <p style={styles.p}>
            — Notify the affected user as soon as we are legally permitted to do so, so they have
            the opportunity to seek legal counsel.
          </p>
          <p style={styles.p}>
            — Disclose only the minimum information required by the valid legal order.
          </p>
          <p style={styles.p}>
            We also design the app to minimize the data we hold in the first place. We can't hand
            over data we don't have.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 7 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>7. Your Rights</h2>
          <p style={styles.p}>
            You have meaningful control over your information. Specifically, you have the right to:
          </p>
          <p style={styles.p}>
            <strong>Access</strong> — Request a copy of the personal data we hold about you.
          </p>
          <p style={styles.p}>
            <strong>Correction</strong> — Ask us to correct inaccurate or incomplete information.
            You can also edit most profile data directly in the app.
          </p>
          <p style={styles.p}>
            <strong>Deletion</strong> — Delete your account and all associated data at any time
            from the Account tab, or by emailing us. We remove your data from active systems
            within 30 days.
          </p>
          <p style={styles.p}>
            <strong>Data portability</strong> — Request an export of your personal data in a
            common, machine-readable format.
          </p>
          <p style={styles.p}>
            <strong>Withdraw consent</strong> — If you've opted into any optional data use (such
            as email updates), you can withdraw that consent at any time.
          </p>
          <p style={styles.p}>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:pjschaum@gmail.com" style={styles.contactLink}>pjschaum@gmail.com</a>.
            We respond within 30 days.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 8 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>8. Children's Privacy (COPPA)</h2>
          <p style={styles.p}>
            Elliss is not directed at children under 13, and we do not knowingly collect personal
            information from anyone under 13. The app includes an age verification step before
            account creation. If we discover that a user under 13 has provided personal
            information, we will delete it promptly.
          </p>
          <p style={styles.p}>
            Users between 13 and 17 may access emergency resource information without creating an
            account. We do not collect personal data in that limited experience.
          </p>
          <p style={styles.p}>
            If you believe a child under 13 has created an account, please contact us immediately
            at{' '}
            <a href="mailto:pjschaum@gmail.com" style={styles.contactLink}>pjschaum@gmail.com</a>.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 9 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>9. Cookies and Local Storage</h2>
          <p style={styles.p}>
            We use local storage on your device to remember your language preference and age
            verification, and to keep your session active between visits. This is minimal and
            functional — not for tracking or advertising.
          </p>
          <p style={styles.p}>
            We do not use third-party tracking cookies. We do not participate in cross-site
            tracking networks or behavioral advertising platforms. If we add any analytics tools
            in the future, we will update this policy and offer you the choice to opt out.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 10 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>10. Data Security</h2>
          <p style={styles.p}>
            We take reasonable technical and organizational measures to protect your data. These
            include encrypted connections (HTTPS/TLS) for all data in transit, row-level security
            in our database (so each user can only access their own data), and access controls
            that limit which team members can view user data.
          </p>
          <p style={styles.p}>
            No system is perfectly secure. If we ever discover a breach that affects your data,
            we will notify you as required by Wisconsin law and take immediate steps to contain
            and remediate the issue.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 11 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>11. Changes to This Policy</h2>
          <p style={styles.p}>
            When we make significant changes to this Privacy Policy, we'll let you know through
            the app or by email. The date at the top tells you when it was last updated. We
            encourage you to review it periodically. Continued use of Elliss after changes are
            posted means you accept the updated policy.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 12 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>12. Contact and Data Deletion Requests</h2>
          <p style={styles.p}>
            Questions about privacy, requests to access or delete your data, or concerns about
            how we handle information — reach out anytime:
          </p>
          <p style={styles.p}>
            <strong>Email:</strong>{' '}
            <a href="mailto:pjschaum@gmail.com" style={styles.contactLink}>pjschaum@gmail.com</a>
          </p>
          <p style={styles.p}>
            <strong>Elliss LLC</strong> — Janesville, Wisconsin
          </p>
          <p style={styles.p}>
            You can also delete your account directly from the Account tab in the app at any time.
            No email required.
          </p>
        </div>
      </div>
    </div>
  )
}
