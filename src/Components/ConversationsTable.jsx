// import React, { useState } from 'react'
// import StepBadge from './StepBadge.jsx'
// import { STEP_ORDER, STEP_LABELS, relTime, initials, avatarColor } from '../mockData.js'

// const FILTERS = ['All', ...STEP_ORDER]

// export default function ConversationsTable({ sessions }) {
//   const [filter, setFilter] = useState('All')
//   const [search, setSearch] = useState('')

//   const filtered = sessions
//     .filter(s => filter === 'All' || s.currentStep === filter)
//     .filter(s => {
//       const q = search.toLowerCase()
//       return !q || (s.customerName||'').toLowerCase().includes(q) || s.phone.includes(q)
//     })

//   return (
//     <div>
//       {/* Filter row */}
//       <div className="flex flex-wrap gap-1.5 mb-4">
//         {FILTERS.map(f => {
//           const count = f === 'All'
//             ? sessions.length
//             : sessions.filter(s => s.currentStep === f).length
//           return (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${
//                 filter === f
//                   ? 'bg-[#E85A2B] border-[#E85A2B] text-white shadow-sm'
//                   : 'bg-transparent border-[#DDD9D4] text-[#7D7670] hover:bg-[#F8F7F6] hover:border-[#C4BEB6]'
//               }`}
//             >
//               {f === 'All' ? 'All' : STEP_LABELS[f]}
//               <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter===f?'bg-white/25':'bg-[#F8F7F6]'}`}>
//                 {count}
//               </span>
//             </button>
//           )
//         })}

//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="Search…"
//           className="ml-auto text-[12px] px-3 py-1.5 rounded-full border border-[#DDD9D4] bg-[#F8F7F6] outline-none focus:border-[#E85A2B] w-40 placeholder-[#C4BEB6]"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto -mx-1">
//         <table className="w-full text-[13px] border-collapse">
//           <thead>
//             <tr>
//               {['Customer','Phone','Step','Collection','Style','Last activity'].map(h => (
//                 <th key={h} className="text-left text-[11px] font-semibold text-[#C4BEB6] uppercase tracking-wide pb-3 px-2 whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-10 text-[#C4BEB6] text-sm">
//                   No conversations found
//                 </td>
//               </tr>
//             ) : filtered.map(s => {
//               const [bg, tc] = avatarColor(s.customerName)
//               return (
//                 <tr key={s.id} className="border-t border-[#F8F7F6] hover:bg-[#F8F7F6] group cursor-pointer">
//                   <td className="py-3 px-2">
//                     <div className="flex items-center gap-2.5">
//                       <div
//                         className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0"
//                         style={{ background: bg, color: tc }}
//                       >
//                         {initials(s.customerName)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-[#28241F] leading-tight">{s.customerName || 'Unknown'}</div>
//                         <div className="text-[11px] text-[#A49D94]">{s.isActive ? 'Active' : 'Inactive'}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-2 text-[#A49D94] font-mono text-[12px]">+{s.phone}</td>
//                   <td className="py-3 px-2"><StepBadge step={s.currentStep} /></td>
//                   <td className="py-3 px-2 text-[#7D7670]">{s.selectedCollection || '—'}</td>
//                   <td className="py-3 px-2 text-[#7D7670] whitespace-nowrap">
//                     {s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—'}
//                   </td>
//                   <td className="py-3 px-2 text-[#A49D94] whitespace-nowrap text-[12px]">{relTime(s.lastActivity)}</td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

import React, { useState, useMemo } from 'react'
import { Search, Download, Filter } from 'lucide-react'
import StepBadge from './StepBadge.jsx'
import { STEP_ORDER, STEP_LABELS, relTime, initials } from '../mockData.js'
import { ExportBar, exportToCSV, exportToPDF } from './Card.jsx'

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
        <div className="text-[13px] font-semibold text-[#1A1713] leading-tight whitespace-nowrap">{name}</div>
        {sub && <div className="text-[10px] text-[#B0A9A1] font-medium">{sub}</div>}
      </div>
    </div>
  )
}

const FILTER_OPTIONS = ['All', ...STEP_ORDER]

export default function ConversationsTable({ sessions = [] }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search,       setSearch]       = useState('')

  const filtered = useMemo(() => {
    let data = sessions
    if (activeFilter !== 'All')
      data = data.filter(s => s.currentStep === activeFilter)
    if (search.trim())
      data = data.filter(s =>
        (s.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.phone || '').includes(search)
      )
    return data
  }, [sessions, activeFilter, search])

  // Counts per step for filter pills
  const stepCounts = useMemo(() => {
    const c = { All: sessions.length }
    STEP_ORDER.forEach(s => { c[s] = sessions.filter(x => x.currentStep === s).length })
    return c
  }, [sessions])

  // Export shape
  const exportData = filtered.map(s => ({
    Name:       s.customerName || 'Unknown',
    Phone:      '+' + s.phone,
    Step:       STEP_LABELS[s.currentStep] || s.currentStep,
    Collection: s.selectedCollection || '—',
    Style:      s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—',
    Active:     s.isActive ? 'Yes' : 'No',
    'Last Activity': relTime(s.lastActivity),
  }))

  return (
    <div>
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Step filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map(f => {
            const count   = stepCounts[f] ?? 0
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
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
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
              {['Customer','Phone','Step','Collection','Style','Last activity'].map(h => (
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[13px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-30">💬</span>
                    No conversations found
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className="table-row-hover border-b border-[#F4F1ED] last:border-0"
                >
                  <td className="py-3 px-4">
                    <AvatarCell
                      name={s.customerName || 'Unknown'}
                      sub={s.isActive ? 'Active' : 'Inactive'}
                      index={i}
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
                    {s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—'}
                  </td>
                  <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">
                    {relTime(s.lastActivity)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-[#B0A9A1] font-medium">
          Showing <span className="text-[#6B6560] font-bold">{filtered.length}</span> of{' '}
          <span className="text-[#6B6560] font-bold">{sessions.length}</span> conversations
        </p>
      </div>
    </div>
  )
}