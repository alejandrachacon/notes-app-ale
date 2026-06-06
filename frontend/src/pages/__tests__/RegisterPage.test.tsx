import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../RegisterPage'
import { AuthProvider } from '@/contexts/AuthContext'
import { authAPI } from '@/services/api'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderRegisterPage = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should render registration form', () => {
    renderRegisterPage()

    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should show link to login page', () => {
    renderRegisterPage()

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })

  it('should handle successful registration', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      data: {
        user: { id: '1', email: 'newuser@example.com' },
        access: 'access-token',
        refresh: 'refresh-token',
      },
    }

    ;(authAPI.register as jest.Mock).mockResolvedValue(mockResponse)

    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const signupButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(signupButton)

    await waitFor(() => {
      expect(authAPI.register).toHaveBeenCalledWith('newuser@example.com', 'password123')
      expect(mockNavigate).toHaveBeenCalledWith('/notes')
    })
  })

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup()

    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const signupButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'differentpassword')
    await user.click(signupButton)

    await waitFor(() => {
      expect(authAPI.register).not.toHaveBeenCalled()
    })
  })

  it('should show error toast on registration failure', async () => {
    const user = userEvent.setup()
    const mockError = {
      response: {
        data: {
          email: ['This email is already registered'],
        },
      },
    }

    ;(authAPI.register as jest.Mock).mockRejectedValue(mockError)

    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const signupButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(signupButton)

    await waitFor(() => {
      expect(authAPI.register).toHaveBeenCalled()
    })
  })

  it('should disable button while loading', async () => {
    const user = userEvent.setup()
    ;(authAPI.register as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    const signupButton = screen.getByRole('button', { name: /sign up/i })

    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    await user.click(signupButton)

    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
  })

  it('should require all fields', () => {
    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
    expect(confirmPasswordInput).toBeRequired()
  })

  it('should have correct input types', () => {
    renderRegisterPage()

    const emailInput = screen.getByLabelText(/^email$/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })
})
