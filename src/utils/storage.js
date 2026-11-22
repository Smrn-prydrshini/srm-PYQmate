// localStorage helpers. Only paper/course metadata is stored – never signed URLs.
export const read = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : [] } catch { return [] } }
export const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage full or blocked */ } }
