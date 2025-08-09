
import React, { useEffect } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import Home from './Home'
import Log from './Log'
import History from './History'
import Settings from './Settings'

export default function App() {
  const init = useStore(s=>s.init)
  const ready = useStore(s=>s.ready)
  const user = useStore(s=>s.user)
  const nav = useNavigate()

  useEffect(()=>{ init() },[])
  useEffect(()=>{
    if (ready && !user) nav('/settings', { replace: true })
  },[ready,user])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/log" element={<Log/>} />
        <Route path="/history" element={<History/>} />
        <Route path="/settings" element={<Settings/>} />
      </Routes>
      <nav className="nav">
        <NavLink to="/" end className={({isActive})=> isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/log" className={({isActive})=> isActive ? 'active' : ''}>Log</NavLink>
        <NavLink to="/history" className={({isActive})=> isActive ? 'active' : ''}>History</NavLink>
        <NavLink to="/settings" className={({isActive})=> isActive ? 'active' : ''}>Settings</NavLink>
      </nav>
    </div>
  )
}
