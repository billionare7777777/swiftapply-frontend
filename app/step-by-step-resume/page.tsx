'use client'

import React from 'react'
import { StepByStepResumeGenerator } from '../../src/components/features/StepByStepResumeGenerator'
import { NotificationProvider } from '../../src/components/ui/NotificationSystem'

export default function StepByStepResumePage() {
  return (
    <NotificationProvider>
      <StepByStepResumeGenerator />
    </NotificationProvider>
  )
}
