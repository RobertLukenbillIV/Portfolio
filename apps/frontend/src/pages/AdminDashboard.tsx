import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import ImageManager from '@/components/ImageManager'
import ImageGallery from '@/components/ImageGallery'
import { RichTextEditor } from '@/components/RichText'
import { Hero, Card, TabbedCard, Button, Badge, LoadingWrapper, Avatar, Switch, TextInput } from '@/components/AcmeUI'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [intro, setIntro] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ posts: 0, featuredPosts: 0 })
  
  // Page descriptions state
  const [pageDescriptions, setPageDescriptions] = useState({
    home: '',
    projects: '',
    about: ''
  })
  
  // Social media links state (dynamic array)
  type SocialLink = { label: string; url: string; icon: string }
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { label: 'GitHub', url: '', icon: '🐙' },
    { label: 'LinkedIn', url: '', icon: '💼' }
  ])
  
  // Social media URLs state (legacy - keeping for backward compatibility)
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

  // Page management state
  const [pages, setPages] = useState([
    { id: '1', title: 'Home', description: 'Landing page with hero section', route: '/', order: 0 },
    { id: '2', title: 'Projects', description: 'Portfolio showcase', route: '/projects', order: 1 },
    { id: '3', title: 'About', description: 'Personal information', route: '/about', order: 2 }
  ])
  const [expandedPage, setExpandedPage] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    // Don't redirect while auth is still loading
    if (loading) return
    
    // Redirect non-admin users to home
    if (user?.role !== 'ADMIN') {
      navigate('/')
      return
    }

    // Load settings
    api.get('/settings').then(r => {
      const settings = r.data.settings || {}
      setIntro(settings.homeIntro ?? '')
      
      // Load page descriptions
      setPageDescriptions({
        home: settings.homeDescription ?? '',
        projects: settings.projectsDescription ?? '',
        about: settings.aboutDescription ?? ''
      })
      
      // Load social links from backend settings or use defaults
      if (settings.socialLinks) {
        try {
          const parsedLinks = typeof settings.socialLinks === 'string' 
            ? JSON.parse(settings.socialLinks)
            : settings.socialLinks
          setSocialLinks(parsedLinks)
        } catch (e) {
          console.error('Failed to parse social links:', e)
        }
      }
      
      // Load social media URLs from localStorage for backward compatibility
      setGithubUrl(localStorage.getItem('admin_github_url') ?? settings.githubUrl ?? 'https://github.com/RobertLukenbillIV')
      setLinkedinUrl(localStorage.getItem('admin_linkedin_url') ?? settings.linkedinUrl ?? 'https://linkedin.com/in/robert-lukenbill')
      
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
  }, [user, loading, navigate])

  async function save() {
    setSaving(true)
    try {
      const settingsData = {
        homeIntro: intro,
        // Save page descriptions
        homeDescription: pageDescriptions.home,
        projectsDescription: pageDescriptions.projects,
        aboutDescription: pageDescriptions.about,
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
      // Reload page to reflect changes
      window.location.reload()
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
      console.log('Saving social media:', { socialLinks, githubUrl, linkedinUrl })
      
      // Save to backend settings
      await api.put('/settings', {
        socialLinks: JSON.stringify(socialLinks),
        githubUrl,  // Keep for backward compatibility
        linkedinUrl // Keep for backward compatibility
      })
      
      // Also store in localStorage for backward compatibility
      localStorage.setItem('admin_github_url', githubUrl)
      localStorage.setItem('admin_linkedin_url', linkedinUrl)
      
      console.log('Stored in localStorage successfully')
      
      // Trigger a custom event to notify Footer component of changes
      window.dispatchEvent(new CustomEvent('socialMediaUpdated', {
        detail: { socialLinks, githubUrl, linkedinUrl }
      }))
      
      console.log('Dispatched custom event')
      
      // Show success tooltip
      console.log('Setting tooltip to true')
      setShowSuccessTooltip(true)
      
      // Reload page after short delay to show success message
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

  // Page management functions
  const updatePageOrder = (fromIndex: number, toIndex: number) => {
    const newPages = [...pages]
    const [movedPage] = newPages.splice(fromIndex, 1)
    newPages.splice(toIndex, 0, movedPage)
    
    const updatedPages = newPages.map((page, index) => ({
      ...page,
      order: index
    }))
    
    setPages(updatedPages)
  }

  const updatePageDetails = (pageId: string, field: 'title' | 'description', value: string) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, [field]: value } : page
    ))
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      updatePageOrder(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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

          <h4 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Page Descriptions</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)', marginBottom: '1rem' }}>
            These descriptions appear as subtitles in the hero sections of each page.
          </p>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <TextInput
              label="Home Page Description"
              value={pageDescriptions.home}
              onChange={(e) => setPageDescriptions({ ...pageDescriptions, home: e.target.value })}
              placeholder="e.g., Software Developer & Portfolio"
            />
            
            <TextInput
              label="Projects Page Description"
              value={pageDescriptions.projects}
              onChange={(e) => setPageDescriptions({ ...pageDescriptions, projects: e.target.value })}
              placeholder="e.g., A collection of software development projects"
            />
            
            <TextInput
              label="About Page Description"
              value={pageDescriptions.about}
              onChange={(e) => setPageDescriptions({ ...pageDescriptions, about: e.target.value })}
              placeholder="e.g., Learn more about me"
            />
          </div>

          <Button 
            variant={saving ? 'secondary' : 'success'}
            onClick={save}
            disabled={saving}
            size="large"
          >
            {saving ? 'Saving...' : '💾 Save Settings'}
          </Button>
        </div>
      )
    },
    {
      label: 'Pages',
      icon: '📄',
      content: (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              Page Management
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary, #7f8c8d)', 
              marginBottom: '2rem' 
            }}>
              Drag and drop to reorder pages. Click to expand and edit page details.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {pages.map((page, index) => (
              <div 
                key={page.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{ 
                  border: '1px solid var(--border-color, #e1e5e9)', 
                  borderRadius: '8px', 
                  background: 'var(--card-background, #fff)',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  cursor: 'move',
                  transition: 'opacity 0.2s'
                }}
              >
                <div 
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer',
                    borderBottom: expandedPage === page.id ? '1px solid var(--border-color, #e1e5e9)' : 'none'
                  }} 
                  onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{index + 1}. {page.title}</strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)', marginTop: '0.25rem' }}>
                        {page.route}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-secondary, #7f8c8d)' }}>
                      {expandedPage === page.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {expandedPage === page.id && (
                  <div style={{ padding: '1rem', background: 'var(--background-secondary, #f8f9fa)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextInput
                        label="Page Title"
                        value={page.title}
                        onChange={(e) => updatePageDetails(page.id, 'title', e.target.value)}
                        placeholder="Enter page title"
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <TextInput
                        label="Description"
                        value={page.description}
                        onChange={(e) => updatePageDetails(page.id, 'description', e.target.value)}
                        placeholder="Enter page description"
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="primary" size="small">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      label: 'Images',
      icon: '🖼️',
      content: (
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Image Management
          </h3>
          
          {/* Single Upload Section */}
          <Card title="📤 Upload Images" style={{ marginBottom: '3rem' }}>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary, #7f8c8d)', 
              marginBottom: '1rem' 
            }}>
              Upload images to your gallery. Once uploaded, you can select them for different page hero sections below.
            </p>
            <ImageManager
              value=""
              onChange={() => {
                // After upload, the gallery will refresh automatically
                alert('Image uploaded successfully! Select it below for your hero images.')
              }}
              label="Upload New Image"
            />
          </Card>

          <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Select Hero Images from Gallery
          </h4>
          
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
              
              <ImageGallery
                onSelect={(url) => {
                  if (imageMode.home === 'single') {
                    updateHeroImages('home', [url])
                  } else {
                    if (!heroImages.home.includes(url)) {
                      updateHeroImages('home', [...heroImages.home, url])
                    }
                  }
                }}
                selectedUrl={heroImages.home[0]}
              />
              
              {heroImages.home.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Selected:</strong>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {heroImages.home.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
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
              
              <ImageGallery
                onSelect={(url) => {
                  if (imageMode.projects === 'single') {
                    updateHeroImages('projects', [url])
                  } else {
                    if (!heroImages.projects.includes(url)) {
                      updateHeroImages('projects', [...heroImages.projects, url])
                    }
                  }
                }}
                selectedUrl={heroImages.projects[0]}
              />
              
              {heroImages.projects.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Selected:</strong>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {heroImages.projects.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
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
              
              <ImageGallery
                onSelect={(url) => {
                  if (imageMode.admin === 'single') {
                    updateHeroImages('admin', [url])
                  } else {
                    if (!heroImages.admin.includes(url)) {
                      updateHeroImages('admin', [...heroImages.admin, url])
                    }
                  }
                }}
                selectedUrl={heroImages.admin[0]}
              />
              
              {heroImages.admin.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Selected:</strong>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {heroImages.admin.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
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
              
              <ImageGallery
                onSelect={(url) => {
                  if (imageMode.about === 'single') {
                    updateHeroImages('about', [url])
                  } else {
                    if (!heroImages.about.includes(url)) {
                      updateHeroImages('about', [...heroImages.about, url])
                    }
                  }
                }}
                selectedUrl={heroImages.about[0]}
              />
              
              {heroImages.about.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong style={{ fontSize: '0.875rem' }}>Selected:</strong>
                  <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {heroImages.about.map((url, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.5rem',
                        background: 'var(--card-background, #f8f9fa)',
                        borderRadius: '4px'
                      }}>
                        <img src={url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
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
            variant={saving ? 'secondary' : 'success'}
            onClick={save}
            disabled={saving}
            size="large"
          >
            {saving ? 'Saving...' : '💾 Save All Hero Images'}
          </Button>
        </div>
      )
    },
    {
      label: 'Social Media',
      icon: '🌐',
      content: (
        <div style={{ position: 'relative' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Social Media Links
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #7f8c8d)', marginBottom: '2rem' }}>
            Manage social media links that appear in the footer. Add, edit, or remove links as needed.
          </p>
          
          {/* Dynamic Social Links */}
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            {socialLinks.map((link, index) => (
              <Card key={index} title={`${link.icon} ${link.label}`}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <TextInput
                      label="Label"
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...socialLinks]
                        newLinks[index].label = e.target.value
                        setSocialLinks(newLinks)
                      }}
                      placeholder="e.g., GitHub"
                    />
                    <TextInput
                      label="Icon (emoji)"
                      value={link.icon}
                      onChange={(e) => {
                        const newLinks = [...socialLinks]
                        newLinks[index].icon = e.target.value
                        setSocialLinks(newLinks)
                      }}
                      placeholder="🐙"
                    />
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => {
                        if (confirm(`Remove ${link.label}?`)) {
                          setSocialLinks(socialLinks.filter((_, i) => i !== index))
                        }
                      }}
                    >
                      🗑️ Remove
                    </Button>
                  </div>
                  <TextInput
                    label="URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...socialLinks]
                      newLinks[index].url = e.target.value
                      setSocialLinks(newLinks)
                    }}
                    placeholder="https://..."
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Add New Link Button */}
          <div style={{ marginBottom: '2rem' }}>
            <Button
              variant="success"
              onClick={() => {
                setSocialLinks([...socialLinks, { label: 'New Link', url: '', icon: '🔗' }])
              }}
            >
              ➕ Add New Social Link
            </Button>
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
    </div>
  )
}
