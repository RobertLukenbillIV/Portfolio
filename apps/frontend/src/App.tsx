// Main application component - defines routing structure and layout
// Uses React Router for client-side navigation
// Connected to: main.tsx (wrapped in AuthProvider), all page components

import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/AcmeUI'      // ACME UI left sidebar navigation
import Footer from './components/Footer'             // Footer with social media links
import { useAuth } from '@/state/auth'               // Authentication state
import Home from './pages/Home'                      // Landing page with featured content
import Projects from './pages/Projects'              // Portfolio grid displaying all projects
import PostDetail from './pages/PostDetail'          // Individual project detail page
import About from './pages/About'                    // Dynamic about page (editable by admin)
import AdminDashboard from './pages/AdminDashboard'  // Content management interface
import PostEditor from './pages/PostEditor'          // Create/edit posts interface
import Login from './routes/Login'                   // Authentication form

export default function App() {
  const { user, logout } = useAuth()
  
  // Handle logout without navigation (Navigation component handles closing)
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await logout()
    // Navigation to home will happen in auth context
  }
  
  // Navigation links configuration for ACME UI sidebar
  const navigationLinks = [
    { 
      label: 'Home', 
      href: '/',
      icon: '🏠'
    },
    { 
      label: 'Projects', 
      href: '/projects',
      icon: '💼'
    },
    { 
      label: 'About', 
      href: '/about',
      icon: '👤'
    },
    ...(user?.role === 'ADMIN' ? [
      { 
        label: 'Admin', 
        href: '/admin',
        icon: '⚙️',
        children: [
          { label: 'Logout', onClick: handleLogout }
        ]
      }
    ] : []),
    ...(user ? [] : [{ 
      label: 'Login', 
      href: '/login',
      icon: '🔑' 
    }])
  ]

  return (
    <div className="min-h-screen flex">
      {/* ACME UI Left Sidebar Navigation with built-in click-outside functionality */}
      <Navigation 
        companyName="My Portfolio"
        position="left"
        variant="sidebar"
        links={navigationLinks}
      />
      
      {/* Main content area with full width */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {/* Application routes - each corresponds to a different page/functionality */}
          <Routes>
            {/* Public routes - accessible to all visitors */}
            <Route path="/" element={<Home />} />                                    {/* Homepage with featured content */}
            <Route path="/about" element={<About />} />                              {/* About me page */}
            <Route path="/projects" element={<Projects />} />                        {/* Portfolio showcase */}
            <Route path="/projects/:id" element={<PostDetail />} />                  {/* Individual project details */}
            
            {/* Authentication route */}
            <Route path="/login" element={<Login />} />                              {/* Admin login form */}
            
            {/* Admin routes - require authentication */}
            <Route path="/admin" element={<AdminDashboard />} />                     {/* Content management */}
            <Route path="/projects/new" element={<PostEditor mode="create" />} />    {/* Create new project */}
            <Route path="/admin/posts/:id/edit" element={<PostEditor mode="edit" />} /> {/* Edit existing project */}
          </Routes>
        </main>

        {/* Footer with social media links */}
        <Footer />
      </div>
    </div>
  )
}
