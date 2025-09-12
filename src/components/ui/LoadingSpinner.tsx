// LoadingSpinner component for displaying loading states

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'gray' | 'white' | 'gradient'
  text?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'gradient', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-slate-600',
    white: 'border-white',
    gradient: 'border-transparent bg-gradient-to-r from-blue-600 to-emerald-600'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div 
          className={`animate-spin rounded-full border-4 border-slate-200 ${sizeClasses[size]}`}
        />
        <div 
          className={`absolute top-0 left-0 animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        />
      </div>
      {text && (
        <div className="mt-6 text-center">
          <p className={`text-sm font-semibold ${color === 'white' ? 'text-white' : 'text-slate-700'}`}>
            {text}
          </p>
          <div className="flex space-x-1 mt-3 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Please wait while we process your request...
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingSpinner
