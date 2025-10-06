import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import ProjectCard, { Post } from '@/components/ProjectCard'

export default function Projects() {
  const [posts, setPosts] = useState<Post[]>([])
  useEffect(() => {
    api.get('/posts').then(r => setPosts(r.data.posts ?? []))
  }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-3 gap-6">
      {posts.map(p => <ProjectCard key={p.id} post={p} />)}
    </div>
  )
}
