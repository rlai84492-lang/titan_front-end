import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Search } from 'lucide-react'
import StepBadge from './StepBadge'
import { FLOW_STEPS, STEP_META, BRANDS, BRAND_KEYS, relTime, initials } from '../mockData'
import { ExportBar } from './CardOne'

const AVATAR_COLORS = [
  ['#EBF4FD','#378ADD'],['#FEF0EB','#E85A2B'],['#E1F5EE','#1D9E75'],
  ['#EEEDFE','#7F77DD'],['#FEF3CD','#BA7517'],['#FCEEF4','#D4537E'],
  ['#F0FDF4','#16A34A'],['#FFF7ED','#EA580C'],
]

export default function ConversationsTableOne({ sessions = [] }) {
  const activeFlow    = useSelector(s => s.ui.activeFlow)
  const steps         = FLOW_STEPS[activeFlow] || []

  const [collFilter,  setCollFilter]  = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [stepFilter,  setStepFilter]  = useState('All')
  const [search,      setSearch]      = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Filter sessions to only this flow's steps
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

  useEffect(() => { setCurrentPage(1) }, [collFilter, brandFilter, stepFilter, search, rowsPerPage, activeFlow])

  const totalPages   = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [filtered, currentPage, rowsPerPage])

  const exportData = filtered.map(s => ({
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
      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">

        {/* Collection filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Collection:</span>
          {['All', 'MENS', 'WOMENS', 'COUPLES'].map(f => (
            <button
              key={f}
              onClick={() => setCollFilter(f)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                collFilter === f
                  ? 'border-[#E85A2B] bg-[#E85A2B] text-white'
                  : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
              }`}
            >
              {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Brand filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Brand:</span>
          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]"
          >
            <option value="All">All Brands</option>
            {BRANDS.map((b, i) => (
              <option key={b} value={BRAND_KEYS[i]}>{b}</option>
            ))}
          </select>
        </div>

        {/* Step filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Step:</span>
          <select
            value={stepFilter}
            onChange={e => setStepFilter(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]"
          >
            <option value="All">All Steps</option>
            {steps.map(step => (
              <option key={step} value={step}>
                {STEP_META[step]?.label || step}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name / phone…"
            className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-36 transition-all"
          />
        </div>

        <ExportBar
          tableId="conv-table"
          title="Active Conversations"
          data={exportData}
          filename="titan-conversations"
          compact
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#EEEBE6]">
        <table id="conv-table" className="w-full border-collapse text-xs">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg,#FAF8F6,#F5F3F0)' }}>
              {['Customer','Phone','Step','Collection','Brand','Last Activity'].map(h => (
                <th key={h} className="text-left text-[9px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[12px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-30">💬</span>
                    No conversations found
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((s, i) => {
                const realIndex = (currentPage - 1) * rowsPerPage + i
                const [abg, atx] = AVATAR_COLORS[realIndex % AVATAR_COLORS.length]
                return (
                  <tr key={s.id} className="table-row-hover border-b border-[#F4F1ED] last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: abg, color: atx }}>
                          {initials(s.customerName)}
                        </div>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[10px] text-[#B0A9A1] font-medium">
          Showing <b className="text-[#6B6560]">{Math.min((currentPage-1)*rowsPerPage+1, filtered.length)}</b>
          {' '}to{' '}
          <b className="text-[#6B6560]">{Math.min(currentPage*rowsPerPage, filtered.length)}</b>
          {' '}of{' '}
          <b className="text-[#6B6560]">{filtered.length}</b> conversations
        </p>
        <div className="flex items-center gap-2">
          <select value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}
            className="h-7 px-2 text-[10px] font-semibold rounded-lg border border-[#EEEBE6] bg-white text-[#6B6560] outline-none">
            {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}
            className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40 hover:border-[#E85A2B]/40">Prev</button>
          {Array.from({length: Math.min(totalPages,5)}, (_, i) => i+1).map(pg => (
            <button key={pg} onClick={() => setCurrentPage(pg)}
              className="w-7 h-7 rounded-lg text-[10px] font-bold border transition-all"
              style={currentPage===pg ? {background:'#E85A2B',borderColor:'#E85A2B',color:'#fff'} : {borderColor:'#EEEBE6',color:'#6B6560'}}>
              {pg}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}
            className="h-7 px-2.5 rounded-lg text-[10px] font-bold border border-[#EEEBE6] text-[#6B6560] disabled:opacity-40 hover:border-[#E85A2B]/40">Next</button>
        </div>
      </div>
    </div>
  )
}