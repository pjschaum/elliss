// Help-side organization profiles
// Referenced from resources.js, programs.js, and courses.js via orgId
//
// id mapping:
//  1  ECHO Inc.                                     (resource 1)
//  2  Caritas Community Resource Center             (resource 2)
//  3  Second Harvest Foodbank — Mobile Pantry       (resource 3)
//  4  Family Promise of Greater Beloit              (resource 4)
//  5  HealthNet of Rock County                      (resource 5)
//  6  Community Health Systems of Wisconsin (CHS)   (resource 6)
//  7  Rock County Crisis & Connections Line         (resource 7)
//  8  NAMI Rock County                              (resource 8)
//  9  Rock County ADRC Transit                      (resource 9)
// 10  MTM Inc. — Free Medicaid Medical Transport    (resource 10)
// 11  Legal Action of Wisconsin                     (resource 11)
// 12  Rock-Walworth CFS — Head Start                (resource 12)
// 13  Community Action Inc. — Energy Assistance     (resource 13)
// 14  Rock County Human Services                    (resource 14)
// 15  Rock County ADRC                              (resource 15, 16)
// 16  The River Food Pantry                         (resource 17)
// 17  Badger Prairie Needs Network                  (resource 18)
// 18  Porchlight Inc.                               (resource 19)
// 19  Salvation Army of Dane County                 (resource 20)
// 20  Access Community Health Centers (ACHC)        (resource 21)
// 21  Journey Mental Health Center                  (resource 22)
// 22  Dane County Behavioral Health Resource Center (resource 23)
// 23  Madison Metro Transit                         (resource 24)
// 24  Legal Action of Wisconsin — Madison           (resource 25)
// 25  Reach Dane — Head Start                       (resource 26)
// 26  Dane County Human Services                    (resource 27)
// 27  Energy Services Inc. (ESI) — Dane County      (resource 28)
// 28  Access to Independence Inc. (ATI)             (resource 29)
// 29  Dane County ADRC                              (resource 30)
// 30  Rock County Human Services — Economic Support (programs 1–3)
// 31  Energy Services Inc. (ESI) — Rock County      (program 4)
// 32  Forward Service Corporation (FSC)             (program 5, 12)
// 33  NHA — WIC Rock County                         (program 6)
// 34  Social Security Administration — Janesville   (program 7, 13)
// 35  Janesville Housing Services Division          (program 8)
// 36  Dane County Dept. of Human Services           (programs 9–11)
// 37  Public Health Madison & Dane County           (program 14)
// 38  Social Security Administration — Madison      (program 15)
// 39  Madison Community Dev. Authority / DCHA       (program 16)
// 40  Wisconsin Dept. of Health Services            (program 17)
// 41  Wisconsin DHS / County Human Services         (program 18)
// 42  IRS / Wisconsin Dept. of Revenue              (program 19)
// 43  USAC / FCC — Lifeline Program                 (program 20)
// 44  Google / Coursera                             (course 1)
// 45  Blackhawk Technical College (BTC)             (courses 2–7)
// 46  Madison College (MATC)                        (courses 8–13)
// 47  Goodwill / Google.org                         (course 14)
// 48  freeCodeCamp                                  (course 15)
// 49  Khan Academy                                  (course 16)
// 50  GED Testing Service / Pearson VUE             (course 17)
// 51  USA Learns / UC Davis                         (course 18)
// 52  LinkedIn / Microsoft (via library)            (course 19)
// 53  Alison                                        (course 20)
// 54  OSHA-Authorized Training Providers            (course 21)
// 55  Wisconsin Job Center / CareerOneStop          (course 22)

