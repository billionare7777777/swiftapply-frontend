'use client'

import React, { useState } from 'react'
import { Target, Search, Building, MapPin, Calendar, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import { Job, Resume } from '../../StepByStepResumeGenerator'

interface JobMatchingResumeFormProps {
  jobs: Job[]
  onResumeGenerated: (resumes: Resume[]) => void
  isGenerating: boolean
  selectedTemplate: string
  editingResume?: Resume | null
}

export const JobMatchingResumeForm: React.FC<JobMatchingResumeFormProps> = ({
  jobs,
  onResumeGenerated,
  isGenerating,
  selectedTemplate,
  editingResume
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate-ready' },
    { id: 'simple', name: 'Simple', description: 'Minimal and elegant' },
    { id: 'modern', name: 'Modern', description: 'Contemporary and stylish' },
    { id: 'creative', name: 'Creative', description: 'Unique and artistic' },
    { id: 'executive', name: 'Executive', description: 'Sophisticated and formal' },
    { id: 'technical', name: 'Technical', description: 'Structured and detailed' }
  ]

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleJobSelect = async (job: Job) => {
    setSelectedJob(job)
    setIsAnalyzing(true)
    
    // Simulate job analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  const generateJobTailoredResumeWithOpenAI = async (template: string) => {
    if (!selectedJob) {
      throw new Error('No job selected')
    }

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
          name: 'Professional Candidate',
          email: 'candidate@example.com',
          phone: '(555) 000-0000',
          location: selectedJob.location,
          summary: `Experienced professional seeking ${selectedJob.title} position at ${selectedJob.company}. Proven track record of delivering results and driving success in dynamic environments.`,
          skills: selectedJob.skills,
          experience: [
            {
              title: 'Senior Professional',
              company: 'Previous Company',
              duration: '2020 - Present',
              description: `Led initiatives and projects that align with ${selectedJob.title} requirements. Demonstrated expertise in ${selectedJob.skills.slice(0, 2).join(' and ')}.`
            },
            {
              title: 'Professional Role',
              company: 'Another Company',
              duration: '2018 - 2020',
              description: `Developed and implemented solutions that directly relate to ${selectedJob.company}'s business objectives.`
            }
          ],
          education: [
            {
              degree: "Bachelor's Degree",
              institution: 'University Name',
              field: 'Relevant Field',
              year: '2018'
            }
          ],
          template: template,
          job_description: `${selectedJob.title} at ${selectedJob.company}\n\n${selectedJob.description}\n\nRequired Skills: ${selectedJob.skills.join(', ')}\n\nRequirements: ${selectedJob.requirements.join(', ')}`
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
      console.error('Error generating job-tailored resume with OpenAI:', error)
      throw error
    }
  }

  const handleGenerate = async () => {
    if (selectedJob) {
      const timestamp = Date.now()
      
      // Generate unique IDs for each variant to ensure proper selection
      const generateId = () => `resume_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
      
      try {
        // Generate three variants using OpenAI with different templates, tailored to the job
        const templates = ['professional', 'modern', 'creative']
        const variants = []
        
        for (const template of templates) {
          try {
            const aiGeneratedContent = await generateJobTailoredResumeWithOpenAI(template)
            
            variants.push({
              id: generateId(),
              title: `${selectedJob.title} - ${template.charAt(0).toUpperCase() + template.slice(1)} Match`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              template: template,
              content: aiGeneratedContent,
              preview: `AI-generated ${template} resume optimized for ${selectedJob.title} position at ${selectedJob.company}`,
              // Database fields (using job data as fallback)
              first_name: 'Professional',
              last_name: 'Candidate',
              location: selectedJob.location,
              phone: '(555) 000-0000',
              email: 'candidate@example.com',
              work_history: [],
              education: [],
              skills: selectedJob.skills,
              profile_summary: `Professional candidate seeking ${selectedJob.title} position at ${selectedJob.company}`
            })
          } catch (error) {
            console.error(`Failed to generate ${template} resume:`, error)
            // Fallback to basic content if OpenAI fails
            variants.push({
              id: generateId(),
              title: `${selectedJob.title} - ${template.charAt(0).toUpperCase() + template.slice(1)} (Fallback)`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              template: template,
              content: `RESUME GENERATION FAILED\n\nPlease try again or contact support.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
              preview: `Fallback ${template} resume - OpenAI generation failed`,
              // Database fields (using job data as fallback)
              first_name: 'Professional',
              last_name: 'Candidate',
              location: selectedJob.location,
              phone: '(555) 000-0000',
              email: 'candidate@example.com',
              work_history: [],
              education: [],
              skills: selectedJob.skills,
              profile_summary: `Professional candidate seeking ${selectedJob.title} position at ${selectedJob.company}`
            })
          }
        }
        
        onResumeGenerated(variants)
      } catch (error) {
        console.error('Error generating job-tailored resumes:', error)
        // Show error to user
        alert(`Failed to generate resumes: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Job-Matching Resume</h3>
        <p className="text-gray-300">Find a job and generate a tailored resume</p>
      </div>

      {/* Job Search */}
      <div className="space-y-6">
        <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Jobs</span>
        </h4>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search by job title or company name..."
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Job List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-400">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedJob?.id === job.id
                    ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
                onClick={() => handleJobSelect(job)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {selectedJob?.id === job.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-10">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-white mb-2">{job.title}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">{job.description}</p>
                  </div>
                </div>

                {/* Job Requirements */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.slice(0, 5).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                      +{job.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Selected Job Analysis */}
      {selectedJob && (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Job Analysis</span>
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
            )}
          </h4>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyzing Job Requirements</h3>
              <p className="text-gray-400">Extracting key skills and requirements...</p>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h5 className="text-lg font-semibold text-white mb-4">{selectedJob.title} at {selectedJob.company}</h5>
              
              <div className="space-y-4">
                <div>
                  <h6 className="font-medium text-white mb-2">Key Requirements:</h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements.map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-sm text-emerald-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h6 className="font-medium text-white mb-2">Required Skills:</h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Template Display */}
      {selectedJob && !isAnalyzing && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">Selected Template</h4>
          <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-500/20">
            <div className="text-center">
              <h5 className="font-semibold text-white mb-1">
                {templates.find(t => t.id === selectedTemplate)?.name || 'Modern'}
              </h5>
              <p className="text-sm text-gray-300">
                {templates.find(t => t.id === selectedTemplate)?.description || 'Clean and contemporary'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {selectedJob && !isAnalyzing && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
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
                {isGenerating ? 'Generating...' : 'Generate Tailored Resume'}
              </span>
              {!isGenerating && (
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
