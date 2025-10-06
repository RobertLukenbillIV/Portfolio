import { useAuth } from '../context/AuthContext'

export default function Protected({children}:{children:React.ReactNode}){
  const { user, loading } = useAuth()
  if (loading) return <p>Loading…</p>
  return user ? <>{children}</> : <p className="text-red-600">Unauthorized. Please login.</p>
}
