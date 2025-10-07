import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '@/lib/api'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    if (!confirm('Are you sure you want to log out?')) return
    await logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 bg-brandNavy text-brandFoam border-b border-brandSteel/30">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="font-bold tracking-wide hover:opacity-90">My Portfolio</Link>

        <div className="flex items-center gap-4">
          <NavLink to="/" className="btn-ghost">Home</NavLink>
          <NavLink to="/links" className="btn-ghost">Links</NavLink>
          <NavLink to="/projects" className="btn-ghost">Projects</NavLink>
          <NavLink to="/about" className="btn-ghost">About Me</NavLink>
          {user?.role === 'ADMIN' && <NavLink to="/admin" className="btn-ghost">Admin</NavLink>}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="text-brandMint/90">
                Hello, <span className="text-white font-medium">{user.name ?? user.email}</span>
              </span>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
