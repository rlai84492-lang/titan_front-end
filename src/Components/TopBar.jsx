import React, { useState } from 'react'
import { Bell, Search, RefreshCw, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { initials, avatarColor } from '../mockData.js'

const USER = { name: 'Samarth Verma', role: 'Campaign Manager', email: 'samarth@titan.in' }

export default function TopBar({ pageTitle, onRefresh, loading, lastRefresh, sidebarW }) {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [avatar, textColor] = avatarColor(USER.name)

  const notifications = [
    { icon:'📞', text:'New callback lead — Aditya Sharma', time:'2m ago'  },
    { icon:'✅', text:'Divya Verma completed bot flow',    time:'1h ago'  },
    { icon:'🚀', text:'T-10 campaign triggered (6 users)', time:'2h ago'  },
    { icon:'🏪', text:'Store visit booked — Priya Patel',  time:'3h ago'  },
  ]

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white border-b border-[#EFEDEA] z-30 flex items-center px-6 gap-4"
      style={{ left: sidebarW, transition:'left 0.25s cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Page title */}
      <div className="flex-1">
        <h1 className="font-sora text-[17px] font-semibold text-[#151210]">{pageTitle}</h1>
        <p className="text-xs text-[#A49D94]">
          {lastRefresh
            ? `Last updated: ${lastRefresh.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`
            : 'Loading…'}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BEB6]" />
        <input
          type="text"
          placeholder="Search users, leads…"
          className="pl-9 pr-4 py-2 text-sm bg-[#F8F7F6] border border-[#EFEDEA] rounded-xl w-52 outline-none focus:border-[#E85A2B] focus:ring-2 focus:ring-[#E85A2B]/10 placeholder-[#C4BEB6]"
        />
      </div>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="w-9 h-9 rounded-xl border border-[#EFEDEA] flex items-center justify-center text-[#A49D94] hover:border-[#E85A2B] hover:text-[#E85A2B] hover:bg-[#FEF0EB] disabled:opacity-40"
        title="Refresh"
      >
        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(n => !n); setShowProfile(false) }}
          className="w-9 h-9 rounded-xl border border-[#EFEDEA] flex items-center justify-center text-[#A49D94] hover:border-[#E85A2B] hover:text-[#E85A2B] hover:bg-[#FEF0EB] relative"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E85A2B]" />
        </button>

        {showNotif && (
          <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-card-hover border border-[#EFEDEA] overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#EFEDEA] flex items-center justify-between">
              <span className="font-sora font-semibold text-sm text-[#151210]">Notifications</span>
              <span className="text-[11px] text-[#E85A2B] font-medium cursor-pointer">Mark all read</span>
            </div>
            {notifications.map((n,i) => (
              <div key={i} className="px-4 py-3 border-b border-[#F8F7F6] last:border-0 hover:bg-[#F8F7F6] cursor-pointer flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">{n.icon}</span>
                <div>
                  <p className="text-sm text-[#28241F] leading-snug">{n.text}</p>
                  <p className="text-[11px] text-[#A49D94] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(p => !p); setShowNotif(false) }}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F8F7F6] border border-transparent hover:border-[#EFEDEA]"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: '#FEF0EB', color: '#E85A2B' }}
          >
            {initials(USER.name)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-[#28241F] leading-tight">{USER.name}</div>
            <div className="text-[11px] text-[#A49D94]">{USER.role}</div>
          </div>
          <ChevronDown size={14} className={`text-[#A49D94] transition-transform ${showProfile ? 'rotate-180' : ''}`} />
        </button>

        {showProfile && (
          <div className="absolute right-0 top-13 w-56 bg-white rounded-2xl shadow-card-hover border border-[#EFEDEA] overflow-hidden z-50 mt-1">
            <div className="px-4 py-3 border-b border-[#EFEDEA]">
              <div className="font-semibold text-sm text-[#151210]">{USER.name}</div>
              <div className="text-[11px] text-[#A49D94]">{USER.email}</div>
            </div>
            {[
              { icon: User,     label: 'My Profile'   },
              { icon: Settings, label: 'Settings'      },
              { icon: LogOut,   label: 'Sign out', red: true },
            ].map(item => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F8F7F6] ${item.red ? 'text-red-500' : 'text-[#5C5650]'}`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}