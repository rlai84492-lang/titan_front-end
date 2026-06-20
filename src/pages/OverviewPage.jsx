import React from 'react'
import { useDashboard } from '../context/DashboardContext'
import { useUI }        from '../context/UIContext'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import FlowFunnelOne from '../Components/FlowFunnelOne'
import ActivityTimelineOne from '../Components/ActivityTimelineOne'
import { CampaignChart, CollectionChart, MessagesChart } from '../Components/Charts'

// ── Flow Config ───────────────────────────────────────────────
const FLOW_CONFIG = {
  bday_t10:  { label: 'Birthday T-10',     emoji: '🎂', hex: '#3B82F6', pulse: '#DBEAFE' },
  bday_t0:   { label: 'Birthday T-Day',    emoji: '🎁', hex: '#EF4444', pulse: '#FEE2E2' },
  anniv_t10: { label: 'Anniversary T-10',  emoji: '💍', hex: '#A855F7', pulse: '#F3E8FF' },
  anniv_t0:  { label: 'Anniversary T-Day', emoji: '🌹', hex: '#EC4899', pulse: '#FCE7F3' },
}

// ── Premium Loader ────────────────────────────────────────────
function PremiumLoader({ activeFlow }) {
  const cfg = FLOW_CONFIG[activeFlow] || FLOW_CONFIG.bday_t10

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-36 h-36 rounded-full border border-dashed"
          style={{ borderColor: cfg.hex + '20', animation: 'spin 4s linear infinite' }} />
        <div className="absolute w-28 h-28 rounded-full border-[2.5px] border-transparent"
          style={{ borderTopColor: cfg.hex, borderRightColor: cfg.hex + '30', animation: 'spin 1.1s linear infinite' }} />
        <div className="absolute w-20 h-20 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: cfg.hex, borderLeftColor: cfg.hex + '40', animation: 'spin 0.75s linear infinite reverse' }} />
        <div className="absolute w-14 h-14 rounded-full"
          style={{ background: cfg.pulse, animation: 'pulsate 1.6s ease-in-out infinite' }} />
        <div className="relative z-10 text-3xl" style={{ animation: 'pulsate 1.6s ease-in-out infinite' }}>
          {cfg.emoji}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase" style={{ color: cfg.hex }}>TITAN WORLD</span>
        <span className="w-1 h-1 rounded-full" style={{ background: cfg.hex + '80' }} />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-gray-400">Dashboard</span>
      </div>
      <div className="text-sm font-bold mb-1" style={{ color: cfg.hex }}>{cfg.label}</div>
      <div className="text-[10px] text-gray-400 mb-6">Fetching campaign data, please wait…</div>

      <div className="flex items-center gap-1.5 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full"
            style={{ background: cfg.hex, animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>

      <div className="w-full max-w-3xl px-4 space-y-3">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.08}s infinite` }} />
          ))}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.1 + 0.4}s infinite` }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl"
              style={{ background: `linear-gradient(90deg, #F5F3F0 25%, ${cfg.pulse} 50%, #F5F3F0 75%)`, backgroundSize: '300% 100%', animation: `shimmer 1.8s ease-in-out ${i * 0.2 + 0.8}s infinite` }} />
          ))}
        </div>
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

