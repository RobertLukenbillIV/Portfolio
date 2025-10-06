import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
    <form onSubmit={submit} className="card max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700">
          {err}
        </div>
      )}

      <label className="block">
        <span className="block text-sm font-medium mb-1">Email</span>
        <input
          className="input w-full"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="block text-sm font-medium mb-1">Password</span>
        <input
          className="input w-full"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button
        className="btn btn-primary w-full disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
