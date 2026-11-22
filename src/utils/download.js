import { api, primaryFile } from '../services/api'
// Gets a fresh signed URL right before downloading. The URL is used immediately and never stored.
export async function downloadPaper(paperId) {
  const files = (await api.files(paperId)).data || []
  const f = primaryFile(files)
  if (!f) throw new Error('No PDF is attached to this paper.')
  const d = (await api.download(f.id)).data
  if (!d?.download_url || !d.download_url.startsWith('https://')) throw new Error('The download link is unavailable. Try again.')
  const a = document.createElement('a')
  a.href = d.download_url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.download = ''
  document.body.appendChild(a); a.click(); a.remove()
}
