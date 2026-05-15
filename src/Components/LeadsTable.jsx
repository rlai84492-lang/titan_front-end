import React, { useState } from 'react'
import { relTime, initials, avatarColor } from '../mockData.js'

const TYPE_STYLE = {
  CALLBACK:    { bg:'#EBF4FD', color:'#185FA5', label:'Callback'    },
  STORE_VISIT: { bg:'#E1F5EE', color:'#0F6E56', label:'Store visit' },
  WEBSITE:     { bg:'#EEEDFE', color:'#3C3489', label:'Website'     },
}
const STATUS_STYLE = {
  NEW:       { bg:'#FEF3CD', color:'#BA7517', label:'New'       },
  ASSIGNED:  { bg:'#EBF4FD', color:'#185FA5', label:'Assigned'  },
  CONTACTED: { bg:'#E1F5EE', color:'#0F6E56', label:'Contacted' },
  CONVERTED: { bg:'#D1FAE5', color:'#059669', label:'Converted' },
  LOST:      { bg:'#FEE2E2', color:'#991B1B', label:'Lost'      },
}

function Pill({ map, val }) {
  const s = map[val] || { bg:'#F8F7F6', color:'#A49D94', label: val }
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background:s.bg, color:s.color }}>
      {s.label}
    </span>
  )
}

export default function LeadsTable({ leads }) {
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = statusFilter === 'All'
    ? leads
    : leads.filter(l => l.status === statusFilter)

  return (
    <div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {['All','NEW','ASSIGNED','CONTACTED','CONVERTED','LOST'].map(f => {
          const count = f === 'All' ? leads.length : leads.filter(l => l.status === f).length
          return (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${
                statusFilter === f
                  ? 'bg-[#E85A2B] border-[#E85A2B] text-white'
                  : 'border-[#DDD9D4] text-[#7D7670] hover:bg-[#F8F7F6]'
              }`}
            >
              {f === 'All' ? 'All' : STATUS_STYLE[f]?.label || f} ({count})
            </button>
          )
        })}
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              {['Customer','Lead type','Collection','Style','Price range','Status','Created'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#C4BEB6] uppercase tracking-wide pb-3 px-2 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#C4BEB6] text-sm">No leads found</td>
              </tr>
            ) : filtered.map(l => {
              const [bg, tc] = avatarColor(l.customerName)
              return (
                <tr key={l.id} className="border-t border-[#F8F7F6] hover:bg-[#F8F7F6] cursor-pointer">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0" style={{ background:bg, color:tc }}>
                        {initials(l.customerName)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#28241F]">{l.customerName}</div>
                        <div className="text-[11px] text-[#A49D94] font-mono">+{l.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2"><Pill map={TYPE_STYLE} val={l.leadType} /></td>
                  <td className="py-3 px-2 text-[#7D7670]">{l.selectedCollection || '—'}</td>
                  <td className="py-3 px-2 text-[#7D7670] whitespace-nowrap">{l.selectedStyle ? l.selectedStyle.replace(/_/g,' ') : '—'}</td>
                  <td className="py-3 px-2 text-[#7D7670]">{l.priceRange || '—'}</td>
                  <td className="py-3 px-2"><Pill map={STATUS_STYLE} val={l.status} /></td>
                  <td className="py-3 px-2 text-[#A49D94] text-[12px] whitespace-nowrap">{relTime(l.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}