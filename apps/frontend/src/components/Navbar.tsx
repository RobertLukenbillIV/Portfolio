
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 export default function Navbar(){

  const { user, logout } = useAuth()
  const nav = useNavigate()
  const linkClass = ({isActive}:{isActive:boolean})=>`px-3 py-2 rounded-xl ${isActive?'bg-sage text-white':'hover:bg-sage/40'}`
  const doLogout = async () => { await logout(); nav('/') }
   return (
     <header className="nav">
       <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
         <Link to="/" className="text-xl font-bold text-mocha">RL • Portfolio</Link>
         <nav className="flex items-center gap-2">
           <NavLink to="/" className={linkClass}>Home</NavLink>
           <NavLink to="/projects" className={linkClass}>Projects</NavLink>
           <NavLink to="/about" className={linkClass}>About Me</NavLink>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">{user.name || user.email}</span>
              <button className="btn" onClick={doLogout}>Logout</button>
            </div>
          ) : (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          )}
         </nav>
       </div>
     </header>
   )
 }
