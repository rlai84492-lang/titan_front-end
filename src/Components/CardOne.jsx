



// import React from 'react'
// import { FileSpreadsheet, FileText, Download } from 'lucide-react'

// // ─── Export helpers ───────────────────────────────────────────────────────────
// export function exportToCSV(data, filename = 'export') {
//   if (!data || !data.length) return
//   const headers = Object.keys(data[0])
//   const rows = data.map(row =>
//     headers.map(h => {
//       const val = row[h] ?? ''
//       return typeof val === 'string' && val.includes(',')
//         ? `"${val}"`
//         : val
//     }).join(',')
//   )
//   const csv = [headers.join(','), ...rows].join('\n')
//   const blob = new Blob([csv], { type: 'text/csv' })
//   const url  = URL.createObjectURL(blob)
//   const a    = document.createElement('a')
//   a.href = url; a.download = `${filename}.csv`; a.click()
//   URL.revokeObjectURL(url)
// }

// export function exportToPDF(tableId, title = 'Report') {
//   const table = document.getElementById(tableId)
//   if (!table) return
//   const printWin = window.open('', '_blank')
//   printWin.document.write(`
//     <html><head>
//     <title>${title}</title>
//     <style>
//       body { font-family: 'DM Sans', Arial, sans-serif; padding: 24px; color: #1A1713; }
//       h2   { font-size: 18px; margin-bottom: 16px; color: #E85A2B; }
//       table { width: 100%; border-collapse: collapse; font-size: 13px; }
//       th   { background: #F5F3F0; padding: 10px 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #EEEBE6; }
//       td   { padding: 9px 12px; border-bottom: 1px solid #F4F1ED; }
//       tr:nth-child(even) td { background: #FAF8F6; }
//       .footer { margin-top: 24px; font-size: 11px; color: #B0A9A1; }
//     </style>
//     </head><body>
//     <h2>${title}</h2>
//     ${table.outerHTML}
//     <div class="footer">Generated: ${new Date().toLocaleString('en-IN')} · Titan Watch Bot Dashboard</div>
//     </body></html>
//   `)
//   printWin.document.close()
//   setTimeout(() => { printWin.print(); printWin.close() }, 400)
// }

// // ─── ExportBar ────────────────────────────────────────────────────────────────
// export function ExportBar({ tableId, title, data, filename, compact = false }) {
//   return (
//     <div className={`flex items-center gap-1.5 ${compact ? '' : ''}`}>
//       <button
//         onClick={() => exportToCSV(data, filename)}
//         className=" group flex items-center gap-2
//     px-3.5 py-2 rounded-xl
//     bg-emerald-600
//     border border-emerald-600
//     text-white text-[11px] font-semibold
//     shadow-sm hover:shadow-md
//     hover:bg-emerald-700
//     hover:border-emerald-700
//     hover:-translate-y-[1px]
//     transition-all duration-200
//     "
//       >
//         <FileSpreadsheet size={13} />
//         {!compact && 'Excel'}
//       </button>
//       <button
//         onClick={() => exportToPDF(tableId, title)}
//         className="   
//         group flex items-center gap-2
//     px-3.5 py-2 rounded-xl
//     bg-red-600
//     border border-red-600
//     text-white text-[11px] font-semibold
//     shadow-sm hover:shadow-md
//     hover:bg-red-700
//     hover:border-red-700
//     hover:-translate-y-[1px]
//     transition-all duration-200

//         "
//       >
//         <FileText size={13} />
//         {!compact && 'PDF'}
//       </button>
//     </div>
//   )
// }

// // ─── Card ─────────────────────────────────────────────────────────────────────
// export default function CardOne({
//   title,
//   subtitle,
//   icon,
//   action,
//   children,
//   className   = '',
//   delay       = 0,
//   tableId,
//   exportData,
//   exportTitle,
//   exportFile,
//   noPadding   = false,
// }) {
//   return (
//     <div
//       className={`
//         relative bg-white rounded-[20px] overflow-hidden card-in
//         border border-[#EEEBE6]
//         shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]
//         hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.09)]
//         transition-shadow duration-300
//         ${className}
//       `}
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       {/* Subtle top accent line */}
//       <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E85A2B]/30 via-[#FF8C60]/20 to-transparent pointer-events-none" />

