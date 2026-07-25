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
              <span className="text-[9px] text-[#A49D94] ml-1">(100%)</span>
            </div>
          </div>
        )}

        {steps.map(step => {
          const meta    = STEP_META[step] || { label: step, meaning: '', color: '#A49D94' }
          const reached = usersReached[step] || 0
          const pctOfTotal = baseTotal > 0 ? Math.round((reached / baseTotal) * 100) : 0
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