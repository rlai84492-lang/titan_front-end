// ─────────────────────────────────────────────────────────────
//  API
// ─────────────────────────────────────────────────────────────
export const API_BASE = 'http://localhost:8080'

export async function apiFetch(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────
export const STEP_ORDER = [
  'WELCOME', 'COLLECTION', 'STYLE', 'CAROUSEL',
  'PRICE_FILTER', 'CALLBACK_CONFIRM', 'OFFER', 'COMPLETED',
]

export const STEP_LABELS = {
  WELCOME:          'Welcome',
  COLLECTION:       'Collection',
  STYLE:            'Style',
  CAROUSEL:         'Carousel',
  PRICE_FILTER:     'Price filter',
  CALLBACK_CONFIRM: 'Callback',
  OFFER:            'Birthday offer',
  COMPLETED:        'Completed',
}

export const STEP_COLORS = {
  WELCOME:          '#378ADD',
  COLLECTION:       '#7F77DD',
  STYLE:            '#1D9E75',
  CAROUSEL:         '#EF9F27',
  PRICE_FILTER:     '#D4537E',
  CALLBACK_CONFIRM: '#639922',
  OFFER:            '#E85A2B',
  COMPLETED:        '#059669',
}

export const STEP_BG = {
  WELCOME:          '#EBF4FD',
  COLLECTION:       '#EEEDFE',
  STYLE:            '#E1F5EE',
  CAROUSEL:         '#FEF3CD',
  PRICE_FILTER:     '#FCEEF4',
  CALLBACK_CONFIRM: '#EAF3DE',
  OFFER:            '#FEF0EB',
  COMPLETED:        '#D1FAE5',
}

// ─────────────────────────────────────────────────────────────
//  Mock data generators
// ─────────────────────────────────────────────────────────────
export function getMockSessions() {
  return [
    { id:1,  customerId:1,  phone:'919876543210', currentStep:'WELCOME',          selectedCollection:null,    selectedStyle:null,               lastActivity: new Date(Date.now()-2*60000).toISOString(),   isActive:true,  customerName:'Aditya Sharma',  gender:'MENS'   },
    { id:2,  customerId:2,  phone:'919812345678', currentStep:'COLLECTION',        selectedCollection:null,    selectedStyle:null,               lastActivity: new Date(Date.now()-5*60000).toISOString(),   isActive:true,  customerName:'Priya Patel',    gender:'WOMENS' },
    { id:3,  customerId:3,  phone:'919898765432', currentStep:'STYLE',             selectedCollection:'MENS',  selectedStyle:null,               lastActivity: new Date(Date.now()-8*60000).toISOString(),   isActive:true,  customerName:'Rahul Gupta',    gender:'MENS'   },
    { id:4,  customerId:4,  phone:'919887654321', currentStep:'CAROUSEL',          selectedCollection:'WOMENS',selectedStyle:'MINIMAL_CHIC',     lastActivity: new Date(Date.now()-12*60000).toISOString(),  isActive:true,  customerName:'Sneha Reddy',    gender:'WOMENS' },
    { id:5,  customerId:5,  phone:'919801234567', currentStep:'PRICE_FILTER',      selectedCollection:'WOMENS',selectedStyle:'LUXE_CLASSY',      lastActivity: new Date(Date.now()-18*60000).toISOString(),  isActive:true,  customerName:'Kiran Nair',     gender:'WOMENS' },
    { id:6,  customerId:6,  phone:'919890123456', currentStep:'CALLBACK_CONFIRM',  selectedCollection:'MENS',  selectedStyle:'BOLD_EDGY',        lastActivity: new Date(Date.now()-25*60000).toISOString(),  isActive:true,  customerName:'Meera Joshi',    gender:'MENS'   },
    { id:7,  customerId:7,  phone:'919867890123', currentStep:'OFFER',             selectedCollection:'MENS',  selectedStyle:'SPORTY_ADVENTUROUS',lastActivity: new Date(Date.now()-40*60000).toISOString(), isActive:true,  customerName:'Arjun Singh',    gender:'MENS'   },
    { id:8,  customerId:8,  phone:'919845678901', currentStep:'COMPLETED',         selectedCollection:'WOMENS',selectedStyle:'LUXE_CLASSY',      lastActivity: new Date(Date.now()-60*60000).toISOString(),  isActive:false, customerName:'Divya Verma',    gender:'WOMENS' },
    { id:9,  customerId:9,  phone:'919834567890', currentStep:'COMPLETED',         selectedCollection:'MENS',  selectedStyle:'MINIMAL_CHIC',     lastActivity: new Date(Date.now()-90*60000).toISOString(),  isActive:false, customerName:'Rohit Kumar',    gender:'MENS'   },
    { id:10, customerId:10, phone:'919823456789', currentStep:'STYLE',             selectedCollection:'WOMENS',selectedStyle:null,               lastActivity: new Date(Date.now()-110*60000).toISOString(), isActive:true,  customerName:'Ananya Iyer',    gender:'WOMENS' },
    { id:11, customerId:11, phone:'919811223344', currentStep:'WELCOME',           selectedCollection:null,    selectedStyle:null,               lastActivity: new Date(Date.now()-3*60000).toISOString(),   isActive:true,  customerName:'Vikram Mehta',   gender:'MENS'   },
    { id:12, customerId:12, phone:'919822334455', currentStep:'CAROUSEL',          selectedCollection:'MENS',  selectedStyle:'BOLD_EDGY',        lastActivity: new Date(Date.now()-15*60000).toISOString(),  isActive:true,  customerName:'Neha Kapoor',    gender:'WOMENS' },
  ]
}

export function getMockLeads() {
  return [
    { id:1, phone:'919876543210', customerName:'Aditya Sharma', leadType:'CALLBACK',    status:'NEW',       selectedCollection:'MENS',   selectedStyle:'BOLD_EDGY',        priceRange:'5000-10000',  createdAt: new Date(Date.now()-20*60000).toISOString()  },
    { id:2, phone:'919812345678', customerName:'Priya Patel',   leadType:'STORE_VISIT', status:'CONTACTED', selectedCollection:'WOMENS', selectedStyle:'LUXE_CLASSY',      priceRange:null,          createdAt: new Date(Date.now()-55*60000).toISOString()  },
    { id:3, phone:'919898765432', customerName:'Rahul Gupta',   leadType:'CALLBACK',    status:'NEW',       selectedCollection:'MENS',   selectedStyle:null,               priceRange:'10000-25000', createdAt: new Date(Date.now()-80*60000).toISOString()  },
    { id:4, phone:'919887654321', customerName:'Sneha Reddy',   leadType:'WEBSITE',     status:'CONVERTED', selectedCollection:null,     selectedStyle:null,               priceRange:null,          createdAt: new Date(Date.now()-120*60000).toISOString() },
    { id:5, phone:'919801234567', customerName:'Kiran Nair',    leadType:'STORE_VISIT', status:'NEW',       selectedCollection:'WOMENS', selectedStyle:'MINIMAL_CHIC',     priceRange:'2000-5000',   createdAt: new Date(Date.now()-180*60000).toISOString() },
    { id:6, phone:'919867890123', customerName:'Arjun Singh',   leadType:'CALLBACK',    status:'ASSIGNED',  selectedCollection:'MENS',   selectedStyle:'SPORTY_ADVENTUROUS',priceRange:'5000-10000', createdAt: new Date(Date.now()-240*60000).toISOString() },
    { id:7, phone:'919845678901', customerName:'Divya Verma',   leadType:'STORE_VISIT', status:'CONVERTED', selectedCollection:'WOMENS', selectedStyle:'LUXE_CLASSY',      priceRange:'25000+',      createdAt: new Date(Date.now()-300*60000).toISOString() },
  ]
}

export function getMockHourly() {
  const labels = []
  const inbound = []
  const outbound = []
  for (let h = 8; h <= 20; h++) {
    labels.push(`${h}:00`)
    inbound.push(Math.floor(Math.random() * 15) + 3)
    outbound.push(Math.floor(Math.random() * 22) + 5)
  }
  return { labels, inbound, outbound }
}

export function getMockCampaignWeek() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  return {
    labels: days,
    t10:  days.map(() => Math.floor(Math.random()*18)+4),
    tday: days.map(() => Math.floor(Math.random()*10)+2),
  }
}