//       {/* Header */}
//       {(title || action) && (
//         <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F1ED]">
//           <div className="flex items-center gap-3 min-w-0">
//             {icon && (
//               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FEF0EB] to-[#FFE4D6] border border-[#FFCBB8]/60 flex items-center justify-center text-[15px] flex-shrink-0 shadow-sm">
//                 {icon}
//               </div>
//             )}
//             <div className="min-w-0">
//               <div className="font-sora font-semibold text-[13.5px] text-[#1A1713] leading-tight truncate">
//                 {title}
//               </div>
//               {subtitle && (
//                 <div className="text-[11px] text-[#B0A9A1] mt-0.5 leading-tight truncate">
//                   {subtitle}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 flex-shrink-0 ml-3">
//             {exportData && (
//               <ExportBar
//                 tableId={tableId}
//                 title={exportTitle || title}
//                 data={exportData}
//                 filename={exportFile || 'titan-export'}
//                 compact
//               />
//             )}
//             {action}
//           </div>
//         </div>
//       )}

//       {/* Body */}
//       <div className={noPadding ? '' : 'p-5'}>
//         {children}
//       </div>
//     </div>
//   )
// }


import React, { useState } from 'react'
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react'

// ─── Export helpers ───────────────────────────────────────────────────────────

// ── CSV/Excel — already poori "data" array use karta hai (sahi tha, same rakha) ──
export function exportToCSV(data, filename = 'export') {
  if (!data || !data.length) return
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h] ?? ''
      return typeof val === 'string' && val.includes(',')
        ? `"${val}"`
        : val
    }).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `${filename}.csv`; a.click()
  URL.revokeObjectURL(url)
}

/**
 * ── PDF Export — FIX ────────────────────────────────────────────
 * PEHLE: document.getElementById(tableId).outerHTML copy karta tha
 *        → sirf DOM mein render hui (paginated/visible) rows aati thin,
 *          baaki saari rows (jaise 2000/30000 mein se 10/50) MISS ho jaati thin
 *
 * AB: poori "data" array se khud HTML <table> banata hai
 *     → chahe 30000 rows ho, SAARI PDF mein export hoti hain
 *     → DOM/pagination se koi farak nahi padta
 */
export function exportToPDF(data, title = 'Report') {
  if (!data || !data.length) return

  const headers = Object.keys(data[0])

  const tableRowsHtml = data.map(row => `
    <tr>
      ${headers.map(h => `<td>${row[h] ?? '—'}</td>`).join('')}
    </tr>
  `).join('')

  const tableHtml = `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>${tableRowsHtml}</tbody>
    </table>
  `

  const printWin = window.open('', '_blank')
  printWin.document.write(`
    <html><head>
    <title>${title}</title>
    <style>
      body { font-family: 'DM Sans', Arial, sans-serif; padding: 24px; color: #1A1713; }
      h2   { font-size: 18px; margin-bottom: 4px; color: #E85A2B; }
      .meta { font-size: 11px; color: #B0A9A1; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th   { background: #F5F3F0; padding: 8px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid #EEEBE6; position: sticky; top: 0; }
      td   { padding: 7px 10px; border-bottom: 1px solid #F4F1ED; white-space: nowrap; }
      tr:nth-child(even) td { background: #FAF8F6; }
      .footer { margin-top: 24px; font-size: 11px; color: #B0A9A1; }
      @media print {
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
      }
    </style>
    </head><body>
    <h2>${title}</h2>
    <div class="meta">${data.length} record${data.length === 1 ? '' : 's'} · Generated: ${new Date().toLocaleString('en-IN')}</div>
    ${tableHtml}
    <div class="footer">Titan Watch Bot Dashboard</div>
    </body></html>
  `)
  printWin.document.close()
  setTimeout(() => { printWin.print(); printWin.close() }, 400)
}

