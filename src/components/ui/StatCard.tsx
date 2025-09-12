// StatCard component for displaying statistics

import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'emerald' | 'orange' | 'emerald' | 'rose'
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  className = '',
  trend
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
    emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
    rose: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white',
  }

  return (
    <div 
      className={`stat-card group ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className={`p-4 rounded-2xl shadow-lg ${colorClasses[color]} group-hover:scale-110 transition-transform duration-300`}
            style={{
              background: colorClasses[color].includes('blue') ? 'linear-gradient(to bottom right, #3b82f6, #2563eb)' :
                         colorClasses[color].includes('emerald') ? 'linear-gradient(to bottom right, #10b981, #059669)' :
                         colorClasses[color].includes('emerald') ? 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)' :
                         colorClasses[color].includes('orange') ? 'linear-gradient(to bottom right, #f97316, #ea580c)' :
                         'linear-gradient(to bottom right, #3b82f6, #2563eb)',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              color: 'white'
            }}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            {trend && (
              <div className={`flex items-center mt-2 text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  trend.isPositive 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="ml-2">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
