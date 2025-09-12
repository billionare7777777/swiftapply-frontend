// CategoryCard component for displaying job categories

import React from 'react'

interface CategoryCardProps {
  title: string
  count: number
  color: 'blue' | 'green' | 'emerald' | 'orange' | 'emerald' | 'rose' | 'indigo' | 'teal'
  className?: string
  onClick?: () => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  count, 
  color, 
  className = '',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200/50 hover:from-blue-100 hover:to-blue-200',
    green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/50 hover:from-emerald-100 hover:to-emerald-200',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/50 hover:from-emerald-100 hover:to-emerald-200',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200/50 hover:from-orange-100 hover:to-orange-200',
    rose: 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 border-rose-200/50 hover:from-rose-100 hover:to-rose-200',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200/50 hover:from-indigo-100 hover:to-indigo-200',
    teal: 'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700 border-teal-200/50 hover:from-teal-100 hover:to-teal-200',
  }

  return (
    <div 
      className={`p-6 rounded-2xl border-2 ${colorClasses[color]} ${className} ${
        onClick ? 'cursor-pointer card-hover' : ''
      } group`}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">{count}</div>
        <div className="text-sm font-semibold uppercase tracking-wide">{title}</div>
        <div className="w-12 h-1 bg-current rounded-full mx-auto mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}

export default CategoryCard
