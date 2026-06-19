import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { useUI } from '../context/UIContext'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import ConversationsTableOne from '../Components/ConversationsTableOne'

// ── Flow Config — same as OverviewPage loader ──────────────────
const FLOW_CONFIG = {
  bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6', pulse: '#DBEAFE' },
  bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444', pulse: '#FEE2E2' },
  anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7', pulse: '#F3E8FF' },
  anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899', pulse: '#FCE7F3' },
}

// ── Premium Loader (reused pattern) ─────────────────────────────
function PremiumLoader({ activeFlow }) {
  const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 rounded-full border border-dashed"
          style={{ borderColor: cfg.hex + '20', animation: 'spin 4s linear infinite' }} />
        <div className="absolute w-24 h-24 rounded-full border-[2.5px] border-transparent"
          style={{ borderTopColor: cfg.hex, borderRightColor: cfg.hex + '30', animation: 'spin 1.1s linear infinite' }} />
        <div className="absolute w-16 h-16 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: cfg.hex, borderLeftColor: cfg.hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
        <div className="absolute w-12 h-12 rounded-full"
          style={{ background: cfg.pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
        <div className="relative z-10 text-2xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
          {cfg.emoji}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.hex }}>TITAN WORLD</span>
        <span className="w-1 h-1 rounded-full" style={{ background: cfg.hex + '80' }} />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Conversations</span>
      </div>
      <div className="text-sm font-bold mb-1" style={{ color: cfg.hex }}>{cfg.label}</div>
      <div className="text-[10px] text-gray-400 mb-6">Loading conversations…</div>

      <div className="flex items-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: cfg.hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>

      <div className="w-full max-w-3xl px-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
          ))}
        </div>
        <div className="h-48 rounded-xl"
          style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: 'shimmer 1.8s ease-in-out 0.3s infinite' }} />
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulsate { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.35} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>
    </div>
  )
}

export default function ConversationsPage() {
  const { sessions, loading } = useDashboard()
  const { activeFlow } = useUI()

  // ── Loader — jab tak naya flow ka data nahi aata ────────────────
  if (loading) {
    return <PremiumLoader activeFlow={activeFlow} />
  }

  const active    = sessions.filter(s => s.isActive).length
  const completed = sessions.filter(s => s.currentStep?.includes('COMPLETED')).length
  const inProg    = sessions.filter(s => s.isActive && !s.currentStep?.includes('COMPLETED')).length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '💬', label: 'Total Sessions', value: sessions.length, accent: 'blue'   },
          { icon: '🟢', label: 'Active Now',     value: active,          accent: 'green'  },
          { icon: '✅', label: 'Completed',      value: completed,       accent: 'orange' },
          { icon: '⏳', label: 'In Progress',    value: inProg,          accent: 'purple' },
        ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 50} />)}
      </div>

      <CardOne
        title="All Conversations"
        subtitle="Filtered to current flow — collection, brand, step"
        icon="💬"
      >
        <ConversationsTableOne sessions={sessions} />
      </CardOne>
    </div>
  )
}