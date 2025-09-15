/**
 * Enhanced Auto-Apply Component
 * Fast, automated job application with real-time progress tracking
 */

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEnhancedAutoApply } from '../../hooks/useEnhancedAutoApply'
import { DatabaseJob } from '../../types'

interface EnhancedAutoApplyProps {
  job: DatabaseJob
  onApplicationComplete?: (success: boolean, message: string) => void
  onClose?: () => void
}

export const EnhancedAutoApply: React.FC<EnhancedAutoApplyProps> = ({
  job,
  onApplicationComplete,
  onClose
}) => {
  const { user } = useAuth()
  const {
    startApplication,
    cancelApplication,
    submitSecurityCode,
    currentProgress,
    isProcessing,
    isWaitingForSecurityCode,
    applications,
    error,
    clearError,
    serviceAvailable,
    testService
  } = useEnhancedAutoApply(user?.id)

  const [showProgress, setShowProgress] = useState(false)
  const [applicationStarted, setApplicationStarted] = useState(false)
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false)
  const [securityCode, setSecurityCode] = useState('')
  const [pendingJobId, setPendingJobId] = useState<number | null>(null)

  // Test service availability on mount
  useEffect(() => {
    testService()
  }, [testService])

  // Show security code modal when waiting for security code
  useEffect(() => {
    if (isWaitingForSecurityCode && !showSecurityCodeModal) {
      setPendingJobId(job.id)
      setShowSecurityCodeModal(true)
      setShowProgress(false)
    }
  }, [isWaitingForSecurityCode, showSecurityCodeModal, job.id])

  const handleStartApplication = async () => {
    if (!user) {
      alert('Please log in to apply for jobs')
      return
    }

    try {
      clearError()
      setApplicationStarted(true)
      setShowProgress(true)

      const success = await startApplication(user.id, job.id)
      
      if (success) {
        console.log('Application started successfully')
      } else {
        setApplicationStarted(false)
        setShowProgress(false)
      }
    } catch (err) {
      console.error('Error starting application:', err)
      setApplicationStarted(false)
      setShowProgress(false)
    }
  }

  const handleCancelApplication = async () => {
    if (!user) return

    try {
      const success = await cancelApplication(user.id, job.id)
      
      if (success) {
        setApplicationStarted(false)
        setShowProgress(false)
        setShowSecurityCodeModal(false)
        onClose?.()
      }
    } catch (err) {
      console.error('Error cancelling application:', err)
    }
  }

  const handleSubmitSecurityCode = async () => {
    if (!user || !pendingJobId || securityCode.length !== 8) {
      alert('Please enter a valid 8-digit security code')
      return
    }

    try {
      clearError()
      setShowSecurityCodeModal(false)
      setShowProgress(true)

      const success = await submitSecurityCode(user.id, pendingJobId, securityCode)
      
      if (success) {
        console.log('Security code submitted successfully')
      } else {
        setShowSecurityCodeModal(true)
        setShowProgress(false)
      }
    } catch (err) {
      console.error('Error submitting security code:', err)
      setShowSecurityCodeModal(true)
      setShowProgress(false)
    }
  }

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
    setSecurityCode(value)
  }

  const handleClose = () => {
    if (isProcessing) {
      if (confirm('Application is in progress. Are you sure you want to close?')) {
        setShowProgress(false)
        onClose?.()
      }
    } else {
      setShowProgress(false)
      onClose?.()
    }
  }

  const getProgressPercentage = () => {
    if (!currentProgress) return 0
    return Math.round((currentProgress.step / currentProgress.total_steps) * 100)
  }

  const getStatusColor = () => {
    if (!currentProgress) return 'bg-gray-500'
    
    switch (currentProgress.status) {
      case 'processing':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (!serviceAvailable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Service Unavailable</h2>
            <p className="text-gray-600 mb-4">
              The enhanced auto-apply service is currently unavailable. Please try again later.
            </p>
            <button
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Security Code Modal */}
      {showSecurityCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-blue-500 text-6xl mb-4">🔐</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Security Code Required</h2>
              <p className="text-gray-600 mb-4">
                Please enter the 8-digit security code that appeared after submitting your application.
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={securityCode}
                  onChange={handleSecurityCodeChange}
                  placeholder="Enter 8-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={8}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {securityCode.length}/8 digits
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmitSecurityCode}
                  disabled={securityCode.length !== 8}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Submit Code
                </button>
                <button
                  onClick={() => {
                    setShowSecurityCodeModal(false)
                    setSecurityCode('')
                    onClose?.()
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {showProgress ? 'Application Progress' : 'Enhanced Auto-Apply'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Job Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company_name}</p>
          <p className="text-sm text-gray-500">
            {job.job_type} • {job.location || 'Location not specified'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Progress Display */}
        {showProgress && currentProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {currentProgress.current_action}
              </span>
              <span className="text-sm text-gray-500">
                Step {currentProgress.step} of {currentProgress.total_steps}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getStatusColor()}`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">{currentProgress.message}</p>
            
            {currentProgress.status === 'completed' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex">
                  <div className="text-green-500 text-xl mr-3">✅</div>
                  <div>
                    <h4 className="text-green-800 font-semibold">Application Complete!</h4>
                    <p className="text-green-700">
                      Your application has been submitted successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {currentProgress.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="text-red-500 text-xl mr-3">❌</div>
                  <div>
                    <h4 className="text-red-800 font-semibold">Application Failed</h4>
                    <p className="text-red-700">
                      There was an error processing your application. Please try again.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!showProgress && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Automated Application
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI will automatically fill out the application form with your information
                and generate professional responses tailored to this job.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What We'll Do:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fill in your personal information</li>
                  <li>• Generate a professional resume (2,500-3,500 chars)</li>
                  <li>• Answer application questions with AI</li>
                  <li>• Submit the application automatically</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Benefits:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Saves time and effort</li>
                  <li>• Professional, tailored responses</li>
                  <li>• Real-time progress tracking</li>
                  <li>• Higher success rate</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleStartApplication}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isProcessing ? 'Starting...' : 'Start Application'}
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Processing Actions */}
        {showProgress && isProcessing && (
          <div className="flex space-x-4">
            <button
              onClick={handleCancelApplication}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-semibold"
            >
              Cancel Application
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}

        {/* Completed Actions */}
        {showProgress && !isProcessing && currentProgress?.status === 'completed' && (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowProgress(false)
                onApplicationComplete?.(true, 'Application submitted successfully!')
                onClose?.()
              }}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold"
            >
              Done
            </button>
          </div>
        )}

        {/* Failed Actions */}
        {showProgress && !isProcessing && currentProgress?.status === 'error' && (
          <div className="flex space-x-4">
            <button
              onClick={handleStartApplication}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
