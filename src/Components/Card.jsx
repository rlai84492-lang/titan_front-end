import React from 'react'

export default function Card({ title, subtitle, icon, action, children, className = '', delay = 0 }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#EFEDEA] shadow-card card-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F8F7F6]">
          <div className="flex items-center gap-2.5">
            {icon && (
              <span className="text-base">{icon}</span>
            )}
            <div>
              <div className="font-sora font-semibold text-[14px] text-[#28241F]">{title}</div>
              {subtitle && <div className="text-[11px] text-[#A49D94] mt-0.5">{subtitle}</div>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}