// import React from 'react'
// import { relTime } from '../mockData.js'

// export default function ActivityTimeline({ events }) {
//   return (
//     <div className="space-y-0">
//       {events.map((e, i) => (
//         <div key={i} className="flex gap-3 relative pb-4 last:pb-0">
//           {/* Connector line */}
//           {i < events.length - 1 && (
//             <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#EFEDEA]" />
//           )}

//           {/* Icon */}
//           <div
//             className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 z-10 relative border"
//             style={{ background: e.bg, borderColor: e.color + '30' }}
//           >
//             {e.icon}
//           </div>

//           {/* Content */}
//           <div className="flex-1 pt-1 min-w-0">
//             <p className="text-[13px] text-[#3E3A35] leading-snug font-medium">{e.text}</p>
//             <p className="text-[11px] text-[#C4BEB6] mt-0.5 font-medium">{relTime(e.time)}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }


import React, { useEffect, useRef, useState } from 'react'
import { relTime } from '../mockData.js'

// Map event text to a type for styling
function getEventType(text = '') {
  const t = text.toLowerCase()
  if (t.includes('callback') || t.includes('call'))   return 'callback'
  if (t.includes('store') || t.includes('visit'))     return 'store'
  if (t.includes('campaign') || t.includes('trigger')) return 'campaign'
  if (t.includes('complete') || t.includes('flow'))   return 'complete'
  if (t.includes('style') || t.includes('collection')) return 'style'
  if (t.includes('price') || t.includes('budget'))    return 'price'
  if (t.includes('message') || t.includes('sent'))    return 'message'
  return 'default'
}

const TYPE_STYLES = {
  callback: { dot: '#E85A2B', bg: 'rgba(232,90,43,0.10)', ring: 'rgba(232,90,43,0.25)', label: 'CALLBACK'  },
  store:    { dot: '#1D9E75', bg: 'rgba(29,158,117,0.10)', ring: 'rgba(29,158,117,0.25)', label: 'STORE'    },
  campaign: { dot: '#E09A1A', bg: 'rgba(224,154,26,0.10)', ring: 'rgba(224,154,26,0.25)', label: 'CAMPAIGN' },
  complete: { dot: '#1D9E75', bg: 'rgba(29,158,117,0.10)', ring: 'rgba(29,158,117,0.25)', label: 'DONE'     },
  style:    { dot: '#7F77DD', bg: 'rgba(127,119,221,0.10)', ring: 'rgba(127,119,221,0.25)', label: 'STYLE'  },
  price:    { dot: '#D4537E', bg: 'rgba(212,83,126,0.10)', ring: 'rgba(212,83,126,0.25)', label: 'PRICE'    },
  message:  { dot: '#378ADD', bg: 'rgba(55,138,221,0.10)', ring: 'rgba(55,138,221,0.25)', label: 'MSG'      },
  default:  { dot: '#B0A9A1', bg: 'rgba(176,169,161,0.10)', ring: 'rgba(176,169,161,0.25)', label: 'EVENT' },
}

function EventRow({ e, i, isNew }) {
  const type  = getEventType(e.text)
  const style = TYPE_STYLES[type]

  return (
    <div
      className="relative flex gap-3 group timeline-in"
      style={{ animationDelay: `${i * 55}ms` }}
    >
      {/* Left timeline track */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Outer ping ring (only for most recent) */}
        <div className="relative">
          {isNew && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-60"
              style={{ background: style.dot, animationDuration: '2s' }}
            />
          )}
          {/* Dot */}
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-125"
            style={{
              background: style.dot,
              boxShadow: `0 0 0 3px ${style.ring}`,
            }}
          />
        </div>
        {/* Connector line */}
        <div
          className="w-px flex-1 mt-1 min-h-[20px]"
          style={{ background: `linear-gradient(to bottom, ${style.ring}, transparent)` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        <div
          className="rounded-xl px-3 py-2.5 border transition-all duration-200 group-hover:shadow-sm"
          style={{
            background:   style.bg,
            borderColor:  style.ring,
          }}
        >
          {/* Type chip + time */}
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-md"
              style={{ color: style.dot, background: `${style.dot}15` }}
            >
              {style.label}
            </span>
            <span className="text-[10px] font-medium" style={{ color: style.dot }}>
              {relTime(e.time)}
            </span>
          </div>

          {/* Icon + text */}
          <div className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0 mt-0.5">{e.icon}</span>
            <p className="text-[12px] leading-snug font-medium text-[#3E3A35]">{e.text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActivityTimelineOne({ events = [] }) {
  const [liveCount, setLiveCount]     = useState(0)
  const [blinking, setBlinking]       = useState(false)
  const prevLen = useRef(events.length)

  // Flash on new event
  useEffect(() => {
    if (events.length > prevLen.current) {
      setBlinking(true)
      setLiveCount(c => c + (events.length - prevLen.current))
      setTimeout(() => setBlinking(false), 1200)
    }
    prevLen.current = events.length
  }, [events.length])

  return (
    <div className="flex flex-col h-full">
      {/* Live header strip */}
      <div
        className="flex items-center justify-between mb-4 px-0.5 transition-all duration-500"
        style={{ opacity: blinking ? 1 : 0.85 }}
      >
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-5 h-5">
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: '#22C55E',
                animation: 'ping-dot 1.8s cubic-bezier(0,0,0.2,1) infinite',
                opacity: 0.5,
              }}
            />
            <span className="w-2 h-2 rounded-full bg-green-500 relative z-10" />
          </div>
          <span className="text-[11px] font-bold text-green-600 tracking-wide uppercase">
            Live feed
          </span>
        </div>
        {liveCount > 0 && (
          <span className="text-[10px] font-bold text-[#E85A2B] bg-[#FEF0EB] px-2 py-0.5 rounded-full border border-[#FFCBB8] fade-in">
            +{liveCount} new
          </span>
        )}
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-0">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-3xl mb-3 opacity-30">📡</div>
            <p className="text-[13px] text-[#B0A9A1] font-medium">Waiting for events…</p>
          </div>
        ) : (
          events.map((e, i) => (
            <EventRow
              key={i}
              e={e}
              i={i}
              isNew={i === 0 && blinking}
            />
          ))
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="h-6 -mb-5 pointer-events-none bg-gradient-to-t from-white to-transparent relative z-10" />
    </div>
  )
}