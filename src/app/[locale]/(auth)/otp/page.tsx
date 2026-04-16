import { Suspense } from 'react'

import OtpPage from '@/components/auth/OtpPage'

export default function Otp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-white" aria-hidden />
      }
    >
      <OtpPage />
    </Suspense>
  )
}

