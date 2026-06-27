import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Give from './pages/Give'
import Help from './pages/Help'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/give" element={<Give />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  )
}
