
import React, { useEffect, useState } from 'react'
import { useStore } from '../store'

export default function Settings() {
  const user = useStore(s=>s.user)
  const saveUser = useStore(s=>s.saveUser)
  const [bw, setBw] = useState<number>(user?.bodyweight_lb ?? 205)
  const [diet, setDiet] = useState<string>(user?.diet_status ?? 'Maintenance')

  useEffect(()=>{
    if (user) {
      setBw(user.bodyweight_lb)
      setDiet(user.diet_status)
    }
  },[user])

  const save = async () => {
    await saveUser({ bodyweight_lb: bw, diet_status: diet as any })
    alert('Saved')
  }

  return (
    <div className="stack">
      <h2 className="title">Settings</h2>
      <div className="card stack">
        <label className="subtitle">Bodyweight (lb)</label>
        <input type="number" inputMode="numeric" value={bw} onChange={e=>setBw(Number(e.target.value||0))} />
        <label className="subtitle">Diet status</label>
        <select value={diet} onChange={e=>setDiet(e.target.value)}>
          <option>Maintenance</option>
          <option>Deficit</option>
          <option>Surplus</option>
          <option>Unknown</option>
        </select>
        <button className="btn primary" onClick={save}>Save</button>
      </div>
      <div className="card">
        <div className="badge">About</div>
        <div style={{color:'#a1a1aa'}}>Strength + Hypertrophy PWA • Local-first • Offline-ready</div>
      </div>
    </div>
  )
}
