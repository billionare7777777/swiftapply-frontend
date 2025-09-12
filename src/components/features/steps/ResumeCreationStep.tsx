'use client'

import React, { useState } from 'react'
import { ArrowLeft, User, Wand2, Target, Sparkles, ArrowRight } from 'lucide-react'
import { UserData, Job, Resume } from '../StepByStepResumeGenerator'
import { ManualResumeForm } from './creation/ManualResumeForm'
import { AutoFillResumeForm } from './creation/AutoFillResumeForm'
import { JobMatchingResumeForm } from './creation/JobMatchingResumeForm'

interface ResumeCreationStepProps {
  userData: UserData | null
  jobs: Job[]
  onResumeGenerated: (resumes: Resume[]) => void
  onBack: () => void
  selectedTemplate: string
  editingResume?: Resume | null
  loadingProfile?: boolean
}

type CreationMethod = 'manual' | 'autofill' | 'jobmatching'

export const ResumeCreationStep: React.FC<ResumeCreationStepProps> = ({
  userData,
  jobs,
  onResumeGenerated,
  onBack,
  selectedTemplate,
  editingResume,
  loadingProfile = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod>('manual')
  const [isGenerating, setIsGenerating] = useState(false)

  const creationMethods = [
    {
      id: 'manual' as CreationMethod,
      title: 'Manually Create Resume',
      description: 'Start from scratch with our guided form',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'autofill' as CreationMethod,
      title: 'Auto-Fill from Profile',
      description: 'Use your existing profile information',
      icon: Wand2,
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-400 to-pink-400'
    },
    {
      id: 'jobmatching' as CreationMethod,
      title: 'Match Job Requirements',
      description: 'Generate resume tailored to specific job',
      icon: Target,
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-400 to-teal-400'
    }
  ]

  const handleResumeGenerated = async (resumes: Resume[]) => {
    setIsGenerating(true)
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    onResumeGenerated(resumes)
    setIsGenerating(false)
  }

  const renderCreationForm = () => {
    switch (selectedMethod) {
      case 'manual':
        return (
          <ManualResumeForm
            onResumeGenerated={handleResumeGenerated}
            isGenerating={isGenerating}
            selectedTemplate={selectedTemplate}
            editingResume={editingResume}
          />
        )
      case 'autofill':
        return (
          <AutoFillResumeForm
            userData={userData}
            onResumeGenerated={handleResumeGenerated}
            isGenerating={isGenerating}
            selectedTemplate={selectedTemplate}
            editingResume={editingResume}
            loadingProfile={loadingProfile}
          />
        )
      case 'jobmatching':
        return (
          <JobMatchingResumeForm
            jobs={jobs}
            onResumeGenerated={handleResumeGenerated}
            isGenerating={isGenerating}
            selectedTemplate={selectedTemplate}
            editingResume={editingResume}
          />
        )
      default:
        return null
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
        <span>Back to Resume List</span>
      </button>

      {/* Method Selection */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Creation Method
        </h2>
        <p className="text-gray-300 text-lg">
          Select how you'd like to create your resume
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {creationMethods.map((method, index) => {
          const Icon = method.icon
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedMethod === method.id
                  ? `border-${method.gradient.split('-')[1]}-500 bg-gradient-to-r ${method.gradient} bg-opacity-20`
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                  selectedMethod === method.id
                    ? `bg-gradient-to-r ${method.gradient}`
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {method.description}
                </p>
              </div>
              
              {selectedMethod === method.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Creation Form */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
        {renderCreationForm()}
      </div>
    </div>
  )
}
