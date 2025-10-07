import { useAuth } from '@/state/auth'
import { useNavigate } from 'react-router-dom'
export default function About(){
  const { user } = useAuth()
  const nav = useNavigate()
  return (
    <article className="prose max-w-none relative">
      {user && <button className="btn btn-primary absolute right-0 -top-2" onClick={()=>nav('/admin')}>Edit</button>}
       <h1>About Me</h1>
       <p>Where I studied, places I've worked, and passion projects.</p>
       <h2>Experience</h2>
       <ul>
         <li>Customer Support Engineer → …</li>
         <li>Discord bot dev (Railway, Python) → …</li>
       </ul>
       <h2>Education</h2>
       <p>…</p>
     </article>
   )
 }
