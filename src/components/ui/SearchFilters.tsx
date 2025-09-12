// SearchFilters component for job search filtering

import React from 'react'
import { Search, MapPin, Building2, DollarSign, Zap } from 'lucide-react'
import { JobSearchFilters } from '../../types'

interface SearchFiltersProps {
  filters: JobSearchFilters
  onFiltersChange: (filters: JobSearchFilters) => void
  onSearch: () => void
  loading?: boolean
  className?: string
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  loading = false,
  className = ''
}) => {
  const handleInputChange = (field: keyof JobSearchFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [field]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Search Query */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Search Keywords
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            placeholder="Job title, skills, or keywords..."
            className="input-field pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, state, or remote"
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Company
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={filters.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Company name"
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Job Type
          </label>
          <select
            value={filters.job_type}
            onChange={(e) => handleInputChange('job_type', e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Min Salary
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="number"
              value={filters.salary_min}
              onChange={(e) => handleInputChange('salary_min', parseInt(e.target.value) || 0)}
              placeholder="Minimum salary"
              className="input-field pl-12"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={loading}
          className="button-primary flex items-center space-x-3 group"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Search Jobs</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default SearchFilters