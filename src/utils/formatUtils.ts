// Formatting utility functions

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

export const formatSalary = (salaryRange: string): string => {
  if (!salaryRange || salaryRange === 'N/A') return 'Not specified'
  return salaryRange
}

export const formatJobType = (jobType: string): string => {
  if (!jobType || jobType === 'N/A') return 'Not specified'
  
  const typeMap: Record<string, string> = {
    'remote': 'Remote',
    'hybrid': 'Hybrid',
    'on-site': 'On-site',
    'onsite': 'On-site'
  }
  
  return typeMap[jobType.toLowerCase()] || jobType
}

export const formatCompanyName = (company: string): string => {
  if (!company) return 'Unknown Company'
  return company.trim()
}

export const formatJobTitle = (title: string): string => {
  if (!title) return 'Untitled Position'
  return title.trim()
}

export const formatLocation = (location: string): string => {
  if (!location || location === 'N/A') return 'Location not specified'
  return location.trim()
}


