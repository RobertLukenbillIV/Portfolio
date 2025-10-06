// apps/frontend/src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Links from './pages/Links'
import AdminDashboard from './pages/AdminDashboard'
import PostEditor from './pages/PostEditor' // <-- create this file (see below)

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/links" element={<Links />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<PostEditor mode="create" />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/posts/:id/edit" element={<PostEditor mode="edit" />} />
      </Routes>
    </>
  )
}
