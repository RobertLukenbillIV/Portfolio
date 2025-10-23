import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { Card, AuthForm } from '@/components/AcmeUI'
import { api } from '@/lib/api'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [heroImage, setHeroImage] = useState<string>()

  // Load home hero image from settings
  useEffect(() => {
    api.get('/settings').then(r => {
      const settings = r.data.settings || {}
      if (settings.homeHeroUrls && settings.homeHeroUrls.length > 0) {
        if (settings.homeImageMode === 'multiple' && settings.homeHeroUrls.length > 1) {
          // Random selection for multiple images
          const randomIndex = Math.floor(Math.random() * settings.homeHeroUrls.length)
          setHeroImage(settings.homeHeroUrls[randomIndex])
        } else {
          // Single image mode or only one image available
          setHeroImage(settings.homeHeroUrls[0])
        }
      }
    }).catch(() => {
      // Silently fail - will use gradient fallback
    })
  }, [])

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
      background: heroImage 
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage}) center/cover` 
        : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
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