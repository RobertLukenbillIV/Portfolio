// apps/frontend/src/lib/api.ts
import axios from 'axios'

export const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  withCredentials: true, // <-- required so auth cookie is sent/received
  timeout: 10000,
})

// Expose for quick checks in the browser console
if (typeof window !== 'undefined') {
  ;(window as any).__API_BASE__ = baseURL
  ;(window as any).__api = api
}
