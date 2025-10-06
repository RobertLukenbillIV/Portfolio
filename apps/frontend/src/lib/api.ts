import axios from 'axios'

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
})

// helpful in dev console
if (typeof window !== 'undefined') {
  ;(window as any).__API_BASE__ = baseURL
  ;(window as any).__api = api
}
