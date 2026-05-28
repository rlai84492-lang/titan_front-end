// import React, { useState } from 'react'
// import { relTime, initials, avatarColor } from '../mockData.js'

// const TYPE_STYLE = {
//   CALLBACK:    { bg:'#EBF4FD', color:'#185FA5', label:'Callback'    },
//   STORE_VISIT: { bg:'#E1F5EE', color:'#0F6E56', label:'Store visit' },
//   WEBSITE:     { bg:'#EEEDFE', color:'#3C3489', label:'Website'     },
// }
// const STATUS_STYLE = {
//   NEW:       { bg:'#FEF3CD', color:'#BA7517', label:'New'       },
//   ASSIGNED:  { bg:'#EBF4FD', color:'#185FA5', label:'Assigned'  },
//   CONTACTED: { bg:'#E1F5EE', color:'#0F6E56', label:'Contacted' },
//   CONVERTED: { bg:'#D1FAE5', color:'#059669', label:'Converted' },
//   LOST:      { bg:'#FEE2E2', color:'#991B1B', label:'Lost'      },
// }

// function Pill({ map, val }) {
//   const s = map[val] || { bg:'#F8F7F6', color:'#A49D94', label: val }
//   return (
//     <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background:s.bg, color:s.color }}>
//       {s.label}
//     </span>
//   )
// }

// export default function LeadsTable({ leads }) {
//   const [statusFilter, setStatusFilter] = useState('All')

//   const filtered = statusFilter === 'All'
//     ? leads
//     : leads.filter(l => l.status === statusFilter)

//   return (
//     <div>
//       <div className="flex gap-1.5 mb-4 flex-wrap">
//         {['All','NEW','ASSIGNED','CONTACTED','CONVERTED','LOST'].map(f => {
//           const count = f === 'All' ? leads.length : leads.filter(l => l.status === f).length
//           return (
//             <button
//               key={f}
//               onClick={() => setStatusFilter(f)}
//               className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${
//                 statusFilter === f
//                   ? 'bg-[#E85A2B] border-[#E85A2B] text-white'
//                   : 'border-[#DDD9D4] text-[#7D7670] hover:bg-[#F8F7F6]'
//               }`}
//             >
//               {f === 'All' ? 'All' : STATUS_STYLE[f]?.label || f} ({count})
//             </button>
//           )
//         })}
//       </div>

//       <div className="overflow-x-auto -mx-1">
//         <table className="w-full text-[13px] border-collapse">
//           <thead>
//             <tr>
//               {['Customer','Lead type','Collection','Style','Price range','Status','Created'].map(h => (
//                 <th key={h} className="text-left text-[11px] font-semibold text-[#C4BEB6] uppercase tracking-wide pb-3 px-2 whitespace-nowrap">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-[#C4BEB6] text-sm">No leads found</td>
//               </tr>
//             ) : filtered.map(l => {
//               const [bg, tc] = avatarColor(l.customerName)
//               return (
//                 <tr key={l.id} className="border-t border-[#F8F7F6] hover:bg-[#F8F7F6] cursor-pointer">
//                   <td className="py-3 px-2">
//                     <div className="flex items-center gap-2.5">
//                       <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background:bg, color:tc }}>
//                         {initials(l.customerName)}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-[#28241F]">{l.customerName}</div>
//                         <div className="text-[11px] text-[#A49D94] font-mono">+{l.phone}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3 px-2"><Pill map={TYPE_STYLE} val={l.leadType} /></td>
//                   <td className="py-3 px-2 text-[#7D7670]">{l.selectedCollection || '—'}</td>
//                   <td className="py-3 px-2 text-[#7D7670] whitespace-nowrap">{l.selectedStyle ? l.selectedStyle.replace(/_/g,' ') : '—'}</td>
//                   <td className="py-3 px-2 text-[#7D7670]">{l.priceRange || '—'}</td>
//                   <td className="py-3 px-2"><Pill map={STATUS_STYLE} val={l.status} /></td>
//                   <td className="py-3 px-2 text-[#A49D94] text-[12px] whitespace-nowrap">{relTime(l.createdAt)}</td>
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
import { Search } from 'lucide-react'
import { relTime, initials } from '../mockData.js'
import { ExportBar } from './Card.jsx'

const AVATAR_COLORS = [
  ['#FEF0EB','#E85A2B'], ['#EBF4FD','#378ADD'], ['#E1F5EE','#1D9E75'],
  ['#EEEDFE','#7F77DD'], ['#FEF3CD','#BA7517'], ['#FCEEF4','#D4537E'],
]

