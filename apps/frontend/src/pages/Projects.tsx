import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { Card, Hero, SearchField, Button, Badge, Switch } from '@/components/AcmeUI'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFeatured, setFilterFeatured] = useState(false)
  const [heroImage, setHeroImage] = useState<string>()
  const [projectsDescription, setProjectsDescription] = useState<string>('A collection of software development projects and experiments')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  useEffect(() => {
    // Use public endpoint for regular users, admin endpoint for admins
    const endpoint = user?.role === 'ADMIN' ? '/posts' : '/posts/public'
    
    Promise.all([
      api.get(endpoint).then(r => setPosts(r.data.posts ?? [])),
      api.get('/settings').then(r => {
        const settings = r.data.settings || {}
        
        // Load description if available
        if (settings.projectsDescription) {
          setProjectsDescription(settings.projectsDescription)
        }
        
        let imageUrl: string
        if (settings.projectsHeroUrls && settings.projectsHeroUrls.length > 0) {
          if (settings.projectsImageMode === 'multiple' && settings.projectsHeroUrls.length > 1) {
            // Random selection for multiple images
            const randomIndex = Math.floor(Math.random() * settings.projectsHeroUrls.length)
            imageUrl = settings.projectsHeroUrls[randomIndex]
          } else {
            // Single image mode or only one image available
            imageUrl = settings.projectsHeroUrls[0]
          }
        } else {
          // Fallback to default image
          imageUrl = "https://picsum.photos/1920/600?random=projects"
        }
        
        setHeroImage(imageUrl)
      })
    ]).catch(() => {
      // Fallback on error
      const fallbackImage = "https://picsum.photos/1920/600?random=projects"
      setHeroImage(fallbackImage)
    }).finally(() => setLoading(false))
  }, [user])

  // Filter posts based on search term and featured filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeatured = !filterFeatured || post.featured
    return matchesSearch && matchesFeatured
  })

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

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero 
        title="Projects Portfolio"
        subtitle={projectsDescription}
        variant="static"
        height="40vh"
        backgroundImage={heroImage}
      />

      {/* Projects Grid */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Admin Actions and Search/Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {user?.role === 'ADMIN' && (
              <Link to="/projects/new" style={{ textDecoration: 'none' }}>
                <Button variant="primary">
                  Create New Project
                </Button>
              </Link>
            )}
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <SearchField
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search projects..."
                icon={
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            
            <Switch
              checked={filterFeatured}
              onChange={setFilterFeatured}
              label="Featured Only"
              color="warning"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
            <span>
              Showing {filteredPosts.length} of {posts.length} projects
            </span>
            {searchTerm && (
              <Badge variant="primary" size="small">
                Search: "{searchTerm}"
              </Badge>
            )}
            {filterFeatured && (
              <Badge variant="warning" size="small">
                Featured Only
              </Badge>
            )}
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem'
        }}>
          {filteredPosts.map(post => (
            <Card key={post.id}>
              <div style={{ position: 'relative' }}>
                {/* Featured Badge */}
                {post.featured && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10 }}>
                    <Badge variant="warning">⭐ Featured</Badge>
                  </div>
                )}
                
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
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {post.title}
                </h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                  style={{ color: 'var(--text-secondary, #7f8c8d)' }}
                />
              </div>

              {/* Project Status Indicators */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                {!post.published && (
                  <Badge variant="secondary">Draft</Badge>
                )}
                <Badge variant="light" size="small">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Link to={`/projects/${post.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary">
                    View Details
                  </Button>
                </Link>

                {user?.role === 'ADMIN' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/admin/posts/${post.id}/edit`} style={{ textDecoration: 'none' }}>
                      <Button variant="success" size="small">
                        Edit
                      </Button>
                    </Link>
                    
                    <Button
                      variant={post.featured ? "warning" : "ghost"}
                      size="small"
                      onClick={() => toggleFeatured(post.id, post.featured)}
                    >
                      {post.featured ? '⭐' : '☆'}
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(post.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-secondary, #7f8c8d)' 
          }}>
            <h3>No projects found</h3>
            <p>
              {searchTerm || filterFeatured 
                ? 'Try adjusting your search or filters.' 
                : 'No projects have been created yet.'
              }
            </p>
            {user?.role === 'ADMIN' && !searchTerm && !filterFeatured && (
              <Link to="/projects/new" style={{ textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
                <Button variant="primary">
                  Create Your First Project
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}