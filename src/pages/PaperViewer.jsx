import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Download, FileX, Loader2 } from 'lucide-react'
import { api, primaryFile } from '../services/api'
import { useBookmarks, useRecent } from '../hooks/useStore'
import { slimPaper, examDate, termLabel } from '../utils/formatters'
import { ErrorState, EmptyState } from '../components/UI'
import { downloadPaper } from '../utils/download'

export default function PaperViewer() {
  const { id } = useParams()
  const nav = useNavigate()
  const [s, setS] = useState({ loading: true })
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState(null)
  const bm = useBookmarks(), recent = useRecent()
  const load = useCallback(async () => {
    setS({ loading: true })
    try {
      const paper = (await api.paper(id)).data
      const slim = slimPaper(paper, paper.course)
      recent.add(slim)
      let url = null, noFile = false
      try {
        const f = primaryFile((await api.files(id)).data)
        if (!f) noFile = true
        else url = (await api.download(f.id)).data?.download_url // fresh every visit
      } catch (e) { return setS({ slim, fileError: e.message }) }
      setS({ slim, url: url?.startsWith('https://') ? url : null, noFile: noFile || !url })
    } catch (e) { setS({ error: e.message }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => { load() }, [load])
  const p = s.slim
  const dl = async () => { setBusy(true); setMsg(null); try { await downloadPaper(id) } catch (e) { setMsg(e.message) } setBusy(false) }
  if (s.error) return <ErrorState message={s.error} onRetry={load} />
  return (
    <div className="space-y-4">
      <button className="btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))}><ArrowLeft size={15} />Back</button>
      {p ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-head text-2xl font-bold leading-tight">{p.title}</h1>
            <p className="mt-1 text-sm text-mute"><Link className="text-accent hover:underline" to={`/course/${encodeURIComponent(p.course_code || '')}`}>{p.course_code}</Link> · {p.course_name}</p>
            <p className="mt-1 text-sm text-mute">{[examDate(p), termLabel(p.exam_term), p.session_label, p.publisher].filter(Boolean).join(' · ')}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={dl} disabled={busy || !!s.noFile}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}Download</button>
            <button className="btn" onClick={() => bm.toggle(p)} aria-pressed={bm.has(p.id)}><Bookmark size={15} className={bm.has(p.id) ? 'fill-mint text-mint' : ''} />{bm.has(p.id) ? 'Saved' : 'Save'}</button>
          </div>
        </div>
      ) : <div className="skel h-20" />}
      {msg && <p role="alert" className="rounded-md border border-red-400/30 bg-red-400/5 p-3 text-sm">{msg}</p>}
      {s.loading ? <div className="skel flex h-[70vh] items-center justify-center text-sm text-mute">Loading paper… the server can take a few seconds to wake up.</div>
        : s.fileError ? <ErrorState message={s.fileError} onRetry={load} />
        : s.noFile ? <EmptyState icon={FileX} title="No PDF available" text="This paper has no usable PDF file, so it can't be previewed." />
        : (<>
            <iframe title={p.title} src={s.url} className="h-[75vh] w-full rounded-lg border border-line bg-white" />
            <p className="text-xs text-mute">PDF not showing? Your browser may block embedded PDFs – use Download. Links expire after about 15 minutes; <button className="underline" onClick={load}>refresh the link</button> if it stops working.</p>
          </>)}
    </div>
  )
}
