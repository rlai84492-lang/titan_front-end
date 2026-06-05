

// import React, { useState, useMemo } from 'react'
// import { Search, Download, Filter } from 'lucide-react'
// import StepBadge from './StepBadge.jsx'
// import { STEP_ORDER, STEP_LABELS, relTime, initials } from '../mockData.js'
// import { ExportBar, exportToCSV, exportToPDF } from './CardOne.jsx'

// const AVATAR_COLORS = [
//   ['#EBF4FD','#378ADD'], ['#FEF0EB','#E85A2B'], ['#E1F5EE','#1D9E75'],
//   ['#EEEDFE','#7F77DD'], ['#FEF3CD','#BA7517'], ['#FCEEF4','#D4537E'],
//   ['#F0FDF4','#16A34A'], ['#FFF7ED','#EA580C'],
// ]

// function AvatarCell({ name, sub, index }) {
//   const [bg, text] = AVATAR_COLORS[index % AVATAR_COLORS.length]
//   return (
//     <div className="flex items-center gap-2.5">
//       <div
//         className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
//         style={{ background: bg, color: text }}
//       >
//         {initials(name)}
//       </div>
//       <div>
//         <div className="text-[13px] font-semibold text-[#1A1713] leading-tight whitespace-nowrap">{name}</div>
//         {sub && <div className="text-[10px] text-[#B0A9A1] font-medium">{sub}</div>}
//       </div>
//     </div>
//   )
// }

// const FILTER_OPTIONS = ['All', ...STEP_ORDER]

// export default function ConversationsTableOne({ sessions = [] }) {
//   const [activeFilter, setActiveFilter] = useState('All')
//   const [search,       setSearch]       = useState('')

//   const filtered = useMemo(() => {
//     let data = sessions
//     if (activeFilter !== 'All')
//       data = data.filter(s => s.currentStep === activeFilter)
//     if (search.trim())
//       data = data.filter(s =>
//         (s.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
//         (s.phone || '').includes(search)
//       )
//     return data
//   }, [sessions, activeFilter, search])

//   // Counts per step for filter pills
//   const stepCounts = useMemo(() => {
//     const c = { All: sessions.length }
//     STEP_ORDER.forEach(s => { c[s] = sessions.filter(x => x.currentStep === s).length })
//     return c
//   }, [sessions])

//   // Export shape
//   const exportData = filtered.map(s => ({
//     Name:       s.customerName || 'Unknown',
//     Phone:      '+' + s.phone,
//     Step:       STEP_LABELS[s.currentStep] || s.currentStep,
//     Collection: s.selectedCollection || '—',
//     Style:      s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—',
//     Active:     s.isActive ? 'Yes' : 'No',
//     'Last Activity': relTime(s.lastActivity),
//   }))

