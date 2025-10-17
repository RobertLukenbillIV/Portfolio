import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { Card, TextInput } from '@/components/AcmeUI'

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--page-background, #f5f5f5)'
    }}>
      <Card title="Admin Login" style={{ maxWidth: '400px', width: '100%' }}>
        {err && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '0.375rem',
            color: '#dc2626'
          }}>
            {err}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-color, #2c3e50)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: '0.5rem'
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </Card>
    </div>
  )
}