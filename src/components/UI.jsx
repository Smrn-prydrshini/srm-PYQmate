import { Link } from 'react-router-dom'
import { Search, Bookmark, Eye, Download, AlertTriangle, Inbox, RefreshCw, Loader2 } from 'lucide-react'
import { examDate, termLabel } from '../utils/formatters'

export const Skeletons = ({ n = 6 }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: n }, (_, i) => <div key={i} className="skel h-20" />)}
  </div>
)
export const EmptyState = ({ icon: Icon = Inbox, title, text, children }) => (
  <div className="rounded-lg border border-dashed border-line p-10 text-center">
    <Icon className="mx-auto mb-3 text-mute" size={28} />
    <p className="font-head text-lg">{title}</p>
    {text && <p className="mx-auto mt-1 max-w-md text-sm text-mute">{text}</p>}
    <div className="mt-4">{children}</div>
  </div>
)
export const ErrorState = ({ message, onRetry }) => (
  <div role="alert" className="rounded-lg border border-red-400/30 bg-red-400/5 p-6 text-center">
    <AlertTriangle className="mx-auto mb-2 text-red-300" size={26} />
    <p className="font-head">Something went wrong</p>
    <p className="mt-1 text-sm text-mute">{message}</p>
    {onRetry && <button className="btn mt-4" onClick={onRetry}><RefreshCw size={15} />Try again</button>}
  </div>
)
export const LoadMore = ({ hasMore, loading, onClick }) => hasMore ? (
  <div className="mt-5 text-center"><button className="btn" disabled={loading} onClick={onClick}>{loading && <Loader2 size={15} className="animate-spin" />}Load more</button></div>
) : null

export function SearchBar({ value, onChange, placeholder = 'Search by course code or name', big }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search courses</span>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mute" size={big ? 20 : 17} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full rounded-lg border border-line bg-card pl-11 pr-4 outline-none focus:border-accent ${big ? 'py-4 text-lg' : 'py-2.5'}`} />
    </label>
  )
}

// Course code sits in its own "ticket stub" column – the code is how students identify subjects.
export function CourseCard({ c }) {
  return (
    <Link to={`/course/${encodeURIComponent(c.course_code)}`} className="flex overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-accent">
      <div className="flex w-28 shrink-0 items-center justify-center border-r border-dashed border-line bg-bg2 px-2 text-center font-head text-sm font-semibold text-accent break-all">{c.course_code}</div>
      <div className="min-w-0 p-3">
        <p className="line-clamp-2 font-medium leading-snug">{c.course_name}</p>
        <p className="mt-1 truncate text-xs text-mute">{[c.semester ? `Semester ${c.semester}` : null, c.department].filter(Boolean).join(' · ') || 'Semester not specified'}</p>
      </div>
    </Link>
  )
}

export function PaperRow({ p, bookmarked, onBookmark, onDownload, busy }) {
  const meta = [examDate(p), termLabel(p.exam_term), p.session_label, p.publisher].filter(Boolean)
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-card p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug">{p.title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {meta.map((m, i) => <span key={i} className={`rounded px-2 py-0.5 text-xs ${i === 0 ? 'bg-accent/15 text-accent' : 'bg-elev text-mute'}`}>{m}</span>)}
        </div>
        {p.course_name && <p className="mt-2 text-xs text-mute">{p.course_code} · {p.course_name}</p>}
      </div>
      <div className="flex gap-2">
        <Link to={`/paper/${p.id}`} className="btn btn-primary"><Eye size={15} />Preview</Link>
        {onDownload && <button className="btn" onClick={onDownload} disabled={busy} aria-label="Download PDF">{busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}</button>}
        <button className="btn" onClick={onBookmark} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark paper'}>
          <Bookmark size={15} className={bookmarked ? 'fill-mint text-mint' : ''} />
        </button>
      </div>
    </div>
  )
}
