import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, User } from '@/services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password)
    const { user, access, refresh } = response.data
    
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const register = async (email: string, password: string) => {
    const response = await authAPI.register(email, password)
    const { user, access, refresh } = response.data
    
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      authAPI.logout(refreshToken).catch(() => {})
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
