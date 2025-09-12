'use client'

import React, { useState } from 'react'
import { Mail, Shield, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { apiClient } from '../../api/client'

interface VerificationCodeInputProps {
  email: string
  onVerificationComplete: (sessionId: string) => void
  onError: (error: string) => void
  onCancel: () => void
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  email,
  onVerificationComplete,
  onError,
  onCancel
}) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'email' | 'code' | 'processing'>('email')
  const [error, setError] = useState('')

  const handleEmailSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      // Start scraping session with email only (no verification code yet)
      const response = await apiClient.post<{
        success: boolean
        session_id: string
        message: string
      }>('/greenhouse/start-scraping-with-verification', {
        email: email,
        verification_code: null,
        max_jobs: 1000
      })

      if (response.success) {
        setStep('code')
        console.log('✅ Verification code request sent to email')
      } else {
        setError('Failed to send verification code. Please try again.')
      }
    } catch (err) {
      console.error('Error sending verification code:', err)
      setError('Failed to send verification code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCodeSubmit = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Start scraping session with verification code
      const response = await apiClient.post<{
        success: boolean
        session_id: string
        message: string
      }>('/greenhouse/start-scraping-with-verification', {
        email: email,
        verification_code: verificationCode,
        max_jobs: 1000
      })

      if (response.success) {
        setStep('processing')
        onVerificationComplete(response.session_id)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (err) {
      console.error('Error submitting verification code:', err)
      setError('Failed to verify code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6) // Only numbers, max 6 digits
    setVerificationCode(value)
    setError('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {step === 'email' && <Mail className="h-8 w-8 text-white" />}
          {step === 'code' && <Shield className="h-8 w-8 text-white" />}
          {step === 'processing' && <Loader2 className="h-8 w-8 text-white animate-spin" />}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {step === 'email' && 'Greenhouse Login'}
          {step === 'code' && 'Enter Verification Code'}
          {step === 'processing' && 'Processing...'}
        </h3>
        <p className="text-sm text-gray-600">
          {step === 'email' && 'We\'ll send a verification code to your email'}
          {step === 'code' && 'Check your email for the verification code'}
          {step === 'processing' && 'Logging in and starting job scraping...'}
        </p>
      </div>

      {step === 'email' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Email Address</span>
            </div>
            <p className="text-sm text-blue-700 mt-1 font-mono bg-blue-100 px-2 py-1 rounded">
              {email}
            </p>
          </div>

          <button
            onClick={handleEmailSubmit}
            disabled={isSubmitting}
            className="w-full button-primary flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Send Verification Code</span>
              </>
            )}
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Code Sent</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={handleInputChange}
              placeholder="123456"
              className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCodeSubmit}
              disabled={isSubmitting || verificationCode.length !== 6}
              className="flex-1 button-primary flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Verify & Start Scraping</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
              <span className="text-sm font-medium text-emerald-900">Processing</span>
            </div>
            <p className="text-sm text-emerald-700">
              Logging into Greenhouse and starting job scraping...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>
          <strong>Note:</strong> Greenhouse now uses email verification instead of passwords for enhanced security.
          The verification code will be sent to your registered email address.
        </p>
      </div>
    </div>
  )
}

export default VerificationCodeInput
