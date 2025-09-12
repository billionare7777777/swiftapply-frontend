// Main App component with clean, modern architecture

import React from 'react'
import { useApp } from '../context/AppContext'
import { Header } from './layout/Header'
import { NotificationBar } from './layout/NotificationBar'
import { CleanDashboard } from './features/CleanDashboard'
import { CleanJobSearch } from './features/CleanJobSearch'
import { CleanResumeGenerator } from './features/CleanResumeGenerator'
import { ApplicationsDisplay } from './features/ApplicationsDisplay'
import { componentRegistry } from '../core/componentRegistry'
import { NotificationProvider } from './ui/NotificationSystem'

// Register clean, focused components
componentRegistry.register('dashboard', CleanDashboard)
componentRegistry.register('job-search', CleanJobSearch)
componentRegistry.register('resume-generator', CleanResumeGenerator)
componentRegistry.register('applications', ApplicationsDisplay)

// Clean, modern components for the five core pages
const ApplicationDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Application Dashboard</h1>
          <p className="text-blue-100 text-lg">Track and manage your job applications</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold">Applications Sent</p>
                  <p className="text-3xl font-bold text-green-700">24</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">📤</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-semibold">Interviews</p>
                  <p className="text-3xl font-bold text-blue-700">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🎯</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-violet-50 p-6 rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 font-semibold">Success Rate</p>
                  <p className="text-3xl font-bold text-emerald-700">12.5%</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-xl">📈</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)


componentRegistry.register('application-dashboard', ApplicationDashboard)

export const App: React.FC = () => {
  const { state } = useApp()

  const renderTabContent = () => {
    const Component = componentRegistry.get(state.activeTab)
    if (Component) {
      return <Component />
    }
    
    // Fallback to default dashboard
    return <CleanDashboard />
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header>
          {renderTabContent()}
        </Header>
        <NotificationBar />
      </div>
    </NotificationProvider>
  )
}

export default App
