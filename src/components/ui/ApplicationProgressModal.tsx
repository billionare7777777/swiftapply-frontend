import React, { useState, useEffect } from 'react'
import { X, CheckCircle, Clock, AlertCircle, Bot, FileText, Send, Download } from 'lucide-react'
import { ApplicationProgress } from '../../types'

interface ApplicationProgressModalProps {
  progress: ApplicationProgress
  applicationId: string | null
  onClose: () => void
}

export const ApplicationProgressModal: React.FC<ApplicationProgressModalProps> = ({
  progress,
  applicationId,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(progress.step)
  const [isCompleted, setIsCompleted] = useState(progress.status === 'completed')

  useEffect(() => {
    setCurrentStep(progress.step)
    setIsCompleted(progress.status === 'completed')
  }, [progress])

  const getStepIcon = (step: number) => {
    if (step < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (step === currentStep) {
      return progress.status === 'error' ? (
        <AlertCircle className="h-5 w-5 text-red-600" />
      ) : (
        <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      )
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) {
      return 'completed'
    } else if (step === currentStep) {
      return progress.status
    } else {
      return 'pending'
    }
  }

  const steps = [
    { id: 1, title: 'Analyzing Job Requirements', description: 'Extracting job details and application questions' },
    { id: 2, title: 'Generating Custom CV', description: 'Creating tailored resume based on job requirements' },
    { id: 3, title: 'AI Response Generation', description: 'Generating intelligent responses to application questions' },
    { id: 4, title: 'Quality Review', description: 'Reviewing and optimizing application content' },
    { id: 5, title: 'Application Ready', description: 'Preparing final application for submission' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bot className="h-6 w-6 mr-2 text-emerald-600" />
              Auto Application Progress
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-600">
                {currentStep} of {progress.total_steps} steps
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / progress.total_steps) * 100}%` }}
              />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700 font-medium">{progress.current_action}</p>
              {progress.message && (
                <p className="text-xs text-gray-600 mt-1">{progress.message}</p>
              )}
            </div>
          </div>

          {/* Step Details */}
          <div className="space-y-4 mb-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  getStepStatus(step.id) === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : getStepStatus(step.id) === 'processing'
                    ? 'bg-blue-50 border-blue-200'
                    : getStepStatus(step.id) === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step.id)}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    getStepStatus(step.id) === 'completed'
                      ? 'text-green-900'
                      : getStepStatus(step.id) === 'processing'
                      ? 'text-blue-900'
                      : getStepStatus(step.id) === 'error'
                      ? 'text-red-900'
                      : 'text-gray-700'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    getStepStatus(step.id) === 'completed'
                      ? 'text-green-700'
                      : getStepStatus(step.id) === 'processing'
                      ? 'text-blue-700'
                      : getStepStatus(step.id) === 'error'
                      ? 'text-red-700'
                      : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Message */}
          {progress.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-900">Application Failed</h3>
              </div>
              <p className="text-sm text-red-700 mt-1">{progress.message}</p>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-sm font-medium text-green-900">Application Complete!</h3>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your customized application has been prepared and is ready for submission.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {isCompleted ? (
              <>
                <button
                  onClick={() => {
                    // Download CV functionality
                    console.log('Download CV')
                    alert('CV download functionality will be implemented')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </button>
                <button
                  onClick={() => {
                    // Open job URL functionality
                    console.log('Open job URL for submission')
                    if (applicationId) {
                      // Get the job URL from the application record
                      alert('Opening job URL for final submission...')
                      // This would open the actual job URL
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </button>
              </>
            ) : progress.status === 'error' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            )}
          </div>

          {/* Application ID */}
          {applicationId && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Application ID: <span className="font-mono">{applicationId}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationProgressModal
