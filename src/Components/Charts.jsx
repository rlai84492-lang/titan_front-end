import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend, Filler
)

const BASE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#151210',
      padding: 10,
      cornerRadius: 10,
      titleFont: { family: 'Sora, sans-serif', size: 12 },
      bodyFont:  { family: 'DM Sans, sans-serif', size: 12 },
    },
  },
}

const SCALE = {
  x: { ticks:{ font:{ size:11, family:'DM Sans, sans-serif' }, color:'#C4BEB6' }, grid:{ display:false }, border:{ display:false } },
  y: { ticks:{ font:{ size:11, family:'DM Sans, sans-serif' }, color:'#C4BEB6' }, grid:{ color:'#F8F7F6', lineWidth:1 }, border:{ display:false } },
}

// ─── Hourly messages (grouped bar) ───────────────────────────
export function MessagesChart({ data }) {
  return (
    <div>
      <div className="flex gap-4 mb-3">
        {[['Inbound','#378ADD'],['Outbound','#E85A2B']].map(([l,c]) => (
          <span key={l} className="flex items-center gap-1.5 text-[12px] text-[#7D7670]">
            <span className="w-3 h-2.5 rounded-sm" style={{ background:c, opacity:0.7 }} />
            {l}
          </span>
        ))}
      </div>
      <div className="h-44">
        <Bar data={{
          labels: data.labels,
          datasets: [
            { label:'Inbound',  data:data.inbound,  backgroundColor:'rgba(55,138,221,0.20)', borderColor:'#378ADD', borderWidth:2, borderRadius:4, borderSkipped:false },
            { label:'Outbound', data:data.outbound, backgroundColor:'rgba(232,90,43,0.18)',  borderColor:'#E85A2B', borderWidth:2, borderRadius:4, borderSkipped:false },
          ],
        }} options={{ ...BASE, scales: SCALE }} />
      </div>
    </div>
  )
}

// ─── Style preference (doughnut) ─────────────────────────────
const STYLE_LABELS = ['Minimal & Chic','Bold & Edgy','Luxe & Classy','Sporty']
const STYLE_COLORS = ['#378ADD','#7F77DD','#E85A2B','#1D9E75']

export function StyleChart({ counts }) {
  const values = [counts.MINIMAL_CHIC||0, counts.BOLD_EDGY||0, counts.LUXE_CLASSY||0, counts.SPORTY_ADVENTUROUS||0]
  const total = values.reduce((a,b) => a+b, 0)

  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        {STYLE_LABELS.map((l,i) => (
          <span key={l} className="flex items-center gap-1.5 text-[11px] text-[#7D7670]">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background:STYLE_COLORS[i] }} />
            {l} <span className="text-[#C4BEB6]">({values[i]})</span>
          </span>
        ))}
      </div>
      <div className="relative h-48">
        <Doughnut data={{
          labels: STYLE_LABELS,
          datasets: [{ data:values, backgroundColor:STYLE_COLORS, borderWidth:3, borderColor:'#fff', hoverOffset:6 }],
        }} options={{
          ...BASE,
          cutout: '68%',
          plugins: {
            ...BASE.plugins,
            tooltip: { ...BASE.plugins.tooltip, callbacks: { label:(c) => ` ${c.label}: ${c.raw} users` } },
          },
        }} />
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-sora font-bold text-xl text-[#151210]">{total}</div>
          <div className="text-[11px] text-[#A49D94]">users</div>
        </div>
      </div>
    </div>
  )
}

// ─── Price range (bar) ────────────────────────────────────────
export function PriceChart({ data }) {
  const colors = ['#B5D4F4','#85B7EB','#378ADD','#185FA5']
  return (
    <div className="h-44">
      <Bar data={{
        labels: Object.keys(data),
        datasets: [{
          label:'Users', data:Object.values(data),
          backgroundColor: colors, borderRadius:6, borderSkipped:false,
        }],
      }} options={{ ...BASE, scales: SCALE }} />
    </div>
  )
}

// ─── Campaign sends (line) ────────────────────────────────────
export function CampaignChart({ data }) {
  return (
    <div>
      <div className="flex gap-4 mb-3">
        {[['T-10','#378ADD','solid'],['T-Day','#E85A2B','dashed']].map(([l,c,s]) => (
          <span key={l} className="flex items-center gap-1.5 text-[12px] text-[#7D7670]">
            <span className="w-5 border-t-2 inline-block" style={{ borderColor:c, borderStyle:s }} />
            {l}
          </span>
        ))}
      </div>
      <div className="h-44">
        <Line data={{
          labels: data.labels,
          datasets: [
            { label:'T-10',  data:data.t10,  borderColor:'#378ADD', backgroundColor:'rgba(55,138,221,0.08)',  fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#378ADD', borderWidth:2.5 },
            { label:'T-Day', data:data.tday, borderColor:'#E85A2B', backgroundColor:'rgba(232,90,43,0.06)',   fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#E85A2B', borderWidth:2, borderDash:[5,4] },
          ],
        }} options={{ ...BASE, scales: SCALE }} />
      </div>
    </div>
  )
}

// ─── Collection split (horizontal bar) ───────────────────────
export function CollectionChart({ data }) {
  return (
    <div className="h-40">
      <Bar data={{
        labels: ["Men's Collection", "Women's Collection"],
        datasets: [{
          label:'Users', data:[data.mens, data.womens],
          backgroundColor:['rgba(55,138,221,0.8)','rgba(212,83,126,0.8)'],
          borderColor:['#378ADD','#D4537E'], borderWidth:2, borderRadius:6, borderSkipped:false,
        }],
      }} options={{
        ...BASE,
        indexAxis: 'y',
        scales: {
          x: { ...SCALE.x, grid: { color:'#F8F7F6' } },
          y: { ...SCALE.y, grid: { display:false } },
        },
      }} />
    </div>
  )
}