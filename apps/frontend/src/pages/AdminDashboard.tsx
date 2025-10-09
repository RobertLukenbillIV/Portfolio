import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'
import ImageManager from '@/components/ImageManager'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hero, setHero] = useState('')
  const [intro, setIntro] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.role !== 'ADMIN') navigate('/')
    api.get('/settings').then(r => {
      setHero(r.data.settings?.homeHeroUrl ?? '')
      setIntro(r.data.settings?.homeIntro ?? '')
    })
  }, [user])

  async function save() {
    setSaving(true)
    await api.put('/settings', { homeHeroUrl: hero, homeIntro: intro })
    setSaving(false)
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl text-brandText font-semibold mb-6">Admin</h1>

      <section className="rounded-2xl border border-brandSteel/30 bg-brandMint/20/40 p-4 mb-6">
        <h2 className="text-brandText font-medium mb-4">Homepage Settings</h2>
        
        <div className="mb-4">
          <ImageManager
            value={hero}
            onChange={setHero}
            label="Hero Image (Main homepage banner image)"
            className=""
          />
          <p className="text-xs text-brandText mt-1">
            This image appears at the top of your homepage. Upload an image or paste a URL.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-brandText mb-2 font-medium">
            Homepage Introduction Text
          </label>
          <textarea 
            value={intro} 
            onChange={e=>setIntro(e.target.value)} 
            rows={6} 
            className="w-full rounded-lg bg-white border border-brandSteel/50 px-3 py-2 text-gray-900 mb-2 resize-y focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen"
            placeholder="Write a welcoming message that appears below your hero image on the homepage..."
          />
          <p className="text-xs text-brandText">
            This text appears below the hero image on your homepage. Use it to introduce yourself or your work.
          </p>
        </div>

        <button disabled={saving} onClick={save} className="px-4 py-2 rounded-lg bg-brandGreen text-white hover:opacity-90 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Homepage Settings'}
        </button>
      </section>

      <section>
        <h2 className="text-brandText font-medium mb-4">Content Management</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/projects/new" className="rounded-xl bg-brandGreen text-white px-4 py-3 text-center hover:opacity-90">Create New Post</Link>
          <Link to="/admin/edit-about" className="rounded-xl bg-brandGreen text-white px-4 py-3 text-center hover:opacity-90">Edit About Me</Link>
          <Link to="/admin/edit-links" className="rounded-xl bg-brandGreen text-white px-4 py-3 text-center hover:opacity-90">Edit Links</Link>
        </div>
      </section>
    </div>
  )
}
