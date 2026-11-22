import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { api } from '../services/api'
import { usePaged, useDebounce } from '../hooks/useCourses'
import { CourseCard, SearchBar, Skeletons, ErrorState, EmptyState, LoadMore } from '../components/UI'

export default function CourseExplorer() {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''
  const dq = useDebounce(q.trim())
  const r = usePaged((cursor) => api.courses({ q: dq, cursor, limit: 30 }), [dq])
  return (
    <div className="space-y-5">
      <h1 className="font-head text-3xl font-bold">Courses</h1>
      <SearchBar value={q} onChange={(v) => setSp(v ? { q: v } : {}, { replace: true })} />
      {r.error ? <ErrorState message={r.error} onRetry={r.retry} /> : r.loading && !r.items.length ? <Skeletons /> :
        !r.items.length ? <EmptyState icon={SearchX} title="No courses found" text="Try a shorter name or part of the course code." /> : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{r.items.map((c) => <CourseCard key={c.id} c={c} />)}</div>
            <LoadMore hasMore={r.hasMore} loading={r.loading} onClick={r.loadMore} />
          </>
        )}
    </div>
  )
}
