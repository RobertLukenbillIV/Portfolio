// Homepage component - displays hero image, intro text, and featured projects
// Redesigned with ACME UI components for modern, professional appearance
// Connected to: backend /settings and /posts/featured endpoints, Projects page via links

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'
import { Hero, Card } from '@/components/AcmeUI'

// Type definitions for homepage content structure
type Settings = { 
  homeHeroUrl?: string | null
  homeHeroUrls?: string[]
  homeIntro?: string | null
  homeImageMode?: 'single' | 'multiple'
}
type PostCard = { id: string; title: string; excerpt: string; coverUrl?: string | null }

// Utility function to get a random hero image
const getRandomHeroImage = (settings: Settings | null): string | undefined => {
  if (!settings) return undefined
  
  // Support new multiple images format
  if (settings.homeHeroUrls && settings.homeHeroUrls.length > 0) {
    if (settings.homeImageMode === 'multiple' && settings.homeHeroUrls.length > 1) {
      // Random selection for multiple images
      const randomIndex = Math.floor(Math.random() * settings.homeHeroUrls.length)
      return settings.homeHeroUrls[randomIndex]
    } else {
      // Single image mode or only one image available
      return settings.homeHeroUrls[0]
    }
  }
  
  // Fallback to old single image format for backward compatibility
  return settings.homeHeroUrl || undefined
}

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [featured, setFeatured] = useState<PostCard[]>([])

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.settings ?? {}))
    api.get('/posts/featured?limit=3').then(r => setFeatured(r.data.posts ?? []))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <Hero 
        backgroundImage={getRandomHeroImage(settings)}
        title="Robert Lukenbill IV"
        subtitle="Software Developer & Portfolio"
        variant="static"
        height="60vh"
      >
        {settings?.homeIntro && (
          <div 
            style={{ 
              marginTop: '1rem',
              maxWidth: '600px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'white'
            }}
            dangerouslySetInnerHTML={{ __html: settings.homeIntro }}
          />
        )}
      </Hero>

      {/* Featured Projects Section */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Featured Projects
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {featured.map(p => (
            <Card key={p.id} title={p.title}>
              {p.coverUrl && (
                <img 
                  src={p.coverUrl} 
                  alt={p.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: p.excerpt }} />
              <div style={{ marginTop: '1rem' }}>
                <Link 
                  to={`/projects/${p.id}`}
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
                  View Project
                </Link>
              </div>
            </Card>
          ))}
          
          {featured.length === 0 && (
            <Card title="No Featured Projects">
              <p style={{ textAlign: 'center', color: 'var(--text-secondary, #7f8c8d)' }}>
                No featured projects yet. Mark up to three posts as "Featured" in Admin.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}