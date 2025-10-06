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
    api.get('/auth/me')
      .then(r => setUser(r.data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return <Ctx.Provider value={{ user, setUser, loading }}>{children}</Ctx.Provider>
}

export function useAuth() {
  return useContext(Ctx)
}
