import { Bookmark, Clock, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBookmarks, useRecent } from '../hooks/useStore'
import { PaperRow, EmptyState } from '../components/UI'
import { useState } from 'react'
import { downloadPaper } from '../utils/download'

export function PaperList({ items, bm, empty }) {
  const [busy, setBusy] = useState(null), [msg, setMsg] = useState(null)
  const dl = async (p) => { setBusy(p.id); setMsg(null); try { await downloadPaper(p.id) } catch (e) { setMsg(e.message) } setBusy(null) }
  if (!items.length) return empty
  return <div className="space-y-3">{msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}{items.map((p) => <PaperRow key={p.id} p={p} bookmarked={bm.has(p.id)} onBookmark={() => bm.toggle(p)} onDownload={() => dl(p)} busy={busy === p.id} />)}</div>
}
export function Bookmarks() {
  const bm = useBookmarks()
  return (
    <div className="space-y-5">
      <h1 className="font-head text-3xl font-bold">Bookmarks</h1>
      <p className="text-sm text-mute">Saved on this device only. Clearing browser data removes them.</p>
      <PaperList items={bm.items} bm={bm} empty={<EmptyState icon={Bookmark} title="Nothing saved yet" text="Tap the bookmark icon on any paper to keep it here."><Link to="/courses" className="btn btn-primary">Find papers</Link></EmptyState>} />
    </div>
  )
}
export function RecentlyViewed() {
  const r = useRecent(), bm = useBookmarks()
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="font-head text-3xl font-bold">Recently viewed</h1>
        {r.items.length > 0 && <button className="btn" onClick={r.clear}><Trash2 size={15} />Clear history</button>}</div>
      <p className="text-sm text-mute">Your last 12 papers, stored only in this browser.</p>
      <PaperList items={r.items} bm={bm} empty={<EmptyState icon={Clock} title="No history yet" text="Papers you open will show up here."><Link to="/courses" className="btn btn-primary">Browse courses</Link></EmptyState>} />
    </div>
  )
}
