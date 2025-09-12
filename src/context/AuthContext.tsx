'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  location_city?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  bio?: string
  job_title?: string
  company?: string
  skills?: string[]
  education?: any[]
  employment?: any[]
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing user session on mount
    const checkAuth = () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setLoading(false)
          return
        }

        // If no localStorage, check cookies (for server-side compatibility)
        const cookies = document.cookie.split(';')
        const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
        if (userCookie) {
          const cookieValue = userCookie.split('=')[1]
          if (cookieValue && cookieValue !== 'null') {
            const userData = JSON.parse(decodeURIComponent(cookieValue))
            setUser(userData)
            // Also set localStorage for consistency
            localStorage.setItem('user', JSON.stringify(userData))
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('user')
        // Clear invalid cookie
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Set cookie for middleware to read
    const cookieValue = JSON.stringify(userData)
    document.cookie = `user=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=Lax` // 7 days
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    
    // Clear the cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax'
    router.push('/login')
  }

  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
