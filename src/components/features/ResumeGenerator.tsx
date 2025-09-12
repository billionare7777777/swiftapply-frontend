// ResumeGenerator component for AI-powered resume generation

import React, { useState, useEffect } from 'react'
import { FileText, Download, Wand2, User, Mail, Briefcase, GraduationCap, Award, Star, Sparkles, Rocket, CheckCircle, Plus, X, Trash2, Edit3, Save, Eye, Target, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useResume } from '../../hooks/useResume'
import { UserData } from '../../types'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

export const ResumeGenerator: React.FC = () => {
  const {
    loading,
    error,
    generatedResume,
    generateResume,
    getResumeTemplates,
    validateUserData,
    downloadResume,
    clearGeneratedResume
  } = useResume()

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    summary: '',
    skills: [],
    experience: [],
    education: []
  })
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [jobDescription, setJobDescription] = useState('')
  const [templates, setTemplates] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState({
    personalInfo: false,  // Only Personal Information expanded by default
    skills: true,
    workExperience: true,
    education: true,
    targetJob: true,
    resumeTemplate: true
  })

  useEffect(() => {
    setIsVisible(true)
    const loadTemplates = async () => {
      try {
        const templateList = await getResumeTemplates()
        console.log('Loaded templates:', templateList)
        if (templateList && templateList.length > 0) {
          setTemplates(templateList)
        } else {
          console.error('No templates available from API')
          setValidationErrors(['Unable to load resume templates. Please check your connection and try again.'])
        }
      } catch (error) {
        console.error('Error loading templates:', error)
        setValidationErrors(['Failed to load resume templates. Please check your connection and try again.'])
      }
    }
    loadTemplates()
  }, [getResumeTemplates])

  const handleInputChange = (field: keyof UserData, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
    setValidationErrors([])
  }

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const addSkill = () => {
    if (currentSkill.trim() && !userData.skills.includes(currentSkill.trim())) {
      setUserData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addExperience = () => {
    setUserData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        duration: '',
        description: ''
      }]
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index: number) => {
    setUserData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setUserData(prev => ({
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
    setUserData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setUserData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleGenerateResume = async () => {
    const validation = validateUserData(userData)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    // Check if templates are loaded
    if (templates.length === 0) {
      setValidationErrors(['Please wait for templates to load before generating resume.'])
      return
    }

    const result = await generateResume({
      ...userData,
      template: selectedTemplate,
      job_description: jobDescription || undefined
    })

    if (!result.success) {
      const errorMessage = result.message || 'Failed to generate resume'
      if (errorMessage.includes('OpenAI') || errorMessage.includes('API')) {
        setValidationErrors([`AI service unavailable: ${errorMessage}. Please check your OpenAI API configuration.`])
      } else {
        setValidationErrors([errorMessage])
      }
    }
  }

  const handleDownloadResume = () => {
    downloadResume(`${userData.name.replace(/\s+/g, '_')}_resume.txt`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <FileText className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Star className="h-4 w-4 text-yellow-800" />
          </div>
          {/* Success rings animation */}
          <div className="absolute inset-0 rounded-3xl border-2 border-purple-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-3xl border-2 border-purple-400 animate-ping opacity-50 animation-delay-1000"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
            AI-Powered
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Resume Generator
          </span>
          <br />
          <span className="text-3xl md:text-4xl bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            Professional CV Creator
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
          Generate AI-powered resumes tailored to your target jobs. Create professional CVs that stand out to employers.
          <span className="block mt-4 text-lg text-purple-300">
            Let AI craft the perfect resume that gets you noticed.
          </span>
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Enhanced Input Form */}
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
              Personal Information
            </h2>
                </div>
                <button
                  onClick={() => toggleSection('personalInfo')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                >
                  {collapsedSections.personalInfo ? (
                    <ChevronDown className="h-5 w-5 text-white" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              <div className={`space-y-6 transition-all duration-500 overflow-hidden ${
                collapsedSections.personalInfo ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}>
              <div>
                  <label className="block text-sm font-medium text-white mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-white mb-2">
                  Professional Summary *
                </label>
                <textarea
                  value={userData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={4}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Brief professional summary..."
                />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Skills */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-pink-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300">
              Skills
            </h2>
                </div>
                <button
                  onClick={() => toggleSection('skills')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                >
                  {collapsedSections.skills ? (
                    <ChevronDown className="h-5 w-5 text-white" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              
              <div className={`space-y-6 transition-all duration-500 overflow-hidden ${
                collapsedSections.skills ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}>
                <div className="flex gap-3">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={addSkill}
                    className="group/btn relative px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Add</span>
                    </div>
                </button>
              </div>
                <div className="flex flex-wrap gap-3">
                {userData.skills.map((skill, index) => (
                    <div
                    key={index}
                      className="group/skill inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full text-sm text-white hover:scale-105 transition-all duration-300"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                        className="ml-2 text-pink-300 hover:text-white transition-colors duration-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Work Experience */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
              Work Experience
            </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.experience.length > 2 && !collapsedSections.workExperience && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleSection('workExperience')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                  >
                    {collapsedSections.workExperience ? (
                      <ChevronDown className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className={`space-y-6 transition-all duration-500 ${
                collapsedSections.workExperience ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[800px] opacity-100 overflow-y-auto sidebar-scroll'
              }`}>
              {userData.experience.map((exp, index) => (
                  <div key={index} className="group/exp relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group-hover/exp:border-white/20 transition-all duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">Experience #{index + 1}</h3>
                        </div>
                        <button
                          onClick={() => removeExperience(index)}
                          className="group/remove p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="h-5 w-5 group-hover/remove:scale-110 transition-transform duration-300" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Company *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Company Name"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Position *
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="Job Title"
                      />
                    </div>
                  </div>
                      
                  <div className="mb-4">
                        <label className="block text-sm font-medium text-white mb-2">
                          Duration *
                    </label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Description *
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Describe your key achievements and responsibilities..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addExperience}
                  className="group/add w-full relative py-6 border-2 border-dashed border-white/30 rounded-2xl text-white hover:border-white/50 transition-all duration-300 hover:bg-white/5"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover/add:scale-110 transition-transform duration-300">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Add Work Experience</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Education */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                    Education
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.education.length > 2 && !collapsedSections.education && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleSection('education')}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                  >
                    {collapsedSections.education ? (
                      <ChevronDown className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className={`space-y-6 transition-all duration-500 ${
                collapsedSections.education ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[800px] opacity-100 overflow-y-auto sidebar-scroll'
              }`}>
                {userData.education.map((edu, index) => (
                  <div key={index} className="group/edu relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group-hover/edu:border-white/20 transition-all duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">Education #{index + 1}</h3>
                        </div>
              <button
                          onClick={() => removeEducation(index)}
                          className="group/remove p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
              >
                          <Trash2 className="h-5 w-5 group-hover/remove:scale-110 transition-transform duration-300" />
              </button>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Institution *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            placeholder="University Name"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Degree *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                  </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Field of Study *
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            placeholder="Computer Science, Business, etc."
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Year *
                      </label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            placeholder="2020"
                      />
                        </div>
                      </div>
                    </div>
                </div>
              ))}
                
              <button
                onClick={addEducation}
                  className="group/add w-full relative py-6 border-2 border-dashed border-white/30 rounded-2xl text-white hover:border-white/50 transition-all duration-300 hover:bg-white/5"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg group-hover/add:scale-110 transition-transform duration-300">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-medium">Add Education</span>
                  </div>
              </button>
              </div>
            </div>
          </div>

          {/* Enhanced Target Job Description */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">
                      Target Job Description
            </h2>
                    <p className="text-sm text-gray-300 mt-1">Optional - Paste job description to tailor your resume</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('targetJob')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                >
                  {collapsedSections.targetJob ? (
                    <ChevronDown className="h-5 w-5 text-white" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              
              <div className={`relative transition-all duration-500 overflow-hidden ${
                collapsedSections.targetJob ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Paste the job description here to tailor your resume to specific requirements..."
            />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {jobDescription.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Resume Template Selection */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-indigo-500/25 transition-all duration-500"></div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
              Resume Template
            </h2>
                    <p className="text-sm text-gray-300 mt-1">
                      Choose a professional template for your resume
                      {templates.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                          {templates.length} templates available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection('resumeTemplate')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group-hover:scale-110"
                >
                  {collapsedSections.resumeTemplate ? (
                    <ChevronDown className="h-5 w-5 text-white" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500 overflow-hidden ${
                collapsedSections.resumeTemplate ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}>
                {templates.length === 0 ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-400" />
                      </div>
                      <p className="text-red-300 font-medium">Templates not available</p>
                      <p className="text-gray-400 text-sm mt-1">Please check your connection and refresh the page</p>
                    </div>
                  </div>
                ) : (
                  templates.map((template, index) => (
                    <div
                      key={template}
                      className={`group/template relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedTemplate === template
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                            selectedTemplate === template
                              ? 'bg-indigo-400 scale-125'
                              : 'bg-white/40 group-hover/template:bg-indigo-400'
                          }`}></div>
                          <h3 className="font-semibold text-white capitalize truncate">
                            {template}
                          </h3>
                        </div>
                        {selectedTemplate === template && (
                          <CheckCircle className="h-5 w-5 text-indigo-400 animate-pulse flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="text-sm text-gray-300">
                        {template === 'modern' && 'Clean, contemporary design with bold typography'}
                        {template === 'classic' && 'Traditional layout with professional styling'}
                        {template === 'creative' && 'Unique design for creative professionals'}
                        {template === 'minimal' && 'Simple, elegant layout with focus on content'}
                        {template === 'executive' && 'Sophisticated design for senior positions'}
                        {template === 'technical' && 'Structured layout for technical roles'}
                        {template === 'academic' && 'Formal design perfect for research and academia'}
                        {template === 'startup' && 'Dynamic layout for entrepreneurial professionals'}
                        {template === 'transparent' && 'Clean design with transparent elements and modern aesthetics'}
                        {template === 'professional' && 'Corporate-ready layout with formal structure and clarity'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 shadow-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Please fix the following errors:</h3>
                </div>
                <ul className="space-y-2">
                {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center space-x-2 text-red-300">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      <span>{error}</span>
                    </li>
                ))}
              </ul>
              </div>
            </div>
          )}

          {/* Enhanced Generate Button */}
          <div className="relative group">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500"></div>
            
            <div className="relative p-8">
          <button
            onClick={handleGenerateResume}
            disabled={loading}
                className="group/btn w-full relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
            {loading ? (
                    <>
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span>Generating AI Resume...</span>
                    </>
            ) : (
              <>
                      <Wand2 className="h-6 w-6 group-hover/btn:scale-110 transition-transform duration-300" />
                      <span>Generate AI Resume</span>
                      <Sparkles className="h-5 w-5 group-hover/btn:animate-pulse" />
              </>
            )}
                </div>
          </button>
            </div>
          </div>
        </div>

        {/* Enhanced Generated Resume */}
        <div className={`space-y-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {error && (
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 shadow-2xl"></div>
              <div className="relative p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Error</h3>
                    <p className="text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {generatedResume && (
            <div className="relative group">
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500"></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                  Generated Resume
                </h2>
                  </div>
                  <div className="flex gap-3">
                  <button
                    onClick={handleDownloadResume}
                      className="group/btn relative px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-2">
                        <Download className="h-5 w-5" />
                        <span>Download</span>
                      </div>
                  </button>
                  <button
                    onClick={clearGeneratedResume}
                      className="group/btn relative px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-2">
                        <Trash2 className="h-5 w-5" />
                        <span>Clear</span>
                      </div>
                  </button>
                </div>
              </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto border border-white/10">
                  <pre className="whitespace-pre-wrap text-sm text-white font-mono leading-relaxed">
                  {generatedResume}
                </pre>
                </div>
              </div>
            </div>
          )}

          {!generatedResume && !loading && (
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500"></div>
              
              <div className="relative p-12 text-center">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Resume Generated</h3>
                <p className="text-gray-300 text-lg max-w-md mx-auto">
                Fill in your information and click "Generate AI Resume" to create your personalized resume.
              </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeGenerator
