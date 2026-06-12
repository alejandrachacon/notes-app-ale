import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../../../src/app/register/page';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('LoginPage', () => {
  describe('Page Rendering', () => {
    it('should render without crashing', () => {
      render(<LoginPage />);
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it('should render the page title', () => {
      render(<LoginPage />);
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it('should render the page description', () => {
      render(<LoginPage />);
      expect(screen.getByText(/Enter your credentials/i)).toBeInTheDocument();
    });
  });

  describe('Major Sections', () => {
    it('should render the login card container', () => {
      const { container } = render(<LoginPage />);
      // Card component should be present
      const card = container.querySelector('[class*="rounded"]');
      expect(card).toBeInTheDocument();
    });

    it('should render the email input field', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render the password input field', () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should render the submit button', () => {
      render(<LoginPage />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should render the sign up link', () => {
      render(<LoginPage />);
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });
  });

  describe('Form Elements', () => {
    it('should have email input with correct type', () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password input with correct type', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have email input with placeholder', () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('placeholder');
    });

    it('should have password input with placeholder', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('placeholder');
    });

    it('should mark email as required', () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeRequired();
    });

    it('should mark password as required', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Layout and Styling', () => {
    it('should apply background gradient', () => {
      const { container } = render(<LoginPage />);
      const background = container.firstChild;
      expect(background).toHaveClass('bg-gradient-to-br');
    });

    it('should center the login card', () => {
      const { container } = render(<LoginPage />);
      const background = container.firstChild;
      expect(background).toHaveClass('flex');
      expect(background).toHaveClass('items-center');
      expect(background).toHaveClass('justify-center');
    });

    it('should apply min-height to container', () => {
      const { container } = render(<LoginPage />);
      const background = container.firstChild;
      expect(background).toHaveClass('min-h-screen');
    });

    it('should limit card width', () => {
      const { container } = render(<LoginPage />);
      // Card should have max-width constraint
      const card = container.querySelector('[class*="max-w"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      const { container } = render(<LoginPage />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have labels associated with inputs', () => {
      render(<LoginPage />);
      const emailLabel = screen.getByText(/email/i);
      const passwordLabel = screen.getByText(/password/i);
      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });

    it('should have submit button with proper role', () => {
      render(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /login/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Snapshot', () => {
    it('should match snapshot', () => {
      const { container } = render(<LoginPage />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
