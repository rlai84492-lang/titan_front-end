


  // import React from 'react'
  // import { useUI } from '../context/UIContext'
  // import { FLOW_STEPS, STEP_META } from '../mockData'

  // export default function FlowFunnelOne({ sessions }) {
  //   const { activeFlow } = useUI()
  //   const steps = FLOW_STEPS[activeFlow] || []

  //   console.log(activeFlow , "hjbn");


  //   // console.log(sessions  , "dweds")
    
  //   // ════════════════════════════════════════════════════════════
  //   const stepIndex = {}
  //   steps.forEach((step, i) => { stepIndex[step] = i })

  //   const counts = {}
  //   steps.forEach((step, i) => {
  //     counts[step] = sessions.filter(s => {
  //       const sIdx = stepIndex[s.currentStep]
  //       // Agar session ka current step in FLOW_STEPS mein hai hi nahi
  //       // (jaise koi alag/unrelated step), to skip karo
  //       if (sIdx === undefined) return false
  //       // Cumulative: is step ya isse aage wale kisi step par ho
  //       return sIdx >= i
  //     }).length
  //   })

  //   const entryCount = counts[steps[0]] || 1
  //   const max = Math.max(entryCount, 1)

  //   return (
  //     <div className="space-y-2.5">
  //       {steps.map((step, i) => {
  //         const m    = STEP_META[step] || { label: step, color: '#A49D94' }
  //         const n    = counts[step] || 0
  //         const pct  = Math.max(Math.round((n / max) * 100), n > 0 ? 4 : 0)
  //         const drop = i > 0 ? (counts[steps[i - 1]] || 0) - n : 0

  //         return (
  //           <div key={step} className="flex items-center gap-3">
  //             <div className="text-[10px] text-[#A49D94] text-right flex-shrink-0" style={{ width: 110 }}>
  //               {m.label}
  //             </div>
  //             <div className="flex-1 h-5 bg-[#F8F7F6] rounded-lg overflow-hidden">
  //               <div className="funnel-fill h-full rounded-lg flex items-center"
  //                 style={{ width: `${pct}%`, background: m.color, opacity: 0.85 }}>
  //                 {n > 0 && <span className="text-white text-[9px] font-bold pl-2 drop-shadow-sm">{n}</span>}
  //               </div>
  //             </div>
  //             <div className="flex-shrink-0 text-right" style={{ width: 44 }}>
  //               <div className="text-[11px] font-semibold text-[#28241F]">{n}</div>
  //               {drop > 0 && i > 0 && <div className="text-[9px] text-red-400">-{drop}</div>}
  //             </div>
  //           </div>
  //         )
  //       })}
  //     </div>
  //   )
  // }
  import React from 'react'
import { FLOW_STEPS, STEP_META } from '../mockData'

export default function FlowFunnelOne({ sessions, stepCounts = {}, activeFlow }) {
  const steps = FLOW_STEPS[activeFlow] || []

  // ── USE stepCounts (from DB) if available, else fallback to sessions list ──
  const useBackendCounts = Object.keys(stepCounts).length > 0

  // ── Calculate counts ─────────────────────────────────────────
  let counts = {}

  if (useBackendCounts) {
    // ★ CORRECT: DB se real COUNT per step (cumulative nahi, exact)
    // Funnel ke liye "cumulative" logic: har step pe us step + 
    // aage ke saare steps ka sum
    const stepIndex = {}
    steps.forEach((s, i) => { stepIndex[s] = i })

    steps.forEach((step, i) => {
      // Is step se aage ke saare steps ka count sum karo
      counts[step] = steps
        .slice(i)
        .reduce((sum, s) => sum + (stepCounts[s] || 0), 0)
    })
  } else {
    // Fallback: session list se calculate (500 row cap wala — less accurate)
    const stepIndex = {}
    steps.forEach((step, i) => { stepIndex[step] = i })

    steps.forEach((step, i) => {
      counts[step] = sessions.filter(s => {
        const sIdx = stepIndex[s.currentStep]
        if (sIdx === undefined) return false
        return sIdx >= i
      }).length
    })
  }

  const entryCount = counts[steps[0]] || 1
  const max = Math.max(entryCount, 1)

  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => {
        const m    = STEP_META[step] || { label: step, color: '#A49D94' }
        const n    = counts[step] || 0
        const pct  = Math.max(Math.round((n / max) * 100), n > 0 ? 4 : 0)
        const drop = i > 0 ? (counts[steps[i - 1]] || 0) - n : 0

        return (
          <div key={step} className="flex items-center gap-3">
            <div className="text-[10px] text-[#A49D94] text-right flex-shrink-0" style={{ width: 110 }}>
              {m.label}
            </div>
            <div className="flex-1 h-5 bg-[#F8F7F6] rounded-lg overflow-hidden">
              <div className="h-full rounded-lg flex items-center transition-all duration-500"
                style={{ width: `${pct}%`, background: m.color, opacity: 0.85 }}>
                {n > 0 && (
                  <span className="text-white text-[9px] font-bold pl-2 drop-shadow-sm">{n}</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-right" style={{ width: 44 }}>
              <div className="text-[11px] font-semibold text-[#28241F]">{n}</div>
              {drop > 0 && i > 0 && (
                <div className="text-[9px] text-red-400">-{drop}</div>
              )}
            </div>
          </div>
        )
      })}

      {/* Source indicator */}
      {useBackendCounts && (
        <div className="text-[9px] text-[#C4BEB6] text-right pt-1">
          Real DB counts
        </div>
      )}
    </div>
  )
}