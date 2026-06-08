// import React from 'react'
// import { useSelector } from 'react-redux'
// import CardOne from '../Components/CardOne'
// import MetricCardOne from '../Components/MetricCardOne'
// import LeadsTableOne from '../Components/LeadsTableOne'

// export default function LeadsPage() {
//   const leads      = useSelector(s => s.dashboard.leads)
//   const activeFlow = useSelector(s => s.ui.activeFlow)
//   const isBday     = activeFlow.includes('bday')

//   const total          = leads.length
//   const newToday       = leads.filter(l => (Date.now() - new Date(l.createdAt)) < 86400000).length
//   const callbacks      = leads.filter(l => l.leadType === 'CALLBACK').length
//   const storeVisits    = leads.filter(l => l.leadType === 'STORE_VISIT').length
//   const afterCatalogue = leads.filter(l => (l.notes || '').toLowerCase().includes('catalogue')).length
//   const offerPath      = leads.filter(l => l.leadType === 'CALLBACK' && (l.notes || '').toLowerCase().includes('offer')).length
//   const reeng          = leads.filter(l => l.status === 'CONVERTED' && (l.notes || '').toLowerCase().includes('nudge')).length

//   return (
//     <div className="space-y-5">
//       <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
//         {[
//           { label: 'Total Leads',              value: total,          accent: 'blue',   icon: '🎯' },
//           { label: 'New Today',                value: newToday,       accent: 'orange', icon: '🆕' },
//           { label: 'Callback – Discovery',     value: Math.floor(callbacks * 0.6), accent: 'purple', icon: '📞' },
//           { label: `Callback – ${isBday ? 'T-Day' : 'T-0'}`, value: Math.floor(callbacks * 0.4), accent: 'pink', icon: isBday ? '🎂' : '💍' },
//           { label: 'Store Visit Requests',     value: storeVisits,    accent: 'green',  icon: '🏪' },
//           { label: 'After Catalogue',          value: afterCatalogue, accent: 'indigo', icon: '📋' },
//           { label: 'Callback – Offer Path',    value: offerPath,      accent: 'amber',  icon: '💰' },
//           { label: 'Callback – Re-engagement', value: reeng,          accent: 'teal',   icon: '🔔' },
//         ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 40} />)}
//       </div>

//       <CardOne title="All Leads" subtitle="Manage and track all incoming bot leads" icon="🎯">
//         <LeadsTableOne leads={leads} />
//       </CardOne>
//     </div>
//   )
// }


import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import LeadsTableOne from '../Components/LeadsTableOne'

// ── helpers ────────────────────────────────────────────────────
const FLOW_LABELS = {
  bday_t10:  'Birthday T-10',
  bday_t0:   'Birthday T-Day',
  anniv_t10: 'Anniversary T-10',
  anniv_t0:  'Anniversary T-Day',
  all:       'All Flows',
}

const todayStart = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleString('en-IN') } catch { return '—' }
}

// ── export helpers ─────────────────────────────────────────────
const leadsToRows = (leads) =>
  leads.map((l, i) => ({
    '#':          i + 1,
    'Name':       l.customerName        || '—',
    'Phone':      l.phone               || '—',
    'Type':       l.leadType            || '—',
    'Flow':       FLOW_LABELS[l.flow]   || l.flow || '—',
    'Collection': l.selectedCollection  || '—',
    'Brand':      (l.selectedBrand      || '—').replace(/_/g, ' '),
    'Style':      l.selectedStyle       || '—',
    'Step':       (l.stepName           || '—').replace(/_/g, ' ').toLowerCase(),
    'Status':     l.status              || '—',
    'Created':    fmtDate(l.createdAt),
  }))

