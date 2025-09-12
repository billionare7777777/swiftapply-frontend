import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../src/context/AuthContext'
import { FontLoader } from '../src/components/ui/FontLoader'

// Use local font loading instead of Google Fonts to avoid timeout issues
const fontClass = 'font-sans'

export const metadata: Metadata = {
  title: 'SwiftApply.ai',
  description: 'Automated Job Application for GreenHouse',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontClass}>
        <FontLoader>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FontLoader>
      </body>
    </html>
  )
}
