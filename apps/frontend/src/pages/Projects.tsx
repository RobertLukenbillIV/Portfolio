import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { Card, Hero } from '@/components/AcmeUI'
import { useAuth } from '@/state/auth'

// Type definition for Post/Project data structure
export type Post = {
  id: string
  title: string
  excerpt: string
  coverUrl?: string | null
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function Projects() {
  const [posts, setPosts] = useState<Post[]>([])
  const { user } = useAuth()
  
  useEffect(() => {
    // Use public endpoint for regular users, admin endpoint for admins
    const endpoint = user?.role === 'ADMIN' ? '/posts' : '/posts/public'
    api.get(endpoint).then(r => setPosts(r.data.posts ?? []))
  }, [user])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/posts/${id}`)
        setPosts(prev => prev.filter(p => p.id !== id))
      } catch (err) {
        console.error('Failed to delete post:', err)
        alert('Failed to delete project. Please try again.')
      }
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await api.put(`/posts/${id}/featured`, { featured: !featured })
      setPosts(prev => prev.map(p => 
        p.id === id ? { ...p, featured: !featured } : p
      ))
    } catch (err) {
      console.error('Failed to toggle featured status:', err)
      alert('Failed to update featured status. Please try again.')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero 
        title="Projects Portfolio"
        subtitle="A collection of software development projects and experiments"
        variant="static"
        height="40vh"
        backgroundImage="https://picsum.photos/1920/600?random=projects"
      />

      {/* Projects Grid */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {user?.role === 'ADMIN' && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <Link 
              to="/projects/new"
              style={{
                display: 'inline-block',
                background: 'var(--primary-color, #2c3e50)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Create New Project
            </Link>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem'
        }}>
          {posts.map(post => (
            <Card key={post.id} title={post.title}>
              {post.coverUrl && (
                <img 
                  src={post.coverUrl} 
                  alt={post.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              
              <div 
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                style={{ marginBottom: '1rem', color: 'var(--text-secondary, #7f8c8d)' }}
              />

              {/* Project Status Indicators */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                {post.featured && (
                  <span style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    ⭐ Featured
                  </span>
                )}
                {!post.published && (
                  <span style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    📝 Draft
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Link 
                  to={`/projects/${post.id}`}
                  style={{
                    display: 'inline-block',
                    background: 'var(--primary-color, #2c3e50)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  View Details
                </Link>

                {user?.role === 'ADMIN' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link 
                      to={`/admin/posts/${post.id}/edit`}
                      style={{
                        display: 'inline-block',
                        background: '#059669',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      ✏️
                    </Link>
                    
                    <button
                      onClick={() => toggleFeatured(post.id, post.featured)}
                      style={{
                        background: post.featured ? '#f59e0b' : '#6b7280',
                        color: 'white',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      title={post.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      ⭐
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card title="No Projects Yet">
            <p style={{ textAlign: 'center', color: 'var(--text-secondary, #7f8c8d)' }}>
              {user?.role === 'ADMIN' 
                ? 'No projects have been created yet. Create your first project to get started!'
                : 'No projects are currently available. Check back later!'
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}