export const HELP_ORGS = [
  // ── ROCK COUNTY RESOURCES ──────────────────────────────────────
  {
    id: 1,
    name: 'ECHO Inc.',
    initials: 'EC',
    color: '#2E7D32',
    type: 'Nonprofit',
    category: 'Food, Housing & Financial Aid',
    desc: 'ECHO — Everyone Cooperating to Help Others — serves Rock County with an emergency food pantry, weekly community meals, emergency rent assistance, motel vouchers for those facing homelessness, and Rapid Re-Housing services.',
    mission: 'ECHO exists to provide emergency assistance and community connection to those in need across Rock County.',
    website: 'echojanesville.org',
    phone: '(608) 754-5333',
    address: '65 S. High St, Janesville, WI 53548',
    hours: 'Pantry: Mon–Fri 9:00–11:15 AM | Office: Mon–Thu 9 AM–4 PM, Fri 9 AM–Noon',
    impact: [
      { label: 'Households served annually', value: '3,000+' },
      { label: 'Emergency rental assistance cases', value: '500+/yr' },
      { label: 'Crisis hotline', value: '(608) 757-5025' },
    ],
  },
  {
    id: 2,
    name: 'Caritas Community Resource Center',
    initials: 'CC',
    color: '#2E7D32',
    type: 'Faith-Based Nonprofit',
    category: 'Food & Meals',
    desc: 'Faith-based food pantry serving the Greater Beloit area. Clients receive 3 days of meals scaled to household size, with dietary accommodations. Also operates a Diaper Bank.',
    mission: 'Caritas provides food and resources to those in need in the Greater Beloit area, serving with compassion and without judgment.',
    website: 'caritasbeloit.org',
    phone: '(608) 362-4403',
    address: '2840 Prairie Ave., Beloit, WI 53511',
    hours: 'Mon–Wed 10:00 AM–2:15 PM | Thu 10:00 AM–12:00 PM',
    impact: [
      { label: 'Days of meals per client visit', value: '3' },
      { label: 'Visits allowed per month', value: 'Up to 2' },
      { label: 'Service area', value: 'Greater Beloit area' },
    ],
  },
  {
    id: 3,
    name: 'Second Harvest Foodbank — Mobile Pantry',
    initials: 'SH',
    color: '#388E3C',
    type: 'Nonprofit',
    category: 'Food & Meals',
    desc: 'Rotating mobile food pantries throughout Rock County at no cost and with no ID or residency requirement. Includes fresh produce, milk, bread, and shelf-stable groceries at multiple county sites.',
    mission: 'Second Harvest Foodbank of Southern Wisconsin provides food to people in need and leads the community in solving hunger-related problems.',
    website: 'secondharvestsw.org',
    phone: '(608) 223-9121',
    address: 'Multiple Rock County sites (e.g., 749 Bluff St., Beloit; 1250 E. Racine St., Janesville)',
    hours: 'Varies by site — check website or text FOODROCK to 47177',
    impact: [
      { label: 'ID or income required', value: 'None' },
      { label: 'Schedule lookup', value: 'Text FOODROCK to 47177' },
      { label: 'Service area', value: 'All of Rock County' },
    ],
  },
  {
    id: 4,
    name: 'Family Promise of Greater Beloit',
    initials: 'FP',
    color: '#1565C0',
    type: 'Nonprofit',
    category: 'Housing & Shelter',
    desc: 'Emergency shelter for families experiencing homelessness, including meals, showers, case management, and housing/job search support. Approximately 88% of families secure stable housing within 9 weeks. Also offers rental assistance.',
    mission: 'Family Promise of Greater Beloit helps families experiencing homelessness achieve sustainable independence through a community-based response.',
    website: 'familypromisebeloit.org',
    phone: '(608) 363-0683',
    address: '1006 Bluff St., Beloit, WI 53511',
    hours: 'Call for current office hours',
    impact: [
      { label: 'Families who secure housing within 9 weeks', value: '88%' },
      { label: 'Service area', value: 'Greater Beloit' },
      { label: 'Rental assistance', value: 'Available online' },
    ],
  },
  {
    id: 5,
    name: 'HealthNet of Rock County',
    initials: 'HN',
    color: '#0277BD',
    type: 'Free Clinic',
    category: 'Healthcare',
    desc: 'Rock County\'s only free and charitable clinic, offering primary care, chronic disease management, dental, vision, chiropractic, lab services, and behavioral health — all at no cost to qualifying uninsured patients.',
    mission: 'HealthNet of Rock County reduces healthcare disparities by providing high-quality, compassionate care to uninsured and underserved individuals.',
    website: 'healthnet-rock.org',
    phone: '(608) 756-4638',
    address: '113 S. Franklin Street, Janesville, WI 53548',
    hours: 'Mon–Fri 8:00 AM–12:00 PM and 1:00–5:00 PM',
    impact: [
      { label: 'Patients served annually', value: '3,000+' },
      { label: 'Cost to qualifying patients', value: '$0' },
      { label: 'Income limit', value: 'At or below 250% FPL' },
    ],
  },
  {
    id: 6,
    name: 'Community Health Systems of Wisconsin (CHS)',
    initials: 'CH',
    color: '#0277BD',
    type: 'Federally Qualified Health Center',
    category: 'Healthcare',
    desc: 'A Federally Qualified Health Center (FQHC) offering medical, dental, behavioral health, substance use treatment, and chiropractic on a sliding-fee scale. Accepts uninsured patients and all insurance types. No one is denied care for inability to pay.',
    mission: 'CHS provides quality healthcare to all individuals in the communities we serve, regardless of ability to pay.',
    website: 'chsofwi.org',
    phone: '(608) 361-0311 (Beloit) | (608) 758-7814 (Janesville)',
    address: '74 Eclipse Blvd, Beloit, WI 53511 | 849 Kellogg Ave, Janesville, WI 53546',
    hours: 'Beloit medical/dental: Mon–Fri 8:00 AM–5:00 PM',
    impact: [
      { label: 'Sliding-fee scale available', value: 'Yes' },
      { label: 'Patients turned away for inability to pay', value: 'None' },
      { label: 'Locations', value: 'Beloit & Janesville' },
    ],
  },
  {
    id: 7,
    name: 'Rock County Crisis & Connections Line',
    initials: 'RC',
    color: '#6f4997',
    type: 'Government',
    category: 'Mental Health',
    desc: '24/7 crisis line that is the single entry point to all county behavioral health services — crisis intervention, in-person assessment, crisis stabilization, and referral to outpatient therapy, case management, and peer support. Drop-in crisis services available 24/7 in Janesville and Beloit.',
    mission: 'Rock County Counseling Center provides accessible, quality behavioral health services to residents of Rock County.',
    website: 'co.rock.wi.us',
    phone: '(608) 757-5025',
    address: 'Drop-in: 1717 Center Ave, Janesville, WI 53546 | Also: 64 Eclipse Blvd, Beloit, WI 53511',
    hours: 'Crisis line: 24/7 | Drop-in crisis center: 24/7 | Outpatient office: Mon–Fri',
    impact: [
      { label: 'Available', value: '24/7, 365 days' },
      { label: 'Sliding-fee scale', value: 'Yes — no one turned away' },
      { label: 'Medicaid accepted', value: 'Yes' },
    ],
  },
  {
    id: 8,
    name: 'NAMI Rock County',
    initials: 'NR',
    color: '#6f4997',
    type: 'Nonprofit',
    category: 'Mental Health',
    desc: 'Free, peer-led support groups for individuals living with mental illness and for family caregivers. Provides education programs (Family-to-Family, Peer-to-Peer) and crisis navigation. Not a clinical provider — community-based support and education.',
    mission: 'NAMI Rock County is dedicated to improving the quality of life for those affected by mental illness through support, education, and advocacy.',
    website: 'namirockcounty.org',
    phone: '(608) 743-9828',
    address: '120 N. Crosby Ave, Suite 11, Janesville, WI 53548',
    hours: 'Varies by program; office Mon–Fri',
    impact: [
      { label: 'Cost of support groups', value: 'Free' },
      { label: 'Family-to-Family course', value: 'Free, 8-week program' },
      { label: 'Serves', value: 'Individuals & family members' },
    ],
  },
  {
    id: 9,
    name: 'Rock County ADRC Transit',
    initials: 'AT',
    color: '#5C6BC0',
    type: 'Government',
    category: 'Transportation',
    desc: 'Wheelchair-accessible, door-to-door transportation anywhere in Rock County for seniors and people with disabilities. Serves medical appointments, work, shopping, social trips, and personal business.',
    mission: 'Rock County ADRC Transit provides accessible transportation to help seniors and adults with disabilities maintain independence and access vital services.',
    website: 'co.rock.wi.us',
    phone: '(608) 757-5054',
    address: 'Rock County Courthouse, 51 S. Main Street, Janesville, WI 53545',
    hours: 'Rides: Mon–Fri | Scheduling: Mon–Fri 8:00 AM–4:30 PM',
    impact: [
      { label: 'Service area', value: 'All of Rock County' },
      { label: 'Eligible', value: 'Age 55+ or adults with a disability' },
      { label: 'Schedule rides', value: '3 business days in advance' },
    ],
  },
  {
    id: 10,
    name: 'MTM Inc. — Free Medicaid Medical Transport',
    initials: 'MT',
    color: '#5C6BC0',
    type: 'Government Program',
    category: 'Transportation',
    desc: 'Free door-to-door transportation to medical appointments for Wisconsin Medicaid/BadgerCare members who have no other way to get there. Also offers gas mileage reimbursement ($0.24/mile) for members who have a car.',
    mission: 'MTM removes transportation barriers for Medicaid members to ensure they can access the healthcare they need.',
    website: 'mtm-inc.net/wisconsin',
    phone: '1-866-907-1493 | TTY: 711',
    address: 'Phone-based service — statewide coverage',
    hours: 'Scheduling line: 24/7',
    impact: [
      { label: 'Cost', value: 'Free for qualifying members' },
      { label: 'Who qualifies', value: 'BadgerCare/Medicaid members' },
      { label: 'Schedule at least', value: '2 business days in advance' },
    ],
  },
  {
    id: 11,
    name: 'Legal Action of Wisconsin',
    initials: 'LA',
    color: '#C62828',
    type: 'Legal Aid Organization',
    category: 'Legal Aid',
    desc: 'Free civil legal aid for Rock County covering housing/eviction defense, family law, public benefits, consumer debt, immigration, employment, and elder law. In-person office hours held in Janesville at ECHO Inc. Available in English, Spanish, and Hmong.',
    mission: 'Legal Action of Wisconsin provides free civil legal services to low-income people throughout Wisconsin.',
    website: 'legalaction.org',
    phone: '(855) 947-2529',
    address: 'In-person hours: ECHO Inc., 65 S. High St., Janesville, WI 53548 (check legalaction.org/events for schedule)',
    hours: 'Intake line: Mon–Fri, business hours | Online intake: 24/7',
    impact: [
      { label: 'Income limit (most cases)', value: 'At or below 125% FPL' },
      { label: 'Available regardless of immigration status', value: 'Most case types' },
      { label: 'Languages', value: 'English, Spanish, Hmong' },
    ],
  },
  {
    id: 12,
    name: 'Rock-Walworth CFS — Head Start & Early Head Start',
    initials: 'CG',
    color: '#F4C04B',
    type: 'Government-Funded Nonprofit',
    category: 'Child Care',
    desc: 'Free comprehensive early childhood program for income-eligible children ages 0–5 and pregnant women in Rock and Walworth counties. Provides education, health screenings, dental, nutrition, and family support. Head Start: ages 3–5. Early Head Start: ages 0–3 and pregnant women.',
    mission: 'Rock-Walworth CFS helps young children and their families achieve school readiness and long-term success.',
    website: 'rwcfs.org',
    phone: '(608) 299-1500',
    address: 'Main office/Beloit: 1221 Henry Ave., Beloit, WI 53511 | Janesville: 1422 Center Ave.',
    hours: 'Janesville center: 8:30 AM–12:30 PM and 11:30 AM–3:30 PM | Office: Mon–Fri 8:00 AM–5:00 PM',
    impact: [
      { label: 'Cost', value: 'Free for eligible families' },
      { label: 'Ages served', value: 'Birth to 5 & pregnant women' },
      { label: 'Service area', value: 'Rock & Walworth County' },
    ],
  },
  {
    id: 13,
    name: 'Community Action Inc. — Energy Assistance',
    initials: 'CA',
    color: '#E07B2A',
    type: 'Community Action Agency',
    category: 'Financial Aid',
    desc: 'The designated WHEAP/LIHEAP administrator for Rock County, providing up to $2,147 for heating costs and up to $1,200 in crisis assistance for households facing shutoff or dangerous heating situations. Weatherization referrals also available.',
    mission: 'Community Action Inc. builds self-sufficiency and improves quality of life for residents of Rock County.',
    website: 'community-action.org',
    phone: '(608) 313-1300',
    address: '1428 Wisconsin Ave, Beloit, WI 53511',
    hours: 'Mon–Fri, business hours',
    impact: [
      { label: 'Max heating benefit', value: '$2,147' },
      { label: 'Max crisis assistance', value: '$1,200' },
      { label: 'Income limit', value: '60% of Wisconsin State Median Income' },
    ],
  },
  {
    id: 14,
    name: 'Rock County Human Services',
    initials: 'RC',
    color: '#1565C0',
    type: 'Government',
    category: 'Financial Aid & Benefits',
    desc: 'County office for enrolling in Wisconsin state and federal benefit programs including FoodShare (SNAP), BadgerCare+ health insurance, Medicaid, child care subsidy, and long-term care. Apply by phone, online, by mail, or in person.',
    mission: 'Rock County Human Services helps residents meet their needs and achieve self-sufficiency through access to public benefits and social services.',
    website: 'access.wisconsin.gov',
    phone: '(888) 794-5780',
    address: '1717 Center Ave, Janesville, WI 53546 | 64 Eclipse Blvd, Beloit, WI 53511',
    hours: 'Call center: Mon–Fri 8:30 AM–4:00 PM | Offices: Mon–Fri',
    impact: [
      { label: 'Programs available', value: 'FoodShare, BadgerCare, Child Care, Medicaid' },
      { label: 'Apply online 24/7', value: 'access.wisconsin.gov' },
      { label: 'No appointment needed', value: 'For most services' },
    ],
  },
  {
    id: 15,
    name: 'Rock County ADRC',
    initials: 'AD',
    color: '#5C6BC0',
    type: 'Government',
    category: 'Senior & Disability Services',
    desc: 'Aging and Disability Resource Center providing home-delivered meals, senior dining sites, and free one-on-one Elder and Disability Benefit Specialists for Rock County residents navigating Medicare, Medicaid, SSI, housing, veterans benefits, and benefit appeals.',
    mission: 'The Rock County ADRC connects older adults, people with disabilities, and their caregivers to the services and supports they need.',
    website: 'co.rock.wi.us',
    phone: '(608) 741-3600 | Toll-free: (855) 741-3600',
    address: '1717 Center Ave, Suite 510, Janesville, WI 53546',
    hours: 'Mon–Fri 8:00 AM–4:30 PM',
    impact: [
      { label: 'Elder Benefit Specialists', value: 'Free for age 60+' },
      { label: 'Disability Benefit Specialists', value: 'Free for ages 18–59' },
      { label: 'Home visits available', value: 'For homebound individuals' },
    ],
  },

  // ── DANE COUNTY RESOURCES ──────────────────────────────────────
  {
    id: 16,
    name: 'The River Food Pantry',
    initials: 'RF',
    color: '#1B5E20',
    type: 'Nonprofit',
    category: 'Food & Meals',
    desc: 'The largest food pantry in Dane County, serving 4,000+ people per week with drive-thru grocery pickup, to-go meal bags, home delivery for homebound clients, and 24/7 food lockers for after-hours access.',
    mission: 'The River Food Pantry provides fresh, healthy food to our neighbors in need with dignity and respect.',
    website: 'riverfoodpantry.org',
    phone: '(608) 442-8815',
    address: '3301 Packers Ave, Madison, WI 53704',
    hours: 'Tue 9 AM–3 PM | Wed 12 PM–6 PM | Thu 9 AM–12 PM | Fri 9 AM–3 PM',
    impact: [
      { label: 'People fed per week', value: '4,000+' },
      { label: 'ID or income required', value: 'None' },
      { label: 'Visits allowed per week', value: '1' },
    ],
  },
  {
    id: 17,
    name: 'Badger Prairie Needs Network',
    initials: 'BP',
    color: '#2E7D32',
    type: 'Nonprofit',
    category: 'Food & Meals',
    desc: 'A grocery store-style food pantry in Verona serving southwest Dane County. Clients shop for fresh fruits and vegetables, dairy, frozen meat, prepared meals, and dry goods. Fully volunteer-run.',
    mission: 'Badger Prairie Needs Network supports the community\'s basic needs through a neighbor-helping-neighbor model.',
    website: 'bpnn.org',
    phone: '(608) 848-2499',
    address: '1200 E Verona Ave, Verona, WI 53593',
    hours: 'Tue & Fri 10 AM–12 PM | Wed 6–8 PM | Thu 10 AM–6:30 PM | Sat 10 AM–12:30 PM',
    impact: [
      { label: 'ID or income required', value: 'None' },
      { label: 'Service area', value: 'Dane County residents' },
      { label: 'Arrive', value: 'At least 45 min before close' },
    ],
  },
  {
    id: 18,
    name: 'Porchlight Inc.',
    initials: 'PL',
    color: '#37474F',
    type: 'Nonprofit',
    category: 'Housing & Shelter',
    desc: 'Emergency overnight shelter for adult men in Madison, providing two meals per day, showers, personal hygiene supplies, individual lockers, and case management. No referral needed — walk-ins welcome nightly.',
    mission: 'Porchlight provides shelter and supportive housing to help people experiencing homelessness achieve stability and self-determination.',
    website: 'porchlightinc.org',
    phone: '(608) 416-1446',
    address: '2002 Zeier Road, Madison, WI 53704',
    hours: 'Open nightly 5 PM–8 AM | Intake: 5 PM–8:30 PM',
    impact: [
      { label: 'Shelter beds available', value: '100+' },
      { label: 'Cost', value: 'Free' },
      { label: 'Cold-weather policy (20°F or below)', value: 'All guests accepted' },
    ],
  },
  {
    id: 19,
    name: 'Salvation Army of Dane County',
    initials: 'SA',
    color: '#C62828',
    type: 'Nonprofit',
    category: 'Housing, Food & Financial Aid',
    desc: 'Operates a family emergency shelter (up to 35 families, 24/7) and a single women\'s overnight shelter. Guests receive three meals per day, laundry, showers, and case management. Also offers a food pantry and emergency financial aid through social services.',
    mission: 'The Salvation Army\'s mission is to preach the gospel of Jesus Christ and to meet human needs in His name without discrimination.',
    website: 'salvationarmyusa.org/wi/madison',
    phone: '(608) 250-2298 (family shelter) | (608) 250-2226 (women\'s shelter) | (608) 256-2321 (social services)',
    address: '630 E Washington Ave, Madison, WI 53703',
    hours: 'Family shelter: 24/7 | Women\'s check-in: 4:15–5 PM daily | Social services: Mon–Fri 9 AM–4 PM',
    impact: [
      { label: 'Family shelter capacity', value: '35 families' },
      { label: 'Women\'s shelter capacity', value: '30 women' },
      { label: 'Social services / food pantry', value: 'Walk-in Mon–Fri 9 AM–4 PM' },
    ],
  },
  {
    id: 20,
    name: 'Access Community Health Centers (ACHC)',
    initials: 'AC',
    color: '#0277BD',
    type: 'Federally Qualified Health Center',
    category: 'Healthcare',
    desc: 'A Federally Qualified Health Center offering primary care, dental, behavioral health, pharmacy, lab, and X-ray on a sliding-scale fee. Accepts all insurance including Medicaid/BadgerCare. No one is turned away for inability to pay. Interpreter services in 16+ languages.',
    mission: 'Access Community Health Centers provides affordable, quality healthcare to everyone in our community, regardless of ability to pay.',
    website: 'accesscommunityhealthcenters.org',
    phone: '(608) 443-5480 (medical) | (608) 443-5482 (dental)',
    address: '2202 S. Park Street, Madison, WI 53713 (also E. Washington Ave and S. Park St locations)',
    hours: 'Medical: Mon–Fri 8 AM–5 PM | Dental: Mon–Fri 7 AM–4 PM (most sites)',
    impact: [
      { label: 'Sliding-fee scale available', value: 'Yes — based on income' },
      { label: 'Patients turned away for inability to pay', value: 'None' },
      { label: 'Languages served', value: '16+' },
    ],
  },
  {
    id: 21,
    name: 'Journey Mental Health Center',
    initials: 'JM',
    color: '#6f4997',
    type: 'Nonprofit',
    category: 'Mental Health',
    desc: 'Dane County\'s primary community mental health center offering individual therapy for adults, children, and families; group therapy; DBT; substance use treatment; medication management; mobile crisis intervention; and specialty programs for Spanish-speaking and Black community residents.',
    mission: 'Journey Mental Health Center provides compassionate mental health services to Dane County residents, regardless of their ability to pay.',
    website: 'journeymhc.org',
    phone: '(608) 280-2720 (scheduling) | (608) 280-2600 (24/7 crisis line)',
    address: '49 Kessel Court, Suite 105, Madison, WI 53711',
    hours: 'Outpatient: Mon–Fri 8 AM–5 PM | Crisis line: 24/7',
    impact: [
      { label: 'Crisis line available', value: '24/7/365' },
      { label: 'No one turned away for inability to pay', value: 'Yes' },
      { label: 'Specialty programs', value: 'Clínica Latina, Ujima (Black community)' },
    ],
  },
  {
    id: 22,
    name: 'Dane County Behavioral Health Resource Center',
    initials: 'BH',
    color: '#6f4997',
    type: 'Government',
    category: 'Mental Health',
    desc: 'A free navigation and peer-support center operated by Dane County. Helps residents identify and connect to counseling, psychiatry, peer support, and case management services. Walk-ins welcome Mon–Fri with no referral, income, or insurance requirement. Bilingual staff in English, Spanish, and Hmong.',
    mission: 'The BHRC helps Dane County residents access the behavioral health services and support they need to thrive.',
    website: 'danebhrc.org',
    phone: '(608) 267-2244',
    address: '2450 Rimrock Road, Suite 301, Madison, WI 53713',
    hours: 'Phones: Mon–Fri 7:45 AM–4:30 PM | Walk-ins: Mon–Fri 8:30 AM–4:00 PM',
    impact: [
      { label: 'Cost', value: 'Free — no insurance needed' },
      { label: 'Referral required', value: 'No' },
      { label: 'Languages', value: 'English, Spanish, Hmong' },
    ],
  },
  {
    id: 23,
    name: 'Madison Metro Transit — Half-Price Fare Program',
    initials: 'MM',
    color: '#5C6BC0',
    type: 'Government',
    category: 'Transportation',
    desc: 'Reduces Madison Metro bus fares by 50% for eligible residents including youth, seniors, people with disabilities, and low-income riders. A Fast Fare card is required. Low-income riders self-certify — no documentation needed beyond a signature or SNAP/EBT card.',
    mission: 'Madison Metro Transit provides safe, reliable, and equitable public transportation to the Madison community.',
    website: 'cityofmadison.com/metro',
    phone: '(608) 266-4466',
    address: '1245 E. Washington Ave., Suite 201, Madison, WI 53702',
    hours: 'Admin Office: Mon–Fri 6:15 AM–6 PM | Weekends 8 AM–4:30 PM',
    impact: [
      { label: 'Fare reduction', value: '50%' },
      { label: 'Low-income eligibility', value: '150% FPL or below' },
      { label: 'Where to enroll', value: 'Metro office or any Madison Public Library' },
    ],
  },
  {
    id: 24,
    name: 'Legal Action of Wisconsin — Madison Office',
    initials: 'LA',
    color: '#C62828',
    type: 'Legal Aid Organization',
    category: 'Legal Aid',
    desc: 'Free civil legal help for low-income Dane County residents. Offers full representation, brief legal advice, and self-help resources in housing, employment, debt and taxes, public benefits, family law, and victim support. Specialized staff serve veterans, seniors, people in recovery, farmworkers, and those recently released from incarceration.',
    mission: 'Legal Action of Wisconsin provides free civil legal services to low-income people throughout Wisconsin.',
    website: 'legalaction.org',
    phone: '(855) 947-2529 (intake) | (608) 256-3304 (Madison office)',
    address: '744 Williamson Street, Suite 200, Madison, WI 53703',
    hours: 'Intake line: Mon–Fri 9 AM–4 PM | Online intake: 24/7',
    impact: [
      { label: 'Income limit (most cases)', value: 'Below 125% FPL' },
      { label: 'No income limit for', value: 'Crime victims age 60+' },
      { label: 'Walk-in availability', value: 'Yes, during office hours' },
    ],
  },
  {
    id: 25,
    name: 'Reach Dane — Head Start & Early Head Start',
    initials: 'RD',
    color: '#F4C04B',
    type: 'Government-Funded Nonprofit',
    category: 'Child Care',
    desc: 'The primary Head Start and Early Head Start operator in Dane County, serving children birth through age 5 with comprehensive early childhood education, health screenings, nutrition, mental health support, and family services. Transportation provided within service areas.',
    mission: 'Reach Dane empowers and strengthens children, families, and communities to reach their full potential.',
    website: 'reachdane.org',
    phone: '(608) 275-6740',
    address: '2096 Red Arrow Trail, Madison, WI 53711',
    hours: 'Center-based: Mon–Fri 6 AM–6 PM (full-day) | Home-based: weekly 90-min home visits',
    impact: [
      { label: 'Cost', value: 'Free for eligible families' },
      { label: 'Ages served', value: 'Birth to 5 & pregnant women' },
      { label: 'Transportation provided', value: 'Within service areas' },
    ],
  },
  {
    id: 26,
    name: 'Dane County Human Services',
    initials: 'DC',
    color: '#1565C0',
    type: 'Government',
    category: 'Financial Aid & Benefits',
    desc: 'The county\'s primary hub for enrolling in public benefits including FoodShare (SNAP), BadgerCare Plus (Medicaid), child care subsidies, and utility assistance. The Joining Forces for Families program provides one-on-one navigation for benefit applications and renewals.',
    mission: 'Dane County Human Services helps residents access the benefits and services they need to thrive.',
    website: 'danecountyhumanservices.org',
    phone: '(608) 242-6200',
    address: '1919 Alliant Energy Center Way, Madison, WI 53713',
    hours: 'Mon–Fri 8 AM–5 PM',
    impact: [
      { label: 'Programs available', value: 'FoodShare, BadgerCare, Child Care, WHEAP' },
      { label: 'Apply online 24/7', value: 'access.wi.gov' },
      { label: 'Navigation help', value: 'Ask for Joining Forces for Families' },
    ],
  },
  {
    id: 27,
    name: 'Energy Services Inc. (ESI) — Dane County',
    initials: 'ES',
    color: '#E07B2A',
    type: 'Community Action Agency',
    category: 'Financial Aid',
    desc: 'Local WHEAP administrator for Dane County, providing up to $2,147 in annual heating benefits and up to $1,200 in crisis assistance for households facing shutoff or loss of heat. Serves natural gas, propane, oil, wood, and electric.',
    mission: 'ESI helps low-income Dane County residents manage energy costs and maintain safe, warm homes.',
    website: 'energybenefit.wi.gov',
    phone: '(608) 267-8601 | Toll-free: 1-800-506-5596',
    address: '2817 Fish Hatchery Road, Suite 2, Madison, WI 53713',
    hours: 'Mon–Fri 8 AM–5 PM',
    impact: [
      { label: 'Max heating benefit', value: '$2,147' },
      { label: 'Max crisis assistance', value: '$1,200' },
      { label: 'Income limit', value: '60% of Wisconsin State Median Income' },
    ],
  },
  {
    id: 28,
    name: 'Access to Independence Inc. (ATI)',
    initials: 'AT',
    color: '#388E3C',
    type: 'Independent Living Center',
    category: 'Disability Services',
    desc: 'The state-designated Independent Living Center for Dane, Columbia, Dodge, and Green counties. Provides free advocacy, information and referral, assistive technology loan/demonstration (1,000+ devices), accessibility assessments, skills training, peer support, and transition services.',
    mission: 'Access to Independence empowers people with disabilities to live independently and fully participate in their communities.',
    website: 'accesstoind.org',
    phone: '(608) 242-8484 | Toll-free: 1-800-362-9877',
    address: '3810 Milwaukee Street, Madison, WI 53714',
    hours: 'Mon–Fri 8 AM–5 PM',
    impact: [
      { label: 'Cost of all services', value: 'Free' },
      { label: 'Income or disability level required', value: 'None' },
      { label: 'Assistive technology devices available to loan', value: '1,000+' },
    ],
  },
  {
    id: 29,
    name: 'Dane County ADRC',
    initials: 'AD',
    color: '#5C6BC0',
    type: 'Government',
    category: 'Senior & Disability Services',
    desc: 'Dane County\'s official single-entry point for all publicly funded long-term care, aging, and disability services. Provides unbiased information and counseling on in-home care, housing, transportation, public benefits, and caregiver support. Includes free Benefit Specialists for Medicare, Medicaid, Social Security, and benefit denials.',
    mission: 'The Dane County ADRC connects older adults, people with disabilities, and their caregivers to services and supports that promote independence and well-being.',
    website: 'daneadrc.org',
    phone: '(608) 240-7400 | Toll-free: (855) 417-6892',
    address: '2865 N. Sherman Avenue, Madison, WI 53704 (Northside Town Center)',
    hours: 'Mon–Fri 8:30 AM–4:00 PM',
    impact: [
      { label: 'Cost', value: 'Free' },
      { label: 'Referral or income required', value: 'None' },
      { label: 'Walk-in appointments', value: 'Mon–Fri 8:30 AM–4 PM' },
    ],
  },
]
