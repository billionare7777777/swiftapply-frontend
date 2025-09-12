// JobListItem component for displaying jobs in list format

import React from 'react'
import { MapPin, Building2, DollarSign, ExternalLink, Calendar, Clock, Zap } from 'lucide-react'
import { Job } from '../../types'
import { formatDate, formatSalary, formatJobType, formatLocation, formatJobTitle, formatCompanyName } from '../../utils/formatUtils'

interface JobListItemProps {
  job: Job
  onAutoApply?: (job: Job) => void
  onManualApply?: (job: Job) => void
  className?: string
}

export const JobListItem: React.FC<JobListItemProps> = ({ 
  job, 
  onAutoApply, 
  onManualApply,
  className = '' 
}) => {
  const handleAutoApply = () => {
    if (onAutoApply) {
      onAutoApply(job)
    }
  }

  const handleManualApply = () => {
    if (onManualApply) {
      onManualApply(job)
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
    <div 
      className={`flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Left Section - Job Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start space-x-4">
          {/* Company Avatar */}
          {job.company_avatar && job.company_avatar !== 'N/A' && (
            <div className="flex-shrink-0">
              <img 
                src={job.company_avatar} 
                alt={`${job.company} logo`}
                className="h-12 w-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 truncate">
              {formatJobTitle(job.title)}
            </h3>
            <div className="flex items-center text-slate-600 mb-2">
              <Building2 className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
              <span className="text-sm font-semibold truncate">{formatCompanyName(job.company)}</span>
            </div>
            
            {/* Job Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {job.location && job.location !== 'N/A' && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                  <span className="truncate">{formatLocation(job.location)}</span>
                </div>
              )}
              
              {job.salary_range && job.salary_range !== 'N/A' && (
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-slate-400" />
                  <span>{formatSalary(job.salary_range)}</span>
                </div>
              )}
              
              {job.posted_date && job.posted_date !== 'N/A' && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  <span>Posted {formatDate(job.posted_date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Job Type and Actions */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Job Type Badge */}
        {job.job_type && job.job_type !== 'N/A' && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getJobTypeColor(job.job_type)}`}>
            {formatJobType(job.job_type)}
          </span>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {onManualApply && (
            <button
              onClick={handleManualApply}
              className="bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-1 text-sm border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Apply</span>
            </button>
          )}
          
          {onAutoApply && (
            <button
              onClick={handleAutoApply}
              className="bg-white hover:bg-gray-50 text-emerald-600 hover:text-emerald-700 font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-1 text-sm border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Auto Apply</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobListItem
