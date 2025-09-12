'use client'

import React, { useState, useEffect } from 'react'
import { User, Wand2, Edit3, Sparkles, ArrowRight, CheckCircle, Briefcase, GraduationCap, Award, Target, FileText, Plus, Trash2 } from 'lucide-react'
import { UserData, Resume } from '../../StepByStepResumeGenerator'

interface AutoFillResumeFormProps {
  userData: UserData | null
  onResumeGenerated: (resumes: Resume[]) => void
  isGenerating: boolean
  selectedTemplate: string
  editingResume?: Resume | null
  loadingProfile?: boolean
}

export const AutoFillResumeForm: React.FC<AutoFillResumeFormProps> = ({
  userData,
  onResumeGenerated,
  isGenerating,
  selectedTemplate,
  editingResume,
  loadingProfile = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    phoneNumber: '',
    email: '',
    workHistory: [] as Array<{
      company: string
      position: string
      duration: string
      description: string
    }>,
    education: [] as Array<{
      institution: string
      degree: string
      field: string
      year: string
    }>,
    skills: [] as string[],
    summary: '',
    template: selectedTemplate || 'professional'
  })
  const [currentSkill, setCurrentSkill] = useState('')

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate-ready' },
    { id: 'simple', name: 'Simple', description: 'Minimal and elegant' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and stylish' },
    { id: 'creative', name: 'Creative', description: 'Unique and artistic' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated and formal' },
    { id: 'technical', name: 'Technical', description: 'Structured and detailed' }
  ]

  // Update template when selectedTemplate prop changes
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== formData.template) {
      setFormData(prev => ({
        ...prev,
        template: selectedTemplate
      }))
    }
  }, [selectedTemplate])

  // Auto-fill form with user data
  useEffect(() => {
    if (userData) {
      // Extract name parts
      const nameParts = userData.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: userData.email,
        // Map phone_number from database to phoneNumber in UI
        phoneNumber: userData.phoneNumber || '',
        // Map location_city from database to location in UI
        location: userData.location || '',
        // Map bio from database to summary in UI
        summary: userData.summary,
        skills: userData.skills,
        workHistory: userData.experience,
        education: userData.education,
        template: selectedTemplate || 'professional'
      }))
    }
  }, [userData, selectedTemplate])

  // Pre-fill form when editing a resume
  useEffect(() => {
    if (editingResume) {
      // Use structured data from database instead of parsing content
      setFormData(prev => ({
        ...prev,
        firstName: editingResume.first_name || '',
        lastName: editingResume.last_name || '',
        email: editingResume.email || '',
        phoneNumber: editingResume.phone || '',
        location: editingResume.location || '',
        template: editingResume.template || 'professional',
        summary: editingResume.profile_summary || '',
        workHistory: editingResume.work_history || [],
        education: editingResume.education || [],
        skills: editingResume.skills || []
      }))
    }
  }, [editingResume])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addWorkHistory = () => {
    setFormData(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, {
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }))
  }

  const updateWorkHistory = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeWorkHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        year: ''
      }]
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const generateResumeWithOpenAI = async (template: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://locust-one-mutt.ngrok-free.app/api'
      const apiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/resume/generate` : `${baseUrl}/api/resume/generate`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phoneNumber,
          location: formData.location,
          summary: formData.summary,
          skills: formData.skills,
          experience: formData.workHistory.map(work => ({
            title: work.position,
            company: work.company,
            duration: work.duration,
            description: work.description
          })),
          education: formData.education.map(edu => ({
            degree: edu.degree,
            institution: edu.institution,
            field: edu.field,
            year: edu.year
          })),
          template: template,
          job_description: null
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        return result.resume
      } else {
        throw new Error(result.error || 'Failed to generate resume')
      }
    } catch (error) {
      console.error('Error generating resume with OpenAI:', error)
      throw error
    }
  }

  const handleGenerate = async () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const timestamp = Date.now()
    
    // Generate unique IDs for each variant to ensure proper selection
    const generateId = () => `resume_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Generate three variants using OpenAI with different templates
      const templates = ['professional', 'modern', 'creative']
      const variants = []
      
      for (const template of templates) {
        try {
          const aiGeneratedContent = await generateResumeWithOpenAI(template)
          
          variants.push({
            id: generateId(),
            title: `${fullName} - ${template.charAt(0).toUpperCase() + template.slice(1)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            template: template,
            content: aiGeneratedContent,
            preview: formData.summary || `AI-generated ${template} resume from profile data`,
            // Database fields
            first_name: formData.firstName,
            last_name: formData.lastName,
            location: formData.location,
            phone: formData.phoneNumber,
            email: formData.email,
            work_history: formData.workHistory,
            education: formData.education,
            skills: formData.skills,
            profile_summary: formData.summary
          })
        } catch (error) {
          console.error(`Failed to generate ${template} resume:`, error)
          // Fallback to basic content if OpenAI fails
          variants.push({
            id: generateId(),
            title: `${fullName} - ${template.charAt(0).toUpperCase() + template.slice(1)} (Fallback)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            template: template,
            content: `RESUME GENERATION FAILED\n\nPlease try again or contact support.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
            preview: `Fallback ${template} resume - OpenAI generation failed`,
            // Database fields
            first_name: formData.firstName,
            last_name: formData.lastName,
            location: formData.location,
            phone: formData.phoneNumber,
            email: formData.email,
            work_history: formData.workHistory,
            education: formData.education,
            skills: formData.skills,
            profile_summary: formData.summary
          })
        }
      }
      
      onResumeGenerated(variants)
    } catch (error) {
      console.error('Error generating resumes:', error)
      // Show error to user
      alert(`Failed to generate resumes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Profile Data</h3>
        <p className="text-gray-400">Please complete your profile first or use manual creation.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Auto-Fill from Profile</h3>
        {loadingProfile ? (
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
            <span>Loading profile data from database...</span>
          </div>
        ) : (
          <p className="text-gray-300">Your profile data has been loaded. Edit as needed.</p>
        )}
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Personal Information</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="New York, NY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Work History */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <span>Work History</span>
        </h4>
        
        {formData.workHistory.map((work, index) => (
          <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-medium text-white">Work Experience #{index + 1}</h5>
              <button
                onClick={() => removeWorkHistory(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Company *</label>
                <input
                  type="text"
                  value={work.company}
                  onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Position *</label>
                <input
                  type="text"
                  value={work.position}
                  onChange={(e) => updateWorkHistory(index, 'position', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Job Title"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-2">Duration *</label>
              <input
                type="text"
                value={work.duration}
                onChange={(e) => updateWorkHistory(index, 'duration', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Jan 2020 - Present"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description *</label>
              <textarea
                value={work.description}
                onChange={(e) => updateWorkHistory(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe your key achievements and responsibilities..."
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addWorkHistory}
          className="w-full py-4 border-2 border-dashed border-white/30 rounded-xl text-white hover:border-white/50 transition-all duration-300 hover:bg-white/5"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Work Experience</span>
          </div>
        </button>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <GraduationCap className="h-5 w-5" />
          <span>Education</span>
        </h4>
        
        {formData.education.map((edu, index) => (
          <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-medium text-white">Education #{index + 1}</h5>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Institution *</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="University Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Degree *</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Field of Study *</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Computer Science, Business, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Year *</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="2020"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addEducation}
          className="w-full py-4 border-2 border-dashed border-white/30 rounded-xl text-white hover:border-white/50 transition-all duration-300 hover:bg-white/5"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Education</span>
          </div>
        </button>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Skills</span>
        </h4>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Add a skill..."
          />
          <button
            onClick={addSkill}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-white"
            >
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(skill)}
                className="text-purple-300 hover:text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Summary</span>
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Professional Summary *</label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Brief professional summary highlighting your key strengths and career objectives..."
          />
        </div>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Select Template</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.template === template.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
              onClick={() => handleInputChange('template', template.id)}
            >
              <div className="text-center">
                <h5 className="font-semibold text-white mb-1">
                  {template.name}
                </h5>
                <p className="text-sm text-gray-300">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !formData.firstName || !formData.lastName || !formData.email || !formData.summary}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-3">
            {isGenerating ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Sparkles className="h-6 w-6" />
            )}
            <span className="text-lg">
              {isGenerating ? 'Generating...' : 'Generate Resume'}
            </span>
            {!isGenerating && (
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
