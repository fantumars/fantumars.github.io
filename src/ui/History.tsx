
import React, { useEffect, useState } from 'react'
import { db } from '../db'

export default function History() {
  const [list, setList] = useState<any[]>([])
  useEffect(()=>{
    (async ()=>{
      const w = await db.workouts.orderBy('date').reverse().toArray()
      setList(w)
    })()
  },[])
  return (
    <div className="stack">
      <h2 className="title">History</h2>
      {list.length===0 && <div className="card">No sessions yet.</div>}
      {list.map(w=>(
        <div className="card row" key={w.id} style={{justifyContent:'space-between'}}>
          <div>
            <div style={{fontWeight:700}}>{w.type} — {w.date}</div>
            <div className="subtitle">{w.calories} kcal</div>
          </div>
        </div>
      ))}
    </div>
  )
}
