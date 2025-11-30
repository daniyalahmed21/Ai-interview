'use client'

import { useParams } from 'next/navigation'
import InterviewInterface from '@/components/InterviewInterface'

export const dynamic = 'force-dynamic';

export default function InterviewPage() {
  const params = useParams()
  // The route is /interview/[id], so we use params.id
  // When starting an interview, this ID represents the field (e.g., 'frontend', 'backend')
  const fieldId = params.id as string

  return <InterviewInterface fieldId={fieldId} />
}
