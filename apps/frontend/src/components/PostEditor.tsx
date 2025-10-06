// apps/frontend/src/pages/PostEditor.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/state/auth'
import { RichTextEditor } from '@/components/RichText' // from earlier

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
  }, [user])

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.get(`/posts/${id}`).then(r => {
        const p = r.data.post
        setTitle(p.title || '')
        setExcerpt(p.excerpt || '')
        setContent(p.content || '')
        setCoverUrl(p.coverUrl || '')
      })
    }
  }, [mode, id])

  async function save() {
    setSaving(true)
    if (mode === 'create') {
      const { data } = await api.post('/posts', { title, excerpt, content, coverUrl })
      navigate(`/projects/${data.post.id}`)
    } else {
      await api.put(`/posts/${id}`, { title, excerpt, content, coverUrl })
      navigate(`/projects/${id}`)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl text-mocha font-semibold mb-4">
        {mode === 'create' ? 'Create Post' : 'Edit Post'}
      </h1>

      <label className="block text-sage mb-1">Title</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mb-3 rounded-lg bg-fern/40 border border-eucalyptus/30 px-3 py-2 text-mocha"/>

      <label className="block text-sage mb-1">Excerpt</label>
      <textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} className="w-full mb-3 rounded-lg bg-fern/40 border border-eucalyptus/30 px-3 py-2 text-mocha"/>

      <label className="block text-sage mb-1">Cover Image URL</label>
      <input value={coverUrl} onChange={e=>setCoverUrl(e.target.value)} className="w-full mb-4 rounded-lg bg-fern/40 border border-eucalyptus/30 px-3 py-2 text-mocha"/>

      <label className="block text-sage mb-2">Content</label>
      <RichTextEditor value={content} onChange={setContent} />

      <div className="mt-4 flex gap-2">
        <button disabled={saving} onClick={save} className="px-4 py-2 rounded-lg bg-mocha text-dark hover:opacity-90">
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={()=>navigate(-1)} className="px-4 py-2 rounded-lg bg-darkTan text-mocha hover:opacity-90">Cancel</button>
      </div>
    </div>
  )
}
