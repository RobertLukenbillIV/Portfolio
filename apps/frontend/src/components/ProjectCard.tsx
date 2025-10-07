import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { FeatureToggle } from './FeatureToggle'

export type Post = {
  id: string
  title: string
  excerpt: string
  coverUrl?: string | null
  featured?: boolean
}

export default function ProjectCard({ post }: { post: Post }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const p = post

  return (
    <article className="rounded-2xl p-4 border border-brandSteel/30 bg-brandMint/20/40">
      {p.coverUrl && <img src={p.coverUrl} className="rounded-xl mb-3 h-40 w-full object-cover" />}
      <h3 className="text-mocha font-medium mb-2">{p.title}</h3>
      <p className="text-brandSteel/90 text-sm mb-3">{p.excerpt}</p>

      <div className="flex gap-2">
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
            <FeatureToggle postId={p.id} initial={p.featured} />
          </>
        )}
      </div>
    </article>
  )
}
