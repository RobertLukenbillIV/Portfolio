import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/state/auth'
import { RichTextEditor } from '@/components/RichText'
import ImageManager from '@/components/ImageManager'
import { Hero, Card, TextArea } from '@/components/AcmeUI'

export default function PostEditor({ mode }: { mode: 'create' | 'edit' }) {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
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
          title, excerpt, content, coverUrl,
        })
        navigate(`/projects/${data.post.id}`)
      } else {
        await api.put(`/posts/${id}`, { title, excerpt, content, coverUrl })
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
              <TextArea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your project..."
                rows={2}
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

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color, #e5e7eb)'
            }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  color: 'var(--text-secondary, #7f8c8d)',
                  border: '1px solid var(--border-color, #e5e7eb)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={save}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#6b7280' : 'var(--primary-color, #2c3e50)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Saving…' : (mode === 'create' ? 'Create Project' : 'Update Project')}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
