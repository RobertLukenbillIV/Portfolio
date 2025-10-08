// Main application component - defines routing structure and layout
// Uses React Router for client-side navigation
// Connected to: main.tsx (wrapped in AuthProvider), all page components

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'           // Persistent navigation header
import Home from './pages/Home'                    // Landing page with featured content
import Projects from './pages/Projects'            // Portfolio grid displaying all projects
import PostDetail from './pages/PostDetail'        // Individual project detail page
import About from './pages/About'                  // Dynamic about page (editable by admin)
import Links from './pages/Links'                  // Dynamic links page (editable by admin)
import AdminDashboard from './pages/AdminDashboard' // Content management interface
import PostEditor from './pages/PostEditor'        // Create/edit posts interface
import EditAbout from './pages/EditAbout'          // Direct edit interface for About page
import EditLinks from './pages/EditLinks'          // Direct edit interface for Links page
import Login from './routes/Login'                 // Authentication form

export default function App() {
  return (
    <>
      {/* Persistent navigation - appears on all pages */}
      <Navbar />
      
      {/* Application routes - each corresponds to a different page/functionality */}
      <Routes>
        {/* Public routes - accessible to all visitors */}
        <Route path="/" element={<Home />} />                                    {/* Homepage with featured content */}
        <Route path="/links" element={<Links />} />                              {/* Social/contact links page */}
        <Route path="/about" element={<About />} />                              {/* About me page */}
        <Route path="/projects" element={<Projects />} />                        {/* Portfolio showcase */}
        <Route path="/projects/:id" element={<PostDetail />} />                  {/* Individual project details */}
        
        {/* Authentication route */}
        <Route path="/login" element={<Login />} />                              {/* Admin login form */}
        
        {/* Admin routes - require authentication */}
        <Route path="/admin" element={<AdminDashboard />} />                     {/* Content management */}
        <Route path="/projects/new" element={<PostEditor mode="create" />} />    {/* Create new project */}
        <Route path="/admin/posts/:id/edit" element={<PostEditor mode="edit" />} /> {/* Edit existing project */}
        <Route path="/admin/edit-about" element={<EditAbout />} />               {/* Direct edit About page */}
        <Route path="/admin/edit-links" element={<EditLinks />} />               {/* Direct edit Links page */}
      </Routes>
    </>
  )
}
