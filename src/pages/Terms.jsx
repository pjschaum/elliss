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
  divider: {
    border: 'none',
    borderTop: '1px solid #e8eaed',
    margin: '12px 0 36px',
  },
  contactLink: {
    color: '#324a7d',
    textDecoration: 'underline',
  },
}

export default function Terms() {
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
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.lastUpdated}>Last updated: July 2026</p>

        <div style={styles.highlight}>
          <p style={styles.highlightText}>
            Elliss exists to connect people with help and opportunities to give back. These terms
            are written in plain language because we want you to actually understand them — not
            just scroll past them.
          </p>
        </div>

        {/* Section 1 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>1. Who We Are</h2>
          <p style={styles.p}>
            Elliss is a social impact platform built for communities in Rock County, Dane County,
            and Walworth County, Wisconsin. We help people find local resources, assistance
            programs, and volunteer opportunities. Elliss is operated by Elliss LLC, a
            Wisconsin limited liability company.
          </p>
          <p style={styles.p}>
            Our mission is simple: kind hearts, better lives. We connect people who want to help
            with people who need it — and we take the responsibility that comes with that seriously.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 2 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>2. Who Can Use Elliss</h2>
          <p style={styles.p}>
            You must be at least 13 years old to use Elliss in any capacity. If you are under 13,
            please do not create an account or use this app. We comply fully with the Children's
            Online Privacy Protection Act (COPPA) and do not knowingly collect information from
            children under 13.
          </p>
          <p style={styles.p}>
            Full account features — including volunteering, donating, and accessing certain
            assistance programs — require you to be 18 or older. Users between 13 and 17 may
            access emergency resources and certain general information without creating an account.
          </p>
          <p style={styles.p}>
            By creating an account, you confirm that the information you provide is accurate and
            that you meet the age requirements above.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 3 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>3. What Elliss Does</h2>
          <p style={styles.p}>
            Elliss is a directory and connection platform. We provide two core experiences:
          </p>
          <p style={styles.p}>
            The <strong>Give side</strong> lets you find volunteer events, sign up to help local
            organizations, and make charitable donations to vetted nonprofits in your area.
          </p>
          <p style={styles.p}>
            The <strong>Help side</strong> lets you browse local resources, assistance programs,
            and educational courses — covering things like food assistance, housing, healthcare,
            legal aid, job training, and more. You can filter by what fits your situation and save
            organizations you want to come back to.
          </p>
          <p style={styles.p}>
            Elliss connects you with resources and organizations but is not itself a service
            provider. When you contact an organization through Elliss, your relationship is with
            that organization — not with us. We are not responsible for services delivered (or not
            delivered) by third-party organizations listed in the app.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 4 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>4. Your Responsibilities</h2>
          <p style={styles.p}>
            When you use Elliss, you agree to use it honestly and respectfully. Specifically, you
            agree not to:
          </p>
          <p style={styles.p}>
            — Provide false information when creating your account or completing a volunteer or
            assistance profile.
          </p>
          <p style={styles.p}>
            — Attempt to access another user's account or data.
          </p>
          <p style={styles.p}>
            — Use Elliss to harass, intimidate, or harm other users or organizations.
          </p>
          <p style={styles.p}>
            — Misrepresent your affiliation with any organization listed on the platform.
          </p>
          <p style={styles.p}>
            — Use automated tools (bots, scrapers) to access or extract data from Elliss without
            our written permission.
          </p>
          <p style={styles.p}>
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 5 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>5. Data We Collect and Why</h2>
          <p style={styles.p}>
            We collect only what we need to run the app and personalize your experience. This
            includes your name, email address, and the profile information you choose to provide
            (such as your volunteer interests or the types of assistance you're looking for).
          </p>
          <p style={styles.p}>
            We also collect basic usage data — like which features you use and what searches you
            run — so we can improve the app over time. We do not use this data to profile you or
            build an advertising audience.
          </p>
          <p style={styles.p}>
            We never collect Social Security numbers, government-issued ID numbers, or financial
            account numbers. Payment card numbers are processed entirely by Stripe and never touch
            our servers. Please see our Privacy Policy for full details.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 6 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>6. What We Never Do With Your Data</h2>
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              We will never sell your personal data. We will never share it with government
              agencies, employers, landlords, law enforcement, or third-party advertisers.
            </p>
          </div>
          <p style={styles.p}>
            We built Elliss for people who need help — including people in vulnerable situations
            where privacy is not just a preference but a matter of safety. We take that
            responsibility seriously.
          </p>
          <p style={styles.p}>
            If we ever receive a legal demand for user data, we will review it carefully, notify
            affected users when we are legally permitted to do so, and push back on demands we
            believe are overbroad or not legally valid.
          </p>
          <p style={styles.p}>
            We use Supabase as our database and authentication provider, and Stripe as our payment
            processor. These companies act as service providers under our direction and are
            contractually prohibited from using your data for their own purposes. For details, see
            our Privacy Policy.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 7 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>7. Payments</h2>
          <p style={styles.p}>
            Donations made through Elliss are processed by Stripe, a leading payment technology
            company. When you enter your card information, you're entering it directly into
            Stripe's secure system — Elliss never sees, stores, or transmits your card number,
            CVV, or full billing address.
          </p>
          <p style={styles.p}>
            Stripe accepts credit and debit cards, Apple Pay, Google Pay, and ACH bank transfers.
            All transactions are encrypted and subject to Stripe's terms of service and privacy
            policy.
          </p>
          <p style={styles.p}>
            Donation amounts, recipient organizations, and transaction dates are stored in our
            system so we can show you your giving history. This information is not shared with
            anyone outside Elliss.
          </p>
          <p style={styles.p}>
            If you have a dispute about a donation, please contact us at{' '}
            <a href="mailto:pjschaum@gmail.com" style={styles.contactLink}>pjschaum@gmail.com</a>.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 8 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>8. Account Deletion and Termination</h2>
          <p style={styles.p}>
            You can delete your account at any time from the Account tab in the app. When you
            delete your account, we permanently remove your personal profile, usage history, saved
            organizations, and all other personally identifiable information from our active
            systems within 30 days.
          </p>
          <p style={styles.p}>
            Some records may be retained for a limited time in encrypted backups before being
            purged entirely. Donation transaction records may be retained for up to 7 years as
            required by financial recordkeeping laws, but these records are not linked to your
            active profile after deletion.
          </p>
          <p style={styles.p}>
            We reserve the right to suspend or terminate accounts that violate these terms, that
            are used for fraudulent activity, or that pose a risk to other users' safety. In those
            cases, we'll tell you why unless doing so would compromise an ongoing review.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 9 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>9. Limitation of Liability</h2>
          <p style={styles.p}>
            Elliss is provided "as is." We work hard to keep the app accurate, reliable, and
            useful, but we cannot guarantee that every resource listing is current, that every
            organization is currently operating, or that the app will be available without
            interruption.
          </p>
          <p style={styles.p}>
            Elliss is not responsible for the actions, services, or omissions of third-party
            organizations listed in the app. When you engage with an organization directly, that
            relationship is between you and them.
          </p>
          <p style={styles.p}>
            To the maximum extent permitted by Wisconsin law, Elliss's total liability for any
            claim arising out of your use of the app is limited to the greater of $100 or the
            amount you paid to Elliss in the 12 months before the claim arose.
          </p>
          <p style={styles.p}>
            Nothing in these terms limits our liability for gross negligence, willful misconduct,
            or fraud.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 10 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>10. Governing Law</h2>
          <p style={styles.p}>
            These Terms of Service are governed by the laws of the State of Wisconsin, without
            regard to its conflict-of-law provisions. Any disputes arising under these terms will
            be resolved in the state or federal courts located in Rock County, Wisconsin, and you
            consent to the jurisdiction of those courts.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 11 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>11. Changes to These Terms</h2>
          <p style={styles.p}>
            We may update these Terms of Service from time to time. When we make significant
            changes, we'll notify you through the app or by email. The date at the top of this
            page tells you when these terms were last updated. Continued use of Elliss after
            changes take effect means you accept the updated terms.
          </p>
        </div>

        <hr style={styles.divider} />

        {/* Section 12 */}
        <div style={styles.section}>
          <h2 style={styles.h2}>12. Contact Us</h2>
          <p style={styles.p}>
            If you have questions about these terms, want to report a concern, or need to request
            account deletion, please reach out:
          </p>
          <p style={styles.p}>
            <strong>Email:</strong>{' '}
            <a href="mailto:pjschaum@gmail.com" style={styles.contactLink}>pjschaum@gmail.com</a>
          </p>
          <p style={styles.p}>
            <strong>Elliss LLC</strong> — Janesville, Wisconsin
          </p>
        </div>
      </div>
    </div>
  )
}
