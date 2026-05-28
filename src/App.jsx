import React, { useState, useEffect, useCallback } from 'react'
// import Sidebar from './components/Sidebar.jsx'
import Topbar  from './components/Topbar.jsx'
import Card    from './components/Card.jsx'
import MetricCard from './components/MetricCard.jsx'
import FlowFunnel from './components/FlowFunnel.jsx'
import ConversationsTable from './components/ConversationsTable.jsx'
import LeadsTable         from './components/LeadsTable.jsx'
import ActivityTimeline   from './components/ActivityTimeline.jsx'
import {
  MessagesChart, StyleChart, PriceChart,
  CampaignChart, CollectionChart,
} from './components/Charts.jsx'


// import {
//   apiFetch,
//   getMockSessions, getMockLeads, getMockHourly,
//   getMockCampaignWeek, getMockPriceData, getMockTimeline,
//   computeMetrics, getStyleCounts, getCollectionCounts,
// } from './mockData.js'



import { fetchDashboard } from './api/dashboardApi.js'
import SideBar from './components/Sidebar.jsx'

// ─────────────────────────────────────────────────────────────
//  Page titles
// ─────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  overview:      'Dashboard Overview',
  conversations: 'Conversations',
  leads:         'Leads & Follow-ups',
  analytics:     'Analytics',
  campaigns:     'Campaign Manager',
  performance:   'Performance',
  customers:     'Customers',
  stores:        'Stores',
  catalogue:     'Watch Catalogue',
  settings:      'Settings',
  help:          'Help & Support',
}

// ─────────────────────────────────────────────────────────────
//  Small helper: section header inside pages
// ─────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 className="font-sora font-semibold text-[13px] text-[#A49D94] uppercase tracking-widest mb-4 mt-2">
      {children}
    </h2>
  )
}

