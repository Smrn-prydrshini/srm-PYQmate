import { useEffect, useState } from 'react'
import { read, write } from '../utils/storage'
const subs = new Set()
function useList(key) {
  const [, tick] = useState(0)
  useEffect(() => { const f = () => tick((x) => x + 1); subs.add(f); return () => subs.delete(f) }, [])
  const save = (l) => { write(key, l); subs.forEach((f) => f()) }
  return [read(key), save]
}
export function useBookmarks() {
  const [items, save] = useList('pyqmate:bookmarks')
  const has = (id) => items.some((p) => p.id === id)
  const toggle = (p) => save(has(p.id) ? items.filter((x) => x.id !== p.id) : [p, ...items])
  return { items, has, toggle }
}
export function useRecent() {
  const [items, save] = useList('pyqmate:recent')
  return { items, add: (p) => save([p, ...items.filter((x) => x.id !== p.id)].slice(0, 12)), clear: () => save([]) }
}
