import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

function ProtectedRoute({}) {
  const { authUser, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (!authUser) return <Navigate to="/" />

  return <Outlet />
}

export default ProtectedRoute
