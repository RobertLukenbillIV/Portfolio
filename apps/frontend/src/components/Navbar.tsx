// Navigation header component - persistent across all pages
// Handles authentication UI, role-based navigation, and user logout
// Connected to: useAuth hook for user state, React Router for navigation

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '@/lib/api'

export default function Navbar() {
  const { user, logout } = useAuth() // Get current user state and logout function
  const navigate = useNavigate()

  // Handle user logout with confirmation
  // Calls logout function from auth context and redirects to home
  async function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) return
    await logout() // Clear JWT cookie and local state
    navigate('/') // Redirect to homepage after logout
  }

  return (
    <nav className="sticky top-0 z-40 bg-brandNavy text-brandFoam border-b border-brandSteel/30">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        {/* Site logo/title - links to homepage */}
        <Link to="/" className="font-bold tracking-wide hover:opacity-90">My Portfolio</Link>

        {/* Main navigation links - public pages accessible to all visitors */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="btn-ghost">Home</NavLink>
          <NavLink to="/links" className="btn-ghost">Links</NavLink>
          <NavLink to="/projects" className="btn-ghost">Projects</NavLink>
          <NavLink to="/about" className="btn-ghost">About Me</NavLink>
          {/* Admin-only navigation - only visible to authenticated admin users */}
          {user?.role === 'ADMIN' && <NavLink to="/admin" className="btn-ghost">Admin</NavLink>}
        </div>

        {/* Authentication section - shows different UI based on login status */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            // Authenticated user UI - shows greeting and logout option
            <>
              <span className="text-brandMint/90">
                Hello, <span className="text-white font-medium">{user.name || 'Admin'}</span>
              </span>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          ) : (
            // Anonymous user UI - shows login link
            <NavLink to="/login" className="btn-primary">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
