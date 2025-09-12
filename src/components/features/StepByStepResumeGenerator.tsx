'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Plus, Upload, ArrowRight, ArrowLeft, CheckCircle, Eye, Edit3, Trash2, Sparkles, Wand2, Target, User, GraduationCap, Briefcase, Award } from 'lucide-react'
import { useNotification } from '../../hooks/useNotification'
import { useAuth } from '../../context/AuthContext'
import { ResumeListStep } from './steps/ResumeListStep'
import { ResumeCreationStep } from './steps/ResumeCreationStep'
import { ResumeSelectionStep } from './steps/ResumeSelectionStep'
import { EnhancedResumeService } from '../../services/enhancedResumeService'

export interface Resume {
  id?: string  // Optional for new resumes, required for existing ones
  title: string
  createdAt: string
  updatedAt: string
  template: string
  content: string
  preview?: string
  // Database fields for editing
  first_name?: string
  last_name?: string
  location?: string
  phone?: string
  email?: string
  linkedin?: string
  work_history?: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  education?: Array<{
    institution: string
    degree: string
    field: string
    year: string
  }>
  skills?: string[]
  profile_summary?: string
  user_id?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  skills: string[]
}

export interface UserData {
  name: string
  email: string
  phoneNumber?: string
  location?: string
  summary: string
  skills: string[]
  experience: Array<{
    company: string
    position: string
    duration: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    year: string
  }>
}

export type Step = 'list' | 'creation' | 'selection'

