import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveFlow } from '../store/uiSlice'
import { loadDashboard } from '../store/dashboardSlice'  // ← loadDashboard import
import { FLOW_KEYS, FLOW_LABELS, FLOW_ICONS, FLOW_COLORS } from '../mockData'

export default function FlowSelector() {
  const dispatch   = useDispatch()
  const activeFlow = useSelector(s => s.ui.activeFlow)

  function handleFlowChange(flow) {
    console.log("Clicked......",flow);
    dispatch(setActiveFlow(flow))
    dispatch(loadDashboard(flow))  // ← API re-call with flow ✅
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