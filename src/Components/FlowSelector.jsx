

// import React from 'react'
// import { useUI } from '../context/UIContext'
// import { useDashboard } from '../context/DashboardContext'
// import { FLOW_KEYS, FLOW_LABELS, FLOW_ICONS, FLOW_COLORS } from '../mockData'

// export default function FlowSelector() {
//   const { activeFlow, setActiveFlow } = useUI()
//   const { loadDashboard }             = useDashboard()

//   function handleFlowChange(flow) {
//     setActiveFlow(flow)
//     loadDashboard(flow)
//   }

//   return (
//     <div className="flex gap-1.5 flex-wrap">
//       {FLOW_KEYS.map(k => (
//         <button
//           key={k}
//           onClick={() => handleFlowChange(k)}
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all duration-200"
//           style={{
//             borderColor: activeFlow === k ? FLOW_COLORS[k] : '#EEEBE6',
//             background:  activeFlow === k ? FLOW_COLORS[k] + '18' : '#fff',
//             color:       activeFlow === k ? FLOW_COLORS[k] : '#6B6560',
//             boxShadow:   activeFlow === k ? `0 2px 8px ${FLOW_COLORS[k]}28` : 'none',
//           }}
//         >
//           <span className="text-sm">{FLOW_ICONS[k]}</span>
//           {FLOW_LABELS[k]}
//         </button>
//       ))}
//     </div>
//   )
// }



import React from 'react'
import { useUI } from '../context/UIContext'
import { useDashboard } from '../context/DashboardContext'
import { FLOW_KEYS, FLOW_LABELS, FLOW_ICONS, FLOW_COLORS } from '../mockData'

export default function FlowSelector() {
  const { activeFlow, setActiveFlow } = useUI()
  const { loadDashboard, dateRange, customStart, customEnd } = useDashboard()

  function handleFlowChange(flow) {
    console.log('%c[FlowSelector] Tab clicked →', 'color:#E85A2B;font-weight:bold', flow)
    setActiveFlow(flow)
    // Date range bhi saath le jao — jo bhi abhi selected hai
    loadDashboard(flow, { dateRange, customStart, customEnd })
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {FLOW_KEYS.map(k => (
        <button
          key={k}
          onClick={() => handleFlowChange(k)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all duration-200"
          style={{
            borderColor: activeFlow === k ? FLOW_COLORS[k] : '#EEEBE6',
            background:  activeFlow === k ? FLOW_COLORS[k] + '18' : '#fff',
            color:       activeFlow === k ? FLOW_COLORS[k] : '#6B6560',
            boxShadow:   activeFlow === k ? `0 2px 8px ${FLOW_COLORS[k]}28` : 'none',
          }}
        >
          <span className="text-sm">{FLOW_ICONS[k]}</span>
          {FLOW_LABELS[k]}
        </button>
      ))}
    </div>
  )
}