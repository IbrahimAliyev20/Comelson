import { Suspense } from 'react'

import NewPasswordPage from '@/components/auth/NewPasswordPage'

export default function NewPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-white" aria-hidden />}>
      <NewPasswordPage />
    </Suspense>
  )
}
