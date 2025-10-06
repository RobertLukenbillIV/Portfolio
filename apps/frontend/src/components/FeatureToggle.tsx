import { useState } from 'react'
import { api } from '@/lib/api'

export function FeatureToggle({ postId, initial }: { postId: string; initial?: boolean }) {
  const [on, setOn] = useState(!!initial)
  async function toggle() {
    const { data } = await api.put(`/posts/${postId}/featured`, { featured: !on })
    setOn(data.post.featured)
  }
  return (
    <button
      onClick={toggle}
      className={`px-3 py-1 rounded ${on ? 'bg-mocha text-dark' : 'bg-darkTan text-mocha'} hover:opacity-90`}
    >
      {on ? 'Featured' : 'Make Featured'}
    </button>
  )
}
