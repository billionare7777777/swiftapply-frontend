// JobCard component for displaying individual job listings

import React, { useState } from 'react'
import { MapPin, Building2, DollarSign, ExternalLink, Calendar, Clock, Zap, Bot, Hand, Loader2 } from 'lucide-react'
import { DatabaseJob } from '../../types'
import { formatDate, formatSalary, formatJobType, formatLocation, formatJobTitle, formatCompanyName } from '../../utils/formatUtils'

interface JobCardProps {
  job: DatabaseJob
  onAutoApply?: (job: DatabaseJob) => void
  onManualApply?: (job: DatabaseJob) => void
  className?: string
  isApplying?: boolean
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onAutoApply,
  onManualApply,
  className = '',
  isApplying = false
}) => {
  const [isAutoApplying, setIsAutoApplying] = useState(false)
  const [isManualApplying, setIsManualApplying] = useState(false)

  const handleAutoApply = async () => {
    if (onAutoApply) {
      setIsAutoApplying(true)
      try {
        await onAutoApply(job)
      } finally {
        setIsAutoApplying(false)
      }
    }
  }

  const handleManualApply = async () => {
    if (onManualApply) {
      setIsManualApplying(true)
      try {
        await onManualApply(job)
      } finally {
        setIsManualApplying(false)
      }
    }
  }

  const getJobTypeColor = (jobType: string) => {
    switch (jobType?.toLowerCase()) {
      case 'remote':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'hybrid':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'on-site':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className={`feature-card group ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {formatJobTitle(job.title)}
          </h3>
          <div className="flex items-center text-slate-600 mb-3">
            <Building2 className="h-5 w-5 mr-2 text-slate-400" />
            <span className="text-base font-semibold">{formatCompanyName(job.company_name)}</span>
          </div>
        </div>
        {job.company_avatar_path && job.company_avatar_path !== 'N/A' && (
          <div className="ml-4">
            <img 
              src={job.company_avatar_path} 
              alt={`${job.company_name} logo`}
              className="h-16 w-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {job.location && job.location !== 'N/A' && (
          <div className="flex items-center text-slate-600">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm font-medium">{formatLocation(job.location)}</span>
          </div>
        )}
        
        {job.job_type && job.job_type !== 'N/A' && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Work Type</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getJobTypeColor(job.job_type)}`}>
              {formatJobType(job.job_type)}
            </span>
          </div>
        )}
        
        {job.budget_cost && (
          <div className="flex items-center text-slate-600">
            <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm font-medium">
              ${job.budget_cost.toLocaleString()}
            </span>
          </div>
        )}
        
        {job.creation_time && (
          <div className="flex items-center text-slate-600">
            <Clock className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm font-medium">Posted {formatDate(job.creation_time)}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center">
          {onManualApply && (
            <button
              onClick={handleManualApply}
              disabled={isAutoApplying || isManualApplying || isApplying}
              className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {isManualApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              <span>
                {isManualApplying ? 'Opening...' : 'Apply'}
              </span>
            </button>
          )}
          
          {onAutoApply && (
            <button
              onClick={handleAutoApply}
              disabled={isAutoApplying || isManualApplying || isApplying}
              className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {isAutoApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              <span>
                {isAutoApplying ? 'Processing...' : 'Auto Apply'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobCard
