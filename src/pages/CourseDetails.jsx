import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileX } from 'lucide-react'
import { api } from '../services/api'
import { usePaged } from '../hooks/useCourses'
import { useBookmarks } from '../hooks/useStore'
import { slimPaper, termLabel } from '../utils/formatters'
import { PaperRow, Skeletons, ErrorState, EmptyState, LoadMore } from '../components/UI'
import { downloadPaper } from '../utils/download'

const Select = ({ label, value, onChange, options }) => (
  <label className="text-sm text-mute">{label}
    <select value={value} onChange={(e) => onChange(e.target.value)} className="ml-2 rounded-md border border-line bg-card px-2 py-1.5 text-ink">
      <option value="">All</option>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </label>
)

export default function CourseDetails() {
  const { code } = useParams()
  const [course, setCourse] = useState(null)
  const [cErr, setCErr] = useState(null)
  const [year, setYear] = useState(''), [term, setTerm] = useState('')
  const [busy, setBusy] = useState(null), [msg, setMsg] = useState(null)
  const bm = useBookmarks()
  useEffect(() => { setCourse(null); setCErr(null); api.course(code).then((r) => setCourse(r.data)).catch((e) => setCErr(e.message)) }, [code])
  const r = usePaged((cursor) => api.papers(code, { year, term, cursor, limit: 30 }), [code, year, term])
  // Filter options come from papers loaded so far (the API has no "list years" endpoint).
  const [seen, setSeen] = useState({ y: new Set(), t: new Set() })
  useEffect(() => { setSeen((s) => ({ y: new Set([...s.y, ...r.items.map((p) => p.exam_year).filter(Boolean)]), t: new Set([...s.t, ...r.items.map((p) => p.exam_term).filter(Boolean)]) })) }, [r.items])
  useEffect(() => setSeen({ y: new Set(), t: new Set() }), [code])
  const c = course || r.course
  const papers = useMemo(() => r.items.map((p) => slimPaper(p, c)), [r.items, c])
  const dl = async (p) => { setBusy(p.id); setMsg(null); try { await downloadPaper(p.id) } catch (e) { setMsg(e.message) } setBusy(null) }
  return (
    <div className="space-y-5">
      {cErr ? <ErrorState message={cErr} /> : (
        <div>
          <p className="font-head text-sm text-accent">{decodeURIComponent(code)}</p>
          <h1 className="font-head text-3xl font-bold">{c?.course_name || <span className="skel inline-block h-8 w-72 align-middle" />}</h1>
          <p className="mt-1 text-sm text-mute">{[course?.semester ? `Semester ${course.semester}` : 'Semester not specified', course?.department, course?.program].filter(Boolean).join(' · ')}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-4">
        <Select label="Year" value={year} onChange={setYear} options={[...seen.y].sort((a, b) => b - a).map((y) => [y, y])} />
        <Select label="Term" value={term} onChange={setTerm} options={[...seen.t].map((t) => [t, termLabel(t)])} />
      </div>
      {msg && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/5 p-3 text-sm">{msg}</p>}
      {r.error ? <ErrorState message={r.error} onRetry={r.retry} /> : r.loading && !r.items.length ? <Skeletons n={4} /> :
        !papers.length ? <EmptyState icon={FileX} title="No papers found" text={year || term ? 'No papers match these filters. Reset them to see everything.' : 'No question papers have been added for this course yet.'} /> : (
          <div className="space-y-3">{papers.map((p) => <PaperRow key={p.id} p={p} bookmarked={bm.has(p.id)} onBookmark={() => bm.toggle(p)} onDownload={() => dl(p)} busy={busy === p.id} />)}</div>
        )}
      <LoadMore hasMore={r.hasMore} loading={r.loading} onClick={r.loadMore} />
    </div>
  )
}
