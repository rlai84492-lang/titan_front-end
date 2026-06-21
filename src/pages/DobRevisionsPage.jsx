import React, { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Loader2, RefreshCw, Calendar, AlertCircle, FileSpreadsheet, Clock, CheckCircle2, ChevronDown } from 'lucide-react'
import { fetchDobRevisions } from '../api/dashboardApi'
import CardOne from '../Components/CardOne'

// ── Local date-range presets (page-specific, NOT global) ────────
const DATE_PRESETS = [
  { label: 'Today',   value: 'today'  },
  { label: '7 Days',  value: '7days'  },
  { label: '30 Days', value: '30days' },
  { label: 'Custom',  value: 'custom' },
]

// ── View toggle options ───────────────────────────────────────
const VIEW_OPTIONS = [
  { value: 'filled',  label: 'Customers With Date On File', icon: '✅' },
  { value: 'pending', label: 'Pending Requests',            icon: '⏳' },
]

const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  } catch { return '—' }
}

const fmtDateOnly = (iso) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return '—' }
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

const AVATAR_COLORS = [
  ['#FEF0EB', '#E85A2B'], ['#EBF4FD', '#378ADD'], ['#E1F5EE', '#1D9E75'],
  ['#EEEDFE', '#7F77DD'], ['#FEF3CD', '#BA7517'], ['#FCEEF4', '#D4537E'],
]

function FlowBadge({ flow }) {
  const cfg = flow === 'Birthday'
    ? { emoji: '🎂', bg: '#FEF0EB', color: '#E85A2B' }
    : { emoji: '💍', bg: '#F5F3FF', color: '#7C3AED' }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.emoji} {flow}
    </span>
  )
}

// ── Excel Export — works for either table ────────────────────────
const exportExcel = (rows, title, filename) => {
  if (!rows.length) return

  const summaryData = [
    [`TITAN WORLD — ${title}`],
    [],
    ['Generated On', new Date().toLocaleString('en-IN')],
    ['Total Records', rows.length],
  ]
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
  wsSummary['!cols'] = [{ wch: 22 }, { wch: 34 }]

  const wsData = XLSX.utils.json_to_sheet(rows)
  wsData['!cols'] = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length + 4, 16) }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary')
  XLSX.utils.book_append_sheet(wb, wsData, 'Data')
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// ── Export Button (with loading state) ───────────────────────────
function ExportButton({ rows, title, filename, label = 'Export Excel' }) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (exporting || !rows?.length) return
    setExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      exportExcel(rows, title, filename)
    } finally {
      setExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting || !rows?.length}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold
                 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      style={{ background: 'linear-gradient(135deg, #059669, #10B981)', color: '#fff' }}
    >
      {exporting
        ? <Loader2 size={12} className="animate-spin" />
        : <FileSpreadsheet size={12} />
      }
      {exporting ? 'Exporting…' : label}
    </button>
  )
}

