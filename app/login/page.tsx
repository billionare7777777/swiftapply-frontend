'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Zap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { apiClient } from '../../src/api/client'
import { useAuth } from '../../src/context/AuthContext'
import { useGoogleAuth } from '../../src/services/googleAuth'

interface LoginData {
  email: string
  password: string
}

interface ApiResponse {
  success: boolean
  error?: string
  message?: string
  user?: any
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { signInWithGoogle, isGoogleAvailable } = useGoogleAuth()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Get the redirect URL from query parameters
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await apiClient.post<ApiResponse>('/auth/login', formData)

      if (result.success) {
        // Use auth context to store user data
        login(result.user)
        
        // Set flag to auto-start Greenhouse scraping with verification code after dashboard loads
        localStorage.setItem('autoStartGreenhouseScraping', 'true')
        localStorage.setItem('greenhouseCredentials', JSON.stringify({
          email: formData.email,
          useVerificationCode: true
        }))
        
        // Set flag to show results modal when scraping completes
        localStorage.setItem('showScrapingResultsModal', 'true')
        
        // Redirect to the intended destination or dashboard
        router.push(redirectTo)
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToRegister = () => {
    router.push('/register')
  }

  const handleGoBack = () => {
    router.push('/')
  }

  const handleGoogleSignIn = async () => {
    if (!isGoogleAvailable) {
      setError('Google authentication is not available. Please check your configuration.')
      return
    }

    setGoogleLoading(true)
    setError('')
    
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
      console.error('Google sign-in error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Mouse Follower */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-r from-emerald-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={handleGoBack}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-full max-w-md">
            {/* Login Form */}
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-3 w-3 text-yellow-800" />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                    Welcome Back
                  </h2>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Sign in to continue your journey with SwiftApply.ai
                  </p>
                </div>
                
                {/* Google Sign In - Moved to Top */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || !isGoogleAvailable}
                  className="group/google relative w-full py-3 px-6 bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 opacity-0 group-hover/google:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <div className="relative flex items-center space-x-3">
                    {googleLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="font-medium">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium">
                          {isGoogleAvailable ? 'Sign in with Google' : 'Google unavailable'}
                        </span>
                      </>
                    )}
                  </div>
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-100">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-sm"></div>
                      <div className="relative p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
                          <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="group/field">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                      <Mail className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group/field">
                    <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                      <Lock className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn relative w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowLeft className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300 rotate-180" />
                        </>
                      )}
                    </div>
                  </button>
                </form>


                {/* Register Link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-400 mb-4">
                    Don't have an account?
                  </p>
                  <button
                    onClick={handleGoToRegister}
                    className="group/link inline-flex items-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/30"
                  >
                    <span>Create Account</span>
                    <ArrowLeft className="h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300 rotate-180" />
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}