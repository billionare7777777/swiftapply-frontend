'use client'

import React, { useState } from 'react'
import { ArrowLeft, CheckCircle, Eye, Download, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { Resume } from '../StepByStepResumeGenerator'

interface ResumeSelectionStepProps {
  resumes: Resume[]
  onResumeCompleted: (resume: Resume) => void
  onBack: () => void
}

export const ResumeSelectionStep: React.FC<ResumeSelectionStepProps> = ({
  resumes,
  onResumeCompleted,
  onBack
}) => {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)

  // Ensure we have valid resumes with unique IDs
  const validResumes = resumes.filter(resume => resume && resume.id)
  
  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('ResumeSelectionStep - Resumes received:', resumes.length)
    console.log('ResumeSelectionStep - Valid resumes:', validResumes.length)
    console.log('ResumeSelectionStep - Resume IDs:', validResumes.map(r => r.id))
    console.log('ResumeSelectionStep - Selected resume ID:', selectedResume?.id)
  }, [resumes, validResumes, selectedResume])

  const handleComplete = async () => {
    if (selectedResume) {
      setIsCompleting(true)
      // Simulate completion delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      onResumeCompleted(selectedResume)
      setIsCompleting(false)
    }
  }

  const handlePreview = (resume: Resume) => {
    // Create a modern professional PDF preview matching the design
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      // Extract name and title from resume title
      const nameMatch = resume.title.match(/^([^-]+)/)
      const titleMatch = resume.title.match(/- (.+)$/)
      const fullName = nameMatch ? nameMatch[1].trim() : 'Professional Candidate'
      const jobTitle = titleMatch ? titleMatch[1].trim() : 'Professional'
      
      // Get contact info from resume data
      const email = resume.email || 'candidate@example.com'
      const phone = resume.phone || '(555) 000-0000'
      const location = resume.location || 'City, State'
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${fullName} - Resume Preview</title>
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
              background: linear-gradient(135deg, #065f46 0%, #047857 100%);
              color: white;
              padding: 40px;
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
              background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="leaves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23leaves)"/></svg>');
              opacity: 0.3;
            }
            .header-content {
              position: relative;
              z-index: 1;
            }
            .name {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 8px;
              letter-spacing: -0.025em;
              text-align: center;
            }
            .title {
              font-size: 1.2rem;
              font-weight: 500;
              opacity: 0.95;
              margin-bottom: 24px;
              text-align: center;
            }
            .contact-info {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 24px;
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
              padding: 40px;
            }
            .section {
              margin-bottom: 32px;
            }
            .section:last-child {
              margin-bottom: 0;
            }
            .section-title {
              font-size: 1.1rem;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
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
              white-space: pre-line;
            }
            .availability {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: #10b981;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: 500;
              margin-bottom: 16px;
            }
            .availability-icon {
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
            }
            .skills-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 12px;
            }
            .skill-item {
              background: #f1f5f9;
              color: #475569;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.8rem;
              border: 1px solid #e2e8f0;
            }
            .work-item, .education-item {
              margin-bottom: 16px;
              padding-bottom: 16px;
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
            }
            .item-company {
              font-weight: 500;
              color: #475569;
              font-size: 0.9rem;
            }
            .item-dates {
              font-size: 0.8rem;
              color: #64748b;
              text-align: right;
            }
            .item-location {
              font-size: 0.8rem;
              color: #64748b;
              text-align: right;
            }
            .template-badge {
              position: absolute;
              top: 20px;
              right: 20px;
              background: rgba(255, 255, 255, 0.15);
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 500;
              backdrop-filter: blur(10px);
              text-transform: capitalize;
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
    }
  }

  const handleDownload = async (resume: Resume) => {
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

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Creation</span>
      </button>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Resume
        </h2>
        <p className="text-gray-300 text-lg">
          Select the best version of your resume
        </p>
      </div>

      {/* Resume Variants */}
      {validResumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Resumes Available</h3>
          <p className="text-gray-300 text-sm">Please go back and create some resumes first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {validResumes.map((resume, index) => (
          <div
            key={resume.id}
            className={`group relative bg-white/10 backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
              selectedResume?.id === resume.id
                ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                : 'border-white/20 hover:border-white/40'
            }`}
            onClick={() => {
              console.log('Resume clicked:', resume.id, resume.title)
              setSelectedResume(resume)
            }}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* Selection Indicator */}
            {selectedResume?.id === resume.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center z-10 shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            
            {/* Selection Ring */}
            {selectedResume?.id === resume.id && (
              <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-400 ring-opacity-50 pointer-events-none"></div>
            )}

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Variant {index + 1}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">
                      {resume.template} Style
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreview(resume)
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(resume)
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Style Description */}
              <div className="text-sm text-gray-300">
                {index === 0 && 'Professional and clean layout with emphasis on achievements'}
                {index === 1 && 'Creative design highlighting skills and experience'}
                {index === 2 && 'Modern format optimized for ATS systems'}
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-6">
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-300 line-clamp-6">
                  {resume.content.substring(0, 300)}...
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>AI Optimized</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>ATS Friendly</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
        >
          Back
        </button>
        
        <button
          onClick={handleComplete}
          disabled={!selectedResume || isCompleting}
          className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-2">
            {isCompleting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span>
              {isCompleting ? 'Saving...' : 'Complete Resume'}
            </span>
            {!isCompleting && (
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
