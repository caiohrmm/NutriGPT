import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on app start
  useEffect(() => {
    checkAuth()
    
    // Escuta evento de logout do interceptor
    const handleLogout = () => {
      setUser(null)
    }
    
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authAPI.me()
      setUser(response.user)
    } catch (error) {
      // User not authenticated
      setUser(null)
      localStorage.removeItem('accessToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    
    // Salva o access token do response
    if (response.tokens?.accessToken) {
      localStorage.setItem('accessToken', response.tokens.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.tokens.accessToken}`
    }
    
    setUser(response.user)
    return response
  }

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password })
    
    // Salva o access token do response
    if (response.tokens?.accessToken) {
      localStorage.setItem('accessToken', response.tokens.accessToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.tokens.accessToken}`
    }
    
    setUser(response.user)
    return response
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('accessToken')
      delete api.defaults.headers.common['Authorization']
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}