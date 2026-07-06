// ─────────────────────────────────────────────────────────────────────────────
// Quick Resources directory data
// Numbers/addresses should be verified before launch.
// ─────────────────────────────────────────────────────────────────────────────

// Always shown regardless of location
export const UNIVERSAL_SERVICES = [
  {
    category: 'Always Available',
    icon: '🚨',
    accent: '#c0392b',
    items: [
      {
        name: 'Emergency Services',
        phone: '911',
        desc: 'Police · Fire · Medical — life-threatening emergencies only',
        phoneDisplay: '9-1-1',
      },
      {
        name: 'Mental Health Crisis Line',
        phone: '988',
        desc: 'Suicide & Crisis Lifeline — call or text anytime, 24/7',
        phoneDisplay: '9-8-8',
      },
      {
        name: 'Community Resource Hotline',
        phone: '211',
        desc: 'Free referrals to health, food, housing & social services',
        phoneDisplay: '2-1-1',
      },
      {
        name: 'Poison Control Center',
        phone: '18002221222',
        phoneDisplay: '1-800-222-1222',
        desc: 'National Poison Control — 24/7',
      },
    ],
  },
]

// Location-specific services keyed by Nominatim county string
export const AREA_SERVICES = {

  // ── Rock County, WI ──────────────────────────────────────────────────────
  'Rock County': {
    label: 'Rock County, WI',
    categories: [
      {
        category: 'Non-Emergency Police & Fire',
        icon: '🚔',
        accent: '#2c3e8c',
        items: [
          {
            name: 'Janesville Police (Non-Emergency)',
            phone: '6087553100',
            phoneDisplay: '(608) 755-3100',
            address: '200 S Main St, Janesville, WI',
            mapsQuery: 'Janesville Police Department Janesville WI',
          },
          {
            name: 'Rock County Sheriff (Non-Emergency)',
            phone: '6087572244',
            phoneDisplay: '(608) 757-2244',
            address: '51 S Main St, Janesville, WI',
            mapsQuery: 'Rock County Sheriff Janesville WI',
          },
          {
            name: 'Beloit Police (Non-Emergency)',
            phone: '6083642000',
            phoneDisplay: '(608) 364-2000',
            address: '105 Rockford Rd, Beloit, WI',
            mapsQuery: 'Beloit Police Department Beloit WI',
          },
        ],
      },
      {
        category: 'Hospital & Emergency Care',
        icon: '🏥',
        accent: '#1a7340',
        items: [
          {
            name: 'Mercyhealth Hospital — Janesville',
            phone: '6087566000',
            phoneDisplay: '(608) 756-6000',
            address: '1010 N Washington St, Janesville, WI',
            mapsQuery: 'Mercyhealth Hospital Janesville WI',
            website: 'https://www.mercyhealthsystem.org',
          },
          {
            name: 'HSHS St. Elizabeth — Beloit',
            phone: '6083643000',
            phoneDisplay: '(608) 364-3000',
            address: '1506 E Bushnell St, Beloit, WI',
            mapsQuery: 'HSHS St Elizabeth Hospital Beloit WI',
          },
          {
            name: 'UW Health — Urgent Care (Janesville)',
            phone: '6086320500',
            phoneDisplay: '(608) 632-0500',
            address: '2600 N Lexington Dr, Janesville, WI',
            mapsQuery: 'UW Health Urgent Care Janesville WI',
            website: 'https://www.uwhealth.org',
          },
        ],
      },
      {
        category: 'Utilities',
        icon: '💧',
        accent: '#0077a8',
        items: [
          {
            name: 'Alliant Energy — Power Outage',
            phone: '18002554268',
            phoneDisplay: '1-800-255-4268',
            desc: 'Electric outage reporting — 24/7',
            website: 'https://www.alliantenergy.com',
          },
          {
            name: 'Black Hills Energy — Gas Emergency',
            phone: '18006948989',
            phoneDisplay: '1-800-694-8989',
            desc: 'Natural gas leak or emergency — 24/7',
            website: 'https://www.blackhillsenergy.com',
          },
          {
            name: 'City of Janesville Water Utility',
            phone: '6087553160',
            phoneDisplay: '(608) 755-3160',
            desc: 'Water service issues & billing',
            website: 'https://www.janesvillewi.gov/departments/water-utility',
          },
        ],
      },
      {
        category: 'Government Services',
        icon: '🏛️',
        accent: '#5a3e8a',
        items: [
          {
            name: 'Rock County DMV',
            phone: '6087545397',
            phoneDisplay: '(608) 754-5397',
            address: '51 S Main St, Janesville, WI',
            mapsQuery: 'Rock County DMV Janesville WI',
          },
          {
            name: 'Rock County Human Services',
            phone: '6087575499',
            phoneDisplay: '(608) 757-5499',
            address: '1900 Center Ave, Janesville, WI',
            mapsQuery: 'Rock County Human Services Janesville WI',
            website: 'https://www.co.rock.wi.us/departments/human-services',
          },
          {
            name: 'Rock County Clerk',
            phone: '6087573136',
            phoneDisplay: '(608) 757-3136',
            address: '51 S Main St, Janesville, WI',
            mapsQuery: 'Rock County Clerk Janesville WI',
          },
          {
            name: 'City of Janesville — Main Line',
            phone: '6087553000',
            phoneDisplay: '(608) 755-3000',
            address: '18 N Jackson St, Janesville, WI',
            mapsQuery: 'City of Janesville City Hall WI',
            website: 'https://www.janesvillewi.gov',
          },
        ],
      },
      {
        category: 'Food & Basic Needs',
        icon: '🍽️',
        accent: '#c17f24',
        items: [
          {
            name: 'Rock County Food Pantry Network',
            phone: '6087552200',
            phoneDisplay: '(608) 755-2200',
            desc: 'Call for nearest food pantry location',
          },
          {
            name: 'Salvation Army — Janesville',
            phone: '6087541101',
            phoneDisplay: '(608) 754-1101',
            address: '3 N Parker Dr, Janesville, WI',
            mapsQuery: 'Salvation Army Janesville WI',
            website: 'https://www.salvationarmyusa.org',
          },
          {
            name: 'Briarpatch Youth Services',
            phone: '6087521533',
            phoneDisplay: '(608) 752-1533',
            address: '1201 S Crosby Ave, Janesville, WI',
            mapsQuery: 'Briarpatch Youth Services Janesville WI',
            website: 'https://www.briarpatchinc.org',
          },
        ],
      },
      {
        category: 'Transportation',
        icon: '🚌',
        accent: '#2e7d6e',
        items: [
          {
            name: 'Janesville Transit System',
            phone: '6087554850',
            phoneDisplay: '(608) 755-4850',
            desc: 'Local bus routes & schedules',
            website: 'https://www.janesvillewi.gov/departments/transit',
          },
          {
            name: 'Rock County Ride Share',
            phone: '6087573810',
            phoneDisplay: '(608) 757-3810',
            desc: 'Paratransit & specialized transportation',
          },
        ],
      },
    ],
  },

  // ── Dane County, WI ──────────────────────────────────────────────────────
  'Dane County': {
    label: 'Dane County, WI',
    categories: [
      {
        category: 'Non-Emergency Police & Fire',
        icon: '🚔',
        accent: '#2c3e8c',
        items: [
          {
            name: 'Madison Police (Non-Emergency)',
            phone: '6082554300',
            phoneDisplay: '(608) 255-4300',
            address: '211 S Carroll St, Madison, WI',
            mapsQuery: 'Madison Police Department Madison WI',
          },
          {
            name: 'Dane County Sheriff (Non-Emergency)',
            phone: '6082664911',
            phoneDisplay: '(608) 266-4911',
            address: '115 W Doty St, Madison, WI',
            mapsQuery: 'Dane County Sheriff Madison WI',
          },
        ],
      },
      {
        category: 'Hospital & Emergency Care',
        icon: '🏥',
        accent: '#1a7340',
        items: [
          {
            name: 'UW Health — University Hospital',
            phone: '6082631500',
            phoneDisplay: '(608) 263-1500',
            address: '600 Highland Ave, Madison, WI',
            mapsQuery: 'UW Health University Hospital Madison WI',
            website: 'https://www.uwhealth.org',
          },
          {
            name: 'SSM Health St. Mary\'s Hospital',
            phone: '6082512333',
            phoneDisplay: '(608) 251-6100',
            address: '700 S Park St, Madison, WI',
            mapsQuery: "SSM Health St Mary's Hospital Madison WI",
            website: 'https://www.ssmhealth.com',
          },
        ],
      },
      {
        category: 'Utilities',
        icon: '💧',
        accent: '#0077a8',
        items: [
          {
            name: 'MG&E — Power Outage',
            phone: '18006457240',
            phoneDisplay: '1-800-245-7240',
            desc: 'Madison Gas & Electric — 24/7 outage line',
            website: 'https://www.mge.com',
          },
          {
            name: 'MG&E — Gas Emergency',
            phone: '18006457240',
            phoneDisplay: '1-800-245-7240',
            desc: 'Natural gas leak or emergency — 24/7',
          },
          {
            name: 'Madison Water Utility',
            phone: '6082664654',
            phoneDisplay: '(608) 266-4654',
            website: 'https://www.cityofmadison.com/water',
          },
        ],
      },
      {
        category: 'Government Services',
        icon: '🏛️',
        accent: '#5a3e8a',
        items: [
          {
            name: 'Dane County DMV',
            phone: '6087948256',
            phoneDisplay: '(608) 794-8256',
            address: '1 Fen Oak Ct, Madison, WI',
            mapsQuery: 'Dane County DMV Madison WI',
          },
          {
            name: 'Dane County Human Services',
            phone: '6082665000',
            phoneDisplay: '(608) 266-5000',
            address: '1202 Northport Dr, Madison, WI',
            mapsQuery: 'Dane County Human Services Madison WI',
          },
        ],
      },
    ],
  },

  // ── Walworth County, WI ──────────────────────────────────────────────────
  'Walworth County': {
    label: 'Walworth County, WI',
    categories: [
      {
        category: 'Non-Emergency Police & Fire',
        icon: '🚔',
        accent: '#2c3e8c',
        items: [
          {
            name: 'Walworth County Sheriff (Non-Emergency)',
            phone: '2627232210',
            phoneDisplay: '(262) 723-2210',
            address: '1800 County Road NN, Elkhorn, WI',
            mapsQuery: 'Walworth County Sheriff Elkhorn WI',
          },
          {
            name: 'Lake Geneva Police (Non-Emergency)',
            phone: '2622484433',
            phoneDisplay: '(262) 248-4433',
            address: '626 Geneva St, Lake Geneva, WI',
            mapsQuery: 'Lake Geneva Police Department Lake Geneva WI',
          },
          {
            name: 'Delavan Police (Non-Emergency)',
            phone: '2627288670',
            phoneDisplay: '(262) 728-8670',
            address: '123 S 2nd St, Delavan, WI',
            mapsQuery: 'Delavan Police Department Delavan WI',
          },
        ],
      },
      {
        category: 'Hospital & Emergency Care',
        icon: '🏥',
        accent: '#1a7340',
        items: [
          {
            name: 'Aurora Medical Center — Lake Geneva',
            phone: '2622482691',
            phoneDisplay: '(262) 248-2691',
            address: 'N5900 County Road H, Lake Geneva, WI',
            mapsQuery: 'Aurora Medical Center Lake Geneva WI',
            website: 'https://www.aurorahealthcare.org',
          },
          {
            name: 'Mercyhealth Hospital — Walworth',
            phone: '2627238551',
            phoneDisplay: '(262) 723-8551',
            address: 'N2950 WI-67, Elkhorn, WI',
            mapsQuery: 'Mercyhealth Hospital Elkhorn WI',
            website: 'https://www.mercyhealthsystem.org',
          },
        ],
      },
      {
        category: 'Utilities',
        icon: '💧',
        accent: '#0077a8',
        items: [
          {
            name: 'Alliant Energy — Power Outage',
            phone: '18002554268',
            phoneDisplay: '1-800-255-4268',
            desc: 'Electric outage reporting — 24/7',
            website: 'https://www.alliantenergy.com',
          },
          {
            name: 'WE Energies — Gas Emergency',
            phone: '18002429137',
            phoneDisplay: '1-800-242-9137',
            desc: 'Natural gas leak or emergency — 24/7',
            website: 'https://www.we-energies.com',
          },
          {
            name: 'Black Hills Energy — Gas Emergency',
            phone: '18006948989',
            phoneDisplay: '1-800-694-8989',
            desc: 'Natural gas emergency (some Walworth areas) — 24/7',
            website: 'https://www.blackhillsenergy.com',
          },
        ],
      },
      {
        category: 'Government Services',
        icon: '🏛️',
        accent: '#5a3e8a',
        items: [
          {
            name: 'Walworth County DMV',
            phone: '2627414200',
            phoneDisplay: '(262) 741-4200',
            address: '1800 County Road NN, Elkhorn, WI',
            mapsQuery: 'Walworth County DMV Elkhorn WI',
          },
          {
            name: 'Walworth County Human Services',
            phone: '2627413200',
            phoneDisplay: '(262) 741-3200',
            address: '1910 County Road NN, Elkhorn, WI',
            mapsQuery: 'Walworth County Human Services Elkhorn WI',
            website: 'https://www.co.walworth.wi.us/218/Health-Human-Services',
          },
          {
            name: 'Walworth County Clerk',
            phone: '2627414241',
            phoneDisplay: '(262) 741-4241',
            address: '100 W Walworth St, Elkhorn, WI',
            mapsQuery: 'Walworth County Clerk Elkhorn WI',
          },
        ],
      },
      {
        category: 'Food & Basic Needs',
        icon: '🍽️',
        accent: '#c17f24',
        items: [
          {
            name: 'The Bridge Food & Diaper Bank',
            phone: '2627494999',
            phoneDisplay: '(262) 749-4999',
            address: '37 Broad St, Elkhorn, WI',
            mapsQuery: 'The Bridge Food Bank Elkhorn WI',
            website: 'https://www.bridgeelkhorn.org',
          },
          {
            name: 'The Time Is Now To Help',
            phone: '2622491107',
            phoneDisplay: '(262) 249-1107',
            address: '1080 Ann St, Lake Geneva, WI',
            mapsQuery: 'The Time Is Now To Help Lake Geneva WI',
            website: 'https://www.thetimeisnowtohelp.org',
          },
        ],
      },
      {
        category: 'Transportation',
        icon: '🚌',
        accent: '#2e7d6e',
        items: [
          {
            name: 'Walworth County Transit',
            phone: '2627413200',
            phoneDisplay: '(262) 741-3200',
            desc: 'Demand-response transit & medical transport',
            website: 'https://www.co.walworth.wi.us',
          },
        ],
      },
    ],
  },
}
