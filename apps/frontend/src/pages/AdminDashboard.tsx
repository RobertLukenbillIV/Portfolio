import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import ImageManager from '@/components/ImageManager'
import { RichTextEditor } from '@/components/RichText'
import { Hero, Card, TabbedCard, Button, Badge, LoadingWrapper, Avatar, Switch, TextInput } from '@/components/AcmeUI'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [intro, setIntro] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ posts: 0, featuredPosts: 0 })
  
  // Social media URLs state
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [savingSocial, setSavingSocial] = useState(false)
  const [showSuccessTooltip, setShowSuccessTooltip] = useState(false)
  
  // Hero images state for different pages
  const [heroImages, setHeroImages] = useState<{
    home: string[]
    projects: string[]
    admin: string[]
    about: string[]
  }>({
    home: [],
    projects: [],
    admin: [],
    about: []
  })
  
  // Single vs multiple image mode for each page
  const [imageMode, setImageMode] = useState<{
    home: 'single' | 'multiple'
    projects: 'single' | 'multiple'
    admin: 'single' | 'multiple'
    about: 'single' | 'multiple'
  }>({
    home: 'single',
    projects: 'single',
    admin: 'single', 
    about: 'single'
  })

  const [newImageUrls, setNewImageUrls] = useState({
    home: '',
    projects: '',
    admin: '',
    about: ''
  })

  // Admin dashboard hero image
  const [adminHeroImage, setAdminHeroImage] = useState<string>("https://picsum.photos/1920/600?random=admin")

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
      return
    }

    // Load settings
    api.get('/settings').then(r => {
      const settings = r.data.settings || {}
      setIntro(settings.homeIntro ?? '')
      
      // Load social media URLs from localStorage for now (until database migration is complete)
      setGithubUrl(localStorage.getItem('admin_github_url') ?? 'https://github.com/RobertLukenbillIV')
      setLinkedinUrl(localStorage.getItem('admin_linkedin_url') ?? 'https://linkedin.com/in/robert-lukenbill')
      
      // Load hero images - support both old single format and new multiple format
      setHeroImages({
        home: settings.homeHeroUrls ? (Array.isArray(settings.homeHeroUrls) ? settings.homeHeroUrls : [settings.homeHeroUrls]) : 
              settings.homeHeroUrl ? [settings.homeHeroUrl] : [],
        projects: settings.projectsHeroUrls ? (Array.isArray(settings.projectsHeroUrls) ? settings.projectsHeroUrls : [settings.projectsHeroUrls]) : [],
        admin: settings.adminHeroUrls ? (Array.isArray(settings.adminHeroUrls) ? settings.adminHeroUrls : [settings.adminHeroUrls]) : [],
        about: settings.aboutHeroUrls ? (Array.isArray(settings.aboutHeroUrls) ? settings.aboutHeroUrls : [settings.aboutHeroUrls]) : []
      })
      
      // Load image modes
      setImageMode({
        home: settings.homeImageMode ?? 'single',
        projects: settings.projectsImageMode ?? 'single', 
        admin: settings.adminImageMode ?? 'single',
        about: settings.aboutImageMode ?? 'single'
      })

      // Set admin dashboard hero image
      if (settings.adminHeroUrls && settings.adminHeroUrls.length > 0) {
        if (settings.adminImageMode === 'multiple' && settings.adminHeroUrls.length > 1) {
          // Random selection for multiple images
          const randomIndex = Math.floor(Math.random() * settings.adminHeroUrls.length)
          setAdminHeroImage(settings.adminHeroUrls[randomIndex])
        } else {
          // Single image mode or only one image available
          setAdminHeroImage(settings.adminHeroUrls[0])
        }
      }
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
      const settingsData = {
        homeIntro: intro,
        // Save hero images and modes
        homeHeroUrls: heroImages.home,
        projectsHeroUrls: heroImages.projects,
        adminHeroUrls: heroImages.admin,
        aboutHeroUrls: heroImages.about,
        homeImageMode: imageMode.home,
        projectsImageMode: imageMode.projects,
        adminImageMode: imageMode.admin,
        aboutImageMode: imageMode.about,
        // Maintain backward compatibility
        homeHeroUrl: heroImages.home[0] || ''
      }
      
      await api.put('/settings', settingsData)
      alert('Settings saved successfully!')
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function saveSocialMedia() {
    setSavingSocial(true)
    try {
      // Store in localStorage for now (until database migration is complete)
      localStorage.setItem('admin_github_url', githubUrl)
      localStorage.setItem('admin_linkedin_url', linkedinUrl)
      
      // Trigger a custom event to notify Footer component of changes
      window.dispatchEvent(new CustomEvent('socialMediaUpdated', {
        detail: { githubUrl, linkedinUrl }
      }))
      
      // Show success tooltip
      setShowSuccessTooltip(true)
      
      // Hide tooltip after 3 seconds with animation
      setTimeout(() => {
        setShowSuccessTooltip(false)
      }, 3000)
      
    } catch (err) {
      console.error('Failed to save social media settings:', err)
      alert('Failed to save social media links. Please try again.')
    } finally {
      setSavingSocial(false)
    }
  }

  // Helper functions for managing hero images
  const updateHeroImages = (page: keyof typeof heroImages, images: string[]) => {
    setHeroImages(prev => ({ ...prev, [page]: images }))
  }

  const addHeroImage = (page: keyof typeof heroImages) => {
    const imageUrl = newImageUrls[page].trim()
    if (imageUrl) {
      setHeroImages(prev => ({ 
        ...prev, 
        [page]: [...prev[page], imageUrl] 
      }))
      setNewImageUrls(prev => ({ ...prev, [page]: '' }))
    }
  }

  const removeHeroImage = (page: keyof typeof heroImages, index: number) => {
    setHeroImages(prev => ({ 
      ...prev, 
      [page]: prev[page].filter((_, i) => i !== index) 
    }))
  }

  const updateImageMode = (page: keyof typeof imageMode, mode: 'single' | 'multiple') => {
    setImageMode(prev => ({ ...prev, [page]: mode }))
    // If switching to single mode and multiple images exist, keep only the first one
    if (mode === 'single' && heroImages[page].length > 1) {
      setHeroImages(prev => ({ 
        ...prev, 
        [page]: prev[page].slice(0, 1) 
      }))
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
      label: 'Images',
      icon: '🖼️',
      content: (
        <div>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Hero Images Management
          </h3>
          
          {/* Home Page Images */}
          <Card title="🏠 Homepage Hero Images" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Switch
                  checked={imageMode.home === 'multiple'}
                  onChange={(checked) => updateImageMode('home', checked ? 'multiple' : 'single')}
                  label="Multiple Images (Cycle on Reload)"
                  color="primary"
                />
              </div>
              
              {imageMode.home === 'single' ? (
                <div>
                  <ImageManager
                    value={heroImages.home[0] || ''}
                    onChange={(url) => updateHeroImages('home', url ? [url] : [])}
                    label="Homepage Hero Image"
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Single image that appears at the top of your homepage.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <TextInput
                      placeholder="Enter image URL to add..."
                      value={newImageUrls.home}
                      onChange={(e) => setNewImageUrls(prev => ({ ...prev, home: e.target.value }))}
                    />
                    <Button
                      variant="primary"
                      onClick={() => addHeroImage('home')}
                      disabled={!newImageUrls.home.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Images will cycle randomly on each page reload.
                  </p>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {heroImages.home.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                        </span>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => removeHeroImage('home', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Projects Page Images */}
          <Card title="💼 Projects Page Hero Images" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Switch
                  checked={imageMode.projects === 'multiple'}
                  onChange={(checked) => updateImageMode('projects', checked ? 'multiple' : 'single')}
                  label="Multiple Images (Cycle on Reload)"
                  color="primary"
                />
              </div>
              
              {imageMode.projects === 'single' ? (
                <div>
                  <ImageManager
                    value={heroImages.projects[0] || ''}
                    onChange={(url) => updateHeroImages('projects', url ? [url] : [])}
                    label="Projects Hero Image"
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Single image for the projects page header.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <TextInput
                      placeholder="Enter image URL to add..."
                      value={newImageUrls.projects}
                      onChange={(e) => setNewImageUrls(prev => ({ ...prev, projects: e.target.value }))}
                    />
                    <Button
                      variant="primary"
                      onClick={() => addHeroImage('projects')}
                      disabled={!newImageUrls.projects.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {heroImages.projects.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                        </span>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => removeHeroImage('projects', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Admin Dashboard Images */}
          <Card title="⚙️ Admin Dashboard Hero Images" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Switch
                  checked={imageMode.admin === 'multiple'}
                  onChange={(checked) => updateImageMode('admin', checked ? 'multiple' : 'single')}
                  label="Multiple Images (Cycle on Reload)"
                  color="primary"
                />
              </div>
              
              {imageMode.admin === 'single' ? (
                <div>
                  <ImageManager
                    value={heroImages.admin[0] || ''}
                    onChange={(url) => updateHeroImages('admin', url ? [url] : [])}
                    label="Admin Dashboard Hero Image"
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Single image for the admin dashboard header.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <TextInput
                      placeholder="Enter image URL to add..."
                      value={newImageUrls.admin}
                      onChange={(e) => setNewImageUrls(prev => ({ ...prev, admin: e.target.value }))}
                    />
                    <Button
                      variant="primary"
                      onClick={() => addHeroImage('admin')}
                      disabled={!newImageUrls.admin.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {heroImages.admin.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                        </span>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => removeHeroImage('admin', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* About Page Images */}
          <Card title="👤 About Page Hero Images" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Switch
                  checked={imageMode.about === 'multiple'}
                  onChange={(checked) => updateImageMode('about', checked ? 'multiple' : 'single')}
                  label="Multiple Images (Cycle on Reload)"
                  color="primary"
                />
              </div>
              
              {imageMode.about === 'single' ? (
                <div>
                  <ImageManager
                    value={heroImages.about[0] || ''}
                    onChange={(url) => updateHeroImages('about', url ? [url] : [])}
                    label="About Page Hero Image"
                  />
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Single image for the about page header.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <TextInput
                      placeholder="Enter image URL to add..."
                      value={newImageUrls.about}
                      onChange={(e) => setNewImageUrls(prev => ({ ...prev, about: e.target.value }))}
                    />
                    <Button
                      variant="primary"
                      onClick={() => addHeroImage('about')}
                      disabled={!newImageUrls.about.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {heroImages.about.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)' }}>
                          {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                        </span>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => removeHeroImage('about', index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Button 
            disabled={saving} 
            loading={saving}
            onClick={save}
            variant="primary"
            size="large"
          >
            Save All Hero Images
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
    },
    {
      label: 'Social Media',
      icon: '🌐',
      content: (
        <div style={{ position: 'relative' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Social Media Links
          </h3>
          
          <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
            {/* GitHub URL Input */}
            <Card title="🐙 GitHub Profile">
              <TextInput
                label="GitHub URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                This URL will be displayed in the footer's GitHub button.
              </p>
            </Card>

            {/* LinkedIn URL Input */}
            <Card title="💼 LinkedIn Profile">
              <TextInput
                label="LinkedIn URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                This URL will be displayed in the footer's LinkedIn button.
              </p>
            </Card>
          </div>

          <Button 
            disabled={savingSocial} 
            loading={savingSocial}
            onClick={saveSocialMedia}
            variant="primary"
            size="large"
          >
            Save Social Media Links
          </Button>

          {/* Success Tooltip */}
          {showSuccessTooltip && (
            <div 
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                animation: 'slideInUp 0.3s ease-out'
              }}
            >
              ✅ Social media links saved successfully!
            </div>
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideOutDown {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(1rem);
            }
          }
        `}
      </style>
      <Hero 
        title="Admin Dashboard"
        subtitle="Manage your portfolio content and settings"
        variant="static"
        height="40vh"
        backgroundImage={adminHeroImage}
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
