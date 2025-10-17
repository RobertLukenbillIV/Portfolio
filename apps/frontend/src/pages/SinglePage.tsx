import { useEffect, useState } from 'react'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'
import { Card, Hero } from '@/components/AcmeUI'

export default function SinglePage({ slug, titleOverride }: { slug: 'about' | 'links'; titleOverride?: string }) {
  const { user } = useAuth()
  const [page, setPage] = useState<{ title: string; content: string } | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000) // 8 second timeout
    
    api.get(`/pages/${slug}`, { signal: controller.signal })
      .then(r => {
        setPage(r.data.page)
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load page:', err)
        if (err.code !== 'ERR_CANCELED') {
          setError('Failed to load page. Please try again later.')
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
  }, [slug])

  async function save() {
    setSaving(true)
    try {
      const { data } = await api.put(`/pages/${slug}`, page)
      setPage(data.page)
      setEditing(false)
    } catch (err) {
      console.error('Failed to save page:', err)
      alert('Failed to save page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Card title="Loading">
          <p>Loading page content...</p>
        </Card>
      </div>
    )
  }
  
  if (error) {
    return (
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Card title="Error">
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
            color: '#dc2626',
            marginBottom: '1rem'
          }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    )
  }
  
  if (!page) {
    return (
      <div>
        <Hero 
          title={titleOverride ?? 'Page'}
          subtitle="This page hasn't been created yet"
          variant="static"
          height="40vh"
        />
        
        <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Card title="Page Not Found">
            <p style={{ color: 'var(--text-secondary, #7f8c8d)', marginBottom: '1rem' }}>
              This page hasn't been created yet.
            </p>
            {user?.role === 'ADMIN' && (
              <button 
                onClick={() => {
                  setPage({ title: titleOverride ?? slug, content: '' })
                  setEditing(true)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--primary-color, #2c3e50)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Create Page
              </button>
            )}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Hero 
        title={titleOverride ?? page.title}
        subtitle={slug === 'about' ? 'Learn more about me' : 'Connect with me'}
        variant="static"
        height="40vh"
        backgroundImage={slug === 'about' 
          ? "https://picsum.photos/1920/600?random=about" 
          : "https://picsum.photos/1920/600?random=links"
        }
      />

      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Card 
          title={titleOverride ?? page.title}
          footer={user?.role === 'ADMIN' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button 
                    disabled={saving} 
                    onClick={save}
                    style={{
                      padding: '0.5rem 1rem',
                      background: saving ? '#6b7280' : '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setEditing(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        >
          {!editing ? (
            <div 
              style={{ lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: page.content || '<p>No content available yet.</p>' }} 
            />
          ) : (
            <RichTextEditor 
              value={page.content} 
              onChange={(v) => setPage(p => ({ ...(p as any), content: v }))} 
            />
          )}
        </Card>
      </div>
    </div>
  )
}