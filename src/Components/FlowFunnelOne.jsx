import React from 'react'
import { FLOW_STEPS, STEP_META } from '../mockData'
export default function FlowFunnelOne({ sessions, stepCounts = {}, activeFlow, reachedCount}) {
  const steps = FLOW_STEPS[activeFlow] || []
  const hasBackendCounts = Object.keys(stepCounts).length > 0

  console.log(reachedCount  + "redsw")

  // ── Exact count per step ──
  const usersAtStep = {}
  if (hasBackendCounts) {
    steps.forEach(step => { usersAtStep[step] = stepCounts[step] || 0 })
  } else {
    steps.forEach(step => {
      usersAtStep[step] = sessions.filter(s => s.currentStep === step).length
    })
  }

  // ★ Exit users — funnel list mein nahi, lekin campaign toh mila tha
  //   Inhe pehli step mein count karo
  const EXIT_STEPS = {
    bday_t10:  'BIRTHDAY_T10_GRACEFUL_EXIT',
    anniv_t10: 'ANNIVERSARY_T10_GRACEFUL_EXIT',
  }
  const exitStep = EXIT_STEPS[activeFlow]
  if (exitStep && stepCounts[exitStep] && steps.length > 0) {
    usersAtStep[steps[0]] = (usersAtStep[steps[0]] || 0) + stepCounts[exitStep]
  }

  // ── Cumulative: is step tak kitne pahunche ──
  const usersReached = {}
  let runningTotal = 0
  for (let i = steps.length - 1; i >= 0; i--) {
    runningTotal += usersAtStep[steps[i]] || 0
    usersReached[steps[i]] = runningTotal
  }

  const totalUsers = usersReached[steps[0]] || 0

  // % aur bar ka base: delivered (reachedCount) agar mila to, warna purana totalUsers
  const baseTotal = reachedCount > 0 ? reachedCount : totalUsers
  const barMax = Math.max(baseTotal, totalUsers, 1)

  return (
    <div>
      <div className="space-y-2.5">

        {/* ★ Top bar — Campaign Reached (delivered messages, backend se) */}
        {reachedCount > 0 && (
          <div className="flex items-center gap-3" title="Messages delivered to users in selected period">
            <div className="text-[10px] font-medium text-[#6B6560] text-right flex-shrink-0" style={{ width: 130 }}>
              Campaign Reached
            </div>
            <div className="flex-1 h-6 bg-[#F8F7F6] rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg flex items-center transition-all duration-500"
                style={{ width: `${Math.max(Math.round((reachedCount / barMax) * 100), 4)}%`, background: '#D4A017', opacity: 0.85 }}
              >
                <span className="text-white text-[9px] font-bold pl-2 drop-shadow-sm whitespace-nowrap">
                  {reachedCount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right leading-tight" style={{ width: 76 }}>
              <span className="text-[11px] font-bold text-[#28241F]">{reachedCount.toLocaleString()}</span>
              <span className="text-[9px] text-[#A49D94] ml-1">(100.00%)</span>
            </div>
          </div>
        )}

        {steps.map(step => {
          const meta    = STEP_META[step] || { label: step, meaning: '', color: '#A49D94' }
          const reached = usersReached[step] || 0
          // const pctOfTotal = baseTotal > 0 ? Math.round((reached / baseTotal) * 100) : 0
          const pctOfTotal = baseTotal > 0 ? ((reached / baseTotal) * 100).toFixed(2) : '0.00'
          const barPct  = Math.max(Math.round((reached / barMax) * 100), reached > 0 ? 4 : 0)

          return (
            <div key={step} className="flex items-center gap-3" title={meta.meaning}>
              {/* Step name */}
              <div className="text-[10px] font-medium text-[#6B6560] text-right flex-shrink-0" style={{ width: 130 }}>
                {meta.label}
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-[#F8F7F6] rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg flex items-center transition-all duration-500"
                  style={{ width: `${barPct}%`, background: meta.color, opacity: 0.85 }}
                >
                  {reached > 0 && barPct > 12 && (
                    <span className="text-white text-[9px] font-bold pl-2 drop-shadow-sm whitespace-nowrap">
                      {reached.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Reached + % */}
              <div className="flex-shrink-0 text-right leading-tight" style={{ width: 76 }}>
                <span className="text-[11px] font-bold text-[#28241F]">{reached.toLocaleString()}</span>
                <span className="text-[9px] text-[#A49D94] ml-1">({pctOfTotal}%)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Simple one-line legend */}
      <div className="mt-4 pt-3 border-t border-[#F0EDE9] flex items-center justify-between">
        <span className="text-[9px] text-[#8A837B]">
          Number = users who reached this step (or went further)
        </span>
        {hasBackendCounts && (
          <span className="text-[9px] text-[#C4BEB6]">Real DB counts</span>
        )}
      </div>
    </div>
  )
}


















// import React from 'react'
// import { FLOW_STEPS, STEP_META } from '../mockData'

// export default function FlowFunnelOne({ sessions, stepCounts = {}, activeFlow, reachedCount }) {
//   const steps = FLOW_STEPS[activeFlow] || []
//   const hasBackendCounts = Object.keys(stepCounts).length > 0

//   // ── Current step count per step ──
//   const usersAtStep = {}
//   if (hasBackendCounts) {
//     steps.forEach(step => { usersAtStep[step] = stepCounts[step] || 0 })
//   } else {
//     steps.forEach(step => {
//       usersAtStep[step] = sessions.filter(s => s.currentStep === step).length
//     })
//   }

//   // Exit users → first step mein add karo
//   const EXIT_STEPS = {
//     bday_t10:  'BIRTHDAY_T10_GRACEFUL_EXIT',
//     anniv_t10: 'ANNIVERSARY_T10_GRACEFUL_EXIT',
//   }
//   const exitStep = EXIT_STEPS[activeFlow]
//   if (exitStep && stepCounts[exitStep] && steps.length > 0) {
//     usersAtStep[steps[0]] = (usersAtStep[steps[0]] || 0) + stepCounts[exitStep]
//   }

//   const baseTotal = reachedCount > 0 ? reachedCount : 1
//   const barMax    = Math.max(baseTotal, 1)

//   // ── Completion zone sum (Store Visit + Callback) ──
//   const COMPLETION_KEYWORDS = ['STORE_VISIT', 'CALLBACK']
//   const completionTotal = steps
//     .filter(s => COMPLETION_KEYWORDS.some(k => s.includes(k)))
//     .reduce((sum, s) => sum + (usersAtStep[s] || 0), 0)
//   const completionPct = baseTotal > 0 ? ((completionTotal / baseTotal) * 100).toFixed(1) : '0.0'

//   return (
//     <div>
//       <div className="space-y-2.5">

//         {/* Campaign Reached
//         {reachedCount > 0 && (
//           <div className="flex items-center gap-3">
//             <div className="text-[10px] font-medium text-[#6B6560] text-right flex-shrink-0" style={{ width: 130 }}>
//               Campaign Reached
//             </div>
//             <div className="flex-1 h-6 bg-[#F8F7F6] rounded-lg overflow-hidden">
//               <div className="h-full rounded-lg flex items-center" style={{ width: '100%', background: '#D4A017', opacity: 0.85 }}>
//                 <span className="text-white text-[9px] font-bold pl-2 whitespace-nowrap">
//                   {reachedCount.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <div className="flex-shrink-0 text-right" style={{ width: 76 }}>
//               <span className="text-[11px] font-bold text-[#28241F]">{reachedCount.toLocaleString()}</span>
//               <span className="text-[9px] text-[#A49D94] ml-1">(100%)</span>
//             </div>
//           </div>
//         )} */}

//         {steps.map(step => {
//           const meta    = STEP_META[step] || { label: step, color: '#A49D94' }
//           const count   = usersAtStep[step] || 0
//           const pct     = baseTotal > 0 ? Math.round((count / baseTotal) * 100) : 0
//           const barPct  = Math.max(Math.round((count / barMax) * 100), count > 0 ? 4 : 0)
//           const isCompletion = COMPLETION_KEYWORDS.some(k => step.includes(k))

//           return (
//             <div key={step} className={`flex items-center gap-3 ${isCompletion ? 'opacity-100' : ''}`}>
//               <div
//                 className="text-[10px] font-medium text-right flex-shrink-0"
//                 style={{ width: 130, color: isCompletion ? meta.color : '#6B6560', fontWeight: isCompletion ? 700 : 500 }}
//               >
//                 {meta.label}
//               </div>
//               <div className="flex-1 h-6 bg-[#F8F7F6] rounded-lg overflow-hidden">
//                 <div
//                   className="h-full rounded-lg flex items-center transition-all duration-500"
//                   style={{ width: `${barPct}%`, background: meta.color, opacity: 0.85 }}
//                 >
//                   {count > 0 && barPct > 12 && (
//                     <span className="text-white text-[9px] font-bold pl-2 whitespace-nowrap">
//                       {count.toLocaleString()}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex-shrink-0 text-right" style={{ width: 76 }}>
//                 <span className="text-[11px] font-bold text-[#28241F]">{count.toLocaleString()}</span>
//                 <span className="text-[9px] text-[#A49D94] ml-1">({pct}%)</span>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ✅ Manual Verify Box — Manager ke liye */}
//       <div className="mt-3 px-3 py-2 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg">
//         <div className="text-[9px] text-[#166534] font-semibold mb-0.5">
//           ✅ Completion = Store Visit + Callback
//         </div>
//         <div className="text-[10px] text-[#15803D] font-bold">
//           {completionTotal.toLocaleString()} ÷ {reachedCount.toLocaleString()} = {completionPct}%
//         </div>
//         <div className="text-[8px] text-[#4ADE80] mt-0.5">
//           Manually verify: add Store Visit + Callback Lead from above ↑
//         </div>
//       </div>

//       <div className="mt-3 pt-3 border-t border-[#F0EDE9] flex items-center justify-between">
//         <span className="text-[9px] text-[#8A837B]">
//           Number = users currently at this step only ✦ all steps add up to Campaign Reached
//         </span>
//         {hasBackendCounts && <span className="text-[9px] text-[#C4BEB6]">Real DB counts</span>}
//       </div>
//     </div>
//   )
// }