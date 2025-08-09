
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { useStore } from '../store'
import { todayISO, uid } from '../util'

export default function Log() {
  const nav = useNavigate()
  const { state } = useLocation() as any
  const plan = state?.plan
  const addWorkout = useStore(s=>s.addWorkout)
  const [date, setDate] = useState<string>(todayISO())
  const [type, setType] = useState<'FullBody'|'Upper'|'Lower'>(plan?.workout_type || 'FullBody')
  const [blocks, setBlocks] = useState<any[]>([])
  const [exMap, setExMap] = useState<Map<string, any>>(new Map())

  useEffect(()=>{
    (async ()=>{
      const exs = await db.exercises.toArray()
      setExMap(new Map(exs.map(e=>[e.id, e])))
      if (plan) {
        setBlocks(plan.plan.map((p:any)=>({
          id: uid(),
          exercise_id: p.exercise_id,
          target_sets: p.sets,
          target_rep_low: p.rep_low,
          target_rep_high: p.rep_high,
          target_load_lb: p.target_load_lb,
          sets: Array.from({length: p.sets}).map((_,i)=>({ reps: p.rep_low, load_lb: p.target_load_lb || 0, rpe: 8 }))
        })))
      }
    })()
  },[])

  const caloriesPreview = useMemo(()=>{
    // quick live tally
    let total = 0
    for (const b of blocks) {
      const ex = exMap.get(b.exercise_id)
      const mf = ex?.movement_factor ?? 1
      for (const s of b.sets) total += s.load_lb * s.reps * mf
    }
    return Math.round(total * 0.0052)
  },[blocks, exMap])

  const save = async () => {
    const wId = await addWorkout({ date, type }, blocks)
    nav('/', { replace: true })
  }

  const updateSet = (bid: string, sidx: number, field: 'reps'|'load_lb'|'rpe', val: number) => {
    setBlocks(prev => prev.map(b => b.id===bid ? {...b, sets: b.sets.map((s:any,i:number)=> i===sidx ? {...s, [field]: val} : s)} : b))
  }

  return (
    <div className="stack">
      <h2 className="title">Log Workout</h2>
      <div className="card stack">
        <div className="row">
          <div className="stack" style={{flex:1}}>
            <label className="subtitle">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="stack" style={{flex:1}}>
            <label className="subtitle">Type</label>
            <select value={type} onChange={e=>setType(e.target.value as any)}>
              <option>FullBody</option>
              <option>Upper</option>
              <option>Lower</option>
            </select>
          </div>
        </div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div className="badge">Live calories</div>
          <div style={{fontWeight:800}}>{caloriesPreview} kcal</div>
        </div>
      </div>

      {blocks.map((b:any)=>{
        const ex = exMap.get(b.exercise_id)
        return (
          <div className="card stack" key={b.id}>
            <div style={{fontWeight:700}}>{ex?.name || b.exercise_id}</div>
            <div className="subtitle">{b.target_sets} x {b.target_rep_low}-{b.target_rep_high}{b.target_load_lb?` @ ~${b.target_load_lb} lb`:''}</div>
            <div className="stack">
              {b.sets.map((s:any, i:number)=>(
                <div className="row" key={i}>
                  <input type="number" inputMode="numeric" value={s.reps} onChange={e=>updateSet(b.id,i,'reps', Number(e.target.value||0))} placeholder="Reps" />
                  <input type="number" inputMode="numeric" value={s.load_lb} onChange={e=>updateSet(b.id,i,'load_lb', Number(e.target.value||0))} placeholder="Load (lb)" />
                  <input type="number" inputMode="numeric" value={s.rpe} onChange={e=>updateSet(b.id,i,'rpe', Number(e.target.value||0))} placeholder="RPE" />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <button className="btn primary" onClick={save}>Save Session</button>
    </div>
  )
}