const exportExcel = (leads, activeFlow) => {
  const rows = leadsToRows(leads)
  const ws   = XLSX.utils.json_to_sheet(rows)
  const wb   = XLSX.utils.book_new()
  ws['!cols'] = [
    { wch: 4 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 18 },
    { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 12 }, { wch: 22 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, 'Titan Leads')
  XLSX.writeFile(wb, `Titan_Leads_${FLOW_LABELS[activeFlow] || 'All'}_${new Date().toISOString().slice(0,10)}.xlsx`)
}

const exportPDF = (leads, activeFlow) => {
  const doc  = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const rows = leadsToRows(leads)

  // Header banner
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, 297, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TITAN WORLD', 14, 10)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(148, 163, 184)
  doc.text('WhatsApp Campaign — Lead Report', 14, 16)

  // Flow badge
  doc.setFillColor(30, 41, 59)
  doc.roundedRect(180, 4, 55, 8, 2, 2, 'F')
  doc.setTextColor(226, 232, 240)
  doc.setFontSize(8)
  doc.text(FLOW_LABELS[activeFlow] || 'All Flows', 207, 9.5, { align: 'center' })

  // Date badge
  doc.setFillColor(30, 41, 59)
  doc.roundedRect(238, 4, 50, 8, 2, 2, 'F')
  doc.text(`Generated: ${new Date().toISOString().slice(0,10)}`, 263, 9.5, { align: 'center' })

  // Summary strip
  const callbacks  = leads.filter(l => l.leadType === 'CALLBACK').length
  const storeVisit = leads.filter(l => l.leadType === 'STORE_VISIT').length
  const newLeads   = leads.filter(l => l.status === 'NEW').length
  const converted  = leads.filter(l => l.status === 'CONVERTED').length

  doc.setFillColor(241, 245, 249)
  doc.rect(0, 22, 297, 14, 'F')
  ;[
    { label: 'Total Leads',  value: leads.length },
    { label: 'Callbacks',    value: callbacks    },
    { label: 'Store Visits', value: storeVisit   },
    { label: 'New',          value: newLeads     },
    { label: 'Converted',    value: converted    },
  ].forEach((s, i) => {
    const x = 14 + i * 52
    doc.setTextColor(15, 23, 42)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(String(s.value), x, 31)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(s.label, x, 34)
  })

  // Table
  autoTable(doc, {
    startY: 38,
    head: [['#', 'Name', 'Phone', 'Type', 'Flow', 'Collection', 'Brand', 'Step', 'Status', 'Created']],
    body: rows.map(r => [
      r['#'], r['Name'], r['Phone'], r['Type'], r['Flow'],
      r['Collection'], r['Brand'], r['Step'], r['Status'], r['Created'],
    ]),
    styles:          { fontSize: 8, cellPadding: 2.5, textColor: [30, 41, 59] },
    headStyles:      { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8,  halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 26 },
      3: { cellWidth: 20 },
      4: { cellWidth: 24 },
      5: { cellWidth: 20 },
      6: { cellWidth: 24 },
      7: { cellWidth: 38 },
      8: { cellWidth: 18 },
      9: { cellWidth: 26 },
    },
    didDrawPage: (data) => {
      doc.setFontSize(7)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}  ·  Titan World WhatsApp Campaign`,
        148, 205, { align: 'center' }
      )
    },
  })

  doc.save(`Titan_Leads_${FLOW_LABELS[activeFlow] || 'All'}_${new Date().toISOString().slice(0,10)}.pdf`)
}

// ── Export Buttons component ───────────────────────────────────
function ExportButtons({ leads, activeFlow }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => exportExcel(leads, activeFlow)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                   bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg
                   transition-colors shadow-sm"
      >
        📊 Excel
      </button>
      <button
        onClick={() => exportPDF(leads, activeFlow)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                   bg-red-600 hover:bg-red-700 text-white rounded-lg
                   transition-colors shadow-sm"
      >
        📄 PDF
      </button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
const PAGE_SIZE = 50

export default function LeadsPage() {
  const allLeads   = useSelector(s => s.dashboard.leads)   // Redux se — already flow-filtered
  console.log(allLeads , "wshjknm");
  const activeFlow = useSelector(s => s.ui.activeFlow)
  const isBday     = activeFlow.includes('bday')

  // Pagination state
  const [page, setPage] = useState(0)

  // Reset page when flow changes
  useEffect(() => { setPage(0) }, [activeFlow])

  // Paginated slice
  const totalLeads = allLeads.length
  const totalPages = Math.max(1, Math.ceil(totalLeads / PAGE_SIZE))
  const pagedLeads = allLeads.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Metrics — calculated from ALL leads (not just current page)
  const newToday   = allLeads.filter(l => new Date(l.createdAt).getTime() >= todayStart()).length
  const callbacks  = allLeads.filter(l => l.leadType === 'CALLBACK').length
  const storeVisits = allLeads.filter(l => l.leadType === 'STORE_VISIT').length
  const converted  = allLeads.filter(l => l.status === 'CONVERTED').length
  const newLeads   = allLeads.filter(l => l.status === 'NEW').length

  // Callback split — T-10 discovery vs T-Day urgent
  const cbDiscovery = allLeads.filter(l =>
    l.leadType === 'CALLBACK' && (l.flow === 'bday_t10' || l.flow === 'anniv_t10')
  ).length
  const cbTday = allLeads.filter(l =>
    l.leadType === 'CALLBACK' && (l.flow === 'bday_t0' || l.flow === 'anniv_t0')
  ).length

  const metrics = [
    { label: 'Total Leads',                   value: totalLeads,  accent: 'blue',   icon: '🎯' },
    { label: 'New Today',                     value: newToday,    accent: 'orange', icon: '🆕' },
    { label: 'Callback – Discovery',          value: cbDiscovery, accent: 'purple', icon: '📞' },
    { label: `Callback – ${isBday ? 'T-Day' : 'T-0'}`, value: cbTday, accent: 'pink', icon: isBday ? '🎂' : '💍' },
    { label: 'Store Visit Requests',          value: storeVisits, accent: 'green',  icon: '🏪' },
    { label: 'New Leads',                     value: newLeads,    accent: 'indigo', icon: '🔵' },
    { label: 'Converted',                     value: converted,   accent: 'amber',  icon: '✅' },
    { label: 'Total Callbacks',               value: callbacks,   accent: 'teal',   icon: '📲' },
  ]

  return (
    <div className="space-y-5">

      {/* ── Metric Tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {metrics.map((m, i) => (
          <MetricCardOne key={m.label} {...m} delay={i * 40} />
        ))}
      </div>

      {/* ── Leads Table ── */}
      <CardOne
        title={`All Leads (${totalLeads})`}
        subtitle="Track leads with collection, brand and step context"
        icon="🎯"
        action={<ExportButtons leads={allLeads} activeFlow={activeFlow} />}
      >
        <LeadsTableOne leads={pagedLeads} />

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalLeads)} of {totalLeads} leads
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="px-2 py-1 text-xs rounded border border-gray-200
                           disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                «
              </button>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-xs rounded border border-gray-200
                           disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                ← Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(0, Math.min(totalPages - 5, page - 2)) + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p + 1}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 text-xs rounded border border-gray-200
                           disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                Next →
              </button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className="px-2 py-1 text-xs rounded border border-gray-200
                           disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                »
              </button>
            </div>
          </div>
        )}
      </CardOne>
    </div>
  )
}