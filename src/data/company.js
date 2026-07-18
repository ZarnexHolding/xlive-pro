// Real XLIVE company data — sourced from the Business Profile, Projects deck &
// Brand Guidelines. No invented figures.

export const company = {
  name: 'XLIVE Production',
  descriptor: 'Event Production & Technologies',
  tagline: 'Where Experiences Come Alive.',
  positioning: 'Your vision, engineered to perform with precision.',
  parent: 'Zarnex Holding Company',
  cr: '7050427413',
  domain: 'xlive-pro.com',
  phone: '+966 53 430 7007',
  phoneHref: 'tel:+966534307007',
  address: {
    line1: 'Abdul Aziz Bin Sabil Street',
    line2: 'Al Farooq District 6485',
    city: 'Riyadh',
    country: 'Saudi Arabia',
  },
}

// Primary navigation. `href` = in-page anchor (home sections); `to` = route.
export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Fabrication', href: '#fabrication' },
  { label: 'Industries', href: '#industries' },
  { label: 'Partners', to: '/partners' },
  { label: 'About', to: '/about' },
]

// Honest, source-backed metrics
export const metrics = [
  { value: 3, suffix: '×', label: 'F1 Saudi Arabian Grand Prix', sub: '2023 · 2024 · 2025' },
  { value: 10, suffix: '+', label: 'Flagship events delivered', sub: 'Motorsport · brand · exhibition' },
  { value: 6, suffix: '', label: 'Production disciplines', sub: 'Under one roof' },
  { value: 4, suffix: '', label: 'Turnkey solution areas', sub: 'Concept to dismantle' },
]

// Real clients & rights-holders XLIVE has produced for (text wordmarks until
// licensed logo files are supplied).
export const clients = [
  { name: 'Formula 1', id: 'f1' },
  { name: 'McLaren F1 Team', id: 'mclaren' },
  { name: 'Oracle Red Bull Racing', id: 'redbull-racing' },
  { name: 'WRC', id: 'wrc' },
  { name: 'Saudi Motorsport', id: 'saudi-motorsport' },
  { name: 'Ministry of Sports', id: 'mos' },
  { name: 'Dakar Rally', id: 'dakar' },
  { name: 'GITEX Global', id: 'gitex' },
  { name: 'IWC Schaffhausen', id: 'iwc' },
  { name: 'ENEC', id: 'enec' },
  { name: 'Fortinet', id: 'fortinet' },
  { name: 'Formula E', id: 'formula-e' },
]

export const clientCategories = [
  'International Motorsport Federations',
  'Government Ministries & Authorities',
  'Corporate & Luxury Brands',
  'Event Organizers & Agencies',
  'Tourism & Entertainment Commissions',
]
