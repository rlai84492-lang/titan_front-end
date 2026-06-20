// import React, { useState, useMemo, useEffect, useRef } from 'react'
// import { useUI } from '../context/UIContext'
// import { Search, Loader2, ChevronDown, FileSpreadsheet, FileText, CheckSquare } from 'lucide-react'
// import StepBadge from './StepBadge'
// import SortableHeader from './SortableHeader'
// import { FLOW_STEPS, STEP_META, BRANDS, BRAND_KEYS, relTime, initials } from '../mockData'
// import { ExportBar, exportToCSV, exportToPDF } from './CardOne'

// const AVATAR_COLORS = [
//   ['#EBF4FD','#378ADD'],['#FEF0EB','#E85A2B'],['#E1F5EE','#1D9E75'],
//   ['#EEEDFE','#7F77DD'],['#FEF3CD','#BA7517'],['#FCEEF4','#D4537E'],
//   ['#F0FDF4','#16A34A'],['#FFF7ED','#EA580C'],
// ]

// // ── Column field → comparable value extractor (sorting ke liye) ──
// const SORT_ACCESSORS = {
//   customerName: (s) => (s.customerName || '').toLowerCase(),
//   phone:        (s) => s.phone || '',
//   currentStep:  (s) => STEP_META[s.currentStep]?.label || s.currentStep || '',
//   selectedCollection: (s) => s.selectedCollection || '',
//   selectedBrand:      (s) => s.selectedBrand || '',
//   lastActivity: (s) => new Date(s.lastActivity || 0).getTime(),
// }

