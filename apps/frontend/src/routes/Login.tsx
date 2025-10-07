import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await login(email, password)
      nav('/admin')
    } catch {
      setErr('Login failed. Check your email/password and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-brandNavy border border-brandSteel/30 rounded-lg p-6 max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-brandFoam">Admin Login</h1>

        {err && (
          <div className="rounded border border-red-500 bg-red-900/20 px-3 py-2 text-red-300">
            {err}
          </div>
        )}

        <label className="block">
          <span className="block text-sm font-medium mb-1 text-brandFoam">Email</span>
          <input
            className="w-full px-3 py-2 rounded border border-brandSteel/50 bg-brandNavy text-brandFoam placeholder-brandSteel focus:border-brandMint focus:outline-none"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1 text-brandFoam">Password</span>
          <input
            className="w-full px-3 py-2 rounded border border-brandSteel/50 bg-brandNavy text-brandFoam placeholder-brandSteel focus:border-brandMint focus:outline-none"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="w-full px-4 py-2 bg-brandMint text-dark font-medium rounded hover:opacity-90 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
