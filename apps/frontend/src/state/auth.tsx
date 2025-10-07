import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

export type User = {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'USER'
}

type AuthCtx = {
  user: User | null
  setUser: (u: User | null) => void
  loading: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, setUser: () => {}, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let canceled = false
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
      if (!canceled) {
        setUser(null)
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    api.get('/auth/me', { signal: controller.signal })
      .then(r => {
        if (!canceled) {
          setUser(r.data.user ?? r.data ?? null)
        }
      })
      .catch((err) => {
        if (!canceled) {
          console.warn('Auth check failed:', err.message)
          setUser(null)
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false)
          clearTimeout(timer)
        }
      })

    return () => {
      canceled = true
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  return <Ctx.Provider value={{ user, setUser, loading }}>{children}</Ctx.Provider>
}

export function useAuth() {
  return useContext(Ctx)
}
