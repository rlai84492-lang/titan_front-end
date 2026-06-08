import React from 'react'
import { STEP_META } from '../mockData'

export default function StepBadge({ step }) {
  const m = STEP_META[step] || { label: step, color: '#A49D94', bg: '#F8F7F6' }
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: m.bg, color: m.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}