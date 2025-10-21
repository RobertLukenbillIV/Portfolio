import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import ImageManager from '@/components/ImageManager'
import { RichTextEditor } from '@/components/RichText'
import { Hero, Card, TabbedCard, Button, Badge, LoadingWrapper, Avatar } from '@/components/AcmeUI'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hero, setHero] = useState('')
  const [intro, setIntro] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ posts: 0, featuredPosts: 0 })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
      return
    }

    // Load settings
    api.get('/settings').then(r => {
      setHero(r.data.settings?.homeHeroUrl ?? '')
      setIntro(r.data.settings?.homeIntro ?? '')
    })

    // Load statistics
    api.get('/posts').then(r => {
      const posts = r.data.posts || []
      setStats({
        posts: posts.length,
        featuredPosts: posts.filter((p: any) => p.featured).length
      })
    })
  }, [user, navigate])

  async function save() {
    setSaving(true)
    try {
      await api.put('/settings', { homeHeroUrl: hero, homeIntro: intro })
      alert('Settings saved successfully!')
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'ADMIN') {
    return null
  }

  const dashboardTabs = [
    {
      label: 'Overview',
      icon: '📊',
      content: (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Portfolio Statistics
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              background: 'var(--card-background, #f8f9fa)', 
              borderRadius: '8px' 
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                {stats.posts}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                Total Projects
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem', 
              background: 'var(--card-background, #f8f9fa)', 
              borderRadius: '8px' 
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
                {stats.featuredPosts}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                Featured Projects <Badge variant="warning" size="small">Max 3</Badge>
              </div>
            </div>
          </div>

          <h4 style={{ marginBottom: '1rem' }}>Quick Actions</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <Link to="/projects/new" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="large" className="w-full">
                📝 Create New Project
              </Button>
            </Link>
            
            <Link to="/projects" style={{ textDecoration: 'none' }}>
              <Button variant="success" size="large" className="w-full">
                📂 Manage Projects
              </Button>
            </Link>
          </div>
        </div>
      )
    },
    {
      label: 'Homepage Settings',
      icon: '🏠',
      content: (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Hero Image</h4>
            <ImageManager
              value={hero}
              onChange={setHero}
              label="Homepage Hero Image"
            />
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary, #7f8c8d)', 
              marginTop: '0.5rem' 
            }}>
              This image appears at the top of your homepage. Upload an image or paste a URL.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Introduction Text</h4>
            <RichTextEditor 
              value={intro} 
              onChange={setIntro}
            />
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary, #7f8c8d)', 
              marginTop: '0.5rem' 
            }}>
              This text appears in the hero section on your homepage. Use it to introduce yourself or your work.
            </p>
          </div>

          <Button 
            disabled={saving} 
            loading={saving}
            onClick={save}
            variant="primary"
            size="large"
          >
            Save Homepage Settings
          </Button>
        </div>
      )
    },
    {
      label: 'Pages',
      icon: '📄',
      content: (
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Manage Static Pages</h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Link to="/admin/edit-about" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="large" className="w-full justify-start">
                <span style={{ marginRight: '1rem', fontSize: '1.5rem' }}>👤</span>
                <div className="text-left">
                  <div style={{ fontWeight: '500' }}>Edit About Page</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                    Update your personal information and biography
                  </div>
                </div>
              </Button>
            </Link>

            <Link to="/admin/edit-links" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="large" className="w-full justify-start">
                <span style={{ marginRight: '1rem', fontSize: '1.5rem' }}>🔗</span>
                <div className="text-left">
                  <div style={{ fontWeight: '500' }}>Edit Links Page</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                    Manage social media and contact links
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      )
    }
  ]

  return (
    <div>
      <Hero 
        title="Admin Dashboard"
        subtitle="Manage your portfolio content and settings"
        variant="static"
        height="40vh"
        backgroundImage="https://picsum.photos/1920/600?random=admin"
      />

      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <TabbedCard
          title="Portfolio Management"
          tabs={dashboardTabs}
          defaultTab={0}
        />
      </div>
    </div>
  )
}
