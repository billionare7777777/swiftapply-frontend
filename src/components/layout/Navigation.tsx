// Navigation component for tab-based navigation

import React from 'react'
import { Briefcase, FileText, Send, BarChart3, Zap, Database } from 'lucide-react'
import { TabType } from '../../types'
import { useApp } from '../../context/AppContext'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
  { id: 'job-search', label: 'Job Search', icon: Briefcase, description: 'Find Opportunities' },
  { id: 'scraped-jobs', label: 'Database Jobs', icon: Database, description: '500+ Scraped Jobs' },
  { id: 'resume-generator', label: 'Resume Generator', icon: FileText, description: 'AI-Powered CVs' },
  { id: 'application-dashboard', label: 'Applications', icon: Send, description: 'Track Progress' },
]

export const Navigation: React.FC = () => {
  const { state, setActiveTab } = useApp()

  return (
    <nav 
      className="glass-effect border-b border-white/20"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = state.activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex flex-col items-center py-4 px-6 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg transform -translate-y-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-4px)'
                } : {}}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
                <span className={`text-xs mt-1 transition-opacity duration-300 ${
                  isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-700'
                }`}>
                  {tab.description}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
