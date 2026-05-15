import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MetricCard({ icon, label, value, delta, up, accent, delay = 0 }) {
  const accentColors = {
    orange: { bg:'#FEF0EB', text:'#E85A2B', border:'#FFCBB8' },
    blue:   { bg:'#EBF4FD', text:'#378ADD', border:'#B5D4F4' },
    green:  { bg:'#E1F5EE', text:'#1D9E75', border:'#9FE1CB' },
    purple: { bg:'#EEEDFE', text:'#7F77DD', border:'#CECBF6' },
    amber:  { bg:'#FEF3CD', text:'#BA7517', border:'#FAC775' },
    pink:   { bg:'#FCEEF4', text:'#D4537E', border:'#F4C0D1' },
  }
  const c = accentColors[accent] || accentColors.orange

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-[#EFEDEA] shadow-card hover:shadow-card-hover card-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border"
          style={{ background: c.bg, borderColor: c.border }}
        >
          {icon}
        </div>
        {delta && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="font-sora font-bold text-3xl text-[#151210] leading-none mb-1 count-in">
        {value ?? '—'}
      </div>

      {/* Label */}
      <div className="text-sm text-[#A49D94] font-medium">{label}</div>
    </div>
  )
}