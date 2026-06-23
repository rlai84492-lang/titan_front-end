import React, { useState, useMemo } from 'react'
import { useUI } from '../context/UIContext'
import { Search } from 'lucide-react'
import SortableHeader from './SortableHeader'
import { relTime, initials } from '../mockData'

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
    <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  )
}

function StatusPill({ status }) {
  const c = STATUS_CONFIG[status] || { bg:'#F5F3F0', text:'#6B6560', label: status }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.text }} />
      {c.label}
    </span>
  )
}

// ── Column field → comparable value extractor (sorting ke liye) ──
const SORT_ACCESSORS = {
  customerName:       (l) => (l.customerName || '').toLowerCase(),
  phone:              (l) => l.phone || '',
  leadType:           (l) => l.leadType || '',
  selectedCollection: (l) => l.selectedCollection || '',
  selectedBrand:      (l) => l.selectedBrand || '',   // ← NAYA — Brand sort
  stepName:           (l) => l.stepName || '',         // ← NAYA — Step sort
  status:             (l) => l.status || '',
  createdAt:          (l) => new Date(l.createdAt || 0).getTime(),
}

export default function LeadsTableOne({ leads = [] }) {
  const { activeFlow } = useUI()
  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

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

  const flowLeads = useMemo(() =>
    leads.filter(l => !l.flow || l.flow === activeFlow)
  , [leads, activeFlow])

  const filtered = useMemo(() => {
    let d = flowLeads
    if (typeFilter !== 'All') d = d.filter(l => l.leadType === typeFilter)
    if (search.trim()) d = d.filter(l =>
      (l.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.phone || '').includes(search)
    )
    return d
  }, [flowLeads, typeFilter, search])

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

  const totalLeads  = flowLeads.length
  const callbacks   = flowLeads.filter(l => l.leadType === 'CALLBACK').length
  const storeVisits = flowLeads.filter(l => l.leadType === 'STORE_VISIT').length

  // ← Helper: empty brand/step ko readable fallback dikhao, format clean karo
  const formatBrand = (b) => b && b.trim() ? b.replace(/_/g, ' ') : '—'
  const formatStep   = (s) => s && s.trim() ? s.replace(/_/g, ' ') : '—'

  return (
    <div>
      {/* 3 Summary Cards */}
      {/* <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total Leads', value: totalLeads,  color: '#E85A2B', bg: '#FEF0EB' },
          { label: 'Callback',    value: callbacks,   color: '#378ADD', bg: '#EBF4FD' },
          { label: 'Store Visit', value: storeVisits, color: '#1D9E75', bg: '#E1F5EE' },
        ].map(c => (
          <div key={c.label} style={{ borderRadius: 10, padding: '10px 12px', background: c.bg, border: `1px solid ${c.color}22` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, fontFamily: 'Sora,system-ui' }}>{c.value}</div>
            <div style={{ fontSize: 10, color: c.color, opacity: 0.8, fontWeight: 600, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div> */}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1.5">
          {['All','CALLBACK','STORE_VISIT'].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`text-[10px] font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                typeFilter === f ? 'border-[#E85A2B] text-white' : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
              }`}
              style={typeFilter === f ? { background: 'linear-gradient(135deg,#E85A2B,#FF7040)' } : {}}>
              {f === 'All' ? 'All' : f === 'STORE_VISIT' ? 'Store Visit' : 'Callback'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-32" />
        </div>
      </div>

      {/* Table — ab horizontal scroll chahiye kyunki 8 columns ho gaye */}
      <div className="overflow-x-auto">
        <table id="leads-table" className="w-full border-collapse text-xs">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
              <SortableHeader label="Customer"   field="customerName"       sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Phone"      field="phone"              sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Lead Type"  field="leadType"           sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Collection" field="selectedCollection" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Brand"      field="selectedBrand"      sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Step"       field="stepName"           sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Status"     field="status"             sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Created"    field="createdAt"          sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-[#B0A9A1] text-[13px]">
                <div className="flex flex-col items-center gap-2"><span className="text-2xl opacity-30">🎯</span>No leads found</div>
              </td></tr>
            ) : sorted.map((l, i) => (
              <tr key={l.id} className="table-row-hover border-b border-[#F4F1ED] last:border-0">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length][0], color: AVATAR_COLORS[i % AVATAR_COLORS.length][1] }}>
                      {initials(l.customerName || l.phone)}
                    </div>
                    <span className="text-[13px] font-semibold text-[#1A1713] whitespace-nowrap">{l.customerName || 'Unknown'}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560] whitespace-nowrap">+{l.phone}</td>
                <td className="py-3 px-4"><TypePill type={l.leadType} /></td>
                <td className="py-3 px-4 text-[12px] text-[#6B6560]">{l.selectedCollection ?? '—'}</td>
                <td className="py-3 px-4 text-[12px] text-[#6B6560] capitalize">{formatBrand(l.selectedBrand)}</td>
                <td className="py-3 px-4 text-[11px] text-[#6B6560] capitalize whitespace-nowrap">{formatStep(l.stepName)}</td>
                <td className="py-3 px-4"><StatusPill status={l.status} /></td>
                <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">{relTime(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}