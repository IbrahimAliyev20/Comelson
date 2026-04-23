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
      className={cn('size-6 shrink-0 sm:size-7', className)}
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
    'flex w-full items-center justify-between overflow-hidden rounded-md px-4 py-2.5 sm:px-6 sm:py-3',
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
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eaf1fa] px-4 py-4 sm:px-8 sm:py-6">
          <h2 className="text-xl font-medium leading-7 text-[#1d212a] sm:text-2xl sm:leading-8">
            {title}
          </h2>
          {headerAction}
        </div>
      ) : null}
      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto bg-white',
          hideHeader ? 'p-0' : 'px-3 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8'
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

  const inactiveLabel = 'text-sm sm:text-base font-normal leading-6 text-[#6b6e71]'
  const activeLabel = 'text-sm sm:text-base font-medium leading-6 text-[#0f477d]'
  const iconInactive = 'text-[#6b6e71]'
  const iconActive = 'text-[#0f477d]'

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] py-8 max-sm:py-5">
      <Container>
        <div className="grid min-h-[min(872px,calc(100vh-160px))] grid-cols-1 gap-2 md:grid-cols-[240px_minmax(0,1fr)] md:grid-rows-1 md:items-stretch md:gap-2 lg:grid-cols-[288px_minmax(0,1fr)]">
          {/* Sidebar — Figma: 288px, rounded 12px, border #eaf1fa */}
          <aside className="flex h-full min-h-0 w-full flex-col rounded-xl border border-[#eaf1fa] bg-white px-4 py-6 md:px-5 md:py-7 lg:px-6 lg:py-8">
            <p className="mb-6 text-xl font-medium leading-7 text-[#14171a] sm:mb-8 sm:text-2xl sm:leading-8">
              Hesabım
            </p>

            <nav className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className={cn(
                    navRowShell(activeTab === 'account'),
                    'cursor-pointer text-left'
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <CircleUser
                      className={cn(
                        'size-6 shrink-0 sm:size-7',
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
                  className={cn(
                    navRowShell(activeTab === 'security'),
                    'cursor-pointer text-left'
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <Shield
                      className={cn(
                        'size-6 shrink-0 sm:size-7',
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
                  className={cn(
                    navRowShell(activeTab === 'companies'),
                    'cursor-pointer text-left'
                  )}
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
                  className={cn(
                    navRowShell(activeTab === 'tenders'),
                    'cursor-pointer text-left'
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3.5">
                    <FileText
                      className={cn(
                        'size-6 shrink-0 sm:size-7',
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
                className={cn(navRowShell(false), 'cursor-pointer text-left')}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3.5">
                  <LogOut className="size-6 shrink-0 text-[#6b6e71] sm:size-7" aria-hidden />
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
            className="absolute inset-0 cursor-pointer bg-black/40"
            onClick={() => setLogoutOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#ebf0f7] bg-white px-6 pb-6 pt-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)]"
          >
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Bağla"
                onClick={() => setLogoutOpen(false)}
                className="flex size-8 items-center justify-center rounded-full border border-[#ebf0f7] bg-[#fafdff] text-[#32393f] transition-opacity hover:opacity-80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 px-2 pb-2 pt-2">
              <div className="flex size-[72px] items-center justify-center rounded-full bg-[#fff1f0]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M18.6667 10.6663V7.99967C18.6667 7.29243 18.3857 6.61415 17.8856 6.11406C17.3855 5.61396 16.7072 5.33301 16 5.33301H6.66667C5.95942 5.33301 5.28115 5.61396 4.78105 6.11406C4.28095 6.61415 4 7.29243 4 7.99967V23.9997C4 24.7069 4.28095 25.3852 4.78105 25.8853C5.28115 26.3854 5.95942 26.6663 6.66667 26.6663H16C16.7072 26.6663 17.3855 26.3854 17.8856 25.8853C18.3857 25.3852 18.6667 24.7069 18.6667 23.9997V21.333M9.33333 15.9997H28M28 15.9997L24 11.9997M28 15.9997L24 19.9997"
                    stroke="#FF3B30"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="text-center text-[18px] font-medium leading-6 text-[#14171a]">
                Hesabdan çıxmaq istədiyinizə <br /> əminsiniz?
              </p>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="cursor-pointer rounded-2xl bg-[#eaf1fa] px-4 py-3 text-base font-medium leading-6 text-[#14171a] transition-colors hover:bg-[#dfe9f6]"
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
                className="cursor-pointer rounded-2xl bg-[#ff3b30] px-4 py-3 text-base font-medium leading-6 text-white transition-colors hover:bg-[#e8342a] disabled:opacity-60"
              >
                {logoutPending ? 'Çıxılır…' : 'Bəli'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
