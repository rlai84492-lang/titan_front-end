import React from 'react'
import { STEP_ORDER, STEP_LABELS, STEP_COLORS, getFunnelCounts } from '../mockData.js'

export default function FlowFunnel({ sessions }) {
  const counts = getFunnelCounts(sessions)
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="space-y-2.5">
      {STEP_ORDER.map((step, i) => {
        const n = counts[step]
        const pct = Math.round((n / max) * 100)
        const dropoff = i > 0 ? counts[STEP_ORDER[i-1]] - n : 0
        const color = STEP_COLORS[step]

        return (
          <div key={step} className="flex items-center gap-3">
            {/* Step label */}
            <div className="text-xs text-[#A49D94] text-right flex-shrink-0" style={{ width: 96 }}>
              {STEP_LABELS[step]}
            </div>

            {/* Bar */}
            <div className="flex-1 h-6 bg-[#F8F7F6] rounded-lg overflow-hidden relative">
              <div
                className="funnel-fill h-full rounded-lg flex items-center"
                style={{ width: `${pct}%`, background: color, opacity: 0.85 }}
              >
                {n > 0 && (
                  <span className="text-white text-[10px] font-bold pl-2.5 drop-shadow-sm">{n}</span>
                )}
              </div>
            </div>

            {/* Count + dropoff */}
            <div className="flex-shrink-0 text-right" style={{ width: 52 }}>
              <div className="text-xs font-semibold text-[#28241F]">{n}</div>
              {dropoff > 0 && (
                <div className="text-[10px] text-red-400">-{dropoff}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}