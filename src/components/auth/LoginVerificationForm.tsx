// Login verification form component

import React, { useState, useEffect } from 'react'
import { Mail, Shield, ArrowLeft, RefreshCw } from 'lucide-react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

interface LoginVerificationFormProps {
  email: string
  userName: string
  onVerify: (code: string) => Promise<void>
  onResend: () => Promise<void>
  onBack: () => void
  loading?: boolean
  error?: string
  resendLoading?: boolean
}

export const LoginVerificationForm: React.FC<LoginVerificationFormProps> = ({
  email,
  userName,
  onVerify,
  onResend,
  onBack,
  loading = false,
  error,
  resendLoading = false
}) => {
  const [code, setCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 6)
    setCode(numericValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 6) {
      return
    }

    await onVerify(code)
  }

  const handleResend = async () => {
    setCanResend(false)
    setTimeLeft(900) // Reset to 15 minutes
    setCode('')
    await onResend()
  }

  return (
    <div 
      className="max-w-md mx-auto p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 
          className="text-2xl font-bold mb-2"
          style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Verify Login
        </h2>
        <p className="text-sm text-slate-600">
          Hello {userName}! We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-slate-800 mt-1 text-sm">{email}</p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Verification Code Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="h-4 w-4 inline mr-2" />
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="input-field w-full text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <p className="text-sm text-slate-500 mt-2 text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Timer */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-slate-600">
              Code expires in <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold">
              Verification code has expired
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="button-primary w-full py-3 text-lg font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Logging In...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resendLoading}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {resendLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-1" />
                Resend Code
              </div>
            )}
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-800 font-medium text-sm"
          >
            <div className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </div>
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Check your spam folder if you don't see the email in your inbox.
        </p>
      </div>
    </div>
  )
}
