import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'

export default function LoginPageOne() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@titan.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    // Inject font link ONCE into document head — not inside style tag
    if (!document.getElementById('titan-fonts')) {
      const link = document.createElement('link')
      link.id = 'titan-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    // All data initialized ONCE — never recreated on resize
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      baseO: Math.random() * 0.45 + 0.08,
      s: Math.random() * 0.4 + 0.05,
    }))

    const constellationPairs = []
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x
        const dy = stars[i].y - stars[j].y
        if (Math.sqrt(dx*dx + dy*dy) < 95 && Math.random() > 0.70)
          constellationPairs.push([i, j])
      }
    }

    const gears = [
      { x: 100, offY: -130, r: 78, teeth: 22, angle: 0,           speed:  0.0022 },
      { x: 215, offY: -160, r: 50, teeth: 14, angle: Math.PI/14,  speed: -0.0038 },
      { x:  38, offY: -250, r: 42, teeth: 12, angle: 0,           speed:  0.0052 },
      { x: 285, offY: -105, r: 30, teeth:  9, angle: Math.PI/5,   speed:  0.0068 },
    ]
    const gearsRight = [
      { offX: -65,  y: 75,  r: 44, teeth: 13, angle: 0,          speed: -0.003  },
      { offX: -140, y: 42,  r: 27, teeth:  8, angle: Math.PI/8,  speed:  0.0048 },
      { offX: -50,  y: 165, r: 20, teeth:  6, angle: 0,          speed: -0.007  },
    ]

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width * 0.55,
      y: Math.random() * canvas.height,
      vy: -(0.12 + Math.random() * 0.32),
      vx: (Math.random() - 0.5) * 0.12,
      r:  Math.random() * 1.5 + 0.4,
      o:  Math.random() * 0.5 + 0.12,
      life: Math.random() * 200,
      maxLife: 180 + Math.random() * 120,
    }))

    // resize only updates dimensions — no data reset
    const handleResize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const drawGear = (cx, cy, r, teeth, angle) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0,0,r*0.68,0,Math.PI*2)
      ctx.strokeStyle='rgba(212,175,55,0.09)'; ctx.stroke()
      ctx.beginPath(); ctx.arc(0,0,r*0.27,0,Math.PI*2)
      ctx.strokeStyle='rgba(212,175,55,0.16)'; ctx.stroke()
      ctx.strokeStyle='rgba(212,175,55,0.06)'; ctx.lineWidth=0.8
      for (let i=0;i<6;i++){
        const a=(i/6)*Math.PI*2
        ctx.beginPath()
        ctx.moveTo(Math.cos(a)*r*0.27,Math.sin(a)*r*0.27)
        ctx.lineTo(Math.cos(a)*r*0.68,Math.sin(a)*r*0.68)
        ctx.stroke()
      }
      const ta=(Math.PI*2)/teeth
      ctx.beginPath()
      for (let i=0;i<teeth;i++){
        const a=i*ta, a2=a+ta*0.42
        ctx.moveTo(Math.cos(a)*r*0.82,  Math.sin(a)*r*0.82)
        ctx.lineTo(Math.cos(a)*r,       Math.sin(a)*r)
        ctx.lineTo(Math.cos(a2)*r,      Math.sin(a2)*r)
        ctx.lineTo(Math.cos(a2)*r*0.82, Math.sin(a2)*r*0.82)
      }
      ctx.strokeStyle='rgba(212,175,55,0.13)'; ctx.lineWidth=1; ctx.stroke()
      ctx.restore()
    }

    let t=0, raf

    const animate = () => {
      const W=canvas.width, H=canvas.height
      ctx.clearRect(0,0,W,H)

      const vg=ctx.createRadialGradient(W*0.28,H*0.5,0,W*0.5,H*0.5,W*0.72)
      vg.addColorStop(0,'rgba(18,13,5,0)')
      vg.addColorStop(0.55,'rgba(10,8,4,0.12)')
      vg.addColorStop(1,'rgba(5,4,3,0.5)')
      ctx.fillStyle=vg; ctx.fillRect(0,0,W,H)

      constellationPairs.forEach(([i,j]) => {
        const b=(Math.sin(t*0.28+i)+1)/2
        ctx.beginPath()
        ctx.moveTo(stars[i].x,stars[i].y)
        ctx.lineTo(stars[j].x,stars[j].y)
        ctx.strokeStyle=`rgba(212,175,55,${0.025+b*0.055})`
        ctx.lineWidth=0.5; ctx.stroke()
      })

      stars.forEach((s,i) => {
        const o=Math.max(0.04,Math.min(0.8,s.baseO+Math.sin(t*s.s+i)*0.18))
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(240,230,200,${o})`; ctx.fill()
        if(s.r>0.95){
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.8,0,Math.PI*2)
          ctx.fillStyle=`rgba(212,175,55,${o*0.13})`; ctx.fill()
        }
      })

      gears.forEach(g => { g.angle+=g.speed; drawGear(g.x,H+g.offY,g.r,g.teeth,g.angle) })
      gearsRight.forEach(g => { g.angle+=g.speed; drawGear(W+g.offX,g.y,g.r,g.teeth,g.angle) })

      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.life++
        if(p.life>p.maxLife){ p.x=Math.random()*W*0.52; p.y=H+10; p.life=0; p.vy=-(0.12+Math.random()*0.32) }
        const fi=Math.min(1,p.life/30), fo=Math.min(1,(p.maxLife-p.life)/40)
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(212,175,55,${p.o*fi*fo})`; ctx.fill()
      })

      const sy=((t*16)%(H+60))-30
      const sg=ctx.createLinearGradient(0,sy-28,0,sy+28)
      sg.addColorStop(0,'rgba(212,175,55,0)')
      sg.addColorStop(0.5,'rgba(212,175,55,0.022)')
      sg.addColorStop(1,'rgba(212,175,55,0)')
      ctx.fillStyle=sg; ctx.fillRect(0,sy-28,W,56)

      t+=0.016
      raf=requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // CSS-in-JS string — NO @import inside (that caused 403 loop)
  const css = `
    @keyframes floatWatch  { 0%,100%{transform:translateY(0) rotate(-1.2deg)} 50%{transform:translateY(-20px) rotate(1.2deg)} }
    @keyframes ringPulse   { 0%{opacity:.55;transform:translate(-50%,-50%) scale(.9)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)} }
    @keyframes slideInR    { from{opacity:0;transform:translateX(50px)} to{opacity:1;transform:none} }
    @keyframes slideInL    { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:none} }
    @keyframes spinLoader  { to{transform:translate(-50%,-50%) rotate(360deg)} }
    @keyframes shimmerBtn  { 0%{left:-110%} 55%,100%{left:110%} }
    @keyframes topShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes badgeGlow   { 0%,100%{box-shadow:0 0 8px rgba(212,175,55,.12)} 50%{box-shadow:0 0 24px rgba(212,175,55,.38)} }
    @keyframes minHand     { to{transform:rotate(360deg)} }
    @keyframes secHand     { to{transform:rotate(360deg)} }
    @keyframes hourHand    { to{transform:rotate(360deg)} }

    .watch-float { animation:floatWatch 7s ease-in-out infinite }
    .t-ring      { position:absolute;border-radius:50%;top:50%;left:50%;animation:ringPulse 5s ease-out infinite }
    .left-panel  { animation:slideInL .9s cubic-bezier(.16,1,.3,1) both }
    .t-card      { animation:slideInR .9s cubic-bezier(.16,1,.3,1) both }

    .t-card::before {
      content:'';position:absolute;top:0;left:10%;right:10%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(212,175,55,.8),rgba(212,175,55,.4),transparent);
      background-size:200% 100%;
      animation:topShimmer 4s linear infinite;
    }
    .t-card::after {
      content:'';position:absolute;bottom:0;left:25%;right:25%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(212,175,55,.3),transparent);
    }

    .t-input {
      background:rgba(255,255,255,.055) !important;
      transition:border-color .25s,background .25s,box-shadow .25s !important;
      color:#fff !important;
    }
    .t-input:focus {
      border-color:rgba(212,175,55,.65) !important;
      background:rgba(212,175,55,.07) !important;
      box-shadow:0 0 0 3px rgba(212,175,55,.09),inset 0 1px 0 rgba(212,175,55,.10) !important;
      outline:none !important;
    }
    .t-input::placeholder { color:rgba(255,255,255,.18) !important }

    .t-btn {
      background:linear-gradient(135deg,#967618 0%,#C9A330 30%,#D4AF37 52%,#C8A025 75%,#967618 100%) !important;
      transition:opacity .2s,transform .15s,box-shadow .25s !important;
      box-shadow:0 3px 20px rgba(212,175,55,.25),0 1px 5px rgba(0,0,0,.55) !important;
    }
    .t-btn:hover:not(:disabled) {
      opacity:.92;transform:translateY(-2px);
      box-shadow:0 8px 32px rgba(212,175,55,.38),0 2px 8px rgba(0,0,0,.5) !important;
    }
    .t-btn:active:not(:disabled) { transform:scale(.985) !important }
    .t-btn::after {
      content:'';position:absolute;top:0;left:-110%;width:55%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
      animation:shimmerBtn 3.5s ease-in-out infinite;pointer-events:none;
    }

    .t-spin {
      position:absolute;top:50%;left:50%;width:17px;height:17px;
      border:1.8px solid rgba(13,11,9,.22);border-top-color:#0D0B09;
      border-radius:50%;animation:spinLoader .65s linear infinite;
    }

    .watch-min { transform-origin:100px 138px; animation:minHand  60s    steps(60) infinite }
    .watch-sec { transform-origin:100px 138px; animation:secHand  60s    linear    infinite }
    .watch-hr  { transform-origin:100px 138px; animation:hourHand 43200s linear    infinite }

    .brand-badge  { animation:badgeGlow 3s ease-in-out infinite }
    .divider-line { background:linear-gradient(180deg,transparent 0%,rgba(212,175,55,.25) 25%,rgba(212,175,55,.20) 75%,transparent 100%) }
    .eye-toggle   { background:none;border:none;cursor:pointer;padding:0;display:flex;align-items:center;opacity:.42;transition:opacity .2s }
    .eye-toggle:hover { opacity:.75 }
    .forgot-link  { color:rgba(212,175,55,.42);font-size:10px;letter-spacing:.1em;text-decoration:none;text-transform:uppercase;transition:color .2s }
    .forgot-link:hover { color:rgba(212,175,55,.75) }
  `

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-stretch"
      style={{ fontFamily:"'Jost',sans-serif", background:'#050403' }}
    >
      <style>{css}</style>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity:.88 }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 75% 85% at 27% 50%,transparent 15%,rgba(5,4,3,.52) 100%)'
      }} />

      {/* LEFT PANEL */}
      <div className="left-panel relative z-10 flex flex-col items-center justify-center"
        style={{ width:'55%', minHeight:'100vh', padding:'4rem 3rem' }}>

        <div className="watch-float relative flex items-center justify-center"
          style={{ width:580, height:580 }}>

          <div className="t-ring" style={{ width:530,height:530,border:'1.5px solid rgba(212,175,55,.09)',animationDelay:'0s' }} />
          <div className="t-ring" style={{ width:640,height:530,border:'1px solid rgba(212,175,55,.06)',animationDelay:'1.6s' }} />
          <div className="t-ring" style={{ width:750,height:750,border:'1px solid rgba(212,175,55,.035)',animationDelay:'3.2s' }} />

          <svg width="500" height="580" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="87" y="2" width="26" height="22" rx="8" stroke="#D4AF37" strokeWidth="1.8" fill="rgba(212,175,55,.07)"/>
            <rect x="92" y="0" width="16" height="8" rx="4" fill="#D4AF37" fillOpacity=".55"/>
            <line x1="100" y1="24" x2="100" y2="42" stroke="#D4AF37" strokeWidth="1.8"/>
            <path d="M100 42 Q76 32 60 19" stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="3 3" opacity=".32"/>

            <circle cx="100" cy="138" r="93" stroke="rgba(255,255,255,0.62)" strokeWidth="2.2"/>
            <circle cx="100" cy="138" r="89" stroke="#D4AF37" strokeWidth="1.2" opacity=".4"/>
            <circle cx="100" cy="138" r="85" stroke="#D4AF37" strokeWidth=".6" opacity=".18"/>
            <circle cx="100" cy="138" r="82" fill="#0C0A07"/>
            <circle cx="100" cy="138" r="82" stroke="#D4AF37" strokeWidth="2.2"/>
            <circle cx="100" cy="138" r="75" stroke="#D4AF37" strokeWidth=".9" opacity=".45"/>
            <circle cx="100" cy="138" r="71" fill="#080604"/>
            <circle cx="100" cy="138" r="71" stroke="rgba(212,175,55,.12)" strokeWidth=".5"/>
            <circle cx="100" cy="138" r="62" stroke="rgba(212,175,55,.07)" strokeWidth=".5"/>
            <circle cx="100" cy="138" r="46" stroke="rgba(212,175,55,.05)" strokeWidth=".5"/>

            <g stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" opacity=".92">
              <line x1="100" y1="68"  x2="100" y2="82"/>
              <line x1="169" y1="138" x2="155" y2="138"/>
              <line x1="100" y1="208" x2="100" y2="194"/>
              <line x1="31"  y1="138" x2="45"  y2="138"/>
            </g>
            <g stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity=".38">
              {[1,2,4,5,7,8,10,11].map(h => {
                const a=(h/12)*Math.PI*2-Math.PI/2
                return <line key={h}
                  x1={100+Math.cos(a)*71} y1={138+Math.sin(a)*71}
                  x2={100+Math.cos(a)*64} y2={138+Math.sin(a)*64}/>
              })}
            </g>

            <text x="100" y="91"  fill="#D4AF37" fontSize="9.5" fontFamily="Cormorant Garamond,serif" textAnchor="middle" opacity=".88">XII</text>
            <text x="158" y="142" fill="#D4AF37" fontSize="9.5" fontFamily="Cormorant Garamond,serif" textAnchor="middle" opacity=".88">III</text>
            <text x="100" y="190" fill="#D4AF37" fontSize="9.5" fontFamily="Cormorant Garamond,serif" textAnchor="middle" opacity=".88">VI</text>
            <text x="43"  y="142" fill="#D4AF37" fontSize="9.5" fontFamily="Cormorant Garamond,serif" textAnchor="middle" opacity=".88">IX</text>

            <circle cx="100" cy="163" r="12" stroke="#D4AF37" strokeWidth=".9" opacity=".42"/>
            <circle cx="100" cy="163" r="9"  fill="rgba(212,175,55,.035)"/>
            {[0,1,2,3].map(i => {
              const a=(i/4)*Math.PI*2
              return <line key={i}
                x1={100+Math.cos(a)*9} y1={163+Math.sin(a)*9}
                x2={100+Math.cos(a)*7} y2={163+Math.sin(a)*7}
                stroke="#D4AF37" strokeWidth=".7" opacity=".5"/>
            })}
            <line x1="100" y1="163" x2="100" y2="156" stroke="#E85A2B" strokeWidth="1" strokeLinecap="round" opacity=".85" className="watch-sec"/>

            <text x="100" y="121" fill="#D4AF37" fontSize="6.8" fontFamily="Jost,sans-serif" textAnchor="middle" letterSpacing="5.5" opacity=".68">TITAN</text>
            <text x="100" y="130" fill="rgba(212,175,55,.32)" fontSize="4.2" fontFamily="Jost,sans-serif" textAnchor="middle" letterSpacing="2.5">SINCE 1984</text>

            <line x1="100" y1="138" x2="100" y2="104" stroke="#F0E6C8" strokeWidth="3.2" strokeLinecap="round" className="watch-hr"/>
            <line x1="100" y1="138" x2="100" y2="94"  stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" className="watch-min"/>
            <line x1="100" y1="150" x2="100" y2="88"  stroke="#E85A2B" strokeWidth=".9" strokeLinecap="round" className="watch-sec" opacity=".88"/>

            <circle cx="100" cy="138" r="5"   fill="#D4AF37"/>
            <circle cx="100" cy="138" r="2.2" fill="#0D0B09"/>
            <circle cx="100" cy="138" r=".8"  fill="#D4AF37" opacity=".6"/>
            <path d="M83 218 Q100 227 117 218" stroke="#D4AF37" strokeWidth="1.4" fill="none" opacity=".42"/>
          </svg>
        </div>

        <div className="text-center select-none" style={{ marginTop:'2rem' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", color:'#F0E6C8', fontSize:'3rem', letterSpacing:'.34em', textTransform:'uppercase', fontWeight:300 }}>
            Titan
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginTop:10 }}>
            <div style={{ width:40, height:.5, background:'rgba(212,175,55,.38)' }}/>
            <span style={{ color:'rgba(212,175,55,.48)', fontSize:9, letterSpacing:'.32em', textTransform:'uppercase' }}>
              Est. 1984 · Timepiece Excellence
            </span>
            <div style={{ width:40, height:.5, background:'rgba(212,175,55,.38)' }}/>
          </div>
          <div style={{ color:'rgba(212,175,55,.22)', fontSize:8, letterSpacing:'.28em', textTransform:'uppercase', marginTop:8 }}>
            Precision · Heritage · Elegance
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="absolute divider-line z-10" style={{ left:'55%', top:'7%', bottom:'7%', width:1 }} />

      {/* RIGHT PANEL */}
      <div className="relative z-20 flex items-center justify-center"
        style={{ width:'50%', minHeight:'100vh', padding:'3rem 3.5rem' }}>

        <div className="t-card relative w-full rounded-2xl"
          style={{
            maxWidth:580,
            background:'rgba(11,9,6,.84)',
            border:'1px solid rgba(212,175,55,.22)',
            padding:'3rem 2.8rem',
            backdropFilter:'blur(28px)',
            WebkitBackdropFilter:'blur(28px)',
            boxShadow:'0 40px 90px rgba(0,0,0,.65),0 0 0 .5px rgba(212,175,55,.10),inset 0 1px 0 rgba(212,175,55,.10)',
          }}>

          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:'2rem' }}>
            <div className="brand-badge" style={{
              width:48, height:48, border:'1px solid rgba(212,175,55,.35)',
              borderRadius:14, background:'rgba(212,175,55,.07)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5"  stroke="#D4AF37" strokeWidth="1.4"/>
                <circle cx="12" cy="12" r="5.5"  stroke="rgba(212,175,55,.3)" strokeWidth=".7"/>
                <line x1="12" y1="12" x2="12" y2="6"    stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="12" y1="12" x2="15.5" y2="12" stroke="#D4AF37" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="1.3" fill="#D4AF37"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", color:'#F0E6C8', fontSize:'1.5rem', letterSpacing:'.2em', fontWeight:500 }}>
                TITAN
              </div>
              <div style={{ color:'rgba(212,175,55,.48)', fontSize:9, letterSpacing:'.24em', textTransform:'uppercase', marginTop:3 }}>
                Admin Console
              </div>
            </div>
          </div>

          <div style={{ height:.5, background:'linear-gradient(90deg,rgba(212,175,55,.28),rgba(212,175,55,.08),transparent)', marginBottom:'2rem' }} />

          <div style={{ fontFamily:"'Cormorant Garamond',serif", color:'#F0E6C8', fontSize:'1.75rem', fontStyle:'italic', marginBottom:6 }}>
            Welcome back
          </div>
          <div style={{ color:'rgba(212,175,55,.4)', fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:'2rem' }}>
            Sign in to access your dashboard
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

            {error && (
              <div style={{
                display:'flex', alignItems:'center', gap:8,
                background:'rgba(200,50,50,.09)', border:'1px solid rgba(220,80,80,.22)',
                borderRadius:12, padding:'11px 15px', color:'rgba(255,145,145,.85)', fontSize:12,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <circle cx="12" cy="16" r=".5" fill="currentColor"/>
                </svg>
                {error}
              </div>
            )}

            <div>
              <label style={{ display:'block', color:'rgba(212,175,55,.48)', fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:9 }}>
                Email Address
              </label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', opacity:.42, pointerEvents:'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                </svg>
                <input
                  type="email" value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="admin@titan.com" required
                  className="t-input"
                  style={{
                    width:'100%', paddingLeft:42, paddingRight:16, paddingTop:12, paddingBottom:12,
                    border:'1px solid rgba(212,175,55,.18)', borderRadius:12,
                    fontSize:13, boxSizing:'border-box', fontFamily:"'Jost',sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display:'block', color:'rgba(212,175,55,.48)', fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', marginBottom:9 }}>
                Password
              </label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', opacity:.42, pointerEvents:'none' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter your password" required
                  className="t-input"
                  style={{
                    width:'100%', paddingLeft:42, paddingRight:44, paddingTop:12, paddingBottom:12,
                    border:'1px solid rgba(212,175,55,.18)', borderRadius:12,
                    fontSize:13, boxSizing:'border-box', fontFamily:"'Jost',sans-serif",
                  }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="eye-toggle"
                  style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)' }}>
                  {showPassword
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div style={{ textAlign:'right', marginTop:-6 }}>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button
              type="submit" disabled={loading}
              className="t-btn"
              style={{
                position:'relative', width:'100%', padding:'14px 0', marginTop:4,
                borderRadius:12, color:'#0D0B09', fontSize:10, fontWeight:500,
                letterSpacing:'.24em', textTransform:'uppercase', overflow:'hidden',
                cursor:loading ? 'not-allowed' : 'pointer',
                opacity:loading ? .65 : 1, border:'none',
                fontFamily:"'Jost',sans-serif",
              }}>
              {loading
                ? <><span style={{ visibility:'hidden' }}>Sign In</span><span className="t-spin"/></>
                : 'Sign In'
              }
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.75rem 0 1.2rem' }}>
            <div style={{ flex:1, height:.5, background:'rgba(212,175,55,.12)' }}/>
            <span style={{ color:'rgba(212,175,55,.28)', fontSize:9, letterSpacing:'.15em', whiteSpace:'nowrap', textTransform:'uppercase' }}>
              Authorized Personnel Only
            </span>
            <div style={{ flex:1, height:.5, background:'rgba(212,175,55,.12)' }}/>
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:18 }}>
            {['256-bit SSL','Secure Session','ISO 27001'].map(label => (
              <span key={label} style={{ color:'rgba(212,175,55,.26)', fontSize:8, letterSpacing:'.1em', display:'flex', alignItems:'center', gap:5 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,.45)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}