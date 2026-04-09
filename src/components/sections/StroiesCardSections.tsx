'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { getSuccessStoryMessageKeys, successStoriesSlides } from '@/utils/success-stories-data'

export default function StroiesCardSections() {


    const t = useTranslations('home')
    return (
        <section className="bg-[#f8fafc] pb-16 pt-10 sm:pb-24 sm:pt-12">
            <Container>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {successStoriesSlides.map((slide, idx) => {
                        const keys = getSuccessStoryMessageKeys(slide.key)

                        return (
                            <Link
                                key={`${slide.key}-${idx}`}
                                href={`/success-stories/${slide.slug}`}
                                className="group flex w-full flex-col items-start rounded-[14px] border border-[#eaf1fa] bg-white p-6 transition-shadow hover:shadow-[0_14px_40px_rgba(15,71,125,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f477d]/40"
                            >
                                <div className="flex w-full flex-col gap-10">
                                    <div className="flex w-full flex-col gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="relative size-16 overflow-hidden rounded-full">
                                                <Image
                                                    src={keys.logo}
                                                    alt={t(keys.company)}
                                                    width={64}
                                                    height={64}
                                                    className="h-16 w-16 object-cover"
                                                />
                                            </div>
                                            <p className="text-xl font-medium leading-6 text-[#0f477d]">
                                                {t(keys.company)}
                                            </p>
                                        </div>

                                        <blockquote className="text-xl font-medium leading-8 text-[#32393f] sm:text-2xl sm:leading-8">
                                            {t(keys.quote)}
                                        </blockquote>

                                        <div className="flex flex-col gap-1.5">
                                            <p className="text-base font-medium leading-6 text-[#14171a]">
                                                {t(keys.author)}
                                            </p>
                                            <p className="text-sm leading-5 text-[#6b6e71]">
                                                {t(keys.role)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </Container>
        </section>

    )
}