// ─── ExportBar — ab loading state ke saath, heavy export ke liye safe ─────────
export function ExportBar({ tableId, title, data, filename, compact = false }) {
  // ← NAYA: alag-alag loading state, taaki user ko pata chale export chal raha hai
  //   (especially jab data 1000s/10000s rows ka ho — PDF/CSV banane mein time lagta hai)
  const [exportingCsv, setExportingCsv] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)

  const handleCsv = async () => {
    if (exportingCsv || !data?.length) return
    setExportingCsv(true)
    try {
      // setTimeout se ek frame milta hai spinner render hone ke liye,
      // warna heavy CSV generation synchronous hone se UI freeze ho jaata
      // aur spinner kabhi dikhta hi nahi
      await new Promise(resolve => setTimeout(resolve, 50))
      exportToCSV(data, filename)
    } finally {
      setExportingCsv(false)
    }
  }

  const handlePdf = async () => {
    if (exportingPdf || !data?.length) return
    setExportingPdf(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      exportToPDF(data, title)   // ← AB "data" array pass hota hai, tableId nahi
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className={`flex items-center gap-1.5 ${compact ? '' : ''}`}>
      <button
        onClick={handleCsv}
        disabled={exportingCsv || !data?.length}
        className=" group flex items-center gap-2
    px-3.5 py-2 rounded-xl
    bg-emerald-600
    border border-emerald-600
    text-white text-[11px] font-semibold
    shadow-sm hover:shadow-md
    hover:bg-emerald-700
    hover:border-emerald-700
    hover:-translate-y-[1px]
    transition-all duration-200
    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
    "
      >
        {exportingCsv
          ? <Loader2 size={13} className="animate-spin" />
          : <FileSpreadsheet size={13} />
        }
        {!compact && (exportingCsv ? 'Exporting…' : 'Excel')}
      </button>
      <button
        onClick={handlePdf}
        disabled={exportingPdf || !data?.length}
        className="   
        group flex items-center gap-2
    px-3.5 py-2 rounded-xl
    bg-red-600
    border border-red-600
    text-white text-[11px] font-semibold
    shadow-sm hover:shadow-md
    hover:bg-red-700
    hover:border-red-700
    hover:-translate-y-[1px]
    transition-all duration-200
    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
        "
      >
        {exportingPdf
          ? <Loader2 size={13} className="animate-spin" />
          : <FileText size={13} />
        }
        {!compact && (exportingPdf ? 'Exporting…' : 'PDF')}
      </button>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export default function CardOne({
  title,
  subtitle,
  icon,
  action,
  children,
  className   = '',
  delay       = 0,
  tableId,
  exportData,
  exportTitle,
  exportFile,
  noPadding   = false,
}) {
  return (
    <div
      className={`
        relative bg-white rounded-[20px] overflow-hidden card-in
        border border-[#EEEBE6]
        shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]
        hover:shadow-[0_4px_8px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.09)]
        transition-shadow duration-300
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E85A2B]/30 via-[#FF8C60]/20 to-transparent pointer-events-none" />

      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F1ED]">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FEF0EB] to-[#FFE4D6] border border-[#FFCBB8]/60 flex items-center justify-center text-[15px] flex-shrink-0 shadow-sm">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-sora font-semibold text-[13.5px] text-[#1A1713] leading-tight truncate">
                {title}
              </div>
              {subtitle && (
                <div className="text-[11px] text-[#B0A9A1] mt-0.5 leading-tight truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {exportData && (
              <ExportBar
                tableId={tableId}
                title={exportTitle || title}
                data={exportData}
                filename={exportFile || 'titan-export'}
                compact
              />
            )}
            {action}
          </div>
        </div>
      )}

      {/* Body */}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  )
}