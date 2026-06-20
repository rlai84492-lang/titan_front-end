import React from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

/**
 * Reusable sortable column header — Conversations aur Leads dono
 * tables mein use hota hai. Click karne pe sort field set karta hai,
 * dobara click karne pe direction (asc/desc) toggle hoti hai.
 */
export default function SortableHeader({ label, field, sortField, sortDir, onSort, className = '' }) {
  const isActive = sortField === field

  return (
    <th
      onClick={() => onSort(field)}
      className={`text-left text-[9px] font-bold text-[#9B9590] uppercase tracking-widest pb-2.5 pt-3 px-4 border-b border-[#EEEBE6] whitespace-nowrap cursor-pointer select-none hover:text-[#E85A2B] transition-colors ${className}`}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {isActive ? (
          sortDir === 'asc'
            ? <ArrowUp size={11} className="text-[#E85A2B]" />
            : <ArrowDown size={11} className="text-[#E85A2B]" />
        ) : (
          <ArrowUpDown size={11} className="text-[#D8D2CA] opacity-60" />
        )}
      </div>
    </th>
  )
}