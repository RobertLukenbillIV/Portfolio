import { useEffect, useState } from 'react'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import { RichTextEditor } from '../components/RichText'

export default function SinglePage({ slug, titleOverride }: { slug: 'about' | 'links'; titleOverride?: string }) {
  const { user } = useAuth()
  const [page, setPage] = useState<{ title: string; content: string } | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get(`/pages/${slug}`).then(r => setPage(r.data.page))
  }, [slug])

  async function save() {
    setSaving(true)
    const { data } = await api.put(`/pages/${slug}`, page)
    setPage(data.page)
    setSaving(false)
    setEditing(false)
  }

  if (!page) return <div className="p-6">Loading…</div>

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl text-mocha font-semibold">{titleOverride ?? page.title}</h1>
        {user?.role === 'ADMIN' && (
          <div className="flex gap-2">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-3 py-1 rounded bg-eucalyptus text-dark hover:opacity-90">Edit</button>
            ) : (
              <>
                <button disabled={saving} onClick={save} className="px-3 py-1 rounded bg-mocha text-dark hover:opacity-90">{saving ? 'Saving…' : 'Save'}</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1 rounded bg-darkTan text-mocha hover:opacity-90">Cancel</button>
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
