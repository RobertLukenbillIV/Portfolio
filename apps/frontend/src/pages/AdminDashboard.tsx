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
  
  // Save status tooltips for page reload approach
  
  // Image management state
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showImageBrowser, setShowImageBrowser] = useState<string | null>(null) // page name when browsing
  const [browsingForMultiple, setBrowsingForMultiple] = useState(false)
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  
  // Save status tooltips
  const [showSaveTooltip, setShowSaveTooltip] = useState<{show: boolean, message: string}>({show: false, message: ''})
  
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
      
      // Load social media URLs from backend, fallback to localStorage, then defaults
      setGithubUrl(settings.githubUrl || localStorage.getItem('admin_github_url') || 'https://github.com/RobertLukenbillIV')
      setLinkedinUrl(settings.linkedinUrl || localStorage.getItem('admin_linkedin_url') || 'https://linkedin.com/in/robert-lukenbill')
      
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

    // Load available images for browsing
    api.get('/upload/list').then(r => {
      if (r.data && r.data.images) {
        setAvailableImages(r.data.images)
      }
    }).catch(err => {
      console.log('No uploaded images found or upload endpoint not available')
      setAvailableImages([])
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
      
      // Show tooltip and reload page
      setShowSaveTooltip({show: true, message: 'Settings saved successfully!'})
      setTimeout(() => {
        window.location.reload()
      }, 1500)
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
      // Get current settings first
      const currentSettings = await api.get('/settings')
      const settings = currentSettings.data.settings || {}
      
      // Update settings with new social media URLs
      await api.put('/settings', {
        ...settings,
        githubUrl,
        linkedinUrl
      })
      
      // Also store in localStorage as backup
      localStorage.setItem('admin_github_url', githubUrl)
      localStorage.setItem('admin_linkedin_url', linkedinUrl)
      
      // Trigger a custom event to notify Footer component of changes
      window.dispatchEvent(new CustomEvent('socialMediaUpdated', {
        detail: { githubUrl, linkedinUrl }
      }))
      
      // Show tooltip and reload page to Social Media tab
      setShowSaveTooltip({show: true, message: 'Social media links saved successfully!'})
      setTimeout(() => {
        window.location.reload()
      }, 1500)
      
    } catch (err) {
      console.error('Failed to save social media settings:', err)
      alert('Failed to save social media links. Please try again.')
    } finally {
      setSavingSocial(false)
    }
  }

  // Handle tooltip auto-hide with useEffect to avoid closure issues
  useEffect(() => {
    if (showSaveTooltip.show) {
      const timeoutId = setTimeout(() => {
        setShowSaveTooltip({show: false, message: ''})
      }, 3000)
      
      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [showSaveTooltip.show])

  // Legacy tooltip for backward compatibility
  useEffect(() => {
    if (showSuccessTooltip) {
      console.log('Tooltip is now visible, setting timeout')
      
      // Debug: Check if tooltip element exists in DOM
      setTimeout(() => {
        const tooltipElement = document.getElementById('success-tooltip')
        console.log('Tooltip element in DOM:', tooltipElement)
        if (tooltipElement) {
          console.log('Tooltip computed styles:', window.getComputedStyle(tooltipElement))
        }
      }, 100)
      
      const timeoutId = setTimeout(() => {
        console.log('Hiding tooltip after 3 seconds')
        setShowSuccessTooltip(false)
      }, 3000)
      
      return () => {
        console.log('Cleaning up tooltip timeout')
        clearTimeout(timeoutId)
      }
    }
  }, [showSuccessTooltip])

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

  // Reusable function to render ImageManager for any page
  const renderImageManager = (page: keyof typeof heroImages, title: string, icon: string, description: string) => {
    return (
      <Card title={`${icon} ${title}`} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Switch
              checked={imageMode[page] === 'multiple'}
              onChange={(checked) => updateImageMode(page, checked ? 'multiple' : 'single')}
              label="Multiple Images (Cycle on Reload)"
              color="primary"
            />
          </div>
          
          {imageMode[page] === 'single' ? (
            <div>
              <ImageManager
                value={heroImages[page][0] || ''}
                onChange={(url) => updateHeroImages(page, url ? [url] : [])}
                label={`${title} Hero Image`}
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                {description}
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <TextInput
                  placeholder="Enter image URL to add..."
                  value={newImageUrls[page]}
                  onChange={(e) => setNewImageUrls(prev => ({ ...prev, [page]: e.target.value }))}
                />
                <Button
                  variant="primary"
                  onClick={() => addHeroImage(page)}
                  disabled={!newImageUrls[page].trim()}
                >
                  Add
                </Button>
              </div>
              
              {heroImages[page].length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Current Images:</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {heroImages[page].map((url, index) => (
                      <div key={index} style={{ 
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color, #e1e5e9)'
                      }}>
                        <img 
                          src={url} 
                          alt={`${title} ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={() => removeHeroImage(page, index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)', 
                    marginTop: '0.5rem' 
                  }}>
                    Multiple images that will cycle randomly on page reload.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    )
  }

  // New image management functions
  const addImageFromUrl = () => {
    if (newImageUrl.trim()) {
      setAvailableImages(prev => {
        if (!prev.includes(newImageUrl.trim())) {
          return [...prev, newImageUrl.trim()]
        }
        return prev
      })
      setNewImageUrl('')
    }
  }

  const openImageBrowser = (page: string, multiple: boolean = false) => {
    setShowImageBrowser(page)
    setBrowsingForMultiple(multiple)
    setSelectedImages([])
  }

  const selectImage = (imageUrl: string) => {
    if (browsingForMultiple) {
      setSelectedImages(prev => 
        prev.includes(imageUrl) 
          ? prev.filter(url => url !== imageUrl)
          : [...prev, imageUrl]
      )
    } else {
      // Single selection
      updateHeroImages(showImageBrowser as keyof typeof heroImages, [imageUrl])
      setShowImageBrowser(null)
    }
  }

  const confirmMultipleSelection = () => {
    if (showImageBrowser && selectedImages.length > 0) {
      updateHeroImages(showImageBrowser as keyof typeof heroImages, selectedImages)
      setShowImageBrowser(null)
      setSelectedImages([])
    }
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
          {renderImageManager('home', 'Homepage Hero Images', '🏠', 'Single image that appears at the top of your homepage.')}

          {/* Projects Page Images */}
          {renderImageManager('projects', 'Projects Page Hero Images', '💼', 'Single image for the projects page header.')}

          {/* Admin Dashboard Images */}
          {renderImageManager('admin', 'Admin Dashboard Hero Images', '⚙️', 'Single image for the admin dashboard header.')}

          {/* About Page Images */}
          {renderImageManager('about', 'About Page Hero Images', '👤', 'Single image for the about page header.')}

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
              id="success-tooltip"
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                animation: 'slideInUp 0.3s ease-out',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: '1px solid #059669',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '200px',
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: '1rem' }}>✅</span>
              Saved successfully!
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

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '600px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>
                Select {browsingForMultiple ? 'Multiple Images' : 'Image'} for {showImageBrowser}
              </h3>
              <button
                onClick={() => setShowImageBrowser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>
            
            {availableImages.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary, #7f8c8d)' }}>
                No images available. Upload some images first.
              </p>
            ) : (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {availableImages.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => selectImage(url)}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedImages.includes(url) 
                          ? '3px solid var(--primary-color, #3498db)'
                          : '1px solid var(--border-color, #e1e5e9)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={url}
                        alt={`Available ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {selectedImages.includes(url) && (
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'var(--primary-color, #3498db)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {browsingForMultiple && (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button
                      variant="ghost"
                      onClick={() => setShowImageBrowser(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={confirmMultipleSelection}
                      disabled={selectedImages.length === 0}
                    >
                      Select {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Success Tooltip */}
      {showSaveTooltip.show && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          animation: 'slideInUp 0.3s ease-out',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          {showSaveTooltip.message}
        </div>
      )}
    </div>
  )
}
