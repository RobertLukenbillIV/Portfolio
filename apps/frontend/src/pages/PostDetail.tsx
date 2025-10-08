// Individual post/project detail page component
// Displays full content for a specific project with edit capabilities for admins
// Connected to: backend GET /api/posts/:id endpoint, Home/Projects page links

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '@/lib/api'

// Type definition for individual post data
type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  coverUrl?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function PostDetail() {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load post data when component mounts or ID changes
  useEffect(() => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    
    api.get(`/posts/${id}`)
      .then(r => setPost(r.data))
      .catch(err => {
        console.error('Failed to load post:', err)
        setError(err.response?.status === 404 ? 'Post not found' : 'Failed to load post')
      })
      .finally(() => setLoading(false))
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-brandTextMuted">Loading...</p>
      </div>
    )
  }

  // Error state
  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
        <button 
          onClick={() => navigate('/projects')}
          className="btn-primary"
        >
          Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Post header with cover image */}
      {post.coverUrl && (
        <img 
          src={post.coverUrl} 
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />
      )}
      
      {/* Post title and metadata */}
      <h1 className="text-3xl font-bold text-brandText mb-2">{post.title}</h1>
      <p className="text-brandTextMuted mb-6">{post.excerpt}</p>
      
      {/* Post content */}
      <div 
        className="prose prose-lg max-w-none text-brandTextMuted"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Admin controls */}
      {user?.role === 'ADMIN' && (
        <div className="mt-8 pt-6 border-t border-brandSteel/30 flex gap-3">
          <button
            onClick={() => navigate(`/admin/posts/${id}/edit`)}
            className="btn-primary"
          >
            Edit Post
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="btn-ghost"
          >
            Back to Projects
          </button>
        </div>
      )}
      
      {/* Navigation for non-admin users */}
      {!user && (
        <div className="mt-8 pt-6 border-t border-brandSteel/30">
          <button
            onClick={() => navigate('/projects')}
            className="btn-primary"
          >
            Back to Projects
          </button>
        </div>
      )}
    </div>
  )
}
