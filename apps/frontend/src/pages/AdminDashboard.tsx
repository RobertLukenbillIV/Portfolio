import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '../lib/api'

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
      <h1 className="text-3xl text-mocha font-semibold mb-6">Admin</h1>

      <section className="rounded-2xl border border-brandSteel/30 bg-brandMint/20/40 p-4 mb-6">
        <h2 className="text-mocha font-medium mb-3">Home Settings</h2>
        <label className="block text-brandSteel/90 mb-1">Hero Image URL</label>
        <input value={hero} onChange={e=>setHero(e.target.value)} className="w-full rounded-lg bg-brandFoam/40 border border-brandSteel/30 px-3 py-2 text-mocha mb-3"/>

        <label className="block text-brandSteel/90 mb-1">Intro Text</label>
        <textarea value={intro} onChange={e=>setIntro(e.target.value)} rows={4} className="w-full rounded-lg bg-brandFoam/40 border border-brandSteel/30 px-3 py-2 text-mocha mb-3"/>
        <button disabled={saving} onClick={save} className="px-4 py-2 rounded-lg bg-mocha text-dark hover:opacity-90">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link to="/projects/new" className="rounded-xl bg-brandSteel text-dark px-4 py-3 text-center hover:opacity-90">Create New Post</Link>
        <Link to="/about" className="rounded-xl bg-brandSteel text-dark px-4 py-3 text-center hover:opacity-90">Edit About</Link>
        <Link to="/links" className="rounded-xl bg-brandSteel text-dark px-4 py-3 text-center hover:opacity-90">Edit Links</Link>
      </section>
    </div>
  )
}