export function getMockPriceData() {
  return { '₹2k–5k': 8, '₹5k–10k': 14, '₹10k–25k': 11, '>₹25k': 5 }
}

export function getMockTimeline() {
  return [
    { icon:'💬', color:'#378ADD', bg:'#EBF4FD', text:'Aditya Sharma started a new conversation', time: new Date(Date.now()-2*60000).toISOString()   },
    { icon:'👗', color:'#D4537E', bg:'#FCEEF4', text:"Priya Patel selected Women's Collection",  time: new Date(Date.now()-5*60000).toISOString()   },
    { icon:'📞', color:'#639922', bg:'#EAF3DE', text:'Rahul Gupta requested a callback',          time: new Date(Date.now()-12*60000).toISOString()  },
    { icon:'🏪', color:'#1D9E75', bg:'#E1F5EE', text:'Sneha Reddy booked a store visit',         time: new Date(Date.now()-25*60000).toISOString()  },
    { icon:'💰', color:'#EF9F27', bg:'#FEF3CD', text:'Kiran Nair chose ₹10k–₹25k range',         time: new Date(Date.now()-40*60000).toISOString()  },
    { icon:'✅', color:'#059669', bg:'#D1FAE5', text:'Divya Verma completed the full bot flow',   time: new Date(Date.now()-65*60000).toISOString()  },
    { icon:'🚀', color:'#E85A2B', bg:'#FEF0EB', text:'T-10 campaign sent to 6 customers',        time: new Date(Date.now()-120*60000).toISOString() },
    { icon:'⌚', color:'#7F77DD', bg:'#EEEDFE', text:'Arjun Singh viewed Bold & Edgy carousel',  time: new Date(Date.now()-150*60000).toISOString() },
  ]
}

