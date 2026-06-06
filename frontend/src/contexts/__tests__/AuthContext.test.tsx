import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { authAPI } from '@/services/api'
import { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
      
      consoleError.mockRestore()
    })

    it('should initialize with null user and loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      
      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should load user from localStorage on mount', () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      localStorage.setItem('access_token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toEqual(mockUser)
    })
  })

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com' },
          access: 'access-token',
          refresh: 'refresh-token',
        },
      }

      ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })

      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(result.current.user).toEqual(mockResponse.data.user)
      expect(localStorage.getItem('access_token')).toBe('access-token')
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user))
    })

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials')
      ;(authAPI.login as jest.Mock).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrong-password')
        })
      ).rejects.toThrow('Invalid credentials')

      expect(result.current.user).toBeNull()
    })
  })

  describe('register', () => {
    it('should register successfully and store tokens', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'newuser@example.com' },
          access: 'access-token',
          refresh: 'refresh-token',
        },
      }

      ;(authAPI.register as jest.Mock).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.register('newuser@example.com', 'password123')
      })

      expect(authAPI.register).toHaveBeenCalledWith('newuser@example.com', 'password123')
      expect(result.current.user).toEqual(mockResponse.data.user)
      expect(localStorage.getItem('access_token')).toBe('access-token')
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
    })

    it('should handle registration failure', async () => {
      const mockError = new Error('Email already exists')
      ;(authAPI.register as jest.Mock).mockRejectedValue(mockError)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await expect(
        act(async () => {
          await result.current.register('existing@example.com', 'password123')
        })
      ).rejects.toThrow('Email already exists')

      expect(result.current.user).toBeNull()
    })
  })

  describe('logout', () => {
    it('should logout and clear tokens', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      localStorage.setItem('access_token', 'access-token')
      localStorage.setItem('refresh_token', 'refresh-token')
      localStorage.setItem('user', JSON.stringify(mockUser))

      ;(authAPI.logout as jest.Mock).mockResolvedValue({})

      const { result } = renderHook(() => useAuth(), { wrapper })

      act(() => {
        result.current.logout()
      })

      await waitFor(() => {
        expect(result.current.user).toBeNull()
      })

      expect(authAPI.logout).toHaveBeenCalledWith('refresh-token')
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('should logout even if API call fails', () => {
      localStorage.setItem('refresh_token', 'refresh-token')
      ;(authAPI.logout as jest.Mock).mockRejectedValue(new Error('API error'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(localStorage.getItem('refresh_token')).toBeNull()
    })

    it('should handle logout without refresh token', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      act(() => {
        result.current.logout()
      })

      expect(authAPI.logout).not.toHaveBeenCalled()
      expect(result.current.user).toBeNull()
    })
  })
})
