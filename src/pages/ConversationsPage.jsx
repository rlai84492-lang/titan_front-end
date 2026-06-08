import React from 'react'
import { useSelector } from 'react-redux'
import CardOne from '../Components/CardOne'
import MetricCardOne from '../Components/MetricCardOne'
import ConversationsTableOne from '../Components/ConversationsTableOne'

export default function ConversationsPage() {
  const sessions = useSelector(s => s.dashboard.sessions)

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