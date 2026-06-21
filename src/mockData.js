// ─────────────────────────────────────────────────────────────
//  Flow constants — used by FlowSelector, StepBadge, Funnel, etc.
// ─────────────────────────────────────────────────────────────

export const FLOW_KEYS = ['bday_t10', 'bday_t0', 'anniv_t10', 'anniv_t0']

export const FLOW_LABELS = {
  bday_t10:  'Birthday T-10',
  bday_t0:   'Birthday T-0',
  anniv_t10: 'Anniversary T-10',
  anniv_t0:  'Anniversary T-0',
}

export const FLOW_ICONS = {
  bday_t10:  '🎂',
  bday_t0:   '🎁',
  anniv_t10: '💍',
  anniv_t0:  '🌹',
}

export const FLOW_COLORS = {
  bday_t10:  '#E85A2B',
  bday_t0:   '#D4537E',
  anniv_t10: '#7F77DD',
  anniv_t0:  '#1D9E75',
}

export const FLOW_STEPS = {
  bday_t10: [
    'BIRTHDAY_T10_CONFIRMATION_SENT',
    'BIRTHDAY_T10_DOB_CORRECTION_PENDING',
    'BIRTHDAY_T10_BRIDGE_SENT',
    'BIRTHDAY_T10_OPENER_SENT',
    'BIRTHDAY_T10_GENDER_SELECTION_SENT',
    'BIRTHDAY_T10_MEN_BRAND_CAROUSEL_SENT',
    'BIRTHDAY_T10_WOMEN_BRAND_CAROUSEL_SENT',
    'BIRTHDAY_T10_CATALOGUE_SENT',
    // 'BIRTHDAY_T10_CATALOGUE_FOLLOW_UP_SENT',
    'BIRTHDAY_T10_OFFER_SENT',
    'BIRTHDAY_T10_STORE_VISIT_SENT',
    // 'BIRTHDAY_T10_CALLBACK_CONFIRMED',
  ],
  bday_t0: [
    'BIRTHDAY_TDAY_TEMPLATE_SENT',
    'BIRTHDAY_TDAY_OPENER_SENT',
    'BIRTHDAY_TDAY_GENDER_SELECTION_SENT',
    'BIRTHDAY_TDAY_MEN_BRAND_CAROUSEL_SENT',
    'BIRTHDAY_TDAY_WOMEN_BRAND_CAROUSEL_SENT',
    'BIRTHDAY_TDAY_OFFER_SENT',
    'BIRTHDAY_TDAY_T10_STORE_VISIT_SENT',
    'BIRTHDAY_TDAY_T10_CALLBACK_CONFIRMED',
    'BIRTHDAY_TDAY_FLOW_COMPLETED',
  ],
  anniv_t10: [
    'ANNIVERSARY_T10_CONFIRMATION_SENT',
    'ANNIVERSARY_T10_DATE_CORRECTION_PENDING',
    'ANNIVERSARY_T10_BRIDGE_SENT',
    'ANNIVERSARY_T10_OPENER_SENT',
    'ANNIVERSARY_T10_GENDER_SELECTION_SENT',
    'ANNIVERSARY_T10_MEN_BRAND_CAROUSEL_SENT',
    'ANNIVERSARY_T10_WOMEN_BRAND_CAROUSEL_SENT',
    'ANNIVERSARY_T10_COUPLE_CATALOGUE_SENT',
    'ANNIVERSARY_T10_CATALOGUE_SENT',
    'ANNIVERSARY_T10_OFFER_SENT',
    'ANNIVERSARY_T10_STORE_VISIT_SENT',
    'ANNIVERSARY_T10_CALLBACK_CONFIRMED',
  ],
  anniv_t0: [
    'ANNIVERSARY_TDAY_TEMPLATE_SENT',
    'ANNIVERSARY_TDAY_OPENER_SENT',
    'ANNIVERSARY_TDAY_GENDER_SELECTION_SENT',
    'ANNIVERSARY_TDAY_MEN_BRAND_CAROUSEL_SENT',
    'ANNIVERSARY_TDAY_WOMEN_BRAND_CAROUSEL_SENT',
    'ANNIVERSARY_TDAY_COUPLE_CATALOGUE_SENT',
    'ANNIVERSARY_TDAY_OFFER_SENT',
    'ANNIVERSARY_TDAY_COLLECTION_STORE_VISIT_SENT',
    'ANNIVERSARY_TDAY_COLLECTION_CALLBACK_CONFIRMED',
    'ANNIVERSARY_TDAY_FLOW_COMPLETED',
  ],
}