// // ════════════════════════════════════════════════════════════
// // ── NAYA — "Export All" Dropdown Button ────────────────────
// // Explicitly batata hai ki SAARI (filtered+sorted) conversations
// // export hongi — chahe pagination mein sirf 10 dikh rahi hon,
// // chahe total 2000/30000 ho. Apna loading state rakhta hai.
// // ════════════════════════════════════════════════════════════
// function ExportAllConversationsButton({ exportData, title }) {
//   const [menuOpen, setMenuOpen]   = useState(false)
//   const [exporting, setExporting] = useState(false)   // false | 'excel' | 'pdf'
//   const menuRef = useRef(null)

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setMenuOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const runExport = async (type) => {
//     if (exporting || !exportData?.length) return
//     setMenuOpen(false)
//     setExporting(type)
//     try {
//       // setTimeout se UI ko ek frame milta hai spinner render karne ke liye,
//       // warna heavy export (jaise 30000 rows) synchronous chalne se
//       // UI freeze ho jaata aur spinner kabhi dikhta hi nahi
//       await new Promise(resolve => setTimeout(resolve, 50))
//       if (type === 'excel') exportToCSV(exportData, 'titan-conversations-all')
//       if (type === 'pdf')   exportToPDF(exportData, title)
//     } finally {
//       setExporting(false)
//     }
//   }

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         onClick={() => setMenuOpen(o => !o)}
//         disabled={!!exporting || !exportData?.length}
//         className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold
//                    transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
//                    bg-[#1A1713] text-white
//                    disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
//       >
//         {exporting
//           ? <Loader2 size={13} className="animate-spin" />
//           : <CheckSquare size={13} />
//         }
//         {exporting
//           ? `Exporting ${exporting === 'excel' ? 'Excel' : 'PDF'}…`
//           : `Export All (${exportData?.length ?? 0})`
//         }
//         {!exporting && <ChevronDown size={12} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />}
//       </button>

//       {menuOpen && !exporting && (
//         <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-[#EEEBE6] bg-white shadow-lg overflow-hidden z-20">
//           <div className="px-3 py-2 text-[10px] font-semibold text-[#B0A9A1] border-b border-[#F4F1ED]">
//             All {exportData?.length ?? 0} conversations will be exported
//           </div>
//           <button
//             onClick={() => runExport('excel')}
//             className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] font-semibold text-[#1A1713] hover:bg-[#FEF0EB] transition-colors"
//           >
//             <FileSpreadsheet size={14} className="text-emerald-600" />
//             Export as Excel
//           </button>
//           <button
//             onClick={() => runExport('pdf')}
//             className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] font-semibold text-[#1A1713] hover:bg-[#FEF0EB] transition-colors border-t border-[#F4F1ED]"
//           >
//             <FileText size={14} className="text-red-600" />
//             Export as PDF
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function ConversationsTableOne({ sessions = [] }) {
//   const { activeFlow } = useUI()
//   const steps = FLOW_STEPS[activeFlow] || []

//   const [collFilter,  setCollFilter]  = useState('All')
//   const [brandFilter, setBrandFilter] = useState('All')
//   const [stepFilter,  setStepFilter]  = useState('All')
//   const [search,      setSearch]      = useState('')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [rowsPerPage, setRowsPerPage] = useState(10)

//   // ── Sorting state ──────────────────────────────────────────────
//   const [sortField, setSortField] = useState(null)
//   const [sortDir,   setSortDir]   = useState('asc')

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
//     } else {
//       setSortField(field)
//       setSortDir('asc')
//     }
//   }

//   const flowSessions = useMemo(() =>
//     sessions.filter(s => steps.includes(s.currentStep))
//   , [sessions, steps])

//   const filtered = useMemo(() => {
//     let d = flowSessions
//     if (collFilter  !== 'All') d = d.filter(s => s.selectedCollection === collFilter)
//     if (brandFilter !== 'All') d = d.filter(s => s.selectedBrand      === brandFilter)
//     if (stepFilter  !== 'All') d = d.filter(s => s.currentStep        === stepFilter)
//     if (search.trim()) {
//       const q = search.toLowerCase()
//       d = d.filter(s =>
//         (s.customerName || '').toLowerCase().includes(q) ||
//         (s.phone || '').includes(search)
//       )
//     }
//     return d
//   }, [flowSessions, collFilter, brandFilter, stepFilter, search])

//   // ── Sorted data — filtered ke upar sort apply hota hai ──────────
//   const sorted = useMemo(() => {
//     if (!sortField) return filtered
//     const accessor = SORT_ACCESSORS[sortField]
//     if (!accessor) return filtered

//     const arr = [...filtered]
//     arr.sort((a, b) => {
//       const va = accessor(a)
//       const vb = accessor(b)
//       if (va < vb) return sortDir === 'asc' ? -1 : 1
//       if (va > vb) return sortDir === 'asc' ? 1 : -1
//       return 0
//     })
//     return arr
//   }, [filtered, sortField, sortDir])

//   useEffect(() => { setCurrentPage(1) }, [collFilter, brandFilter, stepFilter, search, rowsPerPage, activeFlow])

//   const totalPages    = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage
//     return sorted.slice(start, start + rowsPerPage)
//   }, [sorted, currentPage, rowsPerPage])

//   // ── exportData — poora "sorted" array (NOT paginated) ───────────
//   // Ye dono ExportBar aur ExportAllConversationsButton dono ko jaata hai —
//   // dono hi always FULL filtered+sorted data export karte hain,
//   // current page ka data nahi.
//   const exportData = sorted.map(s => ({
//     Name:       s.customerName || 'Unknown',
//     Phone:      '+' + s.phone,
//     Step:       STEP_META[s.currentStep]?.label || s.currentStep,
//     Collection: s.selectedCollection || '—',
//     Brand:      s.selectedBrand?.replace(/_/g, ' ') || '—',
//     Active:     s.isActive ? 'Yes' : 'No',
//     'Last Activity': relTime(s.lastActivity),
//   }))

//   return (
//     <div>
//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-2 mb-4">
//         <div className="flex items-center gap-1">
//           <span className="text-[10px] font-bold text-[#A49D94] mr-1">Collection:</span>
//           {['All','MENS','WOMENS','COUPLES'].map(f => (
//             <button key={f} onClick={() => setCollFilter(f)}
//               className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
//                 collFilter === f ? 'border-[#E85A2B] bg-[#E85A2B] text-white' : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
//               }`}>
//               {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="text-[10px] font-bold text-[#A49D94] mr-1">Brand:</span>
//           <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
//             className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
//             <option value="All">All Brands</option>
//             {BRANDS.map((b, i) => <option key={b} value={BRAND_KEYS[i]}>{b}</option>)}
//           </select>
//         </div>

//         <div className="flex items-center gap-1">
//           <span className="text-[10px] font-bold text-[#A49D94] mr-1">Step:</span>
//           <select value={stepFilter} onChange={e => setStepFilter(e.target.value)}
//             className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
//             <option value="All">All Steps</option>
//             {steps.map(step => (
//               <option key={step} value={step}>{STEP_META[step]?.label || step}</option>
//             ))}
//           </select>
//         </div>

//         <div className="relative ml-auto">
//           <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
//           <input value={search} onChange={e => setSearch(e.target.value)}
//             placeholder="Search name / phone…"
//             className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-36" />
//         </div>

//         <ExportBar tableId="conv-table" title="Active Conversations" data={exportData} filename="titan-conversations" compact />

//         {/* ── NAYA — Select All & Export dropdown ── */}
//         <ExportAllConversationsButton exportData={exportData} title="All Conversations" />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
//         <table id="conv-table" className="w-full border-collapse text-xs">
//           <thead>
//             <tr style={{ background: 'linear-gradient(135deg,#FAF8F6,#F5F3F0)' }}>
//               <SortableHeader label="Customer"      field="customerName"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//               <SortableHeader label="Phone"         field="phone"              sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//               <SortableHeader label="Step"          field="currentStep"        sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//               <SortableHeader label="Collection"    field="selectedCollection" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//               <SortableHeader label="Brand"         field="selectedBrand"      sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//               <SortableHeader label="Last Activity" field="lastActivity"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length === 0 ? (
//               <tr><td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[12px]">
//                 <div className="flex flex-col items-center gap-2"><span className="text-2xl opacity-30">💬</span>No conversations found</div>
//               </td></tr>
//             ) : paginatedData.map((s, i) => {
//               const ri = (currentPage - 1) * rowsPerPage + i
//               const [abg, atx] = AVATAR_COLORS[ri % AVATAR_COLORS.length]
//               return (
//                 <tr key={s.id} className="table-row-hover border-b border-[#F4F1ED] last:border-0">
//                   <td className="py-3 px-4">
//                     <div className="flex items-center gap-2.5">
//                       <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
//                         style={{ background: abg, color: atx }}>{initials(s.customerName)}</div>
//                       <div>
//                         <div className="text-[12px] font-semibold text-[#1A1713]">{s.customerName || 'Unknown'}</div>
//                         <div className="text-[9px] text-[#B0A9A1]">{s.isActive ? 'Active' : 'Inactive'}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-4 font-mono text-[10px] text-[#6B6560]">+{s.phone}</td>
//                   <td className="py-3 px-4"><StepBadge step={s.currentStep} /></td>
//                   <td className="py-3 px-4 text-[11px] text-[#6B6560]">{s.selectedCollection || '—'}</td>
//                   <td className="py-3 px-4 text-[10px] text-[#6B6560]">{s.selectedBrand?.replace(/_/g, ' ') || '—'}</td>
//                   <td className="py-3 px-4 text-[11px] text-[#B0A9A1] whitespace-nowrap">{relTime(s.lastActivity)}</td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <p className="text-[10px] text-[#B0A9A1] font-medium">
//           Showing <b className="text-[#6B6560]">{Math.min((currentPage-1)*rowsPerPage+1, sorted.length)}</b> to <b className="text-[#6B6560]">{Math.min(currentPage*rowsPerPage, sorted.length)}</b> of <b className="text-[#6B6560]">{sorted.length}</b>
//         </p>
//         <div className="flex items-center gap-2">
//           <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}
//             className="h-7 px-2 text-[10px] font-semibold rounded-lg border border-[#EEEBE6] bg-white text-[#6B6560] outline-none">
//             {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
//           </select>
//           <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}
//             className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40">Prev</button>
//           {Array.from({length: Math.min(totalPages,5)}, (_, i) => {
//             let startPage = Math.max(1, currentPage - 2)
//             if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4)
//             return startPage + i
//           }).map(pg => (
//             <button key={pg} onClick={() => setCurrentPage(pg)}
//               className="w-7 h-7 rounded-lg text-[10px] font-bold border transition-all"
//               style={currentPage===pg ? {background:'#E85A2B',borderColor:'#E85A2B',color:'#fff'} : {borderColor:'#EEEBE6',color:'#6B6560'}}>
//               {pg}
//             </button>
//           ))}
//           <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}
//             className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40">Next</button>
//         </div>
//       </div>
//     </div>
//   )
// }


import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useUI } from '../context/UIContext'
import { Search, Loader2, ChevronDown, FileSpreadsheet, FileText, CheckSquare } from 'lucide-react'
import StepBadge from './StepBadge'
import SortableHeader from './SortableHeader'
import { FLOW_STEPS, STEP_META, BRANDS, BRAND_KEYS, relTime, initials } from '../mockData'
import { ExportBar, exportToExcel, exportToPDF } from './CardOne'

const AVATAR_COLORS = [
  ['#EBF4FD','#378ADD'],['#FEF0EB','#E85A2B'],['#E1F5EE','#1D9E75'],
  ['#EEEDFE','#7F77DD'],['#FEF3CD','#BA7517'],['#FCEEF4','#D4537E'],
  ['#F0FDF4','#16A34A'],['#FFF7ED','#EA580C'],
]

// ── Column field → comparable value extractor (sorting ke liye) ──
const SORT_ACCESSORS = {
  customerName: (s) => (s.customerName || '').toLowerCase(),
  phone:        (s) => s.phone || '',
  currentStep:  (s) => STEP_META[s.currentStep]?.label || s.currentStep || '',
  selectedCollection: (s) => s.selectedCollection || '',
  selectedBrand:      (s) => s.selectedBrand || '',
  lastActivity: (s) => new Date(s.lastActivity || 0).getTime(),
}

// ════════════════════════════════════════════════════════════
// ── NAYA — "Export All" Dropdown Button ────────────────────
// Explicitly batata hai ki SAARI (filtered+sorted) conversations
// export hongi — chahe pagination mein sirf 10 dikh rahi hon,
// chahe total 2000/30000 ho. Apna loading state rakhta hai.
// ════════════════════════════════════════════════════════════
function ExportAllConversationsButton({ exportData, title }) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [exporting, setExporting] = useState(false)   // false | 'excel' | 'pdf'
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const runExport = async (type) => {
    if (exporting || !exportData?.length) return
    setMenuOpen(false)
    setExporting(type)
    try {
      // setTimeout se UI ko ek frame milta hai spinner render karne ke liye,
      // warna heavy export (jaise 30000 rows) synchronous chalne se
      // UI freeze ho jaata aur spinner kabhi dikhta hi nahi
      await new Promise(resolve => setTimeout(resolve, 50))
      if (type === 'excel') exportToExcel(exportData, 'titan-conversations-all')
      if (type === 'pdf')   exportToPDF(exportData, title)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* <button
        onClick={() => setMenuOpen(o => !o)}
        disabled={!!exporting || !exportData?.length}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold
                   transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
                   bg-[#1A1713] text-white
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {exporting
          ? <Loader2 size={13} className="animate-spin" />
          : <CheckSquare size={13} />
        }
        {exporting
          ? `Exporting ${exporting === 'excel' ? 'Excel' : 'PDF'}…`
          : `Export All (${exportData?.length ?? 0})`
        }
        {!exporting && <ChevronDown size={12} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />}
      </button> */}

      {menuOpen && !exporting && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-[#EEEBE6] bg-white shadow-lg overflow-hidden z-20">
          <div className="px-3 py-2 text-[10px] font-semibold text-[#B0A9A1] border-b border-[#F4F1ED]">
            All {exportData?.length ?? 0} conversations will be exported
          </div>
          <button
            onClick={() => runExport('excel')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] font-semibold text-[#1A1713] hover:bg-[#FEF0EB] transition-colors"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            Export as Excel
          </button>
          <button
            onClick={() => runExport('pdf')}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] font-semibold text-[#1A1713] hover:bg-[#FEF0EB] transition-colors border-t border-[#F4F1ED]"
          >
            <FileText size={14} className="text-red-600" />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  )
}

export default function ConversationsTableOne({ sessions = [] }) {
  const { activeFlow } = useUI()
  const steps = FLOW_STEPS[activeFlow] || []

  const [collFilter,  setCollFilter]  = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [stepFilter,  setStepFilter]  = useState('All')
  const [search,      setSearch]      = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // ── Sorting state ──────────────────────────────────────────────
  const [sortField, setSortField] = useState(null)
  const [sortDir,   setSortDir]   = useState('asc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const flowSessions = useMemo(() =>
    sessions.filter(s => steps.includes(s.currentStep))
  , [sessions, steps])

  const filtered = useMemo(() => {
    let d = flowSessions
    if (collFilter  !== 'All') d = d.filter(s => s.selectedCollection === collFilter)
    if (brandFilter !== 'All') d = d.filter(s => s.selectedBrand      === brandFilter)
    if (stepFilter  !== 'All') d = d.filter(s => s.currentStep        === stepFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      d = d.filter(s =>
        (s.customerName || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(search)
      )
    }
    return d
  }, [flowSessions, collFilter, brandFilter, stepFilter, search])

  // ── Sorted data — filtered ke upar sort apply hota hai ──────────
  const sorted = useMemo(() => {
    if (!sortField) return filtered
    const accessor = SORT_ACCESSORS[sortField]
    if (!accessor) return filtered

    const arr = [...filtered]
    arr.sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortField, sortDir])

  useEffect(() => { setCurrentPage(1) }, [collFilter, brandFilter, stepFilter, search, rowsPerPage, activeFlow])

  const totalPages    = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return sorted.slice(start, start + rowsPerPage)
  }, [sorted, currentPage, rowsPerPage])

  // ── exportData — poora "sorted" array (NOT paginated) ───────────
  // Ye dono ExportBar aur ExportAllConversationsButton dono ko jaata hai —
  // dono hi always FULL filtered+sorted data export karte hain,
  // current page ka data nahi.
  const exportData = sorted.map(s => ({
    Name:       s.customerName || 'Unknown',
    Phone:      '+' + s.phone,
    Step:       STEP_META[s.currentStep]?.label || s.currentStep,
    Collection: s.selectedCollection || '—',
    Brand:      s.selectedBrand?.replace(/_/g, ' ') || '—',
    Active:     s.isActive ? 'Yes' : 'No',
    'Last Activity': relTime(s.lastActivity),
  }))

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Collection:</span>
          {['All','MENS','WOMENS','COUPLES'].map(f => (
            <button key={f} onClick={() => setCollFilter(f)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                collFilter === f ? 'border-[#E85A2B] bg-[#E85A2B] text-white' : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
              }`}>
              {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Brand:</span>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
            <option value="All">All Brands</option>
            {BRANDS.map((b, i) => <option key={b} value={BRAND_KEYS[i]}>{b}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Step:</span>
          <select value={stepFilter} onChange={e => setStepFilter(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
            <option value="All">All Steps</option>
            {steps.map(step => (
              <option key={step} value={step}>{STEP_META[step]?.label || step}</option>
            ))}
          </select>
        </div>

        <div className="relative ml-auto">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name / phone…"
            className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-36" />
        </div>

        <ExportBar tableId="conv-table" title="Active Conversations" data={exportData} filename="titan-conversations" compact />

        {/* ── NAYA — Select All & Export dropdown ── */}
        <ExportAllConversationsButton exportData={exportData} title="All Conversations" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
        <table id="conv-table" className="w-full border-collapse text-xs">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg,#FAF8F6,#F5F3F0)' }}>
              <SortableHeader label="Customer"      field="customerName"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Phone"         field="phone"              sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Step"          field="currentStep"        sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Collection"    field="selectedCollection" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Brand"         field="selectedBrand"      sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Last Activity" field="lastActivity"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[12px]">
                <div className="flex flex-col items-center gap-2"><span className="text-2xl opacity-30">💬</span>No conversations found</div>
              </td></tr>
            ) : paginatedData.map((s, i) => {
              const ri = (currentPage - 1) * rowsPerPage + i
              const [abg, atx] = AVATAR_COLORS[ri % AVATAR_COLORS.length]
              return (
                <tr key={s.id} className="table-row-hover border-b border-[#F4F1ED] last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: abg, color: atx }}>{initials(s.customerName)}</div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#1A1713]">{s.customerName || 'Unknown'}</div>
                        <div className="text-[9px] text-[#B0A9A1]">{s.isActive ? 'Active' : 'Inactive'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#6B6560]">+{s.phone}</td>
                  <td className="py-3 px-4"><StepBadge step={s.currentStep} /></td>
                  <td className="py-3 px-4 text-[11px] text-[#6B6560]">{s.selectedCollection || '—'}</td>
                  <td className="py-3 px-4 text-[10px] text-[#6B6560]">{s.selectedBrand?.replace(/_/g, ' ') || '—'}</td>
                  <td className="py-3 px-4 text-[11px] text-[#B0A9A1] whitespace-nowrap">{relTime(s.lastActivity)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[10px] text-[#B0A9A1] font-medium">
          Showing <b className="text-[#6B6560]">{Math.min((currentPage-1)*rowsPerPage+1, sorted.length)}</b> to <b className="text-[#6B6560]">{Math.min(currentPage*rowsPerPage, sorted.length)}</b> of <b className="text-[#6B6560]">{sorted.length}</b>
        </p>
        <div className="flex items-center gap-2">
          <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}
            className="h-7 px-2 text-[10px] font-semibold rounded-lg border border-[#EEEBE6] bg-white text-[#6B6560] outline-none">
            {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}
            className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40">Prev</button>
          {Array.from({length: Math.min(totalPages,5)}, (_, i) => {
            let startPage = Math.max(1, currentPage - 2)
            if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4)
            return startPage + i
          }).map(pg => (
            <button key={pg} onClick={() => setCurrentPage(pg)}
              className="w-7 h-7 rounded-lg text-[10px] font-bold border transition-all"
              style={currentPage===pg ? {background:'#E85A2B',borderColor:'#E85A2B',color:'#fff'} : {borderColor:'#EEEBE6',color:'#6B6560'}}>
              {pg}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}
            className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  )
}