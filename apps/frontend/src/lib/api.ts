import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 8000, // avoid infinite hangs
})

// Expose for quick debugging in DevTools console:
// Type: window.__API_BASE__ or window.__api.defaults.baseURL
// (This avoids using import.meta in the console.)
;(window as any).__API_BASE__ = baseURL
;(window as any).__api = api