export const StepByStepResumeGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('list')
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional')
  
  const { showSuccess, showError, showCelebration } = useNotification()
  const { user } = useAuth()
  const resumeService = new EnhancedResumeService()

  // State for complete user profile data from database
  const [userProfileData, setUserProfileData] = useState<UserData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Fetch complete user profile data from database
  const fetchUserProfile = async () => {
    if (!user) return
    
    setLoadingProfile(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://locust-one-mutt.ngrok-free.app/api'
      const apiUrl = baseUrl.endsWith('/api') ? `${baseUrl}/profile/get` : `${baseUrl}/api/profile/get`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id.toString(),
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.profile) {
          const profile = data.profile
          
          // Convert database profile to UserData format
          const userData: UserData = {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
            phoneNumber: profile.phone_number || '',
            location: profile.location_city || '',
            summary: profile.bio || `Experienced professional with expertise in various fields. Passionate about delivering high-quality results and continuous learning.`,
            skills: profile.skills || [
              'Communication',
              'Problem Solving',
              'Team Leadership',
              'Project Management',
              'Technical Skills',
              'Analytical Thinking'
            ],
            experience: profile.employment ? profile.employment.map((emp: any) => ({
              company: emp.title || 'Previous Company',
              position: 'Professional Role',
              duration: emp.date || '2020 - Present',
              description: emp.description || 'Led various projects and initiatives, demonstrating strong leadership and technical skills.'
            })) : [
              {
                company: 'Previous Company',
                position: 'Professional Role',
                duration: '2020 - Present',
                description: 'Led various projects and initiatives, demonstrating strong leadership and technical skills.'
              }
            ],
            education: profile.education ? profile.education.map((edu: any) => ({
              institution: edu.institution || 'University',
              degree: edu.degree || 'Bachelor\'s Degree',
              field: edu.field || 'Relevant Field',
              year: edu.year || '2018'
            })) : [
              {
                institution: 'University',
                degree: 'Bachelor\'s Degree',
                field: 'Relevant Field',
                year: '2018'
              }
            ]
          }
          
          setUserProfileData(userData)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      showError('Error', 'Failed to load profile data. Using basic information.')
    } finally {
      setLoadingProfile(false)
    }
  }

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  // Use complete profile data if available, otherwise fall back to basic user data
  const userData: UserData | null = userProfileData || (user ? {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phoneNumber: user.phone_number || '',
    location: user.location_city || '',
    summary: user.bio || `Experienced professional with expertise in various fields. Passionate about delivering high-quality results and continuous learning.`,
    skills: user.skills || [
      'Communication',
      'Problem Solving',
      'Team Leadership',
      'Project Management',
      'Technical Skills',
      'Analytical Thinking'
    ],
    experience: user.employment ? user.employment.map((emp: any) => ({
      company: emp.title || 'Previous Company',
      position: 'Professional Role',
      duration: emp.date || '2020 - Present',
      description: emp.description || 'Led various projects and initiatives, demonstrating strong leadership and technical skills.'
    })) : [
      {
        company: 'Previous Company',
        position: 'Professional Role',
        duration: '2020 - Present',
        description: 'Led various projects and initiatives, demonstrating strong leadership and technical skills.'
      }
    ],
    education: user.education ? user.education.map((edu: any) => ({
      institution: edu.institution || 'University',
      degree: edu.degree || 'Bachelor\'s Degree',
      field: 'Relevant Field',
      year: edu.year || '2018'
    })) : [
      {
        institution: 'University',
        degree: 'Bachelor\'s Degree',
        field: 'Relevant Field',
        year: '2018'
      }
    ]
  } : null)

  useEffect(() => {
    setIsVisible(true)
    loadResumes()
    loadJobs()
  }, [])

  const loadResumes = async () => {
    try {
      setLoading(true)
      
      // Clear any existing sample resumes from database
      try {
        await resumeService.clearSampleResumes()
        console.log('Cleared any existing sample resumes')
      } catch (error) {
        console.warn('Failed to clear sample resumes:', error)
      }
      
      const userResumes = await resumeService.getUserResumes()
      setResumes(userResumes)
      
      // No automatic sample data initialization - user must create their own resumes
      if (userResumes.length === 0) {
        console.log('No resumes found. User can create new ones.')
      }
    } catch (error) {
      console.error('Failed to load resumes:', error)
      showError('Failed to load resumes', 'Please check your connection and try again')
    } finally {
      setLoading(false)
    }
  }


  const loadJobs = async () => {
    try {
      const jobList = await resumeService.getAvailableJobs()
      setJobs(jobList)
    } catch (error) {
      console.error('Failed to load jobs:', error)
    }
  }

  const handleCreateNew = (template?: string) => {
    if (template) {
      setSelectedTemplate(template)
    }
    setCurrentStep('creation')
  }

  const handleResumeEdit = async (resume: Resume) => {
    try {
      setLoading(true)
      
      // Check if resume has an ID before attempting to fetch
      if (!resume.id) {
        showError('Invalid resume', 'This resume cannot be edited')
        return
      }
      
      // Fetch full resume data for editing
      const fullResumeData = await resumeService.getResumeForEdit(resume.id)
      
      if (fullResumeData) {
        // Set the template and move to creation step with pre-filled data
        setSelectedTemplate(fullResumeData.title || resume.template)
        setSelectedResume(fullResumeData) // Pass the full resume data for pre-filling
        setCurrentStep('creation')
      } else {
        showError('Failed to load resume data', 'Please try again later')
      }
    } catch (error) {
      console.error('Error loading resume for editing:', error)
      showError('Failed to load resume data', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleResumePreview = (resume: Resume) => {
    // Extract name and title from resume title
    const nameMatch = resume.title.match(/^([^-]+)/)
    const titleMatch = resume.title.match(/- (.+)$/)
    const fullName = nameMatch ? nameMatch[1].trim() : 'Professional Candidate'
    const jobTitle = titleMatch ? titleMatch[1].trim() : 'Professional'
    
    // Get contact info from resume data
    const email = resume.email || 'candidate@example.com'
    const phone = resume.phone || '(555) 000-0000'
    const location = resume.location || 'City, State'
    
    // Create a professional PDF preview matching the image style
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resume.title} - Resume Preview</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              line-height: 1.5; 
              color: #1f2937; 
              background: #f8fafc;
              padding: 20px;
            }
            .resume-container {
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #1a4d3a 100%);
              color: white;
              padding: 40px 30px;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"leaves\" x=\"0\" y=\"0\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><path d=\"M20 5 C25 5, 30 10, 25 15 C30 20, 25 25, 20 20 C15 25, 10 20, 15 15 C10 10, 15 5, 20 5 Z\" fill=\"rgba(255,255,255,0.1)\" opacity=\"0.3\"/><circle cx=\"10\" cy=\"10\" r=\"2\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"30\" cy=\"30\" r=\"1.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23leaves)\"/></svg>');
              opacity: 0.4;
            }
            .header-content {
              position: relative;
              z-index: 2;
              text-align: center;
            }
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
            }
            .name {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 8px;
              letter-spacing: -0.02em;
              line-height: 1.1;
            }
            .title {
              font-size: 1.1rem;
              font-weight: 500;
              opacity: 0.95;
              margin-bottom: 20px;
            }
            .contact-info {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 20px;
              font-size: 0.9rem;
              opacity: 0.9;
            }
            .contact-item {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .contact-icon {
              width: 16px;
              height: 16px;
              opacity: 0.8;
            }
            .content {
              padding: 30px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section:last-child {
              margin-bottom: 0;
            }
            .section-title {
              font-size: 1.1rem;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .section-icon {
              width: 18px;
              height: 18px;
              opacity: 0.7;
            }
            .section-content {
              font-size: 0.9rem;
              line-height: 1.6;
              color: #475569;
            }
            .work-item, .education-item {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #f1f5f9;
            }
            .work-item:last-child, .education-item:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 8px;
            }
            .item-title {
              font-weight: 600;
              color: #1e293b;
              font-size: 0.95rem;
              margin-bottom: 2px;
            }
            .item-company {
              font-weight: 500;
              color: #475569;
              font-size: 0.9rem;
            }
            .item-dates {
              font-size: 0.8rem;
              color: #64748b;
              margin-bottom: 2px;
            }
            .item-location {
              font-size: 0.8rem;
              color: #64748b;
            }
            .item-description {
              font-size: 0.9rem;
              line-height: 1.5;
              color: #475569;
              margin-top: 6px;
            }
            .skills-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            .skill-item {
              background: #f8fafc;
              color: #475569;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 0.8rem;
              border: 1px solid #e2e8f0;
              font-weight: 500;
            }
            .summary-text {
              font-size: 0.9rem;
              line-height: 1.6;
              color: #475569;
              text-align: justify;
            }
            .template-badge {
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(255, 255, 255, 0.1);
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 500;
              backdrop-filter: blur(10px);
            }
            @media print {
              body { background: white; padding: 0; }
              .resume-container { box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <div class="template-badge">${resume.template}</div>
              <div class="header-content">
                <div class="name">${fullName}</div>
                <div class="title">${jobTitle}</div>
                <div class="contact-info">
                  <div class="contact-item">
                    <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    ${email}
                  </div>
                  <div class="contact-item">
                    <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    ${phone}
                  </div>
                  <div class="contact-item">
                    <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    ${location}
                  </div>
                </div>
              </div>
            </div>
            <div class="content">
              ${resume.profile_summary ? `
                <div class="section">
                  <div class="section-title">
                    <svg class="section-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                    Profile
                  </div>
                  <div class="section-content">${resume.profile_summary}</div>
                </div>
              ` : ''}
              
              ${resume.work_history && resume.work_history.length > 0 ? `
                <div class="section">
                  <div class="section-title">
                    <svg class="section-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm3-2a1 1 0 00-1 1v1h4V5a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    Employment History
                  </div>
                  ${resume.work_history.map(work => `
                    <div class="work-item">
                      <div class="item-header">
                        <div>
                          <div class="item-company">${work.company}</div>
                          <div class="item-title">${work.position}</div>
                        </div>
                        <div>
                          <div class="item-dates">${work.duration}</div>
                          <div class="item-location">${location}</div>
                        </div>
                      </div>
                      <div class="section-content">${work.description}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${resume.education && resume.education.length > 0 ? `
                <div class="section">
                  <div class="section-title">
                    <svg class="section-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    Education
                  </div>
                  ${resume.education.map(edu => `
                    <div class="education-item">
                      <div class="item-header">
                        <div>
                          <div class="item-title">${edu.degree} in ${edu.field}</div>
                          <div class="item-company">${edu.institution}</div>
                        </div>
                        <div>
                          <div class="item-dates">${edu.year}</div>
                          <div class="item-location">${location}</div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${resume.skills && resume.skills.length > 0 ? `
                <div class="section">
                  <div class="section-title">
                    <svg class="section-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                    </svg>
                    Skills
                  </div>
                  <div class="skills-list">
                    ${resume.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${!resume.profile_summary && !resume.work_history && !resume.education && !resume.skills ? `
                <div class="section">
                  <div class="section-content">${resume.content}</div>
                </div>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  const handleResumeUpload = async (file: File) => {
    try {
      setLoading(true)
      const uploadedResume = await resumeService.uploadResume(file)
      setResumes(prev => [uploadedResume, ...prev])
      showSuccess('Resume uploaded successfully!', 'Your resume has been added to your collection')
    } catch (error) {
      showError('Failed to upload resume', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeGenerated = (generatedResumes: Resume[]) => {
    // Add generated resumes to the existing list
    setResumes(prev => [...generatedResumes, ...prev])
    setSelectedResume(generatedResumes[0]) // Default to first variant
    
    // Show success notification
    showCelebration(
      'Resume Generated Successfully! 🎉',
      `Your new resume "${generatedResumes[0].title}" has been created and added to your collection.`,
      {
        label: 'View Resume',
        onClick: () => {
          // Stay on list step to show the generated resume
          setCurrentStep('list')
        }
      }
    )
    
    // Stay on the list step to show the generated resume
    setCurrentStep('list')
  }

  const handleResumeCompleted = async (finalResume: Resume) => {
    try {
      setLoading(true)
      await resumeService.saveResume(finalResume)
      await loadResumes()
      setCurrentStep('list')
      showCelebration(
        'Resume Saved Successfully! 🎉', 
        `"${finalResume.title}" has been saved to your collection and is ready to use.`,
        {
          label: 'View All Resumes',
          onClick: () => {
            setCurrentStep('list')
          }
        }
      )
    } catch (error) {
      showError('Failed to save resume', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeDownload = async (resume: Resume) => {
    try {
      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      
      // Extract name and title from resume title
      const nameMatch = resume.title.match(/^([^-]+)/)
      const titleMatch = resume.title.match(/- (.+)$/)
      const fullName = nameMatch ? nameMatch[1].trim() : 'Professional Candidate'
      const jobTitle = titleMatch ? titleMatch[1].trim() : 'Professional'
      
      // Get contact info from resume data
      const email = resume.email || 'candidate@example.com'
      const phone = resume.phone || '(555) 000-0000'
      const location = resume.location || 'City, State'
      
      // Create a temporary container for the resume content
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.left = '-9999px'
      tempContainer.style.top = '0'
      tempContainer.style.width = '210mm'
      tempContainer.style.background = 'white'
      tempContainer.style.fontFamily = 'Inter, sans-serif'
      tempContainer.innerHTML = `
        <div style="padding: 0; background: white; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; min-height: 100vh;">
          <!-- Header Section with Dark Green Leafy Background -->
          <div style="background: linear-gradient(135deg, #1a4d3a 0%, #2d5a47 50%, #1a4d3a 100%); color: white; padding: 40px 30px; position: relative; overflow: hidden;">
            <!-- Leafy Pattern Background -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"leaves\" x=\"0\" y=\"0\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><path d=\"M20 5 C25 5, 30 10, 25 15 C30 20, 25 25, 20 20 C15 25, 10 20, 15 15 C10 10, 15 5, 20 5 Z\" fill=\"rgba(255,255,255,0.1)\" opacity=\"0.3\"/><circle cx=\"10\" cy=\"10\" r=\"2\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"30\" cy=\"30\" r=\"1.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23leaves)\"/></svg></div>
            
            <div style="position: relative; z-index: 2; text-align: center;">
              <!-- Name -->
              <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; line-height: 1.1;">${fullName}</div>
              
              <!-- Title -->
              <div style="font-size: 1.1rem; font-weight: 500; opacity: 0.95; margin-bottom: 20px;">${jobTitle}</div>
              
              <!-- Contact Info -->
              <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 0.9rem; opacity: 0.9;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 16px; height: 16px; opacity: 0.8;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  ${email}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 16px; height: 16px; opacity: 0.8;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  ${phone}
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 16px; height: 16px; opacity: 0.8;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  ${location}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 30px;">
            ${resume.profile_summary ? `
              <div style="margin-bottom: 25px;">
                <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 18px; height: 18px; opacity: 0.7;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  Profile
                </div>
                <div style="font-size: 0.9rem; line-height: 1.6; color: #475569; white-space: pre-line;">${resume.profile_summary}</div>
              </div>
            ` : ''}
            
            ${resume.work_history && resume.work_history.length > 0 ? `
              <div style="margin-bottom: 25px;">
                <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 18px; height: 18px; opacity: 0.7;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm3-2a1 1 0 00-1 1v1h4V5a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  Employment History
                </div>
                ${resume.work_history.map(work => `
                  <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <div>
                        <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem; margin-bottom: 2px;">${work.company}</div>
                        <div style="font-weight: 500; color: #475569; font-size: 0.9rem;">${work.position}</div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 2px;">${work.duration}</div>
                        <div style="font-size: 0.8rem; color: #64748b;">${location}</div>
                      </div>
                    </div>
                    ${work.description ? `<div style="font-size: 0.9rem; line-height: 1.5; color: #475569; white-space: pre-line; margin-top: 8px;">${work.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resume.education && resume.education.length > 0 ? `
              <div style="margin-bottom: 25px;">
                <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 18px; height: 18px; opacity: 0.7;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  Education
                </div>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <div>
                        <div style="font-weight: 600; color: #1e293b; font-size: 0.95rem; margin-bottom: 2px;">${edu.degree} in ${edu.field}</div>
                        <div style="font-weight: 500; color: #475569; font-size: 0.9rem;">${edu.institution}</div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 2px;">${edu.year}</div>
                        <div style="font-size: 0.8rem; color: #64748b;">${location}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resume.skills && resume.skills.length > 0 ? `
              <div style="margin-bottom: 25px;">
                <div style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
                  <svg style="width: 18px; height: 18px; opacity: 0.7;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                  </svg>
                  Skills
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                  ${resume.skills.map(skill => `<span style="background: #f8fafc; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; border: 1px solid #e2e8f0; font-weight: 500;">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${!resume.profile_summary && !resume.work_history && !resume.education && !resume.skills ? `
              <div style="margin-bottom: 25px;">
                <div style="font-size: 0.9rem; line-height: 1.6; color: #475569; white-space: pre-line;">${resume.content}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `
      
      // Add the container to the document
      document.body.appendChild(tempContainer)
      
      // Wait for fonts to load
      await document.fonts.ready
      
      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight
      })
      
      // Remove the temporary container
      document.body.removeChild(tempContainer)
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Generate filename
      const fileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
      
      // Download the PDF
      pdf.save(fileName)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to the old method if PDF generation fails
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>Resume Download</title></head>
            <body>
              <h1>PDF Generation Failed</h1>
              <p>Please use your browser's print function to save as PDF.</p>
              <script>window.print()</script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }


  const handleResumeDelete = async (resume: Resume) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${resume.title}"?\n\nThis action cannot be undone.`
    )
    
    if (!confirmed) return
    
    try {
      setLoading(true)
      
      // Check if resume has an ID before attempting to delete
      if (!resume.id) {
        showError('Invalid resume', 'This resume cannot be deleted')
        return
      }
      
      await resumeService.deleteResume(resume.id)
      
      // Remove from local state
      setResumes(prev => prev.filter(r => r.id !== resume.id))
      
      // Show success notification
      showSuccess(
        'Resume deleted successfully! 🗑️', 
        `"${resume.title}" has been permanently removed from your collection`
      )
    } catch (error) {
      console.error('Failed to delete resume:', error)
      showError('Failed to delete resume', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep === 'creation') {
      setCurrentStep('list')
    } else if (currentStep === 'selection') {
      setCurrentStep('creation')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'list':
        return (
          <ResumeListStep
            resumes={resumes}
            loading={loading}
            onCreateNew={(template?: string) => handleCreateNew(template)}
            onResumePreview={handleResumePreview}
            onResumeUpload={handleResumeUpload}
            onResumeEdit={handleResumeEdit}
            onResumeDelete={handleResumeDelete}
            onResumeDownload={handleResumeDownload}
          />
        )
      case 'creation':
        return (
          <ResumeCreationStep
            userData={userData}
            jobs={jobs}
            onResumeGenerated={handleResumeGenerated}
            onBack={handleBack}
            selectedTemplate={selectedTemplate}
            editingResume={selectedResume}
            loadingProfile={loadingProfile}
          />
        )
      case 'selection':
        return (
          <ResumeSelectionStep
            resumes={resumes}
            onResumeCompleted={handleResumeCompleted}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-all duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Resume Generator
            </h1>
          </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create professional resumes in three simple steps
            </p>
          </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { step: 'list', label: 'My Resumes', icon: FileText },
              { step: 'creation', label: 'Create Resume', icon: Plus },
              { step: 'selection', label: 'Select & Save', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 ${
                  currentStep === step
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300'
                }`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{label}</span>
                </div>
                {index < 2 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {renderStep()}
        </div>
      </div>
    </div>
  )
}