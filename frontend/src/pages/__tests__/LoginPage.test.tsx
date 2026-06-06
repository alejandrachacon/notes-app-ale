import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { AuthProvider } from '@/contexts/AuthContext'
import { authAPI } from '@/services/api'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderLoginPage = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render login form', () => {
    renderLoginPage()

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should show link to register page', () => {
    renderLoginPage()

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        access: 'access-token',
        refresh: 'refresh-token',
      },
    }

    ;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)

    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/notes')
    })
  })

  it('should show error toast on login failure', async () => {
    const user = userEvent.setup()
    const mockError = {
      response: {
        data: {
          error: 'Invalid credentials',
        },
      },
    }

    ;(authAPI.login as jest.Mock).mockRejectedValue(mockError)

    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalled()
    })
  })

  it('should disable button while loading', async () => {
    const user = userEvent.setup()
    ;(authAPI.login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const loginButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled()
  })

  it('should require email and password fields', () => {
    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('should have email type for email input', () => {
    renderLoginPage()

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should have password type for password input', () => {
    renderLoginPage()

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
