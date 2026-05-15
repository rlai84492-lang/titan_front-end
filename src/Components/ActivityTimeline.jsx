import React from 'react'
import { relTime } from '../mockData.js'

export default function ActivityTimeline({ events }) {
  return (
    <div className="space-y-0">
      {events.map((e, i) => (
        <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
          {/* Connector line */}
          {i < events.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#EFEDEA]" />
          )}

          {/* Icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 z-10 relative border"
            style={{ background: e.bg, borderColor: e.color + '30' }}
          >
            {e.icon}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1 min-w-0">
            <p className="text-[13px] text-[#3E3A35] leading-snug font-medium">{e.text}</p>
            <p className="text-[11px] text-[#C4BEB6] mt-0.5 font-medium">{relTime(e.time)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}