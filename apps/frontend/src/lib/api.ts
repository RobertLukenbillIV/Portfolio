// API client configuration for communicating with the backend
// Handles authentication, timeouts, and CORS configuration
// Connected to: backend app.ts CORS settings, used throughout frontend for API calls

import axios from 'axios'

// API base URL - uses environment variable or localhost fallback for development
// Production: VITE_API_URL points to Render backend deployment
// Development: Defaults to local backend server on port 4000
export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Configured axios instance with authentication and timeout settings
export const api = axios.create({
  baseURL,
  withCredentials: true,    // Send cookies with all requests (required for JWT auth)
  timeout: 10000,          // 10 second timeout for all requests
})

// Development debugging helpers - expose API client to browser console
// Useful for testing API calls directly from browser developer tools
if (typeof window !== 'undefined') {
  ;(window as any).__API_BASE__ = baseURL
  ;(window as any).__api = api
}
