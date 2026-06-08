
import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const THEMES = {
  orange: {
    grad:   'from-[#E85A2B] via-[#F07040] to-[#FF9060]',
    glow:   'shadow-[0_8px_24px_rgba(232,90,43,0.32),0_2px_8px_rgba(232,90,43,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#FF8C60]/30',
  },
  blue: {
    grad:   'from-[#1A6DC7] via-[#378ADD] to-[#5CA0E8]',
    glow:   'shadow-[0_8px_24px_rgba(55,138,221,0.32),0_2px_8px_rgba(55,138,221,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#5CA0E8]/30',
  },
  green: {
    grad:   'from-[#0D8A65] via-[#1D9E75] to-[#3AB88A]',
    glow:   'shadow-[0_8px_24px_rgba(29,158,117,0.32),0_2px_8px_rgba(29,158,117,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#3AB88A]/30',
  },
  purple: {
    grad:   'from-[#5E55C8] via-[#7F77DD] to-[#9B95E8]',
    glow:   'shadow-[0_8px_24px_rgba(127,119,221,0.32),0_2px_8px_rgba(127,119,221,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#9B95E8]/30',
  },
  amber: {
    grad:   'from-[#C47B0A] via-[#E09A1A] to-[#F5B830]',
    glow:   'shadow-[0_8px_24px_rgba(224,154,26,0.32),0_2px_8px_rgba(224,154,26,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#F5B830]/30',
  },
  pink: {
    grad:   'from-[#A8285A] via-[#D4537E] to-[#E8789E]',
    glow:   'shadow-[0_8px_24px_rgba(212,83,126,0.32),0_2px_8px_rgba(212,83,126,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#E8789E]/30',
  },
  indigo: {
    grad:   'from-[#3730A3] via-[#4F46E5] to-[#6D64F0]',
    glow:   'shadow-[0_8px_24px_rgba(79,70,229,0.32),0_2px_8px_rgba(79,70,229,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#6D64F0]/30',
  },
  rose: {
    grad:   'from-[#BE123C] via-[#E11D48] to-[#FB4570]',
    glow:   'shadow-[0_8px_24px_rgba(225,29,72,0.32),0_2px_8px_rgba(225,29,72,0.20)]',
    orb1:   'bg-white/10',
    orb2:   'bg-white/5',
    ring:   'ring-[#FB4570]/30',
  },
}

export default function MetricCardOne({
  icon,
  label,
  value,
  delta,
  up,
  accent  = 'orange',
  delay   = 0,
  suffix  = '',
  sparkline,
}) {
  const t = THEMES[accent] || THEMES.orange

  return (
    <div
      className={`
        relative overflow-hidden rounded-[18px] p-5 card-in cursor-default
        bg-gradient-to-br ${t.grad} ${t.glow}
        ring-1 ${t.ring}
        hover:scale-[1.025] hover:brightness-105
        transition-all duration-300 ease-out
        select-none
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative orbs */}
      <div className={`absolute -top-5 -right-5 w-28 h-28 rounded-full ${t.orb1} pointer-events-none`} />
      <div className={`absolute -bottom-8 -left-4 w-20 h-20 rounded-full ${t.orb2} pointer-events-none`} />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between mb-3">
        {/* Icon bubble */}
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border border-white/20 shadow-inner">
          {icon}
        </div>

        {/* Delta badge */}
        {delta !== undefined && delta !== null && (
          <div className={`
            flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg
            backdrop-blur-sm border border-white/20
            ${up === false
              ? 'bg-red-500/25 text-white'
              : up === true
              ? 'bg-white/20 text-white'
              : 'bg-white/15 text-white/80'}
          `}>
            {up === true  && <TrendingUp  size={10} />}
            {up === false && <TrendingDown size={10} />}
            {up === null  && <Minus        size={10} />}
            {delta}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10 font-sora font-extrabold text-[28px] leading-none text-white mb-1.5 count-up tracking-tight">
        {value ?? '—'}{suffix}
      </div>

      {/* Label */}
      <div className="relative z-10 text-[12px] font-medium text-white/70 leading-tight">
        {label}
      </div>

      {/* Sparkline if provided */}
      {sparkline && (
        <div className="relative z-10 mt-3 opacity-60">
          {sparkline}
        </div>
      )}
    </div>
  )
}


