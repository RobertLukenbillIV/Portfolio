import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/state/auth'

export default function PostDetail() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()

  // ...load post by id...

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* title, content, etc. */}
      {user?.role === 'ADMIN' && id && (
        <div className="mt-4">
          <button
            onClick={() => navigate(`/admin/posts/${id}/edit`)}
            className="px-3 py-1 rounded bg-brandSteel text-dark hover:opacity-90"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  )
}