//   return (
//     <div>
//       {/* Controls row */}
//       <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//         {/* Step filter pills */}
//         <div className="flex flex-wrap gap-1.5">
//           {FILTER_OPTIONS.map(f => {
//             const count   = stepCounts[f] ?? 0
//             const isActive = activeFilter === f
//             return (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`
//                   flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl
//                   border transition-all duration-150
//                   ${isActive
//                     ? 'border-[#E85A2B] text-white'
//                     : 'border-[#EEEBE6] text-[#6B6560] hover:border-[#E85A2B]/40 hover:bg-[#FEF0EB]/50'}
//                 `}
//                 style={isActive ? {
//                   background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
//                   boxShadow: '0 2px 8px rgba(232,90,43,0.30)',
//                 } : {}}
//               >
//                 {f === 'All' ? 'All' : STEP_LABELS[f]}
//                 {count > 0 && (
//                   <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
//                     isActive ? 'bg-white/25 text-white' : 'bg-[#F0EDE8] text-[#9B9590]'
//                   }`}>
//                     {count}
//                   </span>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* Right controls */}
//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
//             <input
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search…"
//               className="pl-7 pr-3 py-1.5 text-[12px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] focus:ring-2 focus:ring-[#E85A2B]/10 w-32 transition-all font-dm"
//             />
//           </div>
//           <ExportBar
//             tableId="conv-table"
//             title="Active Conversations"
//             data={exportData}
//             filename="titan-conversations"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
//         <table id="conv-table" className="w-full border-collapse text-xs">
//           <thead>
//             <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
//               {['Customer','Phone','Step','Collection','Style','Last activity'].map(h => (
//                 <th
//                   key={h}
//                   className="text-left text-[10px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap"
//                 >
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[13px]">
//                   <div className="flex flex-col items-center gap-2">
//                     <span className="text-2xl opacity-30">💬</span>
//                     No conversations found
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((s, i) => (
//                 <tr
//                   key={s.id}
//                   className="table-row-hover border-b border-[#F4F1ED] last:border-0"
//                 >
//                   <td className="py-3 px-4">
//                     <AvatarCell
//                       name={s.customerName || 'Unknown'}
//                       sub={s.isActive ? 'Active' : 'Inactive'}
//                       index={i}
//                     />
//                   </td>
//                   <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560]">
//                     +{s.phone}
//                   </td>
//                   <td className="py-3 px-4">
//                     <StepBadge step={s.currentStep} />
//                   </td>
//                   <td className="py-3 px-4 text-[12px] text-[#6B6560]">
//                     {s.selectedCollection ?? '—'}
//                   </td>
//                   <td className="py-3 px-4 text-[12px] text-[#6B6560] whitespace-nowrap">
//                     {s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—'}
//                   </td>
//                   <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">
//                     {relTime(s.lastActivity)}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer count */}
//       <div className="mt-3 flex items-center justify-between">
//         <p className="text-[11px] text-[#B0A9A1] font-medium">
//           Showing <span className="text-[#6B6560] font-bold">{filtered.length}</span> of{' '}
//           <span className="text-[#6B6560] font-bold">{sessions.length}</span> conversations
//         </p>
//       </div>
//     </div>
//   )
// }



import React, { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import StepBadge from './StepBadge.jsx'
import { STEP_ORDER, STEP_LABELS, relTime, initials } from '../mockData.js'
import { ExportBar } from './CardOne.jsx'

const AVATAR_COLORS = [
  ['#EBF4FD','#378ADD'], ['#FEF0EB','#E85A2B'], ['#E1F5EE','#1D9E75'],
  ['#EEEDFE','#7F77DD'], ['#FEF3CD','#BA7517'], ['#FCEEF4','#D4537E'],
  ['#F0FDF4','#16A34A'], ['#FFF7ED','#EA580C'],
]

function AvatarCell({ name, sub, index }) {
  const [bg, text] = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
        style={{ background: bg, color: text }}
      >
        {initials(name)}
      </div>

      <div>
        <div className="text-[13px] font-semibold text-[#1A1713] leading-tight whitespace-nowrap">
          {name}
        </div>

        {sub && (
          <div className="text-[10px] text-[#B0A9A1] font-medium">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

const FILTER_OPTIONS = ['All', ...STEP_ORDER]

export default function ConversationsTableOne({ sessions = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = useMemo(() => {
    let data = sessions

    if (activeFilter !== 'All') {
      data = data.filter(s => s.currentStep === activeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()

      data = data.filter(s =>
        (s.customerName || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(search)
      )
    }

    return data
  }, [sessions, activeFilter, search])

  // ✅ Filter/search change hone par page 1 pe aa jaaye
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter, search, rowsPerPage])

  // ✅ Total pages
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))

  // ✅ Agar data kam ho gaya aur current page invalid ho gaya
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // ✅ Current page ka data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filtered.slice(start, end)
  }, [filtered, currentPage, rowsPerPage])

  const startItem = filtered.length === 0
    ? 0
    : (currentPage - 1) * rowsPerPage + 1

  const endItem = Math.min(currentPage * rowsPerPage, filtered.length)

  // Counts per step for filter pills
  const stepCounts = useMemo(() => {
    const c = { All: sessions.length }

    STEP_ORDER.forEach(step => {
      c[step] = sessions.filter(x => x.currentStep === step).length
    })

    return c
  }, [sessions])

  // ✅ Export filtered data, only visible page nahi.
  const exportData = filtered.map(s => ({
    Name: s.customerName || 'Unknown',
    Phone: '+' + s.phone,
    Step: STEP_LABELS[s.currentStep] || s.currentStep,
    Collection: s.selectedCollection || '—',
    Style: s.selectedStyle ? s.selectedStyle.replace(/_/g, ' ') : '—',
    Active: s.isActive ? 'Yes' : 'No',
    'Last Activity': relTime(s.lastActivity),
  }))

  const goToPreviousPage = () => {
    setCurrentPage(page => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setCurrentPage(page => Math.min(totalPages, page + 1))
  }

  const getPageNumbers = () => {
    const pages = []

    const maxButtons = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxButtons - 1)

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div>
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Step filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map(f => {
            const count = stepCounts[f] ?? 0
            const isActive = activeFilter === f

            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`
                  flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl
                  border transition-all duration-150
                  ${isActive
                    ? 'border-[#E85A2B] text-white'
                    : 'border-[#EEEBE6] text-[#6B6560] hover:border-[#E85A2B]/40 hover:bg-[#FEF0EB]/50'}
                `}
                style={isActive ? {
                  background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
                  boxShadow: '0 2px 8px rgba(232,90,43,0.30)',
                } : {}}
              >
                {f === 'All' ? 'All' : STEP_LABELS[f]}

                {count > 0 && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#F0EDE8] text-[#9B9590]'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]"
            />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-7 pr-3 py-1.5 text-[12px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] focus:ring-2 focus:ring-[#E85A2B]/10 w-32 transition-all font-dm"
            />
          </div>

          <ExportBar
            tableId="conv-table"
            title="Active Conversations"
            data={exportData}
            filename="titan-conversations"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
        <table id="conv-table" className="w-full border-collapse text-xs">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
              {['Customer', 'Phone', 'Step', 'Collection', 'Style', 'Last activity'].map(h => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[13px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-30">💬</span>
                    No conversations found
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((s, i) => {
                const realIndex = (currentPage - 1) * rowsPerPage + i

                return (
                  <tr
                    key={s.id}
                    className="table-row-hover border-b border-[#F4F1ED] last:border-0"
                  >
                    <td className="py-3 px-4">
                      <AvatarCell
                        name={s.customerName || 'Unknown'}
                        sub={s.isActive ? 'Active' : 'Inactive'}
                        index={realIndex}
                      />
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560]">
                      +{s.phone}
                    </td>

                    <td className="py-3 px-4">
                      <StepBadge step={s.currentStep} />
                    </td>

                    <td className="py-3 px-4 text-[12px] text-[#6B6560]">
                      {s.selectedCollection ?? '—'}
                    </td>

                    <td className="py-3 px-4 text-[12px] text-[#6B6560] whitespace-nowrap">
                      {s.selectedStyle ? s.selectedStyle.replace(/_/g, ' ') : '—'}
                    </td>

                    <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">
                      {relTime(s.lastActivity)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer + Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[11px] text-[#B0A9A1] font-medium">
          Showing{' '}
          <span className="text-[#6B6560] font-bold">{startItem}</span>
          {' '}to{' '}
          <span className="text-[#6B6560] font-bold">{endItem}</span>
          {' '}of{' '}
          <span className="text-[#6B6560] font-bold">{filtered.length}</span>
          {' '}conversations
        </p>

        <div className="flex items-center gap-2">
          {/* Rows per page */}
          <select
            value={rowsPerPage}
            onChange={e => setRowsPerPage(Number(e.target.value))}
            className="h-8 px-2 text-[11px] font-semibold rounded-lg border border-[#EEEBE6] bg-white text-[#6B6560] outline-none focus:border-[#E85A2B]"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          {/* Previous */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`
              h-8 px-3 rounded-lg text-[11px] font-bold border transition-all
              ${currentPage === 1
                ? 'border-[#EEEBE6] text-[#C4BEB6] cursor-not-allowed bg-[#FAF8F6]'
                : 'border-[#EEEBE6] text-[#6B6560] hover:border-[#E85A2B]/40 hover:bg-[#FEF0EB]/50'}
            `}
          >
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map(page => {
              const active = page === currentPage

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    w-8 h-8 rounded-lg text-[11px] font-bold border transition-all
                    ${active
                      ? 'border-[#E85A2B] text-white'
                      : 'border-[#EEEBE6] text-[#6B6560] hover:border-[#E85A2B]/40 hover:bg-[#FEF0EB]/50'}
                  `}
                  style={active ? {
                    background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
                    boxShadow: '0 2px 8px rgba(232,90,43,0.25)',
                  } : {}}
                >
                  {page}
                </button>
              )
            })}
          </div>

          {/* Next */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`
              h-8 px-3 rounded-lg text-[11px] font-bold border transition-all
              ${currentPage === totalPages
                ? 'border-[#EEEBE6] text-[#C4BEB6] cursor-not-allowed bg-[#FAF8F6]'
                : 'border-[#EEEBE6] text-[#6B6560] hover:border-[#E85A2B]/40 hover:bg-[#FEF0EB]/50'}
            `}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}