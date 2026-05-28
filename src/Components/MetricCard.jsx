// // import React from 'react'
// // import { TrendingUp, TrendingDown } from 'lucide-react'

// // export default function MetricCard({ icon, label, value, delta, up, accent, delay = 0 }) {
// //   const accentColors = {
// //     orange: { bg:'#FEF0EB', text:'#E85A2B', border:'#FFCBB8' },
// //     blue:   { bg:'#EBF4FD', text:'#378ADD', border:'#B5D4F4' },
// //     green:  { bg:'#E1F5EE', text:'#1D9E75', border:'#9FE1CB' },
// //     purple: { bg:'#EEEDFE', text:'#7F77DD', border:'#CECBF6' },
// //     amber:  { bg:'#FEF3CD', text:'#BA7517', border:'#FAC775' },
// //     pink:   { bg:'#FCEEF4', text:'#D4537E', border:'#F4C0D1' },
// //   }
// //   const c = accentColors[accent] || accentColors.orange

// //   return (
// //     <div
// //       className="bg-white rounded-2xl p-5 border border-[#EFEDEA] shadow-card hover:shadow-card-hover card-in"
// //       style={{ animationDelay: `${delay}ms` }}
// //     >
// //       {/* Icon */}
// //       <div className="flex items-start justify-between mb-4">
// //         <div
// //           className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border"
// //           style={{ background: c.bg, borderColor: c.border }}
// //         >
// //           {icon}
// //         </div>
// //         {delta && (
// //           <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
// //             {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
// //             {delta}
// //           </div>
// //         )}
// //       </div>

// //       {/* Value */}
// //       <div className="font-sora font-bold text-3xl text-[#151210] leading-none mb-1 count-in">
// //         {value ?? '—'}
// //       </div>

// //       {/* Label */}
// //       <div className="text-sm text-[#A49D94] font-medium">{label}</div>
// //     </div>
// //   )
// // }



// import React from 'react'
// import { TrendingUp, TrendingDown } from 'lucide-react'

// export default function MetricCard({ icon, label, value, delta, up, accent, delay = 0 }) {

//   const accentMap = {
//     orange: {
//       bg:        'from-[#FF6B35] to-[#E85A2B]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(232,90,43,0.35)]',
//     },
//     blue: {
//       bg:        'from-[#378ADD] to-[#1A6DC7]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(55,138,221,0.35)]',
//     },
//     green: {
//       bg:        'from-[#1D9E75] to-[#0F7A5A]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(29,158,117,0.35)]',
//     },
//     purple: {
//       bg:        'from-[#7F77DD] to-[#5E55C8]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(127,119,221,0.35)]',
//     },
//     amber: {
//       bg:        'from-[#F59E0B] to-[#D97706]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(245,158,11,0.35)]',
//     },
//     pink: {
//       bg:        'from-[#D4537E] to-[#B03468]',
//       iconBg:    'bg-white/20',
//       iconText:  'text-white',
//       text:      'text-white',
//       subText:   'text-white/70',
//       deltaBg:   up ? 'bg-white/20 text-white' : 'bg-red-900/30 text-red-100',
//       glow:      'shadow-[0_8px_32px_rgba(212,83,126,0.35)]',
//     },
//   }

//   const c = accentMap[accent] || accentMap.orange

//   return (
//     <div
//       className={`
//         relative overflow-hidden rounded-2xl p-5
//         bg-gradient-to-br ${c.bg} ${c.glow}
//         card-in cursor-default
//         hover:scale-[1.03] hover:brightness-105
//         transition-all duration-300 ease-out
//       `}
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       {/* Decorative circle — top right */}
//       <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
//       <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

//       {/* Top row — icon + delta */}
//       <div className="flex items-start justify-between mb-4 relative z-10">
//         <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.iconBg}`}>
//           {icon}
//         </div>

//         {delta && (
//           <div className={`
//             flex items-center gap-1 text-[11px] font-semibold
//             px-2 py-1 rounded-lg backdrop-blur-sm
//             ${c.deltaBg}
//           `}>
//             {up
//               ? <TrendingUp  size={11} />
//               : <TrendingDown size={11} />
//             }
//             {delta}
//           </div>
//         )}
//       </div>

//       {/* Value */}
//       <div className={`font-sora font-bold text-3xl leading-none mb-1.5 relative z-10 ${c.text}`}>
//         {value ?? '—'}
//       </div>

//       {/* Label */}
//       <div className={`text-[13px] font-medium relative z-10 ${c.subText}`}>
//         {label}
//       </div>
//     </div>
//   )
// }
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

export default function MetricCard({
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


