import React from 'react'
import { useSelector } from 'react-redux'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import FlowFunnelOne from '../Components/FlowFunnelOne'
import ActivityTimelineOne from '../Components/ActivityTimelineOne'
import ConversationsTableOne from '../Components/ConversationsTableOne'
import LeadsTableOne from '../Components/LeadsTableOne'
import { CampaignChart, CollectionChart, MessagesChart } from '../Components/Charts'

export default function OverviewPage() {
  const sessions  = useSelector(s => s.dashboard.sessions)
  const leads     = useSelector(s => s.dashboard.leads)
  const metrics   = useSelector(s => s.dashboard.metrics)
  const hourly    = useSelector(s => s.dashboard.hourly)
  const campData  = useSelector(s => s.dashboard.campData)
  const collData  = useSelector(s => s.dashboard.collData)
  const timeline  = useSelector(s => s.dashboard.timeline)
  const activeFlow = useSelector(s => s.ui.activeFlow)

  const isBday = activeFlow.includes('bday')

  const conv = {
    activeSessions:   sessions.filter(s => s.isActive).length,
    confirmed:        sessions.filter(s => s.currentStep?.includes('CONFIRMATION_SENT')).length,
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

      {/* ── 8 Campaign Metric Tiles ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {[
          { label: 'Messages Sent',       value: metrics.messagesSent,         accent: 'blue',   icon: '📤' },
          { label: 'Delivery Rate',        value: `${metrics.deliveryRate ?? 0}%`, accent: 'green', icon: '📬' },
          { label: 'Open Rate',            value: `${metrics.openRate ?? 0}%`,    accent: 'teal',   icon: '📖' },
          { label: 'Click Rate',           value: `${metrics.clickRate ?? 0}%`,   accent: 'purple', icon: '👆' },
          { label: 'Callback Requests',    value: metrics.callbackRequests,     accent: 'orange', icon: '📞' },
          { label: 'Store Visit Requests', value: metrics.storeVisitRequests,   accent: 'pink',   icon: '🏪' },
          { label: 'Catalogue Views',      value: metrics.catalogueViews,       accent: 'indigo', icon: '📋' },
          { label: 'Completion Rate',      value: `${metrics.completionRate ?? 0}%`, accent: 'amber', icon: '✅' },
        ].map((m, i) => (
          <MetricCardOne key={m.label} {...m} delay={i * 40} />
        ))}
      </div>

      {/* ── 8 Conversation Metric Tiles ─────────────────────── */}
      <div>
        <h2 className="font-sora font-semibold text-[11px] text-[#A49D94] uppercase tracking-widest mb-3">
          Conversation Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {[
            { label: 'Active Sessions',                                       value: conv.activeSessions,   color: '#378ADD', bg: '#EBF4FD' },
            { label: isBday ? 'Birthday Confirmed' : 'Anniversary Confirmed', value: conv.confirmed,        color: '#E85A2B', bg: '#FEF0EB' },
            { label: 'Entered Discovery',                                     value: conv.enteredDiscovery, color: '#7F77DD', bg: '#EEEDFE' },
            { label: "Men's / Women's",                                       value: `${conv.mens}/${conv.womens}`, color: '#D4537E', bg: '#FCEEF4' },
            { label: 'Carousel Reached',                                      value: conv.carouselReached,  color: '#1D9E75', bg: '#E1F5EE' },
            { label: 'Catalogue Sent',                                        value: conv.catalogueSent,    color: '#0F6E56', bg: '#E0F2F1' },
            { label: isBday ? 'Birthday Offer' : 'Anniv Offer',              value: conv.offerTapped,      color: '#E09A1A', bg: '#FEF3CD' },
            { label: 'Re-engagement',                                         value: conv.reengagement,     color: '#A49D94', bg: '#F5F3F0' },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-3 border" style={{ background: c.bg, borderColor: c.color + '22' }}>
              <div className="font-sora font-extrabold text-xl" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[9px] font-semibold mt-1 leading-tight" style={{ color: c.color, opacity: 0.8 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Funnel + Activity ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CardOne title="Bot Flow Drop-off" subtitle="Users at each step" icon="🔽" delay={100}>
          <FlowFunnelOne sessions={sessions} />
        </CardOne>
        <CardOne title="Activity Feed" subtitle="Real-time events" icon="🕐" delay={150}>
          <ActivityTimelineOne events={timeline} />
        </CardOne>
      </div>

      {/* ── Messages chart ───────────────────────────────────── */}
      <CardOne title="Messages Today" subtitle="Inbound vs outbound by hour" icon="📩" delay={180}>
        <MessagesChart data={hourly} />
      </CardOne>

      {/* ── Conversations table ──────────────────────────────── */}
      {/* <CardOne
        title="Active Conversations"
        subtitle="All sessions — filter by collection, brand, step"
        icon="💬"
        delay={200}
        action={
          <span className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 live-dot" />Live
          </span>
        }
      >
        <ConversationsTableOne sessions={sessions} />
      </CardOne> */}

      {/* ── Leads ────────────────────────────────────────────── */}
      {/* <CardOne title="Lead Management" subtitle="Callbacks and store visits" icon="🎯" delay={250}>
        <LeadsTableOne leads={leads} />
      </CardOne> */}

      {/* ── Campaign + Collection ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CardOne title="Campaign Volume" subtitle="T-10 and T-Day sends this week" icon="📅" delay={300}>
          <CampaignChart data={campData} />
        </CardOne>
        <CardOne title="Collection Split" subtitle="Men's vs Women's vs Couple" icon="📊" delay={350}>
          <CollectionChart data={collData} />
        </CardOne>
      </div>

    </div>
  )
}