export function computeMetrics(sessions, leads) {
  const completed = sessions.filter(s => s.currentStep === 'COMPLETED').length
  const total = sessions.length
  return {
    totalReached:    total,
    activeSessions:  sessions.filter(s => s.isActive).length,
    callbackLeads:   leads.filter(l => l.leadType === 'CALLBACK').length,
    storeVisits:     leads.filter(l => l.leadType === 'STORE_VISIT').length,
    conversionRate:  total > 0 ? Math.round((completed / total) * 100) : 0,
    completedFlows:  completed,
    newLeads:        leads.filter(l => l.status === 'NEW').length,
    converted:       leads.filter(l => l.status === 'CONVERTED').length,
  }
}

// ─────────────────────────────────────────────────────────────
//  Utilities
// ─────────────────────────────────────────────────────────────
export function relTime(iso) {
  if (!iso) return ''
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })
}

export function initials(name) {
  if (!name) return '?'
  const p = name.trim().split(' ')
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase()
}

export function avatarColor(name) {
  const colors = [
    ['#E85A2B','#FEF0EB'], ['#378ADD','#EBF4FD'],
    ['#7F77DD','#EEEDFE'], ['#1D9E75','#E1F5EE'],
    ['#EF9F27','#FEF3CD'], ['#D4537E','#FCEEF4'],
  ]
  let hash = 0
  for (const c of (name||'?')) hash = c.charCodeAt(0) + hash
  return colors[hash % colors.length]
}

export function getStyleCounts(sessions) {
  const base = { MINIMAL_CHIC:4, BOLD_EDGY:5, LUXE_CLASSY:6, SPORTY_ADVENTUROUS:3 }
  sessions.forEach(s => { if (s.selectedStyle && base[s.selectedStyle] !== undefined) base[s.selectedStyle]++ })
  return base
}

export function getCollectionCounts(sessions) {
  let mens = 6, womens = 5
  sessions.forEach(s => {
    if (s.selectedCollection === 'MENS') mens++
    if (s.selectedCollection === 'WOMENS') womens++
  })
  return { mens, womens }
}

export function getFunnelCounts(sessions) {
  const seed = { WELCOME:12, COLLECTION:9, STYLE:8, CAROUSEL:6, PRICE_FILTER:4, CALLBACK_CONFIRM:3, OFFER:2, COMPLETED:2 }
  sessions.forEach(s => { if (seed[s.currentStep] !== undefined) seed[s.currentStep]++ })
  return seed
}