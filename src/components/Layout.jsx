import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, Library, Layers, Bookmark, Clock, Menu, X, Search, GraduationCap } from 'lucide-react'
import { api } from '../services/api'

const nav = [['/', 'Home', Home], ['/courses', 'Courses', Library], ['/semesters', 'Semesters', Layers], ['/bookmarks', 'Bookmarks', Bookmark], ['/recent', 'Recently viewed', Clock]]

function Sidebar({ onNavigate, api: status }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2 px-2 pt-1 font-head text-xl font-bold"><GraduationCap className="text-accent" />PYQmate</div>
      <nav className="flex flex-col gap-1" aria-label="Main">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${isActive ? 'bg-elev text-ink' : 'text-mute hover:text-ink'}`}>
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2 px-2 text-xs text-mute">
        <p className="flex items-center gap-2"><span className={`size-2 rounded-full ${status === 'ok' ? 'bg-mint' : status === 'down' ? 'bg-red-400' : 'bg-mute'}`} />API {status === 'ok' ? 'online' : status === 'down' ? 'unreachable' : 'checking…'}</p>
        <p>Bookmarks and history are saved only in this browser.</p>
      </div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('checking')
  const [q, setQ] = useState('')
  const nav2 = useNavigate(), loc = useLocation()
  useEffect(() => { api.health().then((r) => setStatus(r.ok ? 'ok' : 'down')).catch(() => setStatus('down')) }, [])
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])
  const submit = (e) => { e.preventDefault(); nav2(`/courses?q=${encodeURIComponent(q.trim())}`) }
  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-bg2 lg:block"><Sidebar api={status} /></aside>
      {open && <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 left-0 w-64 bg-bg2"><Sidebar api={status} onNavigate={() => setOpen(false)} /></aside></div>}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur">
        <button className="btn lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
        <form onSubmit={submit} className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input aria-label="Search courses" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" className="w-full rounded-md border border-line bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-accent" />
        </form>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6"><Outlet /></main>
    </div>
  )
}
