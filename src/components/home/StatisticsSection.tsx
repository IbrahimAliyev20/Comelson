import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'

const STATS = [
  {
    iconSrc: '/icons/users-group.svg',
    labelKey: 'statsItems.membersLabel',
    valueKey: 'statsItems.membersValue'
  },
  {
    iconSrc: '/icons/calendar-event.svg',
    labelKey: 'statsItems.eventsLabel',
    valueKey: 'statsItems.eventsValue'
  },
  {
    iconSrc: '/icons/stack.svg',
    labelKey: 'statsItems.sectorsLabel',
    valueKey: 'statsItems.sectorsValue'
  },
  {
    iconSrc: '/icons/handshake-icon.svg',
    labelKey: 'statsItems.partnersLabel',
    valueKey: 'statsItems.partnersValue'
  }
] as const

const STATS_COL_LEFT = STATS.slice(0, 2)
const STATS_COL_RIGHT = STATS.slice(2, 4)

export default async function StatisticsSection() {
  const t = await getTranslations('home')

  return (
    <section className="relative overflow-hidden bg-[#0f477d] py-18 md:py-[100px]">
      <Image
        src="/images/statistcbg.png"
        alt=""
        fill
        className="pointer-events-none select-none object-cover object-left"
        sizes="100vw"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:gap-10">
          <div className="flex w-full max-w-[585px] flex-col gap-8">
            <h2 className="text-balance text-3xl font-semibold leading-tight text-white md:text-[40px] md:leading-[56px]">
              <span>{t('statsTitlePrefix')} </span>
              <span className="text-[#3bbae9]">{t('statsTitleAccent')} </span>
              <span>{t('statsTitleSuffix')}</span>
            </h2>
            <p className="max-w-[557px] text-base leading-6 text-[#d9d9d9]">
              {t('statsBody')}
            </p>
          </div>

          <div className="flex w-full max-w-[619px] flex-col gap-6 lg:flex-row lg:items-start lg:gap-[27px]">
            <div className="flex w-full max-w-[296px] flex-col gap-6 self-stretch">
              {STATS_COL_LEFT.map((item, idx) => (
                <div
                  key={`left-${item.iconSrc}-${idx}`}
                  className="flex min-h-[152px] w-full items-start gap-5 rounded-xl bg-[#e6eff6] px-5 py-9"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f9fafc] p-3">
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7"
                      unoptimized
                    />
                  </div>

                  <div className="flex w-[178px] min-w-0 shrink-0 flex-col gap-[14px]">
                    <p className="text-base font-medium leading-6 text-[#636d73]">
                      {t(item.labelKey)}
                    </p>
                    <p className="text-[40px] font-semibold leading-[56px] text-black">
                      {t(item.valueKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full max-w-[296px] flex-col gap-6 self-stretch pt-0 lg:pt-24">
              {STATS_COL_RIGHT.map((item, idx) => (
                <div
                  key={`right-${item.iconSrc}-${idx}`}
                  className="flex min-h-[152px] w-full items-start gap-5 rounded-xl bg-[#e6eff6] px-5 py-9"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#f9fafc] p-3">
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7"
                      unoptimized
                    />
                  </div>

                  <div className="flex w-[178px] min-w-0 shrink-0 flex-col gap-[14px]">
                    <p className="text-base font-medium leading-6 text-[#636d73]">
                      {t(item.labelKey)}
                    </p>
                    <p className="text-[40px] font-semibold leading-[56px] text-black">
                      {t(item.valueKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
