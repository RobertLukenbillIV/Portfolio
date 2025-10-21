// Individual post/project detail page component
// Displays full content for a specific project with edit capabilities for admins
// Connected to: backend GET /api/posts/:id endpoint, Home/Projects page links

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '@/lib/api'
import { Hero, Card } from '@/components/AcmeUI'

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
      .then(r => setPost(r.data.post))
      .catch(err => {
        console.error('Failed to load post:', err)
        setError(err.response?.status === 404 ? 'Post not found' : 'Failed to load post')
      })
      .finally(() => setLoading(false))
  }, [id])

  // Loading state
  if (loading) {
    return (
      <div>
        <Hero 
          title="Loading..."
          variant="static"
          height="30vh"
        />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading project details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !post) {
    return (
      <div>
        <Hero 
          title="Project Not Found"
          subtitle={error || 'The requested project could not be found'}
          variant="static"
          height="40vh"
        />
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <Card
            title="Error"
            footer={
              <button 
                onClick={() => navigate('/projects')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-color, #2c3e50)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Back to Projects
              </button>
            }
          >
            <p style={{ textAlign: 'center', margin: '1rem 0' }}>
              {error || 'Post not found'}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div>
      {/* Custom hero section with full image display and letterboxing */}
      <div style={{
        height: '60vh',
        backgroundColor: 'var(--hero-letterbox-bg, var(--background-color, #ffffff))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background image with contain sizing for full image display */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${post.coverUrl || "https://picsum.photos/1920/800?random=project"})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} />
      </div>

      <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        {/* Project title */}
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          margin: '0 0 2rem 0',
          color: 'var(--text-primary, #2c3e50)',
          textAlign: 'center'
        }}>
          {post.title}
        </h1>

        {/* Project metadata */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'var(--card-background, #f8f9fa)',
          borderRadius: '8px'
        }}>
          <div>
            <small style={{ color: 'var(--text-secondary, #7f8c8d)' }}>
              Published {formatDate(post.createdAt)}
            </small>
            {post.updatedAt !== post.createdAt && (
              <small style={{ 
                display: 'block', 
                color: 'var(--text-secondary, #7f8c8d)' 
              }}>
                Updated {formatDate(post.updatedAt)}
              </small>
            )}
          </div>
          
          {user?.role === 'ADMIN' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => navigate(`/admin/posts/${id}/edit`)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--primary-color, #2c3e50)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                ✏️ Edit
              </button>
            </div>
          )}
        </div>

        {/* Project Summary */}
        <Card title="Project Summary">
          <div 
            style={{ 
              lineHeight: '1.6',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </Card>

        {/* Project content */}
        <Card title="Project Details">
          <div 
            style={{ 
              lineHeight: '1.7',
              fontSize: '1.1rem'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Card>
        
        {/* Navigation footer */}
        <div style={{ 
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-color, #e5e7eb)'
        }}>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: 'var(--primary-color, #2c3e50)',
              border: '2px solid var(--primary-color, #2c3e50)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    </div>
  )
}
