import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/state/auth'
import { RichTextEditor } from '@/components/RichText'
import ImageManager from '@/components/ImageManager'

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
      console.log('PostEditor: Loading post data for', id)
      api.get(`/posts/${id}/admin`).then(r => {
        const p = r.data.post
        console.log('PostEditor: Setting state with', { excerpt: p?.excerpt, content: p?.content })
        setTitle(p?.title ?? '')
        setExcerpt(p?.excerpt ?? '')
        setContent(p?.content ?? '')
        setCoverUrl(p?.coverUrl ?? '')
      })
    }
  }, [mode, id])

  async function save() {
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
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl text-brandText font-semibold mb-4">
        {mode === 'create' ? 'Create Post' : 'Edit Post'}
      </h1>

      <label className="block text-brandSteel mb-1">Title</label>
      <textarea
        value={title}
        onChange={e => setTitle(e.target.value)}
        rows={2}
        className="w-full mb-3 rounded-lg bg-brandNavy border-2 border-brandNavy px-3 py-2 text-white placeholder-gray-300 resize-y focus:ring-2 focus:ring-brandGreen focus:border-brandGreen shadow-md"
        placeholder="Enter post title..."
      />

      <label className="block text-brandSteel mb-2">Excerpt</label>
      <RichTextEditor value={excerpt} onChange={setExcerpt} />
      <div className="mb-3"></div>

      <ImageManager
        value={coverUrl}
        onChange={setCoverUrl}
        label="Cover Image"
        className="mb-4"
      />

      <label className="block text-brandSteel mb-2">Content</label>
      <RichTextEditor value={content} onChange={setContent} />

      <div className="mt-4 flex gap-2">
        <button
          disabled={saving}
          onClick={save}
          className="btn-primary"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="btn-muted">Cancel
        </button>
      </div>
    </div>
  )
}
