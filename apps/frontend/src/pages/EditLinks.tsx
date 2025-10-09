import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'

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
          // If page doesn't exist (404) or other error, create empty page for editing
          const emptyPage = { title: 'Links', content: '' }
          setPage(emptyPage)
          setError(null)
          console.log('Created empty Links page for editing') // Debug log
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
              className="px-3 py-1 bg-brandGreen text-white rounded hover:opacity-90"
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
        <h1 className="text-3xl text-brandText font-semibold">Edit Links</h1>
        <div className="flex gap-2">
          <button 
            disabled={saving} 
            onClick={save} 
            className="px-4 py-2 rounded-lg bg-brandGreen text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button 
            onClick={cancel} 
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-brandText mb-2 font-medium">Page Title</label>
        <textarea
          value={page.title}
          onChange={(e) => setPage(p => ({ ...(p as any), title: e.target.value }))}
          rows={4}
          className="w-full rounded-lg bg-slate-100 border-2 border-slate-300 px-3 py-2 text-gray-900 resize-y focus:ring-2 focus:ring-brandGreen focus:border-brandGreen shadow-md"
          placeholder="Links"
        />
      </div>

      <div>
        <label className="block text-brandText mb-2 font-medium">Page Content</label>
        {/* Only render the RichTextEditor after content is loaded to ensure proper initialization */}
        {!loading && page && (
          <RichTextEditor 
            key={`links-editor-${page.content.length}`} // Force re-render when content changes
            value={page.content} 
            onChange={(v) => setPage(p => ({ ...(p as any), content: v }))} 
          />
        )}
        {loading && (
          <div className="w-full h-40 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Loading editor...</span>
          </div>
        )}
      </div>
    </div>
  )
}