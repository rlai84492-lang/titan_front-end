/**
 * LocalFilters.jsx — Reusable LOCAL flow selector + date range picker.
 *
 * Each page (Overview, Conversations, Leads) includes this component
 * with its OWN local state — completely independent of each other and
 * of the global DashboardContext (which is no longer used for filters).
 *
 * Props:
 *   flow, setFlow           — active flow key
 *   dateRange, setDateRange — today | 7days | 30days | custom
 *   customStart, setCustomStart, customEnd, setCustomEnd — custom range dates
 *   onApply                 — called when user changes preset OR clicks Apply (custom)
 *   loading                 — show spinner on refresh button
 */
import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const FLOWS = [
  { key: 'bday_t10',  label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6' },
  { key: 'bday_t0',   label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444' },
  { key: 'anniv_t10', label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7' },
  { key: 'anniv_t0',  label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899' },
]

const DATE_PRESETS = [
  { label: 'Today',   value: 'today'  },
  { label: '7 Days',  value: '7days'  },
  { label: '30 Days', value: '30days' },
  { label: 'Custom',  value: 'custom' },
]

export default function LocalFilters({
  flow, setFlow,
  dateRange, setDateRange,
  customStart, setCustomStart,
  customEnd, setCustomEnd,
  onApply,
  loading = false,
}) {
  const [showCustom, setShowCustom] = useState(dateRange === 'custom')
  const activeFlowCfg = FLOWS.find(f => f.key === flow) || FLOWS[0]

  useEffect(() => {
    setShowCustom(dateRange === 'custom')
  }, [dateRange])

  const handlePreset = (val) => {
    setDateRange(val)
    setShowCustom(val === 'custom')
    if (val !== 'custom') {
      onApply({ flow, dateRange: val, customStart: '', customEnd: '' })
    }
  }

  const handleFlowChange = (key) => {
    setFlow(key)
    if (dateRange !== 'custom') {
      onApply({ flow: key, dateRange, customStart, customEnd })
    }
  }

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return
    onApply({ flow, dateRange: 'custom', customStart, customEnd })
  }

  return (
    <div
      className="flex items-center justify-between gap-3 flex-wrap px-4 py-2 bg-white border-b border-[#EEEBE6]"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      {/* ── Flow Tabs ── */}
      <div className="flex gap-1 bg-[#F5F3F0] rounded-xl p-1">
        {FLOWS.map(f => {
          const isActive = flow === f.key
          return (
            <button
              key={f.key}
              onClick={() => handleFlowChange(f.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap"
              style={isActive
                ? { background: '#fff', color: f.hex, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                : { color: '#6B6560' }
              }
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Date Presets + Refresh ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-[#F5F3F0] rounded-xl p-1">
          {DATE_PRESETS.map(p => (
            <button
              key={p.value}
              onClick={() => handlePreset(p.value)}
              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={dateRange === p.value
                ? { background: '#fff', color: '#1A1713', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                : { color: '#6B6560' }
              }
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
              onClick={handleApplyCustom}
              disabled={!customStart || !customEnd}
              className="px-3 py-1 rounded-lg text-[11px] font-bold text-white disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg,#E85A2B,#FF7040)' }}
            >
              Apply
            </button>
          </div>
        )}

        <button
          onClick={() => onApply({ flow, dateRange, customStart, customEnd })}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border border-[#EEEBE6] text-[#6B6560] hover:bg-[#FAF8F6] transition-all disabled:opacity-60"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    </div>
  )
}