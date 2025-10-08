// Homepage component - displays hero image, intro text, and featured projects
// Fetches customizable content from backend settings and featured posts
// Connected to: backend /settings and /posts/featured endpoints, Projects page via links

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Link } from 'react-router-dom'

// Type definitions for homepage content structure
type Settings = { homeHeroUrl?: string | null; homeIntro?: string | null }
type PostCard = { id: string; title: string; excerpt: string; coverUrl?: string | null }

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [featured, setFeatured] = useState<PostCard[]>([])

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.settings ?? {}))
    api.get('/posts/featured?limit=3').then(r => setFeatured(r.data.posts ?? []))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {settings?.homeHeroUrl && (
        <div className="w-full flex justify-center mb-6">
          <img
            src={settings.homeHeroUrl}
            alt="Hero"
            className="rounded-2xl shadow-lg max-h-[380px] object-cover"
          />
        </div>
      )}

      {settings?.homeIntro && (
        <p className="text-brandTextMuted text-lg text-center mb-10 max-w-3xl mx-auto">
          {settings.homeIntro}
        </p>
      )}

      <h2 className="text-brandText text-2xl font-semibold mb-4 text-center">Highlighted Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map(p => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="bg-brandMint/20/40 hover:bg-brandMint/20/60 rounded-2xl p-4 border border-brandSteel/30"
          >
            {p.coverUrl && (
              <img src={p.coverUrl} className="rounded-xl mb-3 h-40 w-full object-cover" />
            )}
            <h3 className="text-brandText font-medium mb-2">{p.title}</h3>
            <p className="text-brandTextMuted text-sm">{p.excerpt}</p>
          </Link>
        ))}
        {featured.length === 0 && (
          <p className="text-center text-brandTextMuted col-span-full">
            No featured projects yet. Mark up to three posts as “Featured” in Admin.
          </p>
        )}
      </div>
    </div>
  )
}
