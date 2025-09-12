'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegistrationForm } from '../../src/components/auth/RegistrationForm'
import { CheckCircle, ArrowLeft, Zap, Sparkles, ArrowRight } from 'lucide-react'
import { apiClient } from '../../src/api/client'
import { useAuth } from '../../src/context/AuthContext'

interface RegistrationData {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

interface ApiResponse {
  success: boolean
  error?: string
  message?: string
  user?: any
  verification_code?: string
}

type RegistrationStep = 'form' | 'success'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState<RegistrationStep>('form')
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleRegistration = async (data: RegistrationData) => {
    setLoading(true)
    setError('')
    
    try {
      // Validate password confirmation
      if (data.password !== data.confirm_password) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Remove confirm_password from data sent to backend
      const { confirm_password, ...registrationData } = data

      // Call backend API to register user
      const result = await apiClient.post<ApiResponse>('/auth/register', registrationData)

      if (result.success) {
        setRegistrationData(data)
        // Auto-login after successful registration
        if (result.user) {
          login(result.user)
          // Redirect directly to dashboard after successful registration and login
          router.push('/dashboard')
          return
        } else {
          setStep('success')
        }
      } else {
        // Handle specific error cases
        if (result.error && result.error.includes('already exists')) {
          setError('An account with this email already exists. Please try logging in instead.')
        } else {
          setError(result.error || 'Registration failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const handleBackToForm = () => {
    setStep('form')
    setError('')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const renderStep = () => {
    switch (step) {
      case 'form':
        return (
          <RegistrationForm
            onSubmit={handleRegistration}
            loading={loading}
            error={error}
          />
        )
      
      case 'success':
        return (
          <div className="w-full max-w-md">
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 text-center">
                {/* Success Animation */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="h-3 w-3 text-yellow-800" />
                  </div>
                  {/* Success rings animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-50 animation-delay-1000"></div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
                  Welcome to SwiftApply.ai!
                </h2>
                
                <p className="text-gray-300 mb-8 group-hover:text-white transition-colors duration-300">
                  Your account has been successfully created and verified. 
                  You can now start using SwiftApply.ai to automate your job applications.
                </p>
                
                <button
                  onClick={handleGoToDashboard}
                  className="group/btn relative w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
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
          onClick={() => router.push('/')}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-full max-w-4xl">
            {/* Login Link */}
            {step === 'form' && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-white rounded-xl border border-white/20">
                  <span className="text-sm">Already have an account?</span>
                  <button
                    onClick={() => router.push('/login')}
                    className="group/link inline-flex items-center space-x-1 text-emerald-300 hover:text-white font-medium transition-colors duration-300"
                  >
                    <span>Sign in here</span>
                    <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            )}

            {/* Form Content */}
            {renderStep()}

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
