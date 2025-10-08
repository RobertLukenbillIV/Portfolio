import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'

export default function EditAbout() {
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
    
    api.get('/pages/about', { signal: controller.signal })
      .then(r => {
        setPage(r.data.page || { title: 'About Me', content: '' })
        setError(null)
      })
      .catch(err => {
        console.error('Failed to load page:', err)
        if (err.code !== 'ERR_CANCELED') {
          // If page doesn't exist, create a new one
          setPage({ title: 'About Me', content: '' })
          setError(null)
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
      const { data } = await api.put('/pages/about', page)
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

  if (loading) return <div className="p-6">Loading…</div>
  
  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded">
          <p>{error}</p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button 
              onClick={cancel}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!page) return <div className="p-6">Loading…</div>

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-mocha font-semibold">Edit About Me</h1>
        <div className="flex gap-2">
          <button 
            disabled={saving} 
            onClick={save} 
            className="px-4 py-2 rounded-lg bg-mocha text-dark hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button 
            onClick={cancel} 
            className="px-4 py-2 rounded-lg bg-brandMint/20 text-mocha hover:opacity-90"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-brandSteel/90 mb-2">Page Title</label>
        <input
          type="text"
          value={page.title}
          onChange={(e) => setPage(p => ({ ...(p as any), title: e.target.value }))}
          className="w-full rounded-lg bg-brandFoam/40 border border-brandSteel/30 px-3 py-2 text-mocha"
          placeholder="About Me"
        />
      </div>

      <div>
        <label className="block text-brandSteel/90 mb-2">Page Content</label>
        <RichTextEditor 
          value={page.content} 
          onChange={(v) => setPage(p => ({ ...(p as any), content: v }))} 
        />
      </div>
    </div>
  )
}