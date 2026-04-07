import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'

const MEMBER_LOGOS = [
  { src: '/images/abouthome1.jpg'},
  { src: '/images/abouthome2.jpg'},
  { src: '/images/abouthome3.jpg'},
  { src: '/images/abouthome1.jpg'},
  { src: '/images/abouthome2.jpg'},
  { src: '/images/abouthome3.jpg'},
  { src: '/images/abouthome1.jpg'},
  { src: '/images/abouthome2.jpg'},
] as const

export default async function MembersHomeSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-[100px]">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-balance text-3xl font-semibold leading-tight text-black md:text-[40px] md:leading-[56px]">
              <span>{t('membersTitleMain')} </span>
              <span className="text-[#6b6e71]">{t('membersTitleAccent')}</span>
            </h2>

            <Link
              href="/members"
              className="inline-flex items-center gap-3 text-sm font-medium leading-5 text-black transition-opacity hover:opacity-80"
            >
              {t('membersCta')}
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MEMBER_LOGOS.map((logo, idx) => (
              <div
                key={`${logo.src}-${idx}`}
                className="flex h-[188px] items-center justify-center overflow-hidden rounded-[10px] border border-[#e8eaed] bg-white p-6"
              >
                  <Image
                    src={logo.src}
                    alt=""
                    width={360}
                    height={240}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
