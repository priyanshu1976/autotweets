import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/DashBoard'
import Settings from './pages/Settings'
import TwitterAPISetup from './pages/TwitterAPISetup'
import MainLayout from './layout/sidebarLayout'
import { useAuthStore } from './store/useAuthStore'
import ProtectedRoute from './lib/ProtectedRoute'
import TweetPreferences from './pages/tweetprompt'
function App() {
  const { authUser, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/apisetup" element={<TwitterAPISetup />} />
            <Route path="/prompt" element={<TweetPreferences />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
