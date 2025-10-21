import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/state/auth'
import { RichTextEditor } from '@/components/RichText'
import ImageManager from '@/components/ImageManager'
import { Hero, Card, TextInput, Button, Switch, Badge } from '@/components/AcmeUI'

export default function PostEditor({ mode }: { mode: 'create' | 'edit' }) {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.role !== 'ADMIN') navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.get(`/posts/${id}/admin`).then(r => {
        const p = r.data.post
        setTitle(p?.title ?? '')
        setExcerpt(p?.excerpt ?? '')
        setContent(p?.content ?? '')
        setCoverUrl(p?.coverUrl ?? '')
        setFeatured(p?.featured ?? false)
      })
    }
  }, [mode, id])

  async function save() {
    if (!title.trim()) {
      alert('Please enter a title for your project')
      return
    }
    
    setSaving(true)
    try {
      if (mode === 'create') {
        const { data } = await api.post('/posts', {
          title, excerpt, content, coverUrl, featured,
        })
        navigate(`/projects/${data.post.id}`)
      } else {
        await api.put(`/posts/${id}`, { title, excerpt, content, coverUrl, featured })
        navigate(`/projects/${id}`)
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div>
      <Hero 
        title={mode === 'create' ? 'Create New Project' : 'Edit Project'}
        subtitle={mode === 'create' ? 'Add a new project to your portfolio' : 'Update project details and content'}
        variant="static"
        height="40vh"
        backgroundImage="https://picsum.photos/1920/600?random=editor"
      />

      <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Card>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Title */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Project Title *
              </label>
              <TextInput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Cover Image
              </label>
              <ImageManager
                value={coverUrl}
                onChange={setCoverUrl}
                label="Project cover image"
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                This image will be displayed as the main visual for your project.
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Project Summary
              </label>
              <RichTextEditor 
                value={excerpt} 
                onChange={setExcerpt}
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                A brief description that will be shown on project cards and previews.
              </p>
            </div>

            {/* Content */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Project Details
              </label>
              <RichTextEditor 
                value={content} 
                onChange={setContent}
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                The full content and details about your project.
              </p>
            </div>

            {/* Featured Toggle */}
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '1rem',
                background: 'var(--card-background, #f8f9fa)',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #e5e7eb)'
              }}>
                <Switch
                  checked={featured}
                  onChange={setFeatured}
                  label="Featured Project"
                  color="warning"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    Feature on Homepage
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-secondary, #7f8c8d)' 
                  }}>
                    Featured projects appear on the homepage <Badge variant="warning" size="small">Max 3</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color, #e5e7eb)'
            }}>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={saving}
                loading={saving}
                onClick={save}
              >
                {mode === 'create' ? 'Create Project' : 'Update Project'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}