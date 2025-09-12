'use client'

import React from 'react'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'

export interface ProgressStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  progress?: number // 0-100 for in_progress steps
}

interface ProgressBarProps {
  steps: ProgressStep[]
  currentStep?: string
  overallProgress?: number
  title?: string
  description?: string
  isVisible?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  overallProgress = 0,
  title = "Job Scraping Progress",
  description = "Scraping jobs from Greenhouse...",
  isVisible = true
}) => {
  if (!isVisible) return null

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50'
      case 'in_progress':
        return 'border-blue-200 bg-blue-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getStepTextColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-700'
      case 'in_progress':
        return 'text-blue-700'
      case 'error':
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className={`rounded-lg border p-4 ${getStepColor(step)}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${getStepTextColor(step)}`}>
                    {step.title}
                  </h4>
                  {step.status === 'in_progress' && step.progress !== undefined && (
                    <span className="text-xs text-gray-500">{step.progress}%</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                
                {/* Individual step progress bar */}
                {step.status === 'in_progress' && step.progress !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Indicator */}
      {currentStep && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-sm text-blue-700">
              Currently: {steps.find(s => s.id === currentStep)?.title || currentStep}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressBar
