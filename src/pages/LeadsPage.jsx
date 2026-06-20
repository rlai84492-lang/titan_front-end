import React, { useState, useEffect } from 'react'
import { useDashboard } from '../context/DashboardContext'
import { useUI } from '../context/UIContext'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Loader2 } from 'lucide-react'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import LeadsTableOne from '../Components/LeadsTableOne'

const FLOW_CONFIG = {
  bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', color: [59, 130, 246],  hex: '#3B82F6', tagBg: '#EFF6FF', tagColor: '#1D4ED8' },
  bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', color: [239, 68, 68],   hex: '#EF4444', tagBg: '#FEF2F2', tagColor: '#B91C1C' },
  anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', color: [168, 85, 247],  hex: '#A855F7', tagBg: '#F5F3FF', tagColor: '#7C3AED' },
  anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', color: [236, 72, 153],  hex: '#EC4899', tagBg: '#FDF2F8', tagColor: '#BE185D' },
  all:       { label: 'All Flows',         emoji: '📊', color: [15, 23, 42],    hex: '#0F172A', tagBg: '#F8FAFC', tagColor: '#334155' },
}

const STATUS_CONFIG = {
  NEW:       { color: [29, 78, 216]  },
  CONTACTED: { color: [6, 95, 70]    },
  CONVERTED: { color: [146, 64, 14]  },
  CLOSED:    { color: [55, 65, 81]   },
}

const todayStart = () => { const d = new Date(); d.setHours(0,0,0,0); return d.getTime() }

const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  } catch { return '—' }
}

const leadsToRows = (leads) =>
  leads.map((l, i) => ({
    '#':          i + 1,
    'Name':       l.customerName       || '—',
    'Phone':      l.phone              || '—',
    'Type':       l.leadType === 'STORE_VISIT' ? 'Store Visit' : l.leadType === 'CALLBACK' ? 'Callback' : l.leadType || '—',
    'Flow':       FLOW_CONFIG[l.flow]?.label   || l.flow || '—',
    'Collection': l.selectedCollection || '—',
    'Brand':      (l.selectedBrand     || '—').replace(/_/g, ' '),
    'Style':      (l.selectedStyle     || '—').replace(/_/g, ' '),
    'Step':       (l.stepName          || '—').replace(/_/g, ' ').toLowerCase(),
    'Status':     l.status             || '—',
    'Created':    fmtDate(l.createdAt),
  }))

// ── EXCEL Export ───────────────────────────────────────────────
const exportExcel = (leads, activeFlow) => {
  const cfg  = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.all
  const rows = leadsToRows(leads)

  const summaryData = [
    ['TITAN WORLD — WhatsApp Campaign Report'],
    [],
    ['Campaign Flow',  cfg.label],
    ['Report Type',    `${cfg.emoji} Lead Export`],
    ['Generated On',   new Date().toLocaleString('en-IN')],
    [],
    ['METRICS', ''],
    ['Total Leads',    leads.length],
    ['New Leads',      leads.filter(l => l.status === 'NEW').length],
    ['Converted',      leads.filter(l => l.status === 'CONVERTED').length],
    ['Callbacks',      leads.filter(l => l.leadType === 'CALLBACK').length],
    ['Store Visits',   leads.filter(l => l.leadType === 'STORE_VISIT').length],
    ['New Today',      leads.filter(l => new Date(l.createdAt).getTime() >= todayStart()).length],
  ]

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
  wsSummary['!cols'] = [{ wch: 22 }, { wch: 30 }]

  const wsLeads = XLSX.utils.json_to_sheet(rows)
  wsLeads['!cols'] = [
    { wch: 4 }, { wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    { wch: 14 }, { wch: 22 }, { wch: 18 }, { wch: 34 }, { wch: 14 }, { wch: 22 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, wsSummary, `${cfg.label} — Summary`)
  XLSX.utils.book_append_sheet(wb, wsLeads,   `${cfg.label} — Leads`)
  XLSX.writeFile(wb, `TitanWorld_${cfg.label.replace(/\s/g,'_')}_${new Date().toISOString().slice(0,10)}.xlsx`)
}

// ── PDF Export ─────────────────────────────────────────────────
const exportPDF = (leads, activeFlow) => {
  const cfg  = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.all
  const rows = leadsToRows(leads)
  const doc  = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const W    = 297
  const [r, g, b] = cfg.color

  // Header
  doc.setFillColor(10, 17, 35)
  doc.rect(0, 0, W, 30, 'F')
  doc.setFillColor(212, 175, 55)
  doc.rect(0, 0, W, 1.2, 'F')

  // Brand
  doc.setTextColor(212, 175, 55)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('TITAN WORLD', 14, 12)
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('WhatsApp Campaign Intelligence', 14, 18)
  doc.setTextColor(226, 232, 240)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('LEAD REPORT', 14, 26)

  // Flow badge
  doc.setFillColor(r, g, b)
  doc.roundedRect(W - 98, 7, 55, 11, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(`${cfg.label}`, W - 70.5, 14, { align: 'center' })

  // Date badge
  doc.setFillColor(30, 41, 59)
  doc.roundedRect(W - 40, 7, 36, 11, 3, 3, 'F')
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), W - 22, 14, { align: 'center' })

  // KPI Strip
  doc.setFillColor(248, 250, 252)
  doc.rect(0, 30, W, 22, 'F')
  doc.setFillColor(212, 175, 55)
  doc.rect(0, 30, W, 0.5, 'F')

  const callbacks  = leads.filter(l => l.leadType === 'CALLBACK').length
  const storeVisit = leads.filter(l => l.leadType === 'STORE_VISIT').length
  const newLeads   = leads.filter(l => l.status === 'NEW').length
  const converted  = leads.filter(l => l.status === 'CONVERTED').length
  const newToday   = leads.filter(l => new Date(l.createdAt).getTime() >= todayStart()).length

  const kpis = [
    { label: 'Total Leads',  value: leads.length, color: [15, 23, 42]   },
    { label: 'Callbacks',    value: callbacks,     color: [59, 130, 246] },
    { label: 'Store Visits', value: storeVisit,    color: [16, 185, 129] },
    { label: 'New Today',    value: newToday,      color: [245, 158, 11] },
    { label: 'New Leads',    value: newLeads,      color: [99, 102, 241] },
    { label: 'Converted',    value: converted,     color: [212, 175, 55] },
  ]

  kpis.forEach((kpi, i) => {
    const x = 14 + i * 47
    doc.setTextColor(...kpi.color)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(String(kpi.value), x, 42)
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.text(kpi.label.toUpperCase(), x, 47)
    if (i < kpis.length - 1) {
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(x + 43, 33, x + 43, 51)
    }
  })

  doc.setFillColor(212, 175, 55)
  doc.rect(0, 52, W, 0.4, 'F')

  // Table
  autoTable(doc, {
    startY: 56,
    head: [['#', 'Name', 'Phone', 'Type', 'Flow', 'Collection', 'Brand', 'Step', 'Status', 'Created']],
    body: rows.map(r => [
      r['#'], r['Name'], r['Phone'], r['Type'], r['Flow'],
      r['Collection'], r['Brand'], r['Step'], r['Status'], r['Created'],
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      textColor: [30, 41, 59],
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [10, 17, 35],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center', textColor: [148, 163, 184] },
      1: { cellWidth: 28, fontStyle: 'bold' },
      2: { cellWidth: 24, textColor: [100, 116, 139] },
      3: { cellWidth: 18 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18 },
      6: { cellWidth: 24 },
      7: { cellWidth: 40, textColor: [100, 116, 139], fontSize: 6.5 },
      8: { cellWidth: 18 },
      9: { cellWidth: 26, textColor: [100, 116, 139] },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 8) {
        const statusKey = data.cell.raw?.toUpperCase()
        const sc = STATUS_CONFIG[statusKey]
        if (sc) { data.cell.styles.textColor = sc.color; data.cell.styles.fontStyle = 'bold' }
      }
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'Callback')    data.cell.styles.textColor = [59, 130, 246]
        if (data.cell.raw === 'Store Visit') data.cell.styles.textColor = [16, 185, 129]
      }
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFillColor(10, 17, 35)
      doc.rect(0, 200, W, 10, 'F')
      doc.setFillColor(212, 175, 55)
      doc.rect(0, 200, W, 0.5, 'F')
      doc.setTextColor(212, 175, 55)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('TITAN WORLD', 14, 206.5)
      doc.setTextColor(148, 163, 184)
      doc.setFont('helvetica', 'normal')
      doc.text(`${cfg.emoji} ${cfg.label} · Lead Report`, W / 2, 206.5, { align: 'center' })
      doc.text(`Page ${data.pageNumber} / ${pageCount}`, W - 14, 206.5, { align: 'right' })
    },
  })

  doc.save(`TitanWorld_${cfg.label.replace(/\s/g,'_')}_Leads_${new Date().toISOString().slice(0,10)}.pdf`)
}

