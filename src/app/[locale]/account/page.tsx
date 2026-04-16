import { Suspense } from 'react'

import AccountPage from '@/components/account/AccountPage'

export default function Account() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-[50vh] bg-[#F8FAFC]" />}>
        <AccountPage />
      </Suspense>
    </div>
  )
}
