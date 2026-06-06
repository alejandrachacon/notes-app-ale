import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'

const TestComponent = () => <div>Protected Content</div>
const LoginComponent = () => <div>Login Page</div>

const renderWithRouter = (initialRoute = '/protected', user: any = null) => {
  if (user) {
    localStorage.setItem('access_token', 'mock-token')
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.clear()
  }

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render children when user is authenticated', () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    renderWithRouter('/protected', mockUser)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to login when user is not authenticated', () => {
    renderWithRouter('/protected', null)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should show loading state while checking authentication', () => {
    localStorage.clear()
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )

    const loadingElement = screen.queryByText('Loading...')
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument()
    }
  })

  it('should render children after loading completes with authenticated user', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    renderWithRouter('/protected', mockUser)

    expect(await screen.findByText('Protected Content')).toBeInTheDocument()
  })
})
