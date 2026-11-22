// All API access lives here. Documented endpoints only. No credentials needed.
const BASE = '/api'
const inflight = new Map() // de-duplicates identical simultaneous requests
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function request(path, params = {}, retries = 2) {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`
  if (inflight.has(url)) return inflight.get(url)
  const run = async () => {
    for (let i = 0; ; i++) {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          const err = new Error(res.status === 404 ? 'Not found.' : res.status === 422 ? 'Invalid request.' : `Server error (${res.status}).`)
          err.status = res.status
          throw err
        }
        return await res.json()
      } catch (e) {
        const retryable = !e.status || e.status >= 500
        if (!retryable || i >= retries) throw e.status ? e : new Error('Could not reach the server. It may be waking up – try again.')
        await wait(1000 * 2 ** i + Math.random() * 300) // backoff with jitter
      }
    }
  }
  const p = run().finally(() => inflight.delete(url))
  inflight.set(url, p)
  return p
}

const enc = encodeURIComponent
export const api = {
  health: () => request('/health', {}, 0),
  courses: (p) => request('/v1/courses', p),
  course: (code) => request(`/v1/courses/${enc(code)}`),
  papers: (code, p) => request(`/v1/courses/${enc(code)}/papers`, p),
  paper: (id) => request(`/v1/papers/${enc(id)}`),
  files: (id) => request(`/v1/papers/${enc(id)}/files`),
  // Always fetched fresh – never cached or stored.
  download: (fileId) => request(`/v1/files/${enc(fileId)}/download`, { ttl_seconds: 900 }, 1),
}
export const primaryFile = (files = []) => files.find((f) => f.is_primary) || files.find((f) => f.mime_type === 'application/pdf') || null