// ── Export Buttons — ab loading state ke saath ──────────────────
function ExportButtons({ leads, activeFlow }) {
  const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.all

  // ← NAYA: alag-alag loading state Excel aur PDF ke liye,
  //   taaki user ko pata chale ki export chal raha hai
  const [exportingExcel, setExportingExcel] = useState(false)
  const [exportingPdf,   setExportingPdf]   = useState(false)

  const handleExcel = async () => {
    if (exportingExcel) return
    setExportingExcel(true)
    try {
      // setTimeout se UI ko ek frame milta hai spinner render karne ke liye,
      // warna heavy XLSX generation synchronous hone se UI freeze ho jaata
      // aur spinner kabhi dikhta hi nahi
      await new Promise(resolve => setTimeout(resolve, 50))
      exportExcel(leads, activeFlow)
    } finally {
      setExportingExcel(false)
    }
  }

  const handlePdf = async () => {
    if (exportingPdf) return
    setExportingPdf(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      exportPDF(leads, activeFlow)
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
        style={{ background: cfg.tagBg, color: cfg.tagColor }}>
        {cfg.emoji} {cfg.label}
      </span>

      <button
        onClick={handleExcel}
        disabled={exportingExcel}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' }}>
        {exportingExcel
          ? <><Loader2 size={12} className="animate-spin" /> Exporting…</>
          : <>📊 Excel</>
        }
      </button>

      <button
        onClick={handlePdf}
        disabled={exportingPdf}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', color: '#fff' }}>
        {exportingPdf
          ? <><Loader2 size={12} className="animate-spin" /> Exporting…</>
          : <>📄 PDF</>
        }
      </button>
    </div>
  )
}

// ── Premium Loader (same pattern as Overview/Conversations) ─────
function PremiumLoader({ activeFlow }) {
  const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10
  const hex = cfg.hex
  const pulse = cfg.tagBg

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-dashed"
          style={{ borderColor: hex + '20', animation: 'spin 4s linear infinite' }} />
        <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
          style={{ borderTopColor: hex, borderRightColor: hex + '30', animation: 'spin 1.1s linear infinite' }} />
        <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: hex, borderLeftColor: hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
        <div className="absolute w-12 h-12 rounded-full"
          style={{ background: pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
        <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
          {cfg.emoji}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: hex }}>TITAN WORLD</span>
        <span className="w-1 h-1 rounded-full" style={{ background: hex + '80' }} />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Leads</span>
      </div>
      <div className="text-sm font-bold mb-1" style={{ color: hex }}>{cfg.label}</div>
      <div className="text-[10px] text-gray-400 mb-6">Loading leads…</div>

      <div className="flex items-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>

      <div className="w-full max-w-3xl px-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
          ))}
        </div>
        <div className="h-48 rounded-xl"
          style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
const PAGE_SIZE = 50

