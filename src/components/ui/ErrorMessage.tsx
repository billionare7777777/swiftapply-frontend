// ErrorMessage component for displaying error states

import React from 'react'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
  type?: 'error' | 'network' | 'warning'
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  className = '',
  type = 'error'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff className="h-8 w-8 text-orange-500" />
      case 'warning':
        return <AlertCircle className="h-8 w-8 text-amber-500" />
      default:
        return <AlertCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case 'network':
        return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
      default:
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    }
  }

  return (
    <div className={`feature-card text-center ${className}`}>
      <div className="flex items-center justify-center mb-6">
        <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl">
          {getIcon()}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        {type === 'network' ? 'Connection Issue' : 
         type === 'warning' ? 'Warning' : 'Something went wrong'}
      </h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`button-primary flex items-center space-x-2 mx-auto ${getButtonStyles()}`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}

export default ErrorMessage