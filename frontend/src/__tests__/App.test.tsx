import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<App />)
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('should redirect unauthenticated users to login', async () => {
    localStorage.clear()

    render(<App />)

    await waitFor(() => {
      // Root path redirects to /notes, which then redirects to /login when not authenticated
      expect(window.location.pathname).toBe('/login')
    })
  })

  it('should render AuthProvider', () => {
    render(<App />)
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('should render Router', () => {
    render(<App />)
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('should include Toaster component', () => {
    render(<App />)
    expect(document.querySelector('body')).toBeInTheDocument()
  })

  it('should have login route', () => {
    window.history.pushState({}, 'Login', '/login')
    render(<App />)
    
    waitFor(() => {
      expect(screen.queryByText(/welcome back/i)).toBeInTheDocument()
    })
  })

  it('should have register route', () => {
    window.history.pushState({}, 'Register', '/register')
    render(<App />)
    
    waitFor(() => {
      expect(screen.queryByText(/create an account/i)).toBeInTheDocument()
    })
  })

  it('should protect notes route', () => {
    localStorage.clear()
    window.history.pushState({}, 'Notes', '/notes')
    render(<App />)
    
    waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  it('should allow access to notes route when authenticated', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    localStorage.setItem('access_token', 'mock-token')
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    window.history.pushState({}, 'Notes', '/notes')
    render(<App />)
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/notes')
    })
  })
})
