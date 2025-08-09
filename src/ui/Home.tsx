
import React, { useEffect, useState } from 'react'
import { recommendNext } from '../recommend'
import { db } from '../db'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [summary, setSummary] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const nav = useNavigate()

  useEffect(()=>{
    (async ()=>{
      const last = await db.workouts.orderBy('date').reverse().first()
      setSummary(last || null)
      const rec = await recommendNext()
      setPlan(rec)
    })()
  },[])

  return (
    <div className="stack">
      <header className="stack">
        <h1 className="title">Lift</h1>
        <p className="subtitle">Strength + Hypertrophy, Apple-clean.</p>
      </header>

      <div className="card stack">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div className="badge">Next workout</div>
            <div style={{fontSize:18, fontWeight:800}}>{plan?.workout_type ?? '—'}</div>
          </div>
          <button className="btn primary" onClick={()=>nav('/log', { state: { plan } })}>Start</button>
        </div>
        {plan && (
          <div style={{fontSize:13, color:'#a1a1aa'}}>
            {plan.plan.map((p:any)=> <div key={p.exercise_id}>{p.exercise_id} — {p.sets} x {p.rep_low}-{p.rep_high}{p.target_load_lb?` @ ~${p.target_load_lb} lb`:''}</div>)}
          </div>
        )}
      </div>

      <div className="card">
        <div className="badge">Last session</div>
        {summary ? (
          <div>
            <div style={{fontWeight:700}}>{summary.type} — {summary.date}</div>
            <div style={{color:'#a1a1aa'}}>Calories: {summary.calories} kcal</div>
          </div>
        ) : <div style={{color:'#a1a1aa'}}>No sessions yet.</div>}
      </div>
    </div>
  )
}
