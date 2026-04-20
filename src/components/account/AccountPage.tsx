'use client'

import {
  CircleUser,
  FileText,
  LogOut,
  Shield,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { authKeys } from '@/services/auth/keys'
import { getProfileQuery } from '@/services/auth/queries'
import { logoutAction } from '@/services/auth/serveractions'

import Container from '../shared/container'
import CampainsList from './tabs/campains/CampainsList'
import InfoAccount from './tabs/İnfoAccount'
import Security from './tabs/Security'
import TenderList from './tabs/tenders/TenderList'

type AccountTab = 'account' | 'security' | 'companies' | 'tenders'

const TAB_LABELS: Record<AccountTab, string> = {
  account: 'Hesab məlumatları',
  security: 'Təhlükəsizlik',
  companies: 'Şirkətlərim',
  tenders: 'Tenderlərim',
}

function CompaniesNavIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      className={cn('size-7 shrink-0', className)}
      aria-hidden
    >
      <path
        d="M3.5 24.5H24.5M5.83333 24.5V8.16667L15.1667 3.5V24.5M22.1667 24.5V12.8333L15.1667 8.16667M10.5 10.5V10.5117M10.5 14V14.0117M10.5 17.5V17.5117M10.5 21V21.0117"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function navRowShell(active: boolean) {
  return cn(
    'flex w-full items-center justify-between overflow-hidden rounded-md px-6 py-3',
    active ? 'bg-[#e6eff6]' : 'bg-white'
  )
}

/** Figma: əsas panel — başlıq zolağı + məzmun (grid hüceyrəsində tam hündürlük) */
function AccountMainPanel({
  title,
  children,
  hideHeader = false,
  headerAction,
}: {
  title: string
  children?: ReactNode
  hideHeader?: boolean
  headerAction?: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-[#eaf1fa] bg-white">
      {!hideHeader ? (
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eaf1fa] px-8 py-6">
          <h2 className="text-2xl font-medium leading-8 text-[#1d212a]">{title}</h2>
          {headerAction}
        </div>
      ) : null}
      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto bg-white',
          hideHeader ? 'p-0' : 'px-8 pb-8 pt-8 '
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const {
    data: profile,
    isPending: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useQuery(getProfileQuery())
  const profileUser = profile?.user ?? null

  const [activeTab, setActiveTab] = useState<AccountTab>('account')
  const [companiesView, setCompaniesView] = useState<
    'list' | 'create' | 'edit' | 'detail'
  >('list')
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutPending, setLogoutPending] = useState(false)

  useEffect(() => {
    if (activeTab !== 'companies') setCompaniesView('list')
  }, [activeTab])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'security' || tab === 'companies' || tab === 'tenders') {
      setActiveTab(tab)
      return
    }
    setActiveTab('account')
  }, [searchParams])

  const inactiveLabel = 'text-base font-normal leading-6 text-[#6b6e71]'
  const activeLabel = 'text-base font-medium leading-6 text-[#0f477d]'
  const iconInactive = 'text-[#6b6e71]'
  const iconActive = 'text-[#0f477d]'

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-8 max-sm:py-5">
      <Container >
        <div className="grid min-h-[min(872px,calc(100vh-160px))] grid-cols-1 gap-2 md:grid-cols-[240px_minmax(0,1fr)] md:grid-rows-1 md:items-stretch md:gap-2 lg:grid-cols-[288px_minmax(0,1fr)]">
          {/* Sidebar — Figma: 288px, rounded 12px, border #eaf1fa */}
          <aside className="flex h-full min-h-0 w-full flex-col rounded-xl border border-[#eaf1fa] bg-white px-4 py-6 md:px-5 md:py-7 lg:px-6 lg:py-8">
            <p className="mb-8 text-2xl font-medium leading-8 text-[#14171a]">Hesabım</p>

            <nav className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className={cn(navRowShell(activeTab === 'account'), 'text-left')}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <CircleUser
                      className={cn(
                        'size-7 shrink-0',
                        activeTab === 'account' ? iconActive : iconInactive
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        activeTab === 'account' ? activeLabel : inactiveLabel
                      )}
                    >
                      Hesab məlumatları
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={cn(navRowShell(activeTab === 'security'), 'text-left')}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <Shield
                      className={cn(
                        'size-7 shrink-0',
                        activeTab === 'security' ? iconActive : iconInactive
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        activeTab === 'security' ? activeLabel : inactiveLabel
                      )}
                    >
                      Təhlükəsizlik
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('companies')}
                  className={cn(navRowShell(activeTab === 'companies'), 'text-left')}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <CompaniesNavIcon
                      className={
                        activeTab === 'companies' ? iconActive : iconInactive
                      }
                    />
                    <span
                      className={cn(
                        'min-w-0 flex-1 truncate',
                        activeTab === 'companies' ? activeLabel : inactiveLabel
                      )}
                    >
                      Şirkətlərim
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tenders')}
                  className={cn(navRowShell(activeTab === 'tenders'), 'text-left')}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <FileText
                      className={cn(
                        'size-7 shrink-0',
                        activeTab === 'tenders' ? iconActive : iconInactive
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        activeTab === 'tenders' ? activeLabel : inactiveLabel
                      )}
                    >
                      Tenderlərim
                    </span>
                  </span>
                </button>
              </div>

              <div className="h-px w-full bg-[#eaf1fa]" />

              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className={cn(navRowShell(false), 'text-left')}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3.5">
                  <LogOut className="size-7 shrink-0 text-[#6b6e71]" aria-hidden />
                  <span className={inactiveLabel}>Hesabdan çıxış</span>
                </span>
              </button>
            </nav>
          </aside>

          <div className="flex min-h-0 h-full min-w-0 flex-col">
            <AccountMainPanel
              title={TAB_LABELS[activeTab]}
              hideHeader={activeTab === 'companies' || activeTab === 'tenders'}
              headerAction={undefined}
            >
              {activeTab === 'account' ? (
                <InfoAccount
                  user={profileUser}
                  isLoading={profileLoading}
                  isError={profileError}
                  onRetry={() => void refetchProfile()}
                />
              ) : null}
              {activeTab === 'security' ? (
                <Security userEmail={profileUser?.email ?? ''} />
              ) : null}
              {activeTab === 'companies' ? (
                <CampainsList
                  view={companiesView}
                  onViewChange={setCompaniesView}
                />
              ) : null}
              {activeTab === 'tenders' ? <TenderList /> : null}
            </AccountMainPanel>
          </div>
        </div>
      </Container>

      {logoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <button
            type="button"
            aria-label="Bağla"
            className="absolute inset-0 bg-black/40"
            onClick={() => setLogoutOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#ebf0f7] bg-white p-6 shadow-lg"
          >
            <p className="mb-6 text-center text-base font-medium text-[#14171a]">
              Hesabdan çıxmaqda əminsiniz?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="rounded-xl border border-[#ebf0f7] bg-white px-4 py-2.5 text-sm font-medium text-[#565355] transition-colors hover:bg-[#f4f7fb]"
              >
                Ləğv et
              </button>
              <button
                type="button"
                disabled={logoutPending}
                onClick={async () => {
                  setLogoutPending(true)
                  try {
                    await logoutAction()
                    await queryClient.invalidateQueries({
                      queryKey: authKeys.profile(),
                    })
                  } finally {
                    setLogoutPending(false)
                    setLogoutOpen(false)
                    router.push('/login')
                  }
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {logoutPending ? 'Çıxılır…' : 'Hesabdan çıx'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
