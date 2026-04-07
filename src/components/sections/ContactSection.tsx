'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import Container from '@/components/shared/container'

type TopicKey = 'membership' | 'tender' | 'partnership' | 'support'

export default function ContactSection() {
  const t = useTranslations('home')

  const [topic, setTopic] = useState<TopicKey | ''>('')

  return (
    <section className="bg-[#f8fafc] pb-16 pt-12 sm:pb-24 sm:pt-12">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-6 sm:gap-10">
            <h2 className="text-balance text-2xl font-semibold leading-tight text-[#1d212a] sm:text-[32px] sm:leading-[40px]">
              {t('contact.methodsTitle')}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <div className="rounded-xl border border-[#eaf1fa] bg-white px-6 py-7">
                <div className="flex items-center gap-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#0f477d] text-white">
                    <Phone className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-[#6b6e71]">
                      {t('contact.phoneLabel')}
                    </p>
                    <p className="text-base font-medium leading-6 text-[#14171a]">
                      {t('contact.phoneValue')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#eaf1fa] bg-white px-6 py-7">
                <div className="flex items-center gap-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#0f477d] text-white">
                    <Mail className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-[#6b6e71]">
                      {t('contact.emailLabel')}
                    </p>
                    <p className="text-base font-medium leading-6 text-[#14171a]">
                      {t('contact.emailValue')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#eaf1fa] bg-white px-6 py-7">
                <div className="flex items-center gap-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#0f477d] text-white">
                    <MapPin className="size-6" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm leading-5 text-[#6b6e71]">
                      {t('contact.addressLabel')}
                    </p>
                    <p className="text-base font-medium leading-6 text-[#14171a]">
                      {t('contact.addressValue')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#eaf1fa] bg-white px-4 py-6 sm:px-10 sm:py-9">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-[72px]">
              <div className="w-full max-w-[500px]">
                <h3 className="mb-6 text-balance text-2xl font-semibold leading-tight text-[#1d212a] sm:mb-8 sm:text-[32px] sm:leading-[40px]">
                  {t('contact.formTitle')}
                </h3>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm leading-6 text-[#1d212a]">
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      className="h-12 w-full rounded-lg border border-[#b5b8bb] px-4 text-sm text-[#14171a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]"
                      placeholder={t('contact.namePlaceholder')}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm leading-6 text-[#1d212a]">
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      type="email"
                      className="h-12 w-full rounded-lg border border-[#b5b8bb] px-4 text-sm text-[#14171a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]"
                      placeholder={t('contact.emailPlaceholder')}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm leading-6 text-[#1d212a]">
                      {t('contact.topicLabel')}
                    </label>
                    <div className="relative">
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as TopicKey | '')}
                        className="h-12 w-full appearance-none rounded-lg border border-[#b5b8bb] bg-white px-4 pr-10 text-sm text-[#14171a] outline-none focus:border-[#0f477d]"
                      >
                        <option value="" disabled>
                          {t('contact.topicPlaceholder')}
                        </option>
                        <option value="membership">{t('contact.topics.membership')}</option>
                        <option value="tender">{t('contact.topics.tender')}</option>
                        <option value="partnership">{t('contact.topics.partnership')}</option>
                        <option value="support">{t('contact.topics.support')}</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#14171a]/70">
                        ▾
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm leading-6 text-[#1d212a]">
                      {t('contact.messageLabel')}
                    </label>
                    <textarea
                      className="min-h-[120px] w-full resize-none rounded-lg border border-[#b5b8bb] px-4 py-3 text-sm text-[#14171a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]"
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#889097] px-6 text-base font-medium leading-6 text-[#dadee2]"
                  >
                    {t('contact.submit')}
                  </button>
                </div>
              </div>

              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-xl bg-[#e6eff6]">
                <iframe
                  title="Map"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src="https://www.google.com/maps?q=Baku%20Ahmadli&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

