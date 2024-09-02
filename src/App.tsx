import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App: React.FC = () => {
  const { user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/profile" /> : <LoginPage />} />
        
        <Route 
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        
        <Route 
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/profile" />}
        />
      </Routes>
    </Router>
  )
}

export default App
