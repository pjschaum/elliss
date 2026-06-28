import { Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Give from './pages/Give'
import Help from './pages/Help'
import EventDetail from './pages/EventDetail'
import OrgDetail from './pages/OrgDetail'
import ResourceDetail from './pages/ResourceDetail'
import ProgramDetail from './pages/ProgramDetail'
import CourseDetail from './pages/CourseDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
      <Route path="/give" element={<Give />} />
      <Route path="/give/event/:id" element={<EventDetail />} />
      <Route path="/give/org/:id" element={<OrgDetail />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/resource/:id" element={<ResourceDetail />} />
      <Route path="/help/program/:id" element={<ProgramDetail />} />
      <Route path="/help/course/:id" element={<CourseDetail />} />
    </Routes>
  )
}
