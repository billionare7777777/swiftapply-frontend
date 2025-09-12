'use client'

import React, { useState, useRef } from 'react'
import { Plus, Upload, Eye, Edit3, Trash2, FileText, Calendar, Sparkles, ArrowRight, Download, Search, Filter, Grid, List } from 'lucide-react'
import { Resume } from '../StepByStepResumeGenerator'

interface ResumeListStepProps {
  resumes: Resume[]
  loading: boolean
  onCreateNew: (template?: string) => void
  onResumePreview: (resume: Resume) => void
  onResumeUpload: (file: File) => void
  onResumeEdit?: (resume: Resume) => void
  onResumeDelete?: (resume: Resume) => void
  onResumeDownload?: (resume: Resume) => void
}

export const ResumeListStep: React.FC<ResumeListStepProps> = ({
  resumes,
  loading,
  onCreateNew,
  onResumePreview,
  onResumeUpload,
  onResumeEdit,
  onResumeDelete,
  onResumeDownload
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'template'>('date')
  const [showTemplateSelection, setShowTemplateSelection] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate-ready' },
    { id: 'simple', name: 'Simple', description: 'Minimal and elegant' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and stylish' },
    { id: 'creative', name: 'Creative', description: 'Unique and artistic' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated and formal' },
    { id: 'technical', name: 'Technical', description: 'Structured and detailed' }
  ]

  const handleCreateNewWithTemplate = (template: string) => {
    setShowTemplateSelection(false)
    onCreateNew(template)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        await onResumeUpload(file)
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Professional gradient backgrounds for cards
  const getCardGradient = (index: number) => {
    const gradients = [
      // Professional Blue-Gray Gradient
      'linear-gradient(135deg, rgba(30, 41, 59, 0.15) 0%, rgba(51, 65, 85, 0.12) 25%, rgba(71, 85, 105, 0.1) 50%, rgba(100, 116, 139, 0.08) 75%, rgba(148, 163, 184, 0.06) 100%)',
      
      // Corporate Navy-Blue Gradient
      'linear-gradient(135deg, rgba(15, 23, 42, 0.15) 0%, rgba(30, 41, 59, 0.12) 25%, rgba(51, 65, 85, 0.1) 50%, rgba(71, 85, 105, 0.08) 75%, rgba(100, 116, 139, 0.06) 100%)',
      
      // Executive Slate Gradient
      'linear-gradient(135deg, rgba(71, 85, 105, 0.15) 0%, rgba(100, 116, 139, 0.12) 25%, rgba(148, 163, 184, 0.1) 50%, rgba(203, 213, 225, 0.08) 75%, rgba(226, 232, 240, 0.06) 100%)',
      
      // Professional Charcoal Gradient
      'linear-gradient(135deg, rgba(55, 65, 81, 0.15) 0%, rgba(75, 85, 99, 0.12) 25%, rgba(107, 114, 128, 0.1) 50%, rgba(156, 163, 175, 0.08) 75%, rgba(209, 213, 219, 0.06) 100%)',
      
      // Business Steel Gradient
      'linear-gradient(135deg, rgba(64, 64, 64, 0.15) 0%, rgba(82, 82, 82, 0.12) 25%, rgba(115, 115, 115, 0.1) 50%, rgba(163, 163, 163, 0.08) 75%, rgba(212, 212, 212, 0.06) 100%)'
    ]
    
    return gradients[index % gradients.length]
  }

  const getHoverGradient = (index: number) => {
    const hoverGradients = [
      // Enhanced Professional Blue-Gray
      'linear-gradient(135deg, rgba(30, 41, 59, 0.25) 0%, rgba(51, 65, 85, 0.22) 25%, rgba(71, 85, 105, 0.2) 50%, rgba(100, 116, 139, 0.18) 75%, rgba(148, 163, 184, 0.16) 100%)',
      
      // Enhanced Corporate Navy-Blue
      'linear-gradient(135deg, rgba(15, 23, 42, 0.25) 0%, rgba(30, 41, 59, 0.22) 25%, rgba(51, 65, 85, 0.2) 50%, rgba(71, 85, 105, 0.18) 75%, rgba(100, 116, 139, 0.16) 100%)',
      
      // Enhanced Executive Slate
      'linear-gradient(135deg, rgba(71, 85, 105, 0.25) 0%, rgba(100, 116, 139, 0.22) 25%, rgba(148, 163, 184, 0.2) 50%, rgba(203, 213, 225, 0.18) 75%, rgba(226, 232, 240, 0.16) 100%)',
      
      // Enhanced Professional Charcoal
      'linear-gradient(135deg, rgba(55, 65, 81, 0.25) 0%, rgba(75, 85, 99, 0.22) 25%, rgba(107, 114, 128, 0.2) 50%, rgba(156, 163, 175, 0.18) 75%, rgba(209, 213, 219, 0.16) 100%)',
      
      // Enhanced Business Steel
      'linear-gradient(135deg, rgba(64, 64, 64, 0.25) 0%, rgba(82, 82, 82, 0.22) 25%, rgba(115, 115, 115, 0.2) 50%, rgba(163, 163, 163, 0.18) 75%, rgba(212, 212, 212, 0.16) 100%)'
    ]
    
    return hoverGradients[index % hoverGradients.length]
  }

  const getAccentColor = (index: number) => {
    const accentColors = [
      'from-blue-500/20 to-slate-500/20', // Professional Blue
      'from-slate-600/20 to-gray-500/20', // Executive Gray
      'from-indigo-500/20 to-blue-600/20', // Corporate Indigo
      'from-gray-600/20 to-slate-500/20', // Business Gray
      'from-slate-700/20 to-gray-600/20'  // Professional Slate
    ]
    
    return accentColors[index % accentColors.length]
  }

  // Filter and sort resumes
  const filteredAndSortedResumes = React.useMemo(() => {
    let filtered = resumes.filter(resume =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.template.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort resumes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'template':
          return a.template.localeCompare(b.template)
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

    return filtered
  }, [resumes, searchQuery, sortBy])

  return (
    <div className="space-y-3">
      {/* Create New Resume Button */}
      {resumes.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowTemplateSelection(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Resume</span>
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      {resumes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mb-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-800/20 backdrop-blur-sm border border-slate-600/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-sm"
            />
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'template')}
              className="px-3 py-2 bg-slate-800/20 backdrop-blur-sm border border-slate-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-sm"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="template">Template</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/20 backdrop-blur-sm border border-slate-600/30 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-600/20'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'list' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-600/20'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : filteredAndSortedResumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first resume to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowTemplateSelection(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                Create Your First Resume
              </button>
            )}
          </div>
        ) : (
          <div className={`gap-2 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' 
              : 'space-y-2'
          }`}>
            {filteredAndSortedResumes.map((resume, index) => (
              <div
                key={resume.id}
                className={`group relative backdrop-blur-xl rounded-lg border border-white/10 p-4 hover:shadow-2xl hover:shadow-slate-500/20 hover:border-white/20 hover:scale-105 transition-transform duration-200 ${
                  viewMode === 'list' ? 'flex items-center space-x-4' : ''
                }`}
                style={{ 
                  background: getCardGradient(index)
                }}
              >
                {/* Professional hover overlay */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                  style={{
                    background: getHoverGradient(index)
                  }}
                ></div>
                
                <div className="relative flex-1">
                  {/* Header */}
                  <div className={`flex items-start justify-between mb-2 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className={`p-1 bg-gradient-to-r ${getAccentColor(index)} backdrop-blur-sm rounded shadow-sm flex-shrink-0`}>
                        <FileText className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-white text-sm leading-tight truncate">
                          {resume.title}
                        </h3>
                        <p className="text-sm text-gray-400 capitalize truncate">
                          {resume.template}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 flex-shrink-0">
                      <button
                        onClick={() => onResumePreview(resume)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-500/20 rounded"
                        title="Preview"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                      {onResumeEdit && (
                        <button
                          onClick={() => onResumeEdit(resume)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded"
                          title="Edit"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      )}
                      {onResumeDownload && (
                        <button
                          onClick={() => onResumeDownload(resume)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-green-500/20 rounded"
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                      {onResumeDelete && (
                        <button
                          onClick={() => onResumeDelete(resume)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Preview - Only show in grid mode */}
                  {viewMode === 'grid' && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-300 line-clamp-2 leading-tight">
                        {resume.preview || resume.content.substring(0, 80) + '...'}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="truncate font-medium">{formatDate(resume.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                      <Sparkles className="h-3 w-3" />
                      <span className="hidden sm:inline font-medium">AI</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      {showTemplateSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Choose a Template</h3>
              <p className="text-gray-300">Select a template for your new resume</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-xl border-2 border-white/20 bg-white/5 hover:border-purple-500 hover:bg-purple-500/10 cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => handleCreateNewWithTemplate(template.id)}
                >
                  <div className="text-center">
                    <h5 className="font-semibold text-white mb-2">
                      {template.name}
                    </h5>
                    <p className="text-sm text-gray-300">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowTemplateSelection(false)}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