export default function LeadsPage() {
  const { leads: allLeads, loading } = useDashboard()  // ← Context API se
  const { activeFlow } = useUI()                       // ← Context API se
  const isBday = activeFlow?.includes('bday')
  const cfg    = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.all

  const [page, setPage] = useState(0)
  useEffect(() => { setPage(0) }, [activeFlow])

  // ── Loader — jab tak naya flow ka data nahi aata ────────────────
  if (loading) {
    return <PremiumLoader activeFlow={activeFlow} />
  }

  const totalLeads  = allLeads.length
  const totalPages  = Math.max(1, Math.ceil(totalLeads / PAGE_SIZE))
  const pagedLeads  = allLeads.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const newToday    = allLeads.filter(l => new Date(l.createdAt).getTime() >= todayStart()).length
  const callbacks   = allLeads.filter(l => l.leadType === 'CALLBACK').length
  const storeVisits = allLeads.filter(l => l.leadType === 'STORE_VISIT').length
  const converted   = allLeads.filter(l => l.status === 'CONVERTED').length
  const newLeads    = allLeads.filter(l => l.status === 'NEW').length
  const cbDiscovery = allLeads.filter(l => l.leadType === 'CALLBACK' && (l.flow === 'bday_t10' || l.flow === 'anniv_t10')).length
  const cbTday      = allLeads.filter(l => l.leadType === 'CALLBACK' && (l.flow === 'bday_t0'  || l.flow === 'anniv_t0')).length

  const metrics = [
    { label: 'Total Leads',                              value: totalLeads,  accent: 'blue',   icon: '🎯' },
    { label: 'New Today',                                value: newToday,    accent: 'orange', icon: '🆕' },
    { label: 'Callback – Discovery',                     value: cbDiscovery, accent: 'purple', icon: '📞' },
    { label: `Callback – ${isBday ? 'T-Day' : 'T-0'}`, value: cbTday,      accent: 'pink',   icon: isBday ? '🎂' : '💍' },
    { label: 'Store Visit Requests',                     value: storeVisits, accent: 'green',  icon: '🏪' },
    { label: 'New Leads',                                value: newLeads,    accent: 'indigo', icon: '🔵' },
    { label: 'Converted',                                value: converted,   accent: 'amber',  icon: '✅' },
    { label: 'Total Callbacks',                          value: callbacks,   accent: 'teal',   icon: '📲' },
  ]

  return (
    <div className="space-y-5">

      {/* ── Flow Header Banner ── */}
      <div className="rounded-xl px-5 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${cfg.hex}15, ${cfg.hex}05)`, border: `1px solid ${cfg.hex}25` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg.emoji}</span>
          <div>
            <div className="font-bold text-sm" style={{ color: cfg.hex }}>{cfg.label}</div>
            <div className="text-[10px] text-gray-400">Lead Management · {totalLeads} total leads</div>
          </div>
        </div>
        <ExportButtons leads={allLeads} activeFlow={activeFlow} />
      </div>

      {/* ── Metric Tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {metrics.map((m, i) => (
          <MetricCardOne key={m.label} {...m} delay={i * 40} />
        ))}
      </div>

      {/* ── Leads Table ── */}
      <CardOne
        title={`All Leads (${totalLeads})`}
        subtitle={`${cfg.emoji} ${cfg.label} · Collection, brand and step context`}
        icon="🎯"
      >
        <LeadsTableOne leads={pagedLeads} />

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalLeads)} of {totalLeads} leads
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(0)} disabled={page === 0}
                className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">«</button>
              <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
                className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">← Prev</button>

              {/* ← FIX: pagination ab sahi page numbers dikhata hai
                   jab page badhta hai, sliding window ki tarah, 5 tak nahi atakta */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let startPage = Math.max(0, page - 2)
                if (startPage + 5 > totalPages) startPage = Math.max(0, totalPages - 5)
                return startPage + i
              }).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="px-3 py-1 text-xs rounded border transition-colors"
                  style={p === page
                    ? { background: cfg.hex, borderColor: cfg.hex, color: '#fff' }
                    : { borderColor: '#E5E7EB' }
                  }
                >{p + 1}</button>
              ))}

              <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page >= totalPages-1}
                className="px-3 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">Next →</button>
              <button onClick={() => setPage(totalPages-1)} disabled={page >= totalPages-1}
                className="px-2 py-1 text-xs rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50">»</button>
            </div>
          </div>
        )}
      </CardOne>
    </div>
  )
}