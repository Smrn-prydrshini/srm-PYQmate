import { useCallback, useEffect, useRef, useState } from 'react'
export function useDebounce(v, ms = 350) {
  const [d, setD] = useState(v)
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t) }, [v, ms])
  return d
}
// Generic cursor-paginated loader. fn(cursor) -> { data, page, course? }
export function usePaged(fn, deps) {
  const [s, setS] = useState({ items: [], hasMore: false, loading: true, error: null, course: null })
  const cursor = useRef(null), ticket = useRef(0)
  const load = useCallback(async (reset) => {
    const me = ++ticket.current
    if (reset) cursor.current = null
    setS((p) => ({ ...p, items: reset ? [] : p.items, loading: true, error: null }))
    try {
      const r = await fn(reset ? undefined : cursor.current)
      if (me !== ticket.current) return // stale response
      cursor.current = r.page?.next_cursor ?? null
      setS((p) => ({ items: [...p.items, ...(r.data || [])], hasMore: !!r.page?.has_more, loading: false, error: null, course: r.course ?? p.course }))
    } catch (e) { if (me === ticket.current) setS((p) => ({ ...p, loading: false, error: e.message })) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => { load(true) }, [load])
  return { ...s, loadMore: () => load(false), retry: () => load(s.items.length === 0) }
}
