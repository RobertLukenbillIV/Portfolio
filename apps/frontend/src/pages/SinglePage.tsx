import { useEffect, useState } from 'react'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'

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
    const { data } = await api.put(`/pages/${slug}`, page)
    setPage(data.page)
    setSaving(false)
    setEditing(false)
  }

  if (loading) return <div className="p-6">Loading…</div>
  
  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  if (!page) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl text-mocha font-semibold">{titleOverride ?? 'Page'}</h1>
        <p className="text-gray-400 mt-4">This page hasn't been created yet.</p>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => {
              setPage({ title: titleOverride ?? slug, content: '' })
              setEditing(true)
            }}
            className="mt-4 px-4 py-2 bg-mocha text-dark rounded hover:opacity-90"
          >
            Create Page
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl text-mocha font-semibold">{titleOverride ?? page.title}</h1>
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-3 py-1 rounded bg-brandSteel text-dark hover:opacity-90">Edit</button>
            ) : (
              <>
                <button disabled={saving} onClick={save} className="px-3 py-1 rounded bg-mocha text-dark hover:opacity-90">{saving ? 'Saving…' : 'Save'}</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1 rounded bg-brandMint/20 text-mocha hover:opacity-90">Cancel</button>
              </>
            )}
          </div>
        )}
      </div>

      {!editing ? (
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content || '<p></p>' }} />
      ) : (
        <RichTextEditor value={page.content} onChange={(v) => setPage(p => ({ ...(p as any), content: v }))} />
      )}
    </div>
  )
}
