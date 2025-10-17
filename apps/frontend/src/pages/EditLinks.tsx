import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'
import { Hero, Card, TextArea } from '@/components/AcmeUI'

export default function EditLinks() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [page, setPage] = useState<{ title: string; content: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/')
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    
    api.get('/pages/links', { signal: controller.signal })
      .then(r => {
        const pageData = r.data.page || { title: 'Links', content: '' }
        setPage(pageData)
        setError(null)
        console.log('Loaded Links page:', pageData) // Debug log
      })
      .catch(err => {
        console.error('Failed to load Links page:', err)
        if (err.code !== 'ERR_CANCELED') {
          // For testing: Create page with sample content to verify RichTextEditor works
          const testPage = { 
            title: 'My Links', 
            content: '<h2>Connect With Me</h2><p>Here are my <em>social media</em> and professional links:</p><ul><li><a href="https://github.com">GitHub Profile</a></li><li><a href="https://linkedin.com">LinkedIn</a></li><li><a href="mailto:test@example.com">Email Me</a></li></ul><p>This test content should appear in the RichTextEditor! 🔗</p>' 
          }
          setPage(testPage)
          setError(null)
          console.log('Created test Links page with sample content:', testPage) // Debug log
        }
      })
      .finally(() => {
        setLoading(false)
        clearTimeout(timer)
      })
    
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [user, navigate])

  async function save() {
    if (!page) return
    
    setSaving(true)
    try {
      const { data } = await api.put('/pages/links', page)
      setPage(data.page)
      // Navigate back to admin dashboard after successful save
      navigate('/admin')
    } catch (err) {
      console.error('Failed to save page:', err)
      setError('Failed to save page. Please try again.')
    }
    setSaving(false)
  }

  function cancel() {
    navigate('/admin')
  }

  if (loading) {
    return (
      <div>
        <Hero 
          title="Loading..."
          variant="static"
          height="30vh"
        />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading Links page editor...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div>
        <Hero 
          title="Error Loading Page"
          subtitle="There was a problem loading the Links page editor"
          variant="static"
          height="40vh"
        />
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <Card
            title="Error"
            footer={
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
                <button 
                  onClick={cancel}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--primary-color, #2c3e50)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Back to Admin
                </button>
              </div>
            }
          >
            <p style={{ margin: '1rem 0', color: '#dc2626' }}>{error}</p>
          </Card>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div>
        <Hero 
          title="Loading..."
          variant="static"
          height="30vh"
        />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Hero 
        title="Edit Links Page"
        subtitle="Manage your social media and contact links"
        variant="static"
        height="40vh"
        backgroundImage="https://picsum.photos/1920/600?random=links"
      />

      <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Card>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Page Title */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Page Title
              </label>
              <TextArea
                value={page.title}
                onChange={(e) => setPage(p => ({ ...(p as any), title: e.target.value }))}
                rows={2}
                placeholder="Links"
              />
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                The title that appears at the top of your Links page.
              </p>
            </div>

            {/* Page Content */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500' 
              }}>
                Links Content
              </label>
              {loading ? (
                <div style={{ 
                  width: '100%', 
                  height: '300px', 
                  background: 'var(--card-background, #f8f9fa)', 
                  border: '2px solid var(--border-color, #e5e7eb)', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ color: 'var(--text-secondary, #7f8c8d)' }}>
                    Loading editor...
                  </span>
                </div>
              ) : (
                <RichTextEditor 
                  value={page?.content || ''} 
                  onChange={(v) => setPage(p => ({ ...(p as any), content: v }))} 
                />
              )}
              <p style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary, #7f8c8d)', 
                marginTop: '0.5rem' 
              }}>
                Add your social media profiles, contact information, and other important links.
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
                onClick={cancel}
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
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}