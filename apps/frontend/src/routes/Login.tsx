import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { Card, AuthForm } from '@/components/AcmeUI'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: { email: string; password?: string }) => {
    if (!data.password) return
    
    setErr(null)
    setLoading(true)
    try {
      await login(data.email, data.password)
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
      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      padding: '2rem'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          loading={loading}
          error={err || undefined}
        />
      </Card>
    </div>
  )
}