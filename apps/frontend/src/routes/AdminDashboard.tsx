import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  coverUrl?: string | null
  createdAt?: string
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Pick<Post, 'title' | 'excerpt' | 'content' | 'coverUrl'>>({
    title: '',
    excerpt: '',
    content: '',
    coverUrl: '',
  })

  const refresh = () => api.get('/posts').then((r) => setPosts(r.data as Post[]))

  useEffect(() => {
    refresh()
  }, [])

  const create = async () => {
    setError(null)
    if (!form.title.trim() || !form.excerpt.trim()) {
      setError('Title and excerpt are required.')
      return
    }
    setSaving(true)
    try {
      await api.post('/posts', form)
      setForm({ title: '', excerpt: '', content: '', coverUrl: '' })
      await refresh()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create post.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${id}`)
      await refresh()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete post.')
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Admin</h1>

      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Create New Post</h2>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700">
            {error}
          </div>
        )}

        <input
          className="input w-full"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="input w-full"
          placeholder="Short excerpt"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <input
          className="input w-full"
          placeholder="Cover image URL (optional)"
          value={form.coverUrl || ''}
          onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
        />

        <div className="rounded-2xl overflow-hidden border border-eucalyptus/40">
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(v) => setForm({ ...form, content: v })}
            modules={quillModules}
            placeholder="Write your post…"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary"
            onClick={create}
            disabled={saving}
            title="Create post"
          >
            {saving ? 'Saving…' : 'Create Post'}
          </button>
          <button
            className="btn"
            onClick={() => setForm({ title: '', excerpt: '', content: '', coverUrl: '' })}
            type="button"
            title="Clear form"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-xl font-semibold">Existing Posts</h2>
        {posts.length === 0 && (
          <p className="opacity-70">No posts yet. Create your first one above.</p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{p.title}</h3>
                <p className="opacity-75 line-clamp-2">{p.excerpt}</p>
              </div>
              <div className="shrink-0 flex gap-2">
                {/* Placeholder for future edit flow */}
                {/* <button className="btn" onClick={() => openEditor(p)}>Edit</button> */}
                <button className="btn" onClick={() => remove(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
