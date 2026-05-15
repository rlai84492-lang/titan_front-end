import React from 'react'
import {
  LayoutDashboard, MessageSquare, Users, PhoneCall, Store,
  BarChart2, Calendar, Settings, Bell, HelpCircle,
  ChevronRight, Zap, TrendingUp, BookOpen,
} from 'lucide-react'

const NAV = [
  {
    group: 'OVERVIEW',
    items: [
      { id:'overview',       label:'Overview',       icon: LayoutDashboard },
      { id:'conversations',  label:'Conversations',  icon: MessageSquare,  badge:'12' },
      { id:'leads',          label:'Leads',          icon: PhoneCall,      badge:'7'  },
    ],
  },
  {
    group: 'ANALYTICS',
    items: [
      { id:'analytics',   label:'Analytics',    icon: BarChart2  },
      { id:'campaigns',   label:'Campaigns',    icon: Calendar   },
      { id:'performance', label:'Performance',  icon: TrendingUp },
    ],
  },
  {
    group: 'MANAGEMENT',
    items: [
      { id:'customers', label:'Customers',   icon: Users    },
      { id:'stores',    label:'Stores',      icon: Store    },
      { id:'catalogue', label:'Catalogue',   icon: BookOpen },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { id:'settings', label:'Settings', icon: Settings   },
      { id:'help',     label:'Help',     icon: HelpCircle },
    ],
  },
]

export default function SideBar({ active, setActive, collapsed, setCollapsed }) {
  return (
    <aside
      style={{ width: collapsed ? 68 : 240 }}
      className="fixed top-0 left-0 h-screen bg-white border-r border-[#EFEDEA] flex flex-col z-40 overflow-hidden"
      style={{ width: collapsed ? '68px' : '240px', transition:'width 0.25s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#EFEDEA] flex-shrink-0 gap-3">
        <div className="w-9 h-9 bg-[#E85A2B] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-lg">⌚</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-sora font-semibold text-[#151210] text-[15px] leading-tight whitespace-nowrap">Titan Watch</div>
            <div className="text-[11px] text-[#A49D94] whitespace-nowrap">Bot Dashboard</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(section => (
          <div key={section.group} className="mb-3">
            {!collapsed && (
              <div className="text-[10px] font-semibold tracking-widest text-[#C4BEB6] px-3 mb-1.5 uppercase">
                {section.group}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left group relative
                    ${isActive
                      ? 'bg-[#FEF0EB] text-[#E85A2B]'
                      : 'text-[#5C5650] hover:bg-[#F8F7F6] hover:text-[#28241F]'
                    }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 ${isActive ? 'text-[#E85A2B]' : 'text-[#A49D94] group-hover:text-[#5C5650]'}`}
                  />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#E85A2B] text-white' : 'bg-[#EFEDEA] text-[#7D7670]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && !collapsed && (
                    <ChevronRight size={14} className="text-[#E85A2B] opacity-60" />
                  )}
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E85A2B] rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Live status chip */}
      {!collapsed && (
        <div className="px-4 pb-3">
          <div className="bg-[#F8F7F6] rounded-xl p-3 border border-[#EFEDEA]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 live-dot" />
              <span className="text-xs font-semibold text-[#28241F]">Bot is Live</span>
            </div>
            <div className="text-[11px] text-[#A49D94]">Karix API connected</div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="h-10 flex items-center justify-center border-t border-[#EFEDEA] text-[#A49D94] hover:text-[#5C5650] hover:bg-[#F8F7F6] flex-shrink-0"
      >
        <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}