// ── View Switcher Dropdown — Pending / Filled ────────────────────
function ViewSwitcher({ view, setView }) {
  const [open, setOpen] = useState(false)
  const current = VIEW_OPTIONS.find(o => o.value === view) || VIEW_OPTIONS[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold
                   border border-[#EEEBE6] bg-white text-[#1A1713] hover:bg-[#FAF8F6]
                   transition-all shadow-sm min-w-[230px] justify-between"
      >
        <span className="flex items-center gap-1.5">
          <span>{current.icon}</span>
          {current.label}
        </span>
        <ChevronDown size={14} className={`transition-transform text-[#B0A9A1] ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-full rounded-xl border border-[#EEEBE6] bg-white shadow-lg overflow-hidden z-20">
            {VIEW_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setView(opt.value); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-semibold text-left transition-colors
                  ${view === opt.value ? 'bg-[#FEF0EB] text-[#E85A2B]' : 'text-[#1A1713] hover:bg-[#FAF8F6]'}`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Local Date Range Picker (page-specific state, not global) ───
function LocalDateRangePicker({ range, setRange, customStart, setCustomStart, customEnd, setCustomEnd, onApplyCustom }) {
  const [showCustom, setShowCustom] = useState(range === 'custom')

  const handlePreset = (val) => {
    setRange(val)
    setShowCustom(val === 'custom')
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 bg-[#F5F3F0] rounded-xl p-1">
        {DATE_PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={range === p.value
              ? { background: '#fff', color: '#1A1713', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
              : { color: '#6B6560' }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date" value={customStart}
            onChange={e => setCustomStart(e.target.value)}
            className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
          />
          <span className="text-[11px] text-gray-400">to</span>
          <input
            type="date" value={customEnd}
            onChange={e => setCustomEnd(e.target.value)}
            className="text-[11px] border border-[#EEEBE6] rounded-lg px-2 py-1 outline-none focus:border-[#E85A2B]"
          />
          <button
            onClick={onApplyCustom}
            disabled={!customStart || !customEnd}
            className="px-3 py-1 rounded-lg text-[11px] font-bold text-white disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#E85A2B,#FF7040)' }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

// ── Premium Loader ─────────────────────────────────────────────
function PremiumLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-dashed"
          style={{ borderColor: '#E85A2B20', animation: 'spin 4s linear infinite' }} />
        <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
          style={{ borderTopColor: '#E85A2B', borderRightColor: '#E85A2B30', animation: 'spin 1.1s linear infinite' }} />
        <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: '#E85A2B', borderLeftColor: '#E85A2B40', animation: 'spin 0.75s linear infinite reverse' }} />
        <div className="absolute w-12 h-12 rounded-full"
          style={{ background: '#FEF0EB', animation: 'pulsate 1.6s ease-in-out infinite' }} />
        <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>📅</div>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: '#E85A2B' }}>TITAN WORLD</span>
        <span className="w-1 h-1 rounded-full" style={{ background: '#E85A2B80' }} />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">DOB Revisions</span>
      </div>
      <div className="text-[10px] text-gray-400 mb-6">Loading data…</div>
      <div className="flex items-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: '#E85A2B', animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
      <div className="w-full max-w-3xl px-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl"
              style={{ background: 'linear-gradient(90deg, #F5F3F0 25%, #FEF0EB 50%, #F5F3F0 75%)', backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
          ))}
        </div>
        <div className="h-48 rounded-xl"
          style={{ background: 'linear-gradient(90deg, #F5F3F0 25%, #FEF0EB 50%, #F5F3F0 75%)', backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
      </div>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

// ── Pending Table ─────────────────────────────────────────────
function PendingTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
            {['Customer', 'Phone', 'Flow', 'Revision Type', 'Requested On', 'Last Activity'].map(h => (
              <th key={h} className="text-left text-[10px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-12 text-[#B0A9A1] text-[13px]">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl opacity-30">✅</span>
                No pending requests in this date range
              </div>
            </td></tr>
          ) : rows.map((r, i) => (
            <tr key={r.id} className="border-b border-[#F4F1ED] last:border-0 hover:bg-[#FAF8F6] transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length][0], color: AVATAR_COLORS[i % AVATAR_COLORS.length][1] }}>
                    {initials(r.customerName)}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1A1713] whitespace-nowrap">{r.customerName || 'Unknown'}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560] whitespace-nowrap">+{r.phone}</td>
              <td className="py-3 px-4"><FlowBadge flow={r.flow} /></td>
              <td className="py-3 px-4 text-[12px] text-[#6B6560]">{r.revisionType}</td>
              <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">{fmtDate(r.requestedAt)}</td>
              <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">{fmtDate(r.lastActivity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Filled Table ──────────────────────────────────────────────
function FilledTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #FAF8F6 0%, #F5F3F0 100%)' }}>
            {['Customer', 'Phone', 'Date of Birth', 'Anniversary Date', 'Record Created'].map(h => (
              <th key={h} className="text-left text-[10px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-12 text-[#B0A9A1] text-[13px]">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl opacity-30">📭</span>
                No filled records in this date range
              </div>
            </td></tr>
          ) : rows.map((r, i) => (
            <tr key={r.id} className="border-b border-[#F4F1ED] last:border-0 hover:bg-[#FAF8F6] transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length][0], color: AVATAR_COLORS[i % AVATAR_COLORS.length][1] }}>
                    {initials(r.customerName)}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1A1713] whitespace-nowrap">{r.customerName || 'Unknown'}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-[11px] text-[#6B6560] whitespace-nowrap">+{r.phone}</td>
              <td className="py-3 px-4 text-[12px] text-[#6B6560]">
                {r.dateOfBirth
                  ? <span className="inline-flex items-center gap-1"><span>🎂</span>{fmtDateOnly(r.dateOfBirth)}</span>
                  : '—'}
              </td>
              <td className="py-3 px-4 text-[12px] text-[#6B6560]">
                {r.anniversaryDate
                  ? <span className="inline-flex items-center gap-1"><span>💍</span>{fmtDateOnly(r.anniversaryDate)}</span>
                  : '—'}
              </td>
              <td className="py-3 px-4 text-[12px] text-[#B0A9A1] whitespace-nowrap">{fmtDate(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────
export default function DobRevisionsPage() {
  // ── LOCAL date range — independent of global DashboardContext ──
  const [range,       setRange]       = useState('today')
  const [customStart, setCustomStart] = useState('')
  const [customEnd,   setCustomEnd]   = useState('')

  // ── Which table to show — default is "filled" ──────────────────
  const [view, setView] = useState('filled')

  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,      setError]      = useState(null)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)
    try {
      const result = await fetchDobRevisions(range, customStart, customEnd)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [range, customStart, customEnd])

  // ── Reload whenever range changes (except custom, which waits for Apply) ──
  useEffect(() => {
    if (range !== 'custom') {
      loadData()
    }
  }, [range]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return
    loadData()
  }

  if (loading) return <PremiumLoader />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={40} className="text-red-400 mb-4" />
        <div className="text-[14px] font-semibold text-red-500 mb-2">Failed to load DOB revision data</div>
        <div className="text-[12px] text-[#B0A9A1] mb-4">{error}</div>
        <button onClick={() => loadData()} className="px-4 py-2 rounded-xl text-[12px] font-bold text-white" style={{ background: '#E85A2B' }}>
          Retry
        </button>
      </div>
    )
  }

  const pending = data?.pending || []
  const filled  = data?.filled  || []
  const isFilledView = view === 'filled'

  return (
    <div className="space-y-5">

      {/* ── Header Banner + Local Date Range ── */}
      <div className="rounded-xl px-5 py-3 flex items-center justify-between flex-wrap gap-3"
        style={{ background: 'linear-gradient(135deg, #E85A2B15, #E85A2B05)', border: '1px solid #E85A2B25' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <div className="font-bold text-sm" style={{ color: '#E85A2B' }}>DOB / Date Revision Tracker</div>
            <div className="text-[10px] text-gray-400">Pending requests &amp; customers with date already on file</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <LocalDateRangePicker
            range={range} setRange={setRange}
            customStart={customStart} setCustomStart={setCustomStart}
            customEnd={customEnd} setCustomEnd={setCustomEnd}
            onApplyCustom={handleApplyCustom}
          />
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50 transition-all disabled:opacity-60"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Count Boxes ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 border" style={{ background: '#FEF0EB', borderColor: '#E85A2B22' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-sora font-extrabold text-2xl" style={{ color: '#E85A2B' }}>{data?.pendingCount ?? 0}</div>
              <div className="text-[10px] font-semibold mt-1" style={{ color: '#E85A2B', opacity: 0.8 }}>
                <Clock size={10} className="inline mr-1" />Total Pending
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: '#FEF0EB', borderColor: '#E85A2B22' }}>
          <div className="font-sora font-extrabold text-2xl" style={{ color: '#E85A2B' }}>{data?.pendingDobCount ?? 0}</div>
          <div className="text-[10px] font-semibold mt-1" style={{ color: '#E85A2B', opacity: 0.8 }}>🎂 DOB Pending</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: '#F5F3FF', borderColor: '#7C3AED22' }}>
          <div className="font-sora font-extrabold text-2xl" style={{ color: '#7C3AED' }}>{data?.pendingAnnivCount ?? 0}</div>
          <div className="text-[10px] font-semibold mt-1" style={{ color: '#7C3AED', opacity: 0.8 }}>💍 Anniversary Pending</div>
        </div>
        <div className="rounded-xl p-4 border" style={{ background: '#E1F5EE', borderColor: '#1D9E7522' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-sora font-extrabold text-2xl" style={{ color: '#1D9E75' }}>{data?.filledCount ?? 0}</div>
              <div className="text-[10px] font-semibold mt-1" style={{ color: '#1D9E75', opacity: 0.8 }}>
                <CheckCircle2 size={10} className="inline mr-1" />Date On File
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── View Switcher Dropdown + Active Table ── */}
      <CardOne
        title={isFilledView
          ? `Customers With Date On File (${filled.length})`
          : `Pending Requests (${pending.length})`}
        subtitle={isFilledView
          ? "Customers who already have a Date of Birth or Anniversary Date recorded"
          : "Users who said 'No, that's not right' and haven't replied with the correct date yet"}
        icon={isFilledView ? '✅' : '⏳'}
        action={
          <div className="flex items-center gap-2">
            <ViewSwitcher view={view} setView={setView} />
            {isFilledView ? (
              <ExportButton
                rows={filled.map(r => ({
                  Name: r.customerName, Phone: r.phone,
                  'Date of Birth': r.dateOfBirth || '—',
                  'Anniversary Date': r.anniversaryDate || '—',
                  'Record Created': fmtDate(r.createdAt),
                }))}
                title="Customers With Date On File"
                filename="TitanWorld_DOB_Filled"
              />
            ) : (
              <ExportButton
                rows={pending.map(r => ({
                  Name: r.customerName, Phone: r.phone, Flow: r.flow,
                  'Revision Type': r.revisionType, 'Requested On': fmtDate(r.requestedAt),
                  'Last Activity': fmtDate(r.lastActivity),
                }))}
                title="Pending DOB / Date Revisions"
                filename="TitanWorld_DOB_Pending"
              />
            )}
          </div>
        }
      >
        {isFilledView ? <FilledTable rows={filled} /> : <PendingTable rows={pending} />}
      </CardOne>

    </div>
  )
}