import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Give from './pages/Give'
import Help from './pages/Help'
import EventDetail from './pages/EventDetail'
import OrgDetail from './pages/OrgDetail'
import ResourceDetail from './pages/ResourceDetail'
import ProgramDetail from './pages/ProgramDetail'
import CourseDetail from './pages/CourseDetail'
import HelpOrgDetail from './pages/HelpOrgDetail'
import ProgressScreen from './pages/ProgressScreen'
import QuickResources from './pages/QuickResources'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import InstallBanner from './components/InstallBanner'

/* ── Session guard: redirects unauthenticated users to / ── */
function Protected({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still loading
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null // loading — render nothing briefly
  if (!session) return <Navigate to="/" state={{ from: location }} replace />
  return children
}

export default function App() {
  return (
    <>
    <InstallBanner />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Auth />} />
      <Route path="/quick-resources" element={<QuickResources />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Protected */}
      <Route path="/home" element={<Protected><Home /></Protected>} />
      <Route path="/give" element={<Protected><Give /></Protected>} />
      <Route path="/give/event/:id" element={<Protected><EventDetail /></Protected>} />
      <Route path="/give/org/:id" element={<Protected><OrgDetail /></Protected>} />
      <Route path="/help" element={<Protected><Help /></Protected>} />
      <Route path="/help/resource/:id" element={<Protected><ResourceDetail /></Protected>} />
      <Route path="/help/program/:id" element={<Protected><ProgramDetail /></Protected>} />
      <Route path="/help/course/:id" element={<Protected><CourseDetail /></Protected>} />
      <Route path="/help/org/:id" element={<Protected><HelpOrgDetail /></Protected>} />
      <Route path="/help/progress" element={<Protected><ProgressScreen /></Protected>} />
    </Routes>
    </>
  )
}
