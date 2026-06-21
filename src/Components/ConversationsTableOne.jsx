

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Search, Loader2, FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react'
import StepBadge   from './StepBadge'
import SortableHeader from './SortableHeader'
import { FLOW_STEPS, STEP_META, BRANDS, BRAND_KEYS, relTime, initials } from '../mockData'
import { exportToExcel } from './CardOne'
import { fetchSessions } from '../api/dashboardApi'

// ── Avatar colour palette ──────────────────────────────────────
const AVATAR_COLORS = [
  ['#EBF4FD','#378ADD'],['#FEF0EB','#E85A2B'],['#E1F5EE','#1D9E75'],
  ['#EEEDFE','#7F77DD'],['#FEF3CD','#BA7517'],['#FCEEF4','#D4537E'],
  ['#F0FDF4','#16A34A'],['#FFF7ED','#EA580C'],
]

// ════════════════════════════════════════════════════════════════
export default function ConversationsTableOne({
  sessions      = [],
  totalSessions = 0,
  page          = 0,
  totalPages    = 1,
  pageSize      = 100,
  pageLoading   = false,
  sortField     = 'lastActivity',
  sortDir       = 'desc',
  activeFlow    = 'bday_t10',
  dateRange     = 'today',
  customStart   = '',
  customEnd     = '',
  collection    = '',
  brand         = '',
  step          = '',
  search        = '',
  onFilterChange,
  onSort,
  onPageChange,
}) {
  const steps = FLOW_STEPS[activeFlow] || []

  // ── Local input state (debounced before calling parent) ───────
  const [localSearch,     setLocalSearch]     = useState(search)
  const [localCollection, setLocalCollection] = useState(collection)
  const [localBrand,      setLocalBrand]      = useState(brand)
  const [localStep,       setLocalStep]       = useState(step)

  // Keep local state in sync when parent resets filters (flow change etc.)
  useEffect(() => { setLocalSearch(search)     }, [search])
  useEffect(() => { setLocalCollection(collection) }, [collection])
  useEffect(() => { setLocalBrand(brand)       }, [brand])
  useEffect(() => { setLocalStep(step)         }, [step])

  // ── Debounce search — don't fire on every keystroke ──────────
  const searchDebounce = useRef(null)
  const handleSearchInput = (val) => {
    setLocalSearch(val)
    clearTimeout(searchDebounce.current)
    searchDebounce.current = setTimeout(() => {
      onFilterChange?.({ collection: localCollection, brand: localBrand, step: localStep, search: val })
    }, 400)
  }

  // ── Filter button handlers ────────────────────────────────────
  const handleCollection = (val) => {
    const v = val === 'All' ? '' : val
    setLocalCollection(v)
    onFilterChange?.({ collection: v, brand: localBrand, step: localStep, search: localSearch })
  }

  const handleBrand = (val) => {
    const v = val === 'All' ? '' : val
    setLocalBrand(v)
    onFilterChange?.({ collection: localCollection, brand: v, step: localStep, search: localSearch })
  }

  const handleStep = (val) => {
    const v = val === 'All' ? '' : val
    setLocalStep(v)
    onFilterChange?.({ collection: localCollection, brand: localBrand, step: v, search: localSearch })
  }

  // ── Sort handler ──────────────────────────────────────────────
  const handleSort = (field) => {
    const newDir = sortField === field && sortDir === 'asc' ? 'desc' : 'asc'
    onSort?.(field, newDir)
  }

  // ── Client-side rows per page (display only — server page is 100) ─
  // The server sends 100 rows per page. The user can choose to display
  // 10 / 25 / 50 / 100 of those rows at a time using this local control.
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [localPage,   setLocalPage]   = useState(0)

  useEffect(() => { setLocalPage(0) }, [sessions])

  const totalLocalPages = Math.max(1, Math.ceil(sessions.length / rowsPerPage))
  const pageRows = useMemo(() => {
    const start = localPage * rowsPerPage
    return sessions.slice(start, start + rowsPerPage)
  }, [sessions, localPage, rowsPerPage])

  // Displayed range labels
  const serverStart  = page * pageSize
  const displayStart = serverStart + localPage * rowsPerPage + 1
  const displayEnd   = Math.min(serverStart + (localPage + 1) * rowsPerPage, serverStart + sessions.length)

  // ── Export — fetches ALL filtered rows from server ─────────────
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (exporting) return
    setExporting(true)
    try {
      // Fetch all matching rows — backend allows up to size=500 per call.
      // Loop through all pages and collect everything.
      let allSessions = []
      const exportSize = 500
      let exportPage   = 0
      let exportTotal  = Infinity

      while (allSessions.length < exportTotal) {
        const data = await fetchSessions(
          activeFlow, dateRange, customStart, customEnd,
          localCollection || '', localBrand || '', localStep || '', localSearch || '',
          sortField, sortDir,
          exportPage, exportSize
        )
        allSessions = [...allSessions, ...data.sessions]
        exportTotal = data.totalSessions
        exportPage++
        if (allSessions.length >= exportTotal || data.sessions.length === 0) break
      }

      const rows = allSessions.map(s => ({
        Name:            s.customerName || 'Unknown',
        Phone:           '+' + s.phone,
        Step:            STEP_META[s.currentStep]?.label || s.currentStep || '—',
        Collection:      s.selectedCollection || '—',
        Brand:           s.selectedBrand?.replace(/_/g, ' ') || '—',
        Active:          s.isActive ? 'Yes' : 'No',
        'Last Activity': relTime(s.lastActivity),
      }))

      exportToExcel(rows, `titan-conversations-${activeFlow}`)
    } catch (err) {
      console.error('[Export] failed', err)
    } finally {
      setExporting(false)
    }
  }, [exporting, activeFlow, dateRange, customStart, customEnd,
      localCollection, localBrand, localStep, localSearch, sortField, sortDir])

  // ── Pagination helpers ────────────────────────────────────────
  // Navigation uses TWO levels:
  //   Server pages → onPageChange (loads new 100-row batch from API)
  //   Local pages  → setLocalPage (slices the current batch client-side)
  const goLocalPrev = () => {
    if (localPage > 0) { setLocalPage(p => p - 1); return }
    // Local page 0 → go to previous server page, show last local slice
    if (page > 0) {
      onPageChange?.(page - 1)
      // After server page loads, local page will reset to 0 via useEffect
    }
  }
  const goLocalNext = () => {
    if (localPage < totalLocalPages - 1) { setLocalPage(p => p + 1); return }
    // Last local slice → next server page
    if (page < totalPages - 1) {
      onPageChange?.(page + 1)
    }
  }

  const isFirstPage = page === 0 && localPage === 0
  const isLastPage  = page >= totalPages - 1 && localPage >= totalLocalPages - 1

  // Server-page button numbers to show
  const serverPageButtons = useMemo(() => {
    const total = totalPages
    const cur   = page
    const start = Math.max(0, Math.min(cur - 2, total - 5))
    return Array.from({ length: Math.min(5, total) }, (_, i) => start + i)
  }, [totalPages, page])

  // ── Shimmer overlay while loading ────────────────────────────
  const shimmerStyle = {
    position: 'absolute', inset: 0, zIndex: 10,
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(1px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12,
  }

  return (
    <div>

      {/* ── Filters row ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">

        {/* Collection pills */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Collection:</span>
          {['All','MENS','WOMENS'].map(f => (
            <button key={f} onClick={() => handleCollection(f)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                (localCollection === (f === 'All' ? '' : f))
                  ? 'border-[#E85A2B] bg-[#E85A2B] text-white'
                  : 'border-[#EEEBE6] text-[#6B6560] hover:bg-[#FEF0EB]/50'
              }`}>
              {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Brand dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Brand:</span>
          <select value={localBrand || 'All'} onChange={e => handleBrand(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
            <option value="All">All Brands</option>
            {BRANDS.map((b, i) => <option key={b} value={BRAND_KEYS[i]}>{b}</option>)}
          </select>
        </div>

        {/* Step dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-[#A49D94] mr-1">Step:</span>
          <select value={localStep || 'All'} onChange={e => handleStep(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-lg border border-[#EEEBE6] text-[#6B6560] bg-white outline-none focus:border-[#E85A2B]">
            <option value="All">All Steps</option>
            {steps.map(s => (
              <option key={s} value={s}>{STEP_META[s]?.label || s}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
          <input value={localSearch} onChange={e => handleSearchInput(e.target.value)}
            placeholder="Search name / phone…"
            className="pl-7 pr-3 py-1.5 text-[11px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl outline-none focus:border-[#E85A2B] w-40" />
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={exporting || totalSessions === 0}
          className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold
                     text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: '#059669' }}
        >
          {exporting
            ? <Loader2 size={13} className="animate-spin" />
            : <FileSpreadsheet size={13} />
          }
          {exporting
            ? 'Exporting…'
            : `Export All (${totalSessions.toLocaleString()})`
          }
        </button>

      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="relative overflow-x-auto rounded-xl border border-[#EEEBE6]">

        {/* Shimmer overlay while page loads */}
        {pageLoading && (
          <div style={shimmerStyle}>
            <div className="flex items-center gap-2 text-[12px] text-[#6B6560] font-semibold">
              <Loader2 size={16} className="animate-spin text-[#E85A2B]" />
              Loading…
            </div>
          </div>
        )}

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
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#B0A9A1] text-[12px]">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl opacity-30">💬</span>
                    No conversations found
                  </div>
                </td>
              </tr>
            ) : pageRows.map((s, i) => {
              const ri = localPage * rowsPerPage + i
              const [abg, atx] = AVATAR_COLORS[ri % AVATAR_COLORS.length]
              return (
                <tr key={s.id ?? i} className="table-row-hover border-b border-[#F4F1ED] last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: abg, color: atx }}>
                        {initials(s.customerName)}
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-[#1A1713]">
                          {s.customerName || 'Unknown'}
                        </div>
                        <div className="text-[9px] text-[#B0A9A1]">
                          {s.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#6B6560]">+{s.phone}</td>
                  <td className="py-3 px-4"><StepBadge step={s.currentStep} /></td>
                  <td className="py-3 px-4 text-[11px] text-[#6B6560]">{s.selectedCollection || '—'}</td>
                  <td className="py-3 px-4 text-[10px] text-[#6B6560]">
                    {s.selectedBrand?.replace(/_/g, ' ') || '—'}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#B0A9A1] whitespace-nowrap">
                    {relTime(s.lastActivity)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Left: record range */}
        <p className="text-[10px] text-[#B0A9A1] font-medium">
          Showing{' '}
          <b className="text-[#6B6560]">{totalSessions === 0 ? 0 : displayStart.toLocaleString()}</b>
          {' '}–{' '}
          <b className="text-[#6B6560]">{displayEnd.toLocaleString()}</b>
          {' '}of{' '}
          <b className="text-[#6B6560]">{totalSessions.toLocaleString()}</b>
          {' '}sessions
          {(localCollection || localBrand || localStep || localSearch) && (
            <span className="ml-1 text-[#E85A2B] font-semibold">(filtered)</span>
          )}
        </p>

        {/* Right: controls */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Rows per display-page */}
          <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setLocalPage(0) }}
            className="h-7 px-2 text-[10px] font-semibold rounded-lg border border-[#EEEBE6] bg-white text-[#6B6560] outline-none">
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          {/* Prev */}
          <button onClick={goLocalPrev} disabled={isFirstPage}
            className="h-7 w-7 rounded-lg border border-[#EEEBE6] text-[#6B6560] flex items-center justify-center disabled:opacity-40 hover:bg-[#F5F3F0] transition-colors">
            <ChevronLeft size={13} />
          </button>

          {/* Server page numbers */}
          {serverPageButtons.map(pg => (
            <button key={pg} onClick={() => { onPageChange?.(pg); setLocalPage(0) }}
              className="w-7 h-7 rounded-lg text-[10px] font-bold border transition-all"
              style={page === pg
                ? { background: '#E85A2B', borderColor: '#E85A2B', color: '#fff' }
                : { borderColor: '#EEEBE6', color: '#6B6560' }}>
              {pg + 1}
            </button>
          ))}

          {/* Next */}
          <button onClick={goLocalNext} disabled={isLastPage}
            className="h-7 w-7 rounded-lg border border-[#EEEBE6] text-[#6B6560] flex items-center justify-center disabled:opacity-40 hover:bg-[#F5F3F0] transition-colors">
            <ChevronRight size={13} />
          </button>

        </div>
      </div>

      {/* ── Server page indicator ────────────────────────────────── */}
      {totalPages > 1 && (
        <p className="mt-1 text-[9px] text-[#C4BEB6] text-right">
          Server batch {page + 1} of {totalPages}
          {' '}({pageSize} rows/batch) — navigate pages above to load next batch
        </p>
      )}

    </div>
  )
}