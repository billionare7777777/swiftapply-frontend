'use client'

import { AppProvider } from '../../src/context/AppContext'
import { Header } from '../../src/components/layout/Header'
import { NotificationBar } from '../../src/components/layout/NotificationBar'
import { NotificationProvider } from '../../src/components/ui/NotificationSystem'
import ProtectedRoute from '../../src/components/auth/ProtectedRoute'
import ApplicationsPage from '../../src/components/features/ApplicationsPage'

export default function ApplicationsPageWrapper() {
  return (
    <ProtectedRoute>
      <AppProvider>
        <div 
          className="min-h-screen"
          style={{
            background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe)',
            minHeight: '100vh'
          }}
        >
          <NotificationProvider>
            <Header>
              <ApplicationsPage />
            </Header>
            <NotificationBar />
          </NotificationProvider>
        </div>
      </AppProvider>
    </ProtectedRoute>
  )
}
