import React from 'react'
import { STEP_LABELS, STEP_COLORS, STEP_BG } from '../mockData.js'

export default function StepBadge({ step }) {
  const color = STEP_COLORS[step] || '#A49D94'
  const bg    = STEP_BG[step]    || '#F8F7F6'
  const label = STEP_LABELS[step] || step

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: bg, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {label}
    </span>
  )
}