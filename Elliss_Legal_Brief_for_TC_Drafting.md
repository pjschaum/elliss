# Elliss — Legal Brief for Terms & Conditions Drafting

**Prepared for:** Legal / T&C Drafting  
**Prepared by:** Elliss Development Team  
**Date:** June 2026  
**Status:** Working draft — app in active development

---

## 1. Company & App Overview

**Company name (working):** Elliss  
**Legal entity:** To be incorporated in Wisconsin (Janesville, WI 53545)  
**Founders:** Paul Schaum (technology & strategy) and Samantha Schaum (design & co-founder)  
**App tagline:** "kind hearts | better lives"  
**App name meaning:** "Elliss" is derived from a word meaning kind or benevolent; also intentionally evokes Ellis Island — a symbol of people arriving in search of a better life  

**Core purpose:** Elliss is a two-sided mobile and web application (PWA) that connects people who want to give (volunteers and donors) with people who need help (individuals seeking social services, government assistance, and community resources).

---

## 2. Platform Structure — Two Distinct Sides

Elliss operates two distinct user experiences within a single app. Users access one or both sides:

### Give Side — Volunteers & Donors
Users on the Give side:
- Browse volunteer opportunities with local nonprofit organizations
- Sign up for volunteer events (with tier-based requirements: open, profile-required, background check required)
- Donate money to nonprofit organizations
- Track their volunteer activity and impact
- Maintain a volunteer profile and document library

### Help Side — Individuals Seeking Assistance
Users on the Help side are explicitly identified as among **society's most vulnerable members** — individuals experiencing financial hardship, housing instability, food insecurity, immigration challenges, disability, domestic difficulty, or other crises who have sought out or been referred to the app for help.

Users on the Help side:
- Browse local and state resources (food pantries, healthcare, legal aid, housing, transportation, child care, clothing)
- Browse and apply to government assistance programs (SNAP, Medicaid, WIC, LIHEAP, SSI/SSDI, EITC, Illinois Works, housing vouchers)
- Browse and enroll in courses and job training (Google certificates, GED prep, healthcare training, ESL, trades apprenticeships, small business courses)
- Track their progress through a "My Journey" / "Doors Opened" motivational system
- Save documents for use in program applications

---

## 3. User Authentication & Accounts

- Authentication is handled via **Supabase Auth** (email/password; magic link planned)
- Users create a single account that spans both Give and Help sides
- User profile data is stored in a **Supabase PostgreSQL** database with Row Level Security (RLS) — each user can only access their own data
- Account holds: name, email, volunteer profile fields (skills, tier, certifications), notification preferences, saved items, favorited organizations, and document metadata

---

## 4. Data Collected — Full Inventory

### 4a. Account & Profile Data
- Email address
- Display name
- Volunteer profile: skills, experience level, certifications held, availability, background check status
- Assistance profile (planned): household size, income range, special circumstances — used to pre-fill program applications
- Alert/notification preferences
- Saved resources, programs, courses, organizations, and causes
- App install status (PWA)

### 4b. Document Uploads — HIGH SENSITIVITY
Users on both sides can upload documents to their account. These are stored in **Supabase Storage** in a private, RLS-protected bucket (`user-documents`). Files are accessible only to the authenticated user who uploaded them.

