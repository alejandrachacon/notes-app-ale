import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
