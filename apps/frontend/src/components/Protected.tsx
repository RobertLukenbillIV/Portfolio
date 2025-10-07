// Protected route wrapper component - restricts access to authenticated users only
// Shows loading state during auth check, error for unauthenticated users
// Connected to: useAuth hook for authentication state, used by admin pages

import { useAuth } from '@/state/auth'

// Higher-order component that protects child components from unauthorized access
// Renders children only if user is authenticated, shows appropriate fallbacks otherwise
export default function Protected({children}:{children:React.ReactNode}){
  const { user, loading } = useAuth() // Get current authentication state
  
  // Show loading indicator while checking authentication status
  if (loading) return <p>Loading…</p>
  
  // Render protected content if authenticated, otherwise show error message
  return user ? <>{children}</> : <p className="text-red-600">Unauthorized. Please login.</p>
}
