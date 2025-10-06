import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

export type User = { id: string; email: string; role: string; name?: string | null }

type AuthCtx = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, login: async()=>{}, logout: async()=>{} })
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  let canceled = false
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 7000) // hard stop after 7s

  api.get('/auth/me', { signal: controller.signal })
    .then(r => { if (!canceled) setUser(r.data) })
    .catch(() => { if (!canceled) setUser(null) })
    .finally(() => { if (!canceled) setLoading(false); clearTimeout(timer) })

  return () => { canceled = true; controller.abort(); clearTimeout(timer) }
}, [])


  const login = async (email: string, password: string) => {
    await api.post('/auth/login', { email, password })
    const me = await api.get('/auth/me'); setUser(me.data)
  }

  const logout = async () => { await api.post('/auth/logout'); setUser(null) }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