// ─────────────────────────────────────────────────────────────
//  Empty state stub for non-overview pages
// ─────────────────────────────────────────────────────────────
function ComingSoon({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="font-sora font-semibold text-[#28241F] text-lg mb-2">{label}</div>
      <div className="text-[#A49D94] text-sm max-w-xs">
        This section is under development. Connect your Spring Boot APIs to unlock full functionality.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  OVERVIEW PAGE
// ─────────────────────────────────────────────────────────────
function OverviewPage({ sessions, leads, metrics, hourly, styleCounts, priceData, campData, collData, timeline }) {
  return (
    <div className="space-y-5">

      {/* ── Metric tiles ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
        <MetricCard icon="👥" label="Users Reached"    value={metrics.totalReached}   delta="+3 today"  up accent="blue"   delay={0}   />
        <MetricCard icon="💬" label="Active Sessions"  value={metrics.activeSessions} delta="Live now"  up accent="orange" delay={50}  />
        <MetricCard icon="📞" label="Callback Leads"   value={metrics.callbackLeads}  delta="+2 today"  up accent="green"  delay={100} />
        <MetricCard icon="🏪" label="Store Visits"     value={metrics.storeVisits}    delta="+1 today"  up accent="purple" delay={150} />
        <MetricCard icon="✅" label="Completed Flows"  value={metrics.completedFlows} delta="This week"  up accent="green"  delay={200} />
        <MetricCard icon="📊" label="Conversion Rate"  value={`${metrics.conversionRate}%`} delta={metrics.conversionRate >= 30 ? '↑ Good' : '↓ Low'} up={metrics.conversionRate >= 30} accent="amber" delay={250} />
        {/* <MetricCard icon="🆕" label="New Leads"        value={metrics.newLeads}       delta="Unactioned" up={false} accent="pink"   delay={300} /> */}
        {/* <MetricCard icon="🏆" label="Converted"        value={metrics.converted}      delta="Total"     up accent="green"  delay={350} /> */}
      </div>

      {/* ── Row 1: Funnel + Hourly messages ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title="Bot flow drop-off"
          subtitle="How many users reached each step"
          icon="🔽"
          delay={100}
        >
          <FlowFunnel sessions={sessions} />
        </Card>

        <Card
          title="Messages today"
          subtitle="Inbound vs outbound by hour"
          icon="📩"
          delay={150}
        >
          <MessagesChart data={hourly} />
        </Card>
      </div>

      {/* ── Row 2: Conversations table + Timeline ──── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Card
            title="Active conversations"
            subtitle="All WhatsApp bot sessions in real-time"
            icon="💬"
            delay={200}
            action={
              <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 live-dot" />
                Live
              </span>
            }
          >
            <ConversationsTable sessions={sessions} />
          </Card>
        </div>

        <Card
          title="Activity feed"
          subtitle="Real-time events from bot"
          icon="🕐"
          delay={250}
        >
          <ActivityTimeline events={timeline} />
        </Card>
      </div>

      {/* ── Row 3: Style + Price charts ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title="Style preferences"
          subtitle="Which watch style users are choosing"
          icon="🎨"
          delay={300}
        >
          <StyleChart counts={styleCounts} />
        </Card>

        <Card
          title="Price range selection"
          subtitle="Budget preferences from Price Filter step"
          icon="💰"
          delay={350}
        >
          <PriceChart data={priceData} />
        </Card>
      </div>

      {/* ── Leads table ─────────────────────────────── */}
      <Card
        title="Lead management"
        subtitle="All callback, store visit & website leads"
        icon="🎯"
        delay={400}
        action={
          <button className="text-xs font-semibold text-[#E85A2B] hover:underline">
            View all →
          </button>
        }
      >
        <LeadsTable leads={leads} />
      </Card>

      {/* ── Row 4: Campaign + Collection ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title="Campaign sends this week"
          subtitle="T-10 and T-Day campaign volume"
          icon="📅"
          delay={450}
        >
          <CampaignChart data={campData} />
        </Card>

        <Card
          title="Collection split"
          subtitle="Men's vs Women's selection count"
          icon="📊"
          delay={500}
        >
          <CollectionChart data={collData} />
        </Card>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  CONVERSATIONS PAGE
// ─────────────────────────────────────────────────────────────
function ConversationsPage({ sessions }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon:'💬', label:'Total sessions',  value: sessions.length,                                       accent:'blue'   },
          { icon:'🟢', label:'Active now',      value: sessions.filter(s=>s.isActive).length,                 accent:'green'  },
          { icon:'✅', label:'Completed',       value: sessions.filter(s=>s.currentStep==='COMPLETED').length, accent:'orange' },
          { icon:'⏳', label:'In progress',     value: sessions.filter(s=>s.isActive&&s.currentStep!=='COMPLETED').length, accent:'purple' },
        ].map((m,i) => <MetricCard key={i} {...m} delay={i*50} />)}
      </div>
      <Card title="All conversations" subtitle="Filterable by step, searchable by name or phone" icon="💬">
        <ConversationsTable sessions={sessions} />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  LEADS PAGE
// ─────────────────────────────────────────────────────────────
function LeadsPage({ leads }) {
  const m = {
    total:     leads.length,
    newL:      leads.filter(l=>l.status==='NEW').length,
    converted: leads.filter(l=>l.status==='CONVERTED').length,
    callbacks: leads.filter(l=>l.leadType==='CALLBACK').length,
  }
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard icon="🎯" label="Total leads"   value={m.total}     accent="blue"   delay={0}   />
        <MetricCard icon="🆕" label="New"            value={m.newL}      accent="amber"  delay={50}  />
        <MetricCard icon="🏆" label="Converted"      value={m.converted} accent="green"  delay={100} />
        <MetricCard icon="📞" label="Callback leads" value={m.callbacks} accent="orange" delay={150} />
      </div>
      <Card title="All leads" subtitle="Manage and track all incoming bot leads" icon="🎯">
        <LeadsTable leads={leads} />
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ANALYTICS PAGE
// ─────────────────────────────────────────────────────────────
function AnalyticsPage({ sessions, hourly, styleCounts, priceData, campData, collData }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Bot flow drop-off funnel" icon="🔽">
          <FlowFunnel sessions={sessions} />
        </Card>
        <Card title="Messages by hour" icon="📩">
          <MessagesChart data={hourly} />
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Style preferences" icon="🎨">
          <StyleChart counts={styleCounts} />
        </Card>
        <Card title="Price range selection" icon="💰">
          <PriceChart data={priceData} />
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Campaign volume (weekly)" icon="📅">
          <CampaignChart data={campData} />
        </Card>
        <Card title="Collection split" icon="📊">
          <CollectionChart data={collData} />
        </Card>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage]   = useState('overview')
  const [collapsed,  setCollapsed]    = useState(false)
  const [sessions,   setSessions]     = useState([])
  const [leads,      setLeads]        = useState([])
  const [metrics,    setMetrics]      = useState({})
  const [hourly,     setHourly]       = useState({ labels:[], inbound:[], outbound:[] })
  const [styleCounts,setStyleCounts]  = useState({})
  const [priceData,  setPriceData]    = useState({})
  const [campData,   setCampData]     = useState({ labels:[], t10:[], tday:[] })
  const [collData,   setCollData]     = useState({ mens:0, womens:0 })
  const [timeline,   setTimeline]     = useState([])
  const [loading,    setLoading]      = useState(false)
  const [lastRefresh,setLastRefresh]  = useState(null)

  // ── Sidebar width ─────────────────────────────
  const sidebarW = collapsed ? '68px' : '240px'

  // ── Data refresh ──────────────────────────────
  // const refresh = useCallback(async () => {
  //   setLoading(true)
  //   try {
  //     const [apiSessions, apiLeads] = await Promise.all([
  //       apiFetch('/api/bot-sessions'),
  //       apiFetch('/api/leads'),
  //     ])

  //     const s = Array.isArray(apiSessions) ? apiSessions : getMockSessions()
  //     const l = Array.isArray(apiLeads)    ? apiLeads    : getMockLeads()

  //     setSessions(s)
  //     setLeads(l)
  //     setMetrics(computeMetrics(s, l))
  //     setHourly(getMockHourly())
  //     setStyleCounts(getStyleCounts(s))
  //     setPriceData(getMockPriceData())
  //     setCampData(getMockCampaignWeek())
  //     setCollData(getCollectionCounts(s))
  //     setTimeline(getMockTimeline())
  //     setLastRefresh(new Date())
  //   } finally {
  //     setLoading(false)
  //   }
  // }, [])

const refresh = useCallback(async () => {
  setLoading(true)

  try {
    const data = await fetchDashboard()

    console.log('Dashboard data fetched:', data);

    setSessions(Array.isArray(data.sessions) ? data.sessions : [])
    setLeads(Array.isArray(data.leads) ? data.leads : [])

    setMetrics(data.metrics || {
      totalReached: 0,
      activeSessions: 0,
      callbackLeads: 0,
      storeVisits: 0,
      completedFlows: 0,
      conversionRate: 0,
      newLeads: 0,
      converted: 0,
    })

    setHourly(data.hourly || {
      labels: [],
      inbound: [],
      outbound: [],
    })

    setStyleCounts(data.styleCounts || {
      MINIMAL_CHIC: 0,
      BOLD_EDGY: 0,
      LUXE_CLASSY: 0,
      SPORTY_ADVENTUROUS: 0,
    })

    setPriceData(data.priceData || {
      '₹2k–5k': 0,
      '₹5k–10k': 0,
      '₹10k–25k': 0,
      '>₹25k': 0,
    })

    setCampData(data.campData || {
      labels: [],
      t10: [],
      tday: [],
    })

    setCollData(data.collData || {
      mens: 0,
      womens: 0,
    })

    setTimeline(Array.isArray(data.timeline) ? data.timeline : [])

    setLastRefresh(new Date())
  } catch (error) {
    console.error('Dashboard refresh failed:', error)
  } finally {
    setLoading(false)
  }
}, [])




  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 30_000)
    return () => clearInterval(id)
  }, [refresh])

  // ── Page content ─────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage sessions={sessions} leads={leads} metrics={metrics} hourly={hourly} styleCounts={styleCounts} priceData={priceData} campData={campData} collData={collData} timeline={timeline} />
      case 'conversations':
        return <ConversationsPage sessions={sessions} />
      case 'leads':
        return <LeadsPage leads={leads} />
      case 'analytics':
        return <AnalyticsPage sessions={sessions} hourly={hourly} styleCounts={styleCounts} priceData={priceData} campData={campData} collData={collData} />
      case 'campaigns':
        return <ComingSoon icon="📅" label="Campaign Manager" />
      case 'performance':
        return <ComingSoon icon="📈" label="Performance Reports" />
      case 'customers':
        return <ComingSoon icon="👥" label="Customer Directory" />
      case 'stores':
        return <ComingSoon icon="🏪" label="Store Management" />
      case 'catalogue':
        return <ComingSoon icon="⌚" label="Watch Catalogue" />
      case 'settings':
        return <ComingSoon icon="⚙️" label="Settings" />
      case 'help':
        return <ComingSoon icon="🆘" label="Help & Support" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F6]">

      {/* Sidebar
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      /> */}

      <SideBar
  active={activePage}
  setActive={setActivePage}
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  sessionCount={sessions.length}
  leadCount={leads.length}
/>




      {/* Topbar */}
      <Topbar
        pageTitle={PAGE_TITLES[activePage] || 'Dashboard'}
        onRefresh={refresh}
        loading={loading}
        lastRefresh={lastRefresh}
        sidebarW={sidebarW}
      />

      {/* Main content */}
      <main
        className="pt-16 min-h-screen"
        style={{
          marginLeft: sidebarW,
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="p-3 max-w-[1600px]">
          {renderPage()}
        </div>
      </main>

    </div>
  )
}