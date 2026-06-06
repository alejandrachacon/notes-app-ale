# Frontend Testing Guide

This project uses **Jest** and **React Testing Library** for unit testing following TDD (Test-Driven Development) principles.

## Test Structure

```
src/
├── __tests__/
│   └── App.test.tsx
├── components/
│   └── __tests__/
│       └── ProtectedRoute.test.tsx
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx
├── hooks/
│   └── __tests__/
│       └── use-toast.test.tsx
├── lib/
│   └── __tests__/
│       └── utils.test.ts
└── pages/
    └── __tests__/
        ├── LoginPage.test.tsx
        ├── RegisterPage.test.tsx
        └── NotesPage.test.tsx
```

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Coverage

The test suite covers:

### 1. **Utility Functions** (`lib/utils.test.ts`)
- Class name merging with `cn()` utility
- Tailwind CSS class conflict resolution
- Conditional class handling
- Edge cases (null, undefined, empty arrays)

### 2. **Custom Hooks** (`hooks/use-toast.test.tsx`)
- Toast creation and display
- Toast dismissal
- Toast variants (default, destructive)
- Toast limit enforcement
- Unique ID generation

### 3. **Context** (`contexts/AuthContext.test.tsx`)
- User authentication state management
- Login functionality
- Registration functionality
- Logout functionality
- Token storage in localStorage
- Error handling for auth operations
- Context provider requirements

### 4. **Components** (`components/ProtectedRoute.test.tsx`)
- Route protection for unauthenticated users
- Redirect to login when not authenticated
- Allow access when authenticated
- Loading state handling

### 5. **Page Components**

#### LoginPage (`pages/LoginPage.test.tsx`)
- Form rendering
- User input handling
- Successful login flow
- Error handling and toast notifications
- Loading states
- Form validation
- Navigation after login

#### RegisterPage (`pages/RegisterPage.test.tsx`)
- Registration form rendering
- Password confirmation validation
- Successful registration flow
- Error handling for duplicate emails
- Loading states
- Form validation
- Navigation after registration

#### NotesPage (`pages/NotesPage.test.tsx`)
- Notes list rendering
- Create new note functionality
- Edit existing note functionality
- Delete note functionality
- Empty state display
- Loading state
- Error handling
- User logout

### 6. **App Component** (`__tests__/App.test.tsx`)
- Router configuration
- Route protection
- AuthProvider integration
- Toaster component inclusion
- Navigation flows

## Test Patterns

### Mocking API Calls
```typescript
jest.mock('@/services/api')
;(authAPI.login as jest.Mock).mockResolvedValue(mockResponse)
```

### Testing User Interactions
```typescript
const user = userEvent.setup()
await user.type(emailInput, 'test@example.com')
await user.click(loginButton)
```

### Testing Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### Testing Context Providers
```typescript
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)
const { result } = renderHook(() => useAuth(), { wrapper })
```

## Best Practices

1. **Arrange-Act-Assert Pattern**: Structure tests with clear setup, action, and verification phases
2. **User-Centric Testing**: Test from the user's perspective using accessible queries
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Cleanup**: Use `beforeEach` to reset state and clear mocks
5. **Meaningful Assertions**: Test behavior, not implementation details
6. **Coverage Goals**: Aim for >80% code coverage on critical paths

## Configuration Files

- **`jest.config.js`**: Jest configuration with TypeScript support
- **`src/setupTests.ts`**: Test environment setup with jest-dom matchers
- **`tsconfig.json`**: TypeScript configuration with path aliases

## Troubleshooting

### Path Alias Issues
If you encounter module resolution errors, ensure:
- `tsconfig.json` has the correct `paths` configuration
- `jest.config.js` has matching `moduleNameMapper` settings

### Mock Issues
If mocks aren't working:
- Clear mocks in `beforeEach` with `jest.clearAllMocks()`
- Ensure mocks are defined before imports
- Use `jest.requireActual()` for partial mocks

### Async Test Failures
- Always use `await` with `waitFor()`
- Increase timeout if needed: `jest.setTimeout(10000)`
- Check for unhandled promise rejections

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Run tests
  run: npm test -- --coverage --watchAll=false
```

## Next Steps

- Add integration tests for complete user flows
- Add E2E tests with Playwright or Cypress
- Set up visual regression testing
- Configure pre-commit hooks to run tests
