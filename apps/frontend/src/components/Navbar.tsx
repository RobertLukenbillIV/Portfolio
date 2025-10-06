import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth' // your auth context
import { api } from '../lib/api'

export default function Navbar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    const ok = window.confirm('Are you sure you want to log out?')
    if (!ok) return
    await api.post('/auth/logout')
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-fern text-mocha border-b border-eucalyptus/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="font-bold tracking-wide text-mocha hover:opacity-90">My Portfolio</Link>

        <div className="flex items-center gap-4 text-sage">
          <NavLink to="/" className="hover:text-mocha">Home</NavLink>
          <NavLink to="/links" className="hover:text-mocha">Links</NavLink>
          <NavLink to="/projects" className="hover:text-mocha">Projects</NavLink>
          <NavLink to="/about" className="hover:text-mocha">About Me</NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className="hover:text-mocha">Admin</NavLink>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sage/90">Hello, <span className="text-mocha font-medium">{user.name ?? user.email}</span></span>
              <button onClick={handleLogout} className="px-3 py-1 rounded-lg bg-eucalyptus text-dark hover:opacity-90">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="px-3 py-1 rounded-lg bg-eucalyptus text-dark hover:opacity-90">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
