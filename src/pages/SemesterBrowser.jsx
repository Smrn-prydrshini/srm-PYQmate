import { useMemo, useState } from 'react'
import { api } from '../services/api'
import { usePaged } from '../hooks/useCourses'
import { CourseCard, SearchBar, Skeletons, ErrorState, EmptyState, LoadMore } from '../components/UI'

// The API has no semester filter, so semesters are grouped from the course data loaded so far.
export default function SemesterBrowser() {
  const r = usePaged((cursor) => api.courses({ cursor, limit: 200 }), [])
  const [sel, setSel] = useState(null)
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const g = new Map()
    r.items.forEach((c) => { const k = c.semester ?? 'none'; g.set(k, [...(g.get(k) || []), c]) })
    return [...g.entries()].sort(([a], [b]) => (a === 'none') - (b === 'none') || a - b)
  }, [r.items])
  const active = sel ?? groups[0]?.[0]
  const list = (groups.find(([k]) => k === active)?.[1] || []).filter((c) => (c.course_code + c.course_name).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="space-y-5">
      <h1 className="font-head text-3xl font-bold">Semesters</h1>
      {r.error ? <ErrorState message={r.error} onRetry={r.retry} /> : r.loading && !r.items.length ? <Skeletons n={4} /> : !r.items.length ? <EmptyState title="No courses available" /> : (
        <>
          <div className="flex flex-wrap gap-2" role="tablist">
            {groups.map(([k, cs]) => (
              <button key={k} role="tab" aria-selected={k === active} onClick={() => setSel(k)}
                className={`rounded-lg border px-4 py-3 text-left ${k === active ? 'border-accent bg-elev' : 'border-line bg-card hover:border-accent'}`}>
                <span className="block font-head text-lg">{k === 'none' ? 'Semester not specified' : `Semester ${k}`}</span>
                <span className="text-xs text-mute">{cs.length} loaded</span>
              </button>
            ))}
          </div>
          <SearchBar value={q} onChange={setQ} placeholder="Filter this semester" />
          {list.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CourseCard key={c.id} c={c} />)}</div> : <EmptyState title="No matching courses" />}
          <LoadMore hasMore={r.hasMore} loading={r.loading} onClick={r.loadMore} />
          {r.hasMore && <p className="text-center text-xs text-mute">More courses may add semesters or fill these ones. Load more to continue.</p>}
        </>
      )}
    </div>
  )
}