// ── Main Overview ─────────────────────────────────────────────
export default function OverviewPage() {
  const { sessions, leads, metrics, hourly, campData, collData, timeline, loading } = useDashboard()
  const { activeFlow } = useUI()

  if (loading) return <PremiumLoader activeFlow={activeFlow} />

  const isBday = activeFlow?.includes('bday')

  const conv = {
    activeSessions:   sessions.filter(s => s.isActive).length,
confirmed: sessions.filter(s =>
  s.currentStep?.includes('OPENER_SENT') ||
  s.currentStep?.includes('GENDER_SELECTION_SENT') ||
  s.currentStep?.includes('BRAND_CAROUSEL') ||
  s.currentStep?.includes('CATALOGUE_SENT') ||
  s.currentStep?.includes('OFFER_SENT') ||
  s.currentStep?.includes('COMPLETED')
).length,
    enteredDiscovery: sessions.filter(s => s.currentStep?.includes('OPENER_SENT')).length,
    mens:             sessions.filter(s => s.selectedCollection === 'MENS').length,
    womens:           sessions.filter(s => s.selectedCollection === 'WOMENS').length,
    carouselReached:  sessions.filter(s => s.currentStep?.includes('BRAND_CAROUSEL')).length,
    catalogueSent:    sessions.filter(s => s.currentStep?.includes('CATALOGUE_SENT')).length,
    offerTapped:      sessions.filter(s => s.currentStep?.includes('OFFER_SENT')).length,
    reengagement:     sessions.filter(s => s.currentStep?.includes('COMPLETED')).length,
  }

  return (
    <div className="space-y-5">

      {/* ── 8 Campaign Metric Tiles ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {[
          { label: 'Campaign Sent',        value: metrics.messagesSent,               accent: 'blue',   icon: '📤' },
          { label: 'Delivery Rate',         value: `${metrics.deliveryRate  ?? 0}%`,  accent: 'green',  icon: '📬' },
          { label: 'Open Rate',             value: `${metrics.openRate      ?? 0}%`,  accent: 'teal',   icon: '📖' },
          { label: 'Click Rate',            value: `${metrics.clickRate     ?? 0}%`,  accent: 'purple', icon: '👆' },
          { label: 'Callback Requests',     value: metrics.callbackRequests,           accent: 'orange', icon: '📞' },
          { label: 'Store Visit Requests',  value: metrics.storeVisitRequests,         accent: 'pink',   icon: '🏪' },
          { label: 'Catalogue Views',       value: metrics.catalogueViews,             accent: 'indigo', icon: '📋' },
          { label: 'Completion Rate',       value: `${metrics.completionRate ?? 0}%`, accent: 'amber',  icon: '✅' },
        ].map((m, i) => <MetricCardOne key={m.label} {...m} delay={i * 40} />)}
      </div>

      {/* ── 8 Conversation Metric Tiles ─── */}
      <div>
        <h2 className="font-sora font-semibold text-[11px] text-[#A49D94] uppercase tracking-widest mb-3">
          Conversation Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {[
            // { label: 'Active Sessions',                                        value: conv.activeSessions,           color: '#378ADD', bg: '#EBF4FD' },
            { label: isBday ? 'Birthday Confirmed' : 'Anniversary Confirmed',  value: conv.confirmed,                color: '#E85A2B', bg: '#FEF0EB' },
            { label: 'Entered Discovery',                                       value: conv.enteredDiscovery,         color: '#7F77DD', bg: '#EEEDFE' },
            // { label: "Men's / Women's",                                         value: `${conv.mens}/${conv.womens}`, color: '#D4537E', bg: '#FCEEF4' },
            { label: 'Carousel Reached',                                        value: conv.carouselReached,          color: '#1D9E75', bg: '#E1F5EE' },
            { label: 'Catalogue Sent',                                          value: conv.catalogueSent,            color: '#0F6E56', bg: '#E0F2F1' },
            { label: isBday ? 'Birthday Offer' : 'Anniv Offer',                value: conv.offerTapped,              color: '#E09A1A', bg: '#FEF3CD' },
            { label: 'Re-engagement',                                           value: conv.reengagement,             color: '#A49D94', bg: '#F5F3F0' },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-3 border" style={{ background: c.bg, borderColor: c.color + '22' }}>
              <div className="font-sora font-extrabold text-xl" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[9px] font-semibold mt-1 leading-tight" style={{ color: c.color, opacity: 0.8 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Funnel + Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CardOne title="Bot Flow Drop-off" subtitle="Users at each step" icon="🔽" delay={100}>
          <FlowFunnelOne sessions={sessions} />
        </CardOne>
        <CardOne title="Activity Feed" subtitle="Real-time events" icon="🕐" delay={150}>
          <ActivityTimelineOne events={timeline} />
        </CardOne>
      </div>

      {/* ── Messages chart ─── */}
      <CardOne title="Messages Today" subtitle="Inbound vs outbound by hour" icon="📩" delay={180}>
        <MessagesChart data={hourly} />
      </CardOne>

  

    </div>
  )
}