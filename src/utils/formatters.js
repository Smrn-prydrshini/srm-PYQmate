const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const monthName = (m) => (m >= 1 && m <= 12 ? M[m - 1] : null)
export const termLabel = (t) => (t ? String(t).replace(/_/g, ' / ').replace(/\b\w/g, (c) => c.toUpperCase()) : null)
export const examDate = (p) => [monthName(p.exam_month), p.exam_year].filter(Boolean).join(' ') || 'Date not listed'
export const slimPaper = (p, course) => ({ id: p.id, title: p.title, exam_year: p.exam_year ?? null, exam_month: p.exam_month ?? null, exam_term: p.exam_term ?? null, session_label: p.session_label ?? null, publisher: p.publisher ?? null, course_code: course?.course_code ?? null, course_name: course?.course_name ?? null })
