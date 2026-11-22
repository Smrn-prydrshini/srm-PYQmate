import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { usePaged } from '../hooks/useCourses'
import { useBookmarks, useRecent } from '../hooks/useStore'
import { CourseCard, SearchBar, PaperRow, Skeletons, ErrorState } from '../components/UI'

export default function Home() {
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const bm = useBookmarks(), recent = useRecent()
  const r = usePaged((cursor) => api.courses({ cursor, limit: 6 }), [])
  return (
    <div className="space-y-10">
      <section className="pt-4 sm:pt-8">
        <h1 className="max-w-2xl font-head text-4xl font-bold leading-tight sm:text-5xl">Find the paper before the exam finds you.</h1>
        <p className="mt-3 max-w-xl text-mute">Previous year question papers for SRM courses. Search a code, preview the PDF, save what matters.</p>
        <form className="mt-6 max-w-2xl" onSubmit={(e) => { e.preventDefault(); nav(`/courses?q=${encodeURIComponent(q.trim())}`) }}>
          <SearchBar big value={q} onChange={setQ} placeholder="Try a course code like 21CSE or a name like Networks" />
        </form>
        <div className="mt-4 flex gap-2"><Link className="btn" to="/semesters">Browse by semester</Link><Link className="btn" to="/courses">All courses</Link></div>
      </section>
      {recent.items.length > 0 && <section><div className="mb-3 flex justify-between"><h2 className="font-head text-xl">Recently viewed</h2><Link className="text-sm text-accent" to="/recent">See all</Link></div>
        <div className="space-y-3">{recent.items.slice(0, 3).map((p) => <PaperRow key={p.id} p={p} bookmarked={bm.has(p.id)} onBookmark={() => bm.toggle(p)} />)}</div></section>}
      {bm.items.length > 0 && <section><div className="mb-3 flex justify-between"><h2 className="font-head text-xl">Bookmarked</h2><Link className="text-sm text-accent" to="/bookmarks">See all</Link></div>
        <div className="space-y-3">{bm.items.slice(0, 3).map((p) => <PaperRow key={p.id} p={p} bookmarked onBookmark={() => bm.toggle(p)} />)}</div></section>}
      <section><h2 className="mb-3 font-head text-xl">Discover courses</h2>
        {r.error ? <ErrorState message={r.error} onRetry={r.retry} /> : r.loading ? <Skeletons n={6} /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{r.items.map((c) => <CourseCard key={c.id} c={c} />)}</div>}
      </section>
    </div>
  )
}
