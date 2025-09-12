// Registration form component with city autocomplete

import React, { useState, useEffect } from 'react'
import { User, Mail, UserCheck, Lock, Eye, EyeOff, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'
import { useGoogleAuth } from '../../services/googleAuth'
import { useNotification } from '../../hooks/useNotification'

interface RegistrationData {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>
  loading?: boolean
  error?: string
}


export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading = false,
  error
}) => {
  const { signInWithGoogle, signUpWithGoogle, isGoogleAvailable } = useGoogleAuth()
  const { showSuccess, showError, showCelebration } = useNotification()
  const [formData, setFormData] = useState<RegistrationData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!formData.confirm_password.trim()) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showError('Validation Failed', 'Please fix the errors in the form before submitting')
      return
    }

    try {
      await onSubmit(formData)
      showCelebration('Welcome Aboard! 🎉', 'Your account has been created successfully! Welcome to our platform!')
    } catch (error) {
      showError('Registration Failed', 'Unable to create your account. Please try again.')
    }
  }

  const handleGoogleSignUp = async () => {
    if (!isGoogleAvailable) {
      showError('Google Unavailable', 'Google authentication is not available at the moment')
      return
    }

    setGoogleLoading(true)
    
    try {
      await signUpWithGoogle()
      showSuccess('Google Sign-Up', 'Redirecting to Google for authentication...')
    } catch (err) {
      console.error('Google sign-up error:', err)
      showError('Google Sign-Up Failed', 'Unable to sign up with Google. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }


  return (
    <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="w-full max-w-2xl">
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
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                Create Your Account
              </h2>
              <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                Join SwiftApply.ai and start your automated job application journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-sm"></div>
                <div className="relative p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign Up - Moved to Top */}
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading || !isGoogleAvailable}
              className="group/google relative w-full py-3 px-6 bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-red-500/20 opacity-0 group-hover/google:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <div className="relative flex items-center space-x-3">
                {googleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="font-medium">Signing up...</span>
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
                      {isGoogleAvailable ? 'Sign up with Google' : 'Google unavailable'}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group/field">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                    <User className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10 ${
                        errors.first_name ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your first name"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.first_name && (
                    <p className="text-red-300 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div className="group/field">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                    <User className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10 ${
                        errors.last_name ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your last name"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.last_name && (
                    <p className="text-red-300 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="group/field">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                  <Mail className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10 ${
                      errors.email ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50' : 'border-white/20'
                    }`}
                    placeholder="Enter your email address"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm mt-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group/field">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                    <Lock className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10 ${
                        errors.password ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="text-red-300 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="group/field">
                  <label className="block text-sm font-medium text-gray-300 mb-2 group-hover/field:text-white transition-colors duration-300">
                    <Lock className="h-4 w-4 inline mr-2 group-hover/field:scale-110 transition-transform duration-300" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirm_password}
                      onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                      className={`w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all duration-300 group-hover/field:bg-white/10 ${
                        errors.confirm_password ? 'border-red-400/50 focus:ring-red-500/50 focus:border-red-400/50' : 'border-white/20'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-500/20 opacity-0 group-hover/field:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-300 text-sm mt-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirm_password}
                    </p>
                  )}
                </div>
              </div>






              {/* Submit Button */}
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <CheckCircle className="h-4 w-4 ml-2 group-hover/btn:scale-110 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>


            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