**Give Side — Documents Users May Upload:**
- Government-issued photo ID (driver's license, state ID, passport)
- Resume / CV
- Background check authorization (signed consent form)
- Background check results (from third-party screening services)
- Reference letters
- Liability waivers (signed)
- Skills and professional certifications (nursing license, CPR, food handler, teaching cert)
- Driver's license
- Vehicle insurance documents
- Health certifications / TB test results
- Training completion certificates
- Parental consent forms (for volunteers under 18)

**Help Side — Documents Users May Upload:**
- Government-issued photo ID
- Birth certificate
- **Social Security card** (contains SSN)
- **Proof of income** (pay stubs, W-2s, employer letters, SSI/SSDI award letters)
- **Proof of residency** (lease agreements, utility bills, mortgage statements)
- **Proof of citizenship or immigration status** (passport, green card, visa documentation)
- **Tax returns** (federal Form 1040)
- **Bank statements**
- Utility bills
- **Medical / disability documentation** (doctor's letters, disability determinations)
- Court orders (child support, custody)
- Benefit award letters (SNAP, Medicaid, SSI)

**Legal significance:** The Help side document set includes documents that constitute:
- **Personally Identifiable Information (PII)** — name, address, date of birth
- **Financial information** — bank statements, tax returns, pay stubs, benefit amounts
- **Health/medical information** — disability records, medical letters (potential HIPAA adjacency)
- **Immigration status** — highly sensitive, requires heightened protection
- **Government identifiers** — Social Security numbers

### 4c. Journey & Behavioral Data
- Items the user has "tracked" (resources visited, programs applied to, courses enrolled in)
- Completion status of tracked items
- Progress score and milestones

### 4d. Technical & Usage Data
- Device type, browser, OS (standard web analytics)
- PWA installation status

---

## 5. Third-Party Integrations & Data Sharing

### Currently Integrated:
| Service | Purpose | Data shared |
|---|---|---|
| **Supabase** (US-hosted) | Database, authentication, file storage | All user data lives here |
| **Supabase Auth** | User login / session management | Email, hashed password |
| **Supabase Storage** | Document file storage | Uploaded files |

### Planned Integrations:
| Service | Purpose | Data shared | Phase |
|---|---|---|---|
| **Stripe** | Payment processing for donations (CC, Apple Pay, Google Pay, ACH) | Payment tokens only — raw card data never stored by Elliss | Phase 1 |
| **Stripe Connect** | Nonprofit org payout accounts — donations flow Elliss → org | Donor amount, org destination | Phase 1 |
| **PayPal Giving Fund / Braintree** | Secondary donation method; 0% fee for verified 501(c)(3)s | Payment tokens | Phase 2 |
| **Anthropic Claude API** | In-app AI assistant for real-time help (via Supabase Edge Function proxy) | Message content, screen context | Planned |
| **Third-party background check providers** (e.g., Checkr, Sterling) | Volunteer background screening | Volunteer's name, DOB, SSN (handled directly by screener) | Planned |

**Key note on background checks:** Elliss does not itself run background checks. It facilitates the consent/authorization process. Actual screening is conducted by certified third-party FCRA-compliant consumer reporting agencies. Elliss may store the authorization form and the resulting report PDF as user-uploaded documents.

**Key note on external links:** The app links users to external government and nonprofit websites (abe.illinois.gov, hfs.illinois.gov, illinoisworknet.com, etc.) for actual program applications. Elliss has no control over those external sites or their data practices. These must be clearly disclaimed.

---

## 6. Payments & Donations

- Elliss processes charitable donations on behalf of nonprofit partner organizations
- Payment processing via **Stripe** (Phase 1) with nonprofit rates (2.2% + $0.30 per transaction)
- Elliss acts as the payment intermediary; organizations receive funds via Stripe Connect accounts
- **Elliss never stores raw card numbers** — Stripe handles tokenization
- Elliss stores only Stripe payment method reference IDs
- ACH/bank transfers available; Stripe's 0.8% rate (capped at $5) applies
- A future PayPal Giving Fund integration would offer 0% processing for verified 501(c)(3)s
- Tax receipt / donation acknowledgment obligations depend on the receiving organization's 501(c)(3) status

---

## 7. Target User Demographics — Legal Sensitivity Flags

### Give Side Users:
- Generally adult volunteers (18+)
- Minor volunteers (under 18) are supported — parental consent form upload is included
- Professionals with licensure (nurses, teachers, social workers)
- First-time volunteers with no background

### Help Side Users — Elevated Legal Sensitivity:
The Help side is **explicitly designed for vulnerable populations.** T&C language should account for:
- **Low-income individuals and families**
- **People experiencing homelessness or housing instability**
- **Seniors** (65+)
- **People with disabilities** (physical and mental)
- **Immigrants and non-English speakers** (ESL courses featured; immigration status documents handled)
- **Single parents**
- **Justice-involved individuals** (Illinois Works job training explicitly includes this group)
- **Victims of domestic situations** (legal aid resources included)
- **People in mental health crisis** (NAMI and mental health resources featured)
- **Minors** (some resources/courses are available to teens 13+; After School Matters serves ages 14–24)

**Key implication:** Standard "agree to terms" flows may be legally and ethically insufficient for users who have low literacy, limited English proficiency, or cognitive disabilities. Plain-language summaries of key T&C provisions should be strongly considered.

---

## 8. Planned AI Assistant Feature

An AI assistant powered by the **Anthropic Claude API** is planned as a core Help side feature. Key legal considerations:

- Will be context-aware (knows what screen the user is on)
- Will provide plain-language explanations of programs, documents, and processes
- Will **not** provide legal advice, medical advice, or financial advice — must be clearly disclaimed
- AI responses are not a substitute for professional guidance
- Conversations may be processed through Anthropic's API; privacy implications of message content must be disclosed
- Special sensitivity: users may describe personal hardship, immigration situations, disability, or financial distress in these conversations

---

## 9. Key Legal Areas Requiring T&C Coverage

The following are flagged as requiring specific T&C and/or Privacy Policy language:

### Privacy & Data
- [ ] What data is collected and why (full inventory above)
- [ ] How long data is retained (especially uploaded documents)
- [ ] User's right to delete their account and all associated data
- [ ] Data breach notification obligations (Supabase hosts all data — SLA and breach obligations)
- [ ] Cookies and local storage (app uses localStorage for behavioral data like favorites and journey tracking)
- [ ] Opt-out of analytics

### Document Storage — Heightened Sensitivity
- [ ] Explicit consent for storing SSNs, medical records, financial documents, immigration documents
- [ ] Disclaimer that Elliss is a storage convenience tool, not a financial institution or healthcare provider
- [ ] Data retention limits on uploaded documents (recommend user-controlled deletion, auto-expiry)
- [ ] What happens to documents if the account is deleted or the service shuts down
- [ ] No Elliss employees or third parties access user documents (enforced by Supabase RLS)

### Background Checks (Give Side)
- [ ] FCRA (Fair Credit Reporting Act) compliance — disclosure and authorization requirements if Elliss facilitates the authorization workflow
- [ ] Adverse action notice obligations if a background check disqualifies a volunteer
- [ ] Who is the "user" of the report — Elliss or the partner organization?

### Vulnerable Population Protections
- [ ] COPPA compliance for users under 13 (app should not be used by under-13s — needs explicit prohibition or age gate)
- [ ] Parental consent for 13–17 year old volunteers
- [ ] Non-discrimination policy
- [ ] Accessibility obligations (ADA / WCAG) — especially important for the Help side
- [ ] Plain-language disclosure options for users with limited literacy or English proficiency

### Payments
- [ ] Stripe's role as payment processor (their T&C governs card data handling)
- [ ] No Elliss refund policy for charitable donations (donations are generally non-refundable)
- [ ] Charitable giving disclosure — Elliss is not itself a 501(c)(3); donations go to partner orgs
- [ ] Tax deductibility — depends entirely on the receiving organization's IRS status
- [ ] Stripe's 2.2% + $0.30 fee — does Elliss absorb it or pass it to the org or donor?

### Platform Liability
- [ ] Elliss is a **platform/marketplace**, not a volunteer placement agency or social services provider
- [ ] Elliss does not vet, endorse, or guarantee the organizations listed on the platform
- [ ] Elliss is not responsible for outcomes of volunteer placements (injury, disputes)
- [ ] Elliss is not responsible for program eligibility determinations or denial of benefits
- [ ] Elliss is not responsible for content on external websites it links to
- [ ] AI assistant disclaimer — responses are informational only; not legal, medical, or financial advice
- [ ] Limitation of liability clause
- [ ] Indemnification by users for their own conduct

### Organization Partner Terms (separate agreement needed)
- [ ] Organizations must agree to their own Terms of Partnership
- [ ] Organizations are responsible for accuracy of their listings
- [ ] Organizations must hold appropriate liability insurance for volunteer activities
- [ ] Organizations requiring background checks must conduct those through FCRA-compliant channels
- [ ] Organizations cannot discriminate in volunteer or donation practices

### Account & Content
- [ ] User owns their uploaded documents; Elliss holds no license to use them
- [ ] Elliss may terminate accounts for violations
- [ ] Dispute resolution — arbitration clause, governing law (Wisconsin)
- [ ] How disputes with partner organizations are handled (not Elliss's responsibility)

### Immigration-Specific Sensitivity
- [ ] Elliss does not share immigration documents or status with any government agency, ICE, or law enforcement
- [ ] Explicit non-disclosure commitment for immigration-related data
- [ ] This is especially important for Help side users who may be undocumented or have uncertain status

---

## 10. Governing Law & Jurisdiction

- Entity incorporated in **Wisconsin**
- Governing law: **State of Wisconsin**
- Venue: **Rock County, Wisconsin** (Janesville is the county seat)
- Users in Illinois are a primary target market — Illinois consumer protection laws may apply

---

## 11. Key Documents Needed

Based on the above, the following legal documents should be drafted:

1. **Terms of Service / Terms & Conditions** — primary user agreement
2. **Privacy Policy** — detailed data collection, use, retention, and sharing disclosure (GDPR-adjacent best practices even if not legally required)
3. **Sensitive Data Addendum** — specific to the highly sensitive document types (SSN, medical, immigration)
4. **Volunteer Organization Partner Agreement** — for nonprofits listing volunteer opportunities
5. **Donation Processing Disclosure** — tax, refund, and fee disclosures
6. **AI Assistant Disclaimer** — for the planned Claude-powered help feature
7. **Cookie & Local Storage Policy** — covers localStorage use for behavioral features
8. **Accessibility Statement** — ADA/WCAG commitment, especially for Help side

---

## 12. Notes on App Technology Stack

For the technical team drafting privacy-related provisions:

- **Frontend:** React PWA (runs in browser, installable on mobile)
- **Backend/Database:** Supabase (PostgreSQL) — hosted in the US
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage (private bucket, RLS-enforced)
- **Behavioral persistence:** Browser `localStorage` — favorites, saved items, journey tracking. This data is **client-side only** and is not synced to the server. It is cleared if the user clears browser data.
- **Payments:** Stripe (planned) — PCI DSS compliance handled by Stripe; Elliss is not itself a PCI-scoped entity
- **AI:** Anthropic Claude API (planned) — proxied through Supabase Edge Function; message content transmitted to Anthropic's servers

---

*This brief was compiled from the Elliss development codebase and product roadmap. It is intended as a factual reference for legal drafting — not as legal advice. All provisions should be reviewed by a licensed attorney before publication.*
