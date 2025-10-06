import { useEffect, useState } from 'react'
 import { api } from '../lib/api'
 import ProjectCard from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

 export default function Projects(){
   const [posts,setPosts]=useState<any[]>([])
  const { user } = useAuth()
  const nav = useNavigate()
   useEffect(()=>{ api.get('/posts/public').then(r=>setPosts(r.data)) },[])
   return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-fern">Projects</h1>
        {user && <button className="btn btn-primary" onClick={()=>nav('/admin')}>Create New Post</button>}
      </div>
       {posts.map(p=> <ProjectCard key={p.id} post={p}/>) }
     </section>
   )
 }
