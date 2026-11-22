import { Route, Routes, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CourseExplorer from './pages/CourseExplorer'
import SemesterBrowser from './pages/SemesterBrowser'
import CourseDetails from './pages/CourseDetails'
import PaperViewer from './pages/PaperViewer'
import { Bookmarks, RecentlyViewed } from './pages/Library'
import { EmptyState } from './components/UI'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<CourseExplorer />} />
        <Route path="semesters" element={<SemesterBrowser />} />
        <Route path="course/:code" element={<CourseDetails />} />
        <Route path="paper/:id" element={<PaperViewer />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="recent" element={<RecentlyViewed />} />
        <Route path="*" element={<EmptyState title="Page not found"><Link className="btn" to="/">Go home</Link></EmptyState>} />
      </Route>
    </Routes>
  )
}