export const STEP_META = {
  BIRTHDAY_T10_CONFIRMATION_SENT:         { label: 'Month Confirm',     color: '#378ADD', bg: '#EBF4FD' },
  BIRTHDAY_T10_DOB_CORRECTION_PENDING:    { label: 'DOB Pending',       color: '#E09A1A', bg: '#FEF3CD' },
  BIRTHDAY_T10_BRIDGE_SENT:               { label: 'Bridge',            color: '#7F77DD', bg: '#EEEDFE' },
  BIRTHDAY_T10_OPENER_SENT:               { label: 'Opener',            color: '#E85A2B', bg: '#FEF0EB' },
  BIRTHDAY_T10_GENDER_SELECTION_SENT:     { label: 'Gender Select',     color: '#D4537E', bg: '#FCEEF4' },
  BIRTHDAY_T10_MEN_BRAND_CAROUSEL_SENT:   { label: "Men's Carousel",    color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_T10_WOMEN_BRAND_CAROUSEL_SENT: { label: "Women's Carousel",  color: '#0F6E56', bg: '#E0F2F1' },
  BIRTHDAY_T10_CATALOGUE_SENT:            { label: 'Catalogue',         color: '#378ADD', bg: '#EBF4FD' },
  BIRTHDAY_T10_OFFER_SENT:                { label: 'Birthday Offer',    color: '#E85A2B', bg: '#FEF0EB' },
  BIRTHDAY_T10_STORE_VISIT_SENT:          { label: 'Store Visit',       color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_T10_CALLBACK_CONFIRMED:        { label: 'Callback Done',     color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_TDAY_TEMPLATE_SENT:            { label: 'Template Sent',     color: '#E09A1A', bg: '#FEF3CD' },
  BIRTHDAY_TDAY_OPENER_SENT:              { label: 'Opener',            color: '#E85A2B', bg: '#FEF0EB' },
  BIRTHDAY_TDAY_GENDER_SELECTION_SENT:    { label: 'Gender Select',     color: '#D4537E', bg: '#FCEEF4' },
  BIRTHDAY_TDAY_MEN_BRAND_CAROUSEL_SENT:  { label: "Men's Carousel",    color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_TDAY_WOMEN_BRAND_CAROUSEL_SENT:{ label: "Women's Carousel",  color: '#0F6E56', bg: '#E0F2F1' },
  BIRTHDAY_TDAY_OFFER_SENT:               { label: 'Birthday Offer',    color: '#E85A2B', bg: '#FEF0EB' },
  BIRTHDAY_TDAY_T10_STORE_VISIT_SENT:     { label: 'Store Visit',       color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_TDAY_T10_CALLBACK_CONFIRMED:   { label: 'Callback Done',     color: '#1D9E75', bg: '#E1F5EE' },
  BIRTHDAY_TDAY_FLOW_COMPLETED:           { label: 'Completed',         color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_T10_CONFIRMATION_SENT:        { label: 'Month Confirm',   color: '#378ADD', bg: '#EBF4FD' },
  ANNIVERSARY_T10_DATE_CORRECTION_PENDING:  { label: 'Date Pending',    color: '#E09A1A', bg: '#FEF3CD' },
  ANNIVERSARY_T10_BRIDGE_SENT:              { label: 'Bridge',          color: '#7F77DD', bg: '#EEEDFE' },
  ANNIVERSARY_T10_OPENER_SENT:              { label: 'Opener',          color: '#E85A2B', bg: '#FEF0EB' },
  ANNIVERSARY_T10_GENDER_SELECTION_SENT:    { label: 'Gift Select',     color: '#D4537E', bg: '#FCEEF4' },
  ANNIVERSARY_T10_MEN_BRAND_CAROUSEL_SENT:  { label: "Men's Carousel",  color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_T10_WOMEN_BRAND_CAROUSEL_SENT:{ label: "Women's Carousel",color: '#0F6E56', bg: '#E0F2F1' },
  ANNIVERSARY_T10_COUPLE_CATALOGUE_SENT:    { label: 'Couple Watches',  color: '#7F77DD', bg: '#EEEDFE' },
  ANNIVERSARY_T10_CATALOGUE_SENT:           { label: 'Catalogue',       color: '#378ADD', bg: '#EBF4FD' },
  ANNIVERSARY_T10_OFFER_SENT:               { label: 'Anniv Offer',     color: '#E85A2B', bg: '#FEF0EB' },
  ANNIVERSARY_T10_STORE_VISIT_SENT:         { label: 'Store Visit',     color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_T10_CALLBACK_CONFIRMED:       { label: 'Callback Done',   color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_TDAY_TEMPLATE_SENT:                 { label: 'Template Sent', color: '#E09A1A', bg: '#FEF3CD' },
  ANNIVERSARY_TDAY_OPENER_SENT:                   { label: 'Opener',        color: '#E85A2B', bg: '#FEF0EB' },
  ANNIVERSARY_TDAY_GENDER_SELECTION_SENT:         { label: 'Gift Select',   color: '#D4537E', bg: '#FCEEF4' },
  ANNIVERSARY_TDAY_MEN_BRAND_CAROUSEL_SENT:       { label: "Men's Carousel",color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_TDAY_WOMEN_BRAND_CAROUSEL_SENT:     { label: "Women's Carousel",color:'#0F6E56', bg: '#E0F2F1' },
  ANNIVERSARY_TDAY_COUPLE_CATALOGUE_SENT:         { label: 'Couple Watches',color: '#7F77DD', bg: '#EEEDFE' },
  ANNIVERSARY_TDAY_OFFER_SENT:                    { label: 'Anniv Offer',   color: '#E85A2B', bg: '#FEF0EB' },
  ANNIVERSARY_TDAY_COLLECTION_STORE_VISIT_SENT:   { label: 'Store Visit',   color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_TDAY_COLLECTION_CALLBACK_CONFIRMED: { label: 'Callback Done', color: '#1D9E75', bg: '#E1F5EE' },
  ANNIVERSARY_TDAY_FLOW_COMPLETED:                { label: 'Completed',     color: '#1D9E75', bg: '#E1F5EE' },
}

export const BRANDS = [
  'Titan Edge', 'Titan Stellar', 'Titan Automatic',
  'Xylys', 'Titan Divers', 'Titan',
  'Titan Smart', 'Titan Raga', 'Fastrack',
]

export const BRAND_KEYS = [
  'TITAN_EDGE', 'Titan Stellar', 'TITAN_AUTOMATIC',
  'XYLYS', 'TITAN_DIVERS', 'TITAN',
  'TITAN_SMART', 'TITAN_RAGA', 'FASTRACK',
]

// ─────────────────────────────────────────────────────────────
//  Utilities — still needed by components
// ─────────────────────────────────────────────────────────────

export function relTime(iso) {
  if (!iso) return '—'
  const d = (Date.now() - new Date(iso)) / 1000
  if (d < 60)    return 'just now'
  if (d < 3600)  return Math.floor(d / 60) + 'm ago'
  if (d < 86400) return Math.floor(d / 3600) + 'h ago'
  return Math.floor(d / 86400) + 'd ago'
}

export function initials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function avatarColor(name) {
  const palette = [
    ['#E85A2B', '#FEF0EB'], ['#378ADD', '#EBF4FD'],
    ['#7F77DD', '#EEEDFE'], ['#1D9E75', '#E1F5EE'],
    ['#E09A1A', '#FEF3CD'], ['#D4537E', '#FCEEF4'],
    ['#0F6E56', '#E0F2F1'], ['#EA580C', '#FFF7ED'],
  ]
  let hash = 0
  for (const c of (name || '?')) hash = (c.charCodeAt(0) + hash * 31) >>> 0
  return palette[hash % palette.length]
}