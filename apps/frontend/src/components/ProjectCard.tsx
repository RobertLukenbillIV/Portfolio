import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { FeatureToggle } from './FeatureToggle'
import { api } from '@/lib/api'
import { useState } from 'react'

export type Post = {
  id: string
  title: string
  excerpt: string
  coverUrl?: string | null
  featured?: boolean
}

export default function ProjectCard({ post, onDelete }: { post: Post; onDelete?: (id: string) => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const p = post

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${p.title}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      await api.delete(`/posts/${p.id}`)
      onDelete?.(p.id) // Call parent callback to update the list
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="rounded-2xl p-4 border border-brandSteel/30 bg-brandMint/20/40">
      {p.coverUrl && <img src={p.coverUrl} className="rounded-xl mb-3 h-40 w-full object-cover" />}
      <h3 className="text-mocha font-medium mb-2">{p.title}</h3>
      <p className="text-brandSteel/90 text-sm mb-3">{p.excerpt}</p>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => navigate(`/projects/${p.id}`)}
          className="px-3 py-1 rounded bg-brandSteel text-dark hover:opacity-90"
        >
          View
        </button>
        {user?.role === 'ADMIN' && (
          <>
            <button
              onClick={() => navigate(`/admin/posts/${p.id}/edit`)}
              className="px-3 py-1 rounded bg-brandSteel text-dark hover:opacity-90"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <FeatureToggle postId={p.id} initial={p.featured} />
          </>
        )}
      </div>
    </article>
  )
}
