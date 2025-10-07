// Authentication context and state management for the entire application
// Handles user login/logout state, JWT authentication, and role-based access
// Connected to: main.tsx (provides context), lib/api.ts, backend auth endpoints

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'                            // API client with auth configuration

// User type definition - matches backend user object structure
export type User = {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'USER'    // Role-based access control
}

// Authentication context type - defines what auth state provides to components
type AuthCtx = {
  user: User | null                                       // Current authenticated user
  setUser: (u: User | null) => void                       // Manual user state setter
  loading: boolean                                        // Initial auth check loading state
  login: (email: string, password: string) => Promise<void>  // Login function
  logout: () => Promise<void>                             // Logout function
}

// Create context with default values
const Ctx = createContext<AuthCtx>({ 
  user: null, 
  setUser: () => {}, 
  loading: true, 
  login: async () => {}, 
  logout: async () => {} 
})

// Authentication provider component - wraps app to provide auth state to all components
// Automatically checks authentication status on app load and manages loading states
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on app initialization
  // Uses abort controller and timeout to prevent hanging on failed API calls
  useEffect(() => {
    let canceled = false
    const controller = new AbortController()
    
    // 5-second timeout to prevent infinite loading states
    const timer = setTimeout(() => {
      controller.abort()
      if (!canceled) {
        setUser(null)
        setLoading(false)
      }
    }, 5000)

    // Check if user is authenticated by calling /auth/me endpoint
    api.get('/auth/me', { signal: controller.signal })
      .then(r => {
        if (!canceled) {
          // Handle different response formats from backend
          setUser(r.data.user ?? r.data ?? null)
        }
      })
      .catch((err) => {
        if (!canceled) {
          console.warn('Auth check failed:', err.message)
          setUser(null) // Not authenticated or network error
        }
      })
      .finally(() => {
        if (!canceled) {
          setLoading(false)
          clearTimeout(timer)
        }
      })

    // Cleanup function to prevent memory leaks and race conditions
    return () => {
      canceled = true
      controller.abort()
      clearTimeout(timer)
    }
  }, [])

  // Login function - authenticates user and updates local state
  // Two-step process: 1) Send credentials to login endpoint 2) Fetch user data
  const login = async (email: string, password: string) => {
    await api.post('/auth/login', { email, password }) // Authenticate and set JWT cookie
    const me = await api.get('/auth/me') // Fetch user data with new JWT
    setUser(me.data.user ?? me.data ?? null) // Update local authentication state
  }

  // Logout function - clears JWT cookie on backend and local user state
  // Ensures user is logged out both on server and client
  const logout = async () => {
    await api.post('/auth/logout') // Clear httpOnly JWT cookie on backend
    setUser(null) // Clear local authentication state
  }

  // Provide authentication context to all child components
  // Makes user state, loading state, and auth functions available app-wide
  return <Ctx.Provider value={{ user, setUser, loading, login, logout }}>{children}</Ctx.Provider>
}

// Custom hook for accessing authentication context
// Provides type-safe access to auth state and functions throughout the app
// Used by components like Navbar, Protected routes, and authentication forms
export function useAuth() {
  return useContext(Ctx)
}
