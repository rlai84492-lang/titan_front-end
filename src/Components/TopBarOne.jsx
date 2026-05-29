import React, { useState } from 'react'
import {
  Bell,
  Search,
  RefreshCw,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { initials } from '../mockData.js'

export default function Topbar({
  pageTitle,
  onRefresh,
  loading,
  lastRefresh,
  sidebarW,
  user,
  onLogout,
}) {
  const [showProfile, setShowProfile] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [search, setSearch] = useState('')

  const USER = {
    name: user?.fullName || 'Admin User',
    role: user?.role || 'ADMIN',
    email: user?.email || '',
  }

  const notifications = [
    {
      icon: '📞',
      text: 'New callback lead — Aditya Sharma',
      time: '2m ago',
      dot: '#E85A2B',
    },
    {
      icon: '✅',
      text: 'Divya Verma completed bot flow',
      time: '1h ago',
      dot: '#1D9E75',
    },
    {
      icon: '🚀',
      text: 'T-10 campaign triggered (6 users)',
      time: '2h ago',
      dot: '#E09A1A',
    },
    {
      icon: '🏪',
      text: 'Store visit booked — Priya Patel',
      time: '3h ago',
      dot: '#7F77DD',
    },
  ]

  function handleSignOut() {
    localStorage.removeItem('titan_admin_token')
    localStorage.removeItem('titan_admin_user')

    setShowProfile(false)
    setShowNotif(false)

    if (typeof onLogout === 'function') {
      onLogout()
    } else {
      window.location.reload()
    }
  }

  const profileItems = [
    {
      icon: User,
      label: 'My Profile',
    },
    {
      icon: Settings,
      label: 'Settings',
    },
    {
      icon: LogOut,
      label: 'Sign out',
      red: true,
      action: handleSignOut,
    },
  ]

  return (
    <header
      className="fixed top-0 right-0 h-16 z-30 flex items-center px-5 gap-3 glass border-b border-[#EEEBE6]"
      style={{
        left: sidebarW,
        transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 0 #EEEBE6, 0 4px 16px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex-1 min-w-0">
        <h1 className="font-sora font-bold text-[16px] text-[#1A1713] leading-tight truncate">
          {pageTitle}
        </h1>

        <p className="text-[11px] text-[#B0A9A1] font-medium">
          {lastRefresh
            ? `Last updated: ${lastRefresh.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}`
            : 'Syncing…'}
        </p>
      </div>

      <div className="relative hidden md:block">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4BEB6]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users, leads…"
          className="pl-8 pr-4 py-2 text-[13px] bg-[#F5F3F0] border border-[#EEEBE6] rounded-xl w-48 outline-none focus:border-[#E85A2B] focus:ring-2 focus:ring-[#E85A2B]/10 placeholder-[#C4BEB6] transition-all duration-200 font-dm"
        />
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="w-9 h-9 rounded-xl border border-[#EEEBE6] flex items-center justify-center text-[#B0A9A1] hover:border-[#E85A2B] hover:text-[#E85A2B] hover:bg-[#FEF0EB] disabled:opacity-40 transition-all duration-150"
        title="Refresh data"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
      </button>

      <div className="relative">
        <button
          onClick={() => {
            setShowNotif((n) => !n)
            setShowProfile(false)
          }}
          className="w-9 h-9 rounded-xl border border-[#EEEBE6] flex items-center justify-center text-[#B0A9A1] hover:border-[#E85A2B] hover:text-[#E85A2B] hover:bg-[#FEF0EB] relative transition-all duration-150"
        >
          <Bell size={14} />

          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: '#E85A2B' }}
          />
        </button>

        {showNotif && (
          <div
            className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-[#EEEBE6] overflow-hidden z-50 slide-down"
            style={{
              boxShadow:
                '0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)',
            }}
          >
            <div className="px-4 py-3 border-b border-[#F4F1ED] flex items-center justify-between bg-gradient-to-r from-[#FAF8F6] to-white">
              <div className="flex items-center gap-2">
                <Bell size={13} className="text-[#E85A2B]" />

                <span className="font-sora font-bold text-[13px] text-[#1A1713]">
                  Notifications
                </span>

                <span className="text-[9px] font-bold bg-[#E85A2B] text-white px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </div>

              <button className="text-[11px] text-[#E85A2B] font-semibold hover:underline">
                Mark all read
              </button>
            </div>

            {notifications.map((n, i) => (
              <div
                key={i}
                className="px-4 py-3 border-b border-[#F4F1ED] last:border-0 hover:bg-[#FAF8F6] cursor-pointer flex gap-3 items-start transition-colors duration-150"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{
                    background: n.dot + '15',
                    border: `1px solid ${n.dot}25`,
                  }}
                >
                  {n.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#3E3A35] leading-snug font-medium">
                    {n.text}
                  </p>

                  <p
                    className="text-[10px] font-semibold mt-0.5"
                    style={{ color: n.dot }}
                  >
                    {n.time}
                  </p>
                </div>

                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: n.dot }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => {
            setShowProfile((p) => !p)
            setShowNotif(false)
          }}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-transparent hover:border-[#EEEBE6] hover:bg-[#F8F7F6] transition-all duration-150"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(232,90,43,0.35)',
            }}
          >
            {initials(USER.name)}
          </div>

          <div className="hidden md:block text-left">
            <div className="text-[13px] font-semibold text-[#1A1713] leading-tight">
              {USER.name}
            </div>

            <div className="text-[10px] text-[#B0A9A1] font-medium">
              {USER.role}
            </div>
          </div>

          <ChevronDown
            size={13}
            className={`text-[#B0A9A1] transition-transform duration-200 ${
              showProfile ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showProfile && (
          <div
            className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-[#EEEBE6] overflow-hidden z-50 mt-1 slide-down"
            style={{
              boxShadow:
                '0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.10)',
            }}
          >
            <div
              className="px-4 py-3 border-b border-[#F4F1ED]"
              style={{
                background:
                  'linear-gradient(135deg, #FEF0EB 0%, #FFF8F5 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #E85A2B, #FF7040)',
                    color: '#fff',
                  }}
                >
                  {initials(USER.name)}
                </div>

                <div className="min-w-0">
                  <div className="font-sora font-bold text-[13px] text-[#1A1713] truncate">
                    {USER.name}
                  </div>

                  <div className="text-[10px] text-[#B0A9A1] font-medium truncate">
                    {USER.email}
                  </div>
                </div>
              </div>
            </div>

            {profileItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setShowProfile(false)

                  if (typeof item.action === 'function') {
                    item.action()
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  item.red
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-[#5C5650] hover:bg-[#FAF8F6]'
                }`}
              >
                <item.icon size={14} className="flex-shrink-0" />

                <div className="text-left">
                  <div className="text-[13px] font-medium">{item.label}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}