const TYPE_CONFIG = {
  CALLBACK:    { bg:'#EBF4FD', text:'#1A6DC7', label:'Callback'    },
  STORE_VISIT: { bg:'#E1F5EE', text:'#0F7A5A', label:'Store Visit' },
  WEBSITE:     { bg:'#EEEDFE', text:'#5E55C8', label:'Website'     },
}
const STATUS_CONFIG = {
  NEW:       { bg:'#FEF3CD', text:'#92590A', label:'New'       },
  ASSIGNED:  { bg:'#EBF4FD', text:'#1A6DC7', label:'Assigned'  },
  CONTACTED: { bg:'#E1F5EE', text:'#0F7A5A', label:'Contacted' },
  CONVERTED: { bg:'#DCFCE7', text:'#15803D', label:'Converted' },
  LOST:      { bg:'#FEF2F2', text:'#B91C1C', label:'Lost'      },
}

function TypePill({ type }) {
  const c = TYPE_CONFIG[type] || { bg:'#F5F3F0', text:'#6B6560', label: type }
  return (
    <span
      className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  )
}

function StatusPill({ status }) {
  const c = STATUS_CONFIG[status] || { bg:'#F5F3F0', text:'#6B6560', label: status }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.text }} />
      {c.label}
    </span>
  )
}

export default function LeadsTable({ leads = [] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const filtered = useMemo(() => {
    let data = leads
    if (typeFilter !== 'All') data = data.filter(l => l.leadType === typeFilter)
    if (search.trim())
      data = data.filter(l =>
        (l.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.phone || '').includes(search)
      )
    return data
  }, [leads, typeFilter, search])

  const exportData = filtered.map(l => ({
    Name:       l.customerName || 'Unknown',
    Phone:      '+' + l.phone,
    'Lead Type': l.leadType || '—',
    Collection: l.selectedCollection || '—',
    Style:      l.selectedStyle ? l.selectedStyle.replace(/_/g,' ') : '—',
    'Price Range': l.priceRange || '—',
    Status:     l.status || '—',
    Created:    relTime(l.createdAt),
  }))

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1.5">
          {['All','CALLBACK','STORE_VISIT','WEBSITE'].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all duration-150 ${
                typeFilter === f
                  ? 'border-[#E85A2B] text-white'
                  : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
              }`}
              style={typeFilter === f ? {
                background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
                boxShadow: '0 2px 8px rgba(232,90,43,0.25)',
              } : {}}
            >
              {f === 'All' ? 'All' : f === 'STORE_VISIT' ? 'Store Visit' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-7 pr-3 py-1.5 text-[12px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-32 transition-all font-dm"
            />
          </div>
          <ExportBar
            tableId="leads-table"
            title="Leads Report"
            data={exportData}
            filename="titan-leads"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
        <table id="leads-table" className="w-full border-collapse text-xs">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
              {['Customer','Phone','Lead Type','Collection','Style','Price Range','Status','Created'].map(h => (
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
                <td colSpan={8} className="text-center py-10 text-[#B0A9A1] text-[13px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-30">🎯</span>
                    No leads found
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((l, i) => (
                <tr
                  key={l.id}
                  className="table-row-hover border-b border-[#F4F1ED] last:border-0"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: AVATAR_COLORS[i % AVATAR_COLORS.length][0],
                          color: AVATAR_COLORS[i % AVATAR_COLORS.length][1],
                        }}
                      >
                        {initials(l.customerName || l.phone)}
                      </div>
                      <span className="text-[13px] font-semibold text-[#1A1713] whitespace-nowrap">
                        {l.customerName || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560] whitespace-nowrap">
                    +{l.phone}
                  </td>
                  <td className="py-3 px-4"><TypePill type={l.leadType} /></td>
                  <td className="py-3 px-4 text-[12px] text-[#6B6560]">
                    {l.selectedCollection ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-[12px] text-[#6B6560] whitespace-nowrap">
                    {l.selectedStyle ? l.selectedStyle.replace(/_/g,' ') : '—'}
                  </td>
                  <td className="py-3 px-4 text-[12px] text-[#6B6560] whitespace-nowrap">
                    {l.priceRange ? '₹' + l.priceRange.replace('-', '–₹') : '—'}
                  </td>
                  <td className="py-3 px-4"><StatusPill status={l.status} /></td>
                  <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">
                    {relTime(l.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <p className="text-[11px] text-[#B0A9A1] font-medium">
          Showing <span className="text-[#6B6560] font-bold">{filtered.length}</span> of{' '}
          <span className="text-[#6B6560] font-bold">{leads.length}</span> leads
        </p>
      </div>
    </div>
  )
}