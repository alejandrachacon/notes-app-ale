import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotesPage from '@/pages/NotesPage'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/notes" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  )
}

export default App
