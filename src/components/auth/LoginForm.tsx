// Login form component with email verification

import React, { useState } from 'react'
import { Mail, LogIn, ArrowLeft, UserPlus } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { useNotification } from '../../hooks/useNotification'

interface LoginFormProps {
  onSubmit: (email: string) => Promise<void>
  onGoToRegister: () => void
  loading?: boolean
  error?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoToRegister,
  loading = false,
  error
}) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const { showSuccess, showError, showInfo } = useNotification()

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (emailError) {
      setEmailError('')
    }
  }

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      showError('Invalid Email', 'Please enter a valid email address')
      return
    }

    try {
      await onSubmit(email)
      showSuccess('Login Initiated', 'Please check your email for the verification code')
    } catch (error) {
      showError('Login Failed', 'Unable to send verification email. Please try again.')
    }
  }

  return (
    <div 
      className="max-w-md mx-auto p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 
          className="text-3xl font-bold mb-3"
          style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome Back
        </h2>
        <p className="text-slate-600">
          Enter your email to receive a login verification code
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="h-4 w-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`input-field w-full ${emailError ? 'border-red-500' : ''}`}
            placeholder="Enter your email address"
            autoComplete="email"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="button-primary w-full py-3 text-lg font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Sending Code...</span>
            </div>
          ) : (
            'Send Login Code'
          )}
        </button>

        {/* Register Link */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-2">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <div className="flex items-center justify-center">
              <UserPlus className="h-4 w-4 mr-1" />
              Create Account
            </div>
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          We'll send a verification code to your email for secure login.
        </p>
      </div>
    </div>
  )
}
