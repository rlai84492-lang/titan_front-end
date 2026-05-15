import React, { useState } from 'react'
import StepBadge from './StepBadge.jsx'
import { STEP_ORDER, STEP_LABELS, relTime, initials, avatarColor } from '../mockData.js'

const FILTERS = ['All', ...STEP_ORDER]

export default function ConversationsTable({ sessions }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = sessions
    .filter(s => filter === 'All' || s.currentStep === filter)
    .filter(s => {
      const q = search.toLowerCase()
      return !q || (s.customerName||'').toLowerCase().includes(q) || s.phone.includes(q)
    })

  return (
    <div>
      {/* Filter row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map(f => {
          const count = f === 'All'
            ? sessions.length
            : sessions.filter(s => s.currentStep === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border font-medium transition-all ${
                filter === f
                  ? 'bg-[#E85A2B] border-[#E85A2B] text-white shadow-sm'
                  : 'bg-transparent border-[#DDD9D4] text-[#7D7670] hover:bg-[#F8F7F6] hover:border-[#C4BEB6]'
              }`}
            >
              {f === 'All' ? 'All' : STEP_LABELS[f]}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter===f?'bg-white/25':'bg-[#F8F7F6]'}`}>
                {count}
              </span>
            </button>
          )
        })}

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          className="ml-auto text-[12px] px-3 py-1.5 rounded-full border border-[#DDD9D4] bg-[#F8F7F6] outline-none focus:border-[#E85A2B] w-40 placeholder-[#C4BEB6]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              {['Customer','Phone','Step','Collection','Style','Last activity'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[#C4BEB6] uppercase tracking-wide pb-3 px-2 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#C4BEB6] text-sm">
                  No conversations found
                </td>
              </tr>
            ) : filtered.map(s => {
              const [bg, tc] = avatarColor(s.customerName)
              return (
                <tr key={s.id} className="border-t border-[#F8F7F6] hover:bg-[#F8F7F6] group cursor-pointer">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: bg, color: tc }}
                      >
                        {initials(s.customerName)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#28241F] leading-tight">{s.customerName || 'Unknown'}</div>
                        <div className="text-[11px] text-[#A49D94]">{s.isActive ? 'Active' : 'Inactive'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[#A49D94] font-mono text-[12px]">+{s.phone}</td>
                  <td className="py-3 px-2"><StepBadge step={s.currentStep} /></td>
                  <td className="py-3 px-2 text-[#7D7670]">{s.selectedCollection || '—'}</td>
                  <td className="py-3 px-2 text-[#7D7670] whitespace-nowrap">
                    {s.selectedStyle ? s.selectedStyle.replace(/_/g,' ') : '—'}
                  </td>
                  <td className="py-3 px-2 text-[#A49D94] whitespace-nowrap text-[12px]">{relTime(s.lastActivity)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}