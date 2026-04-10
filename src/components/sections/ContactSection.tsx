'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import Container from '@/components/shared/container'
import { postContactFormMutation } from '@/services/contact/mutations'
import { ContactResponse } from '@/types/types'

type TopicKey = 'membership' | 'tender' | 'partnership' | 'support'

export default function ContactSection({ contact }: { contact: ContactResponse | undefined }) {
  const t = useTranslations('home')
  const locale = useLocale()

  const [topic, setTopic] = useState<TopicKey | ''>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2),
        email: z.string().trim().email(),
        type: z.string().trim().min(1),
        message: z.string().trim().min(3),
        locale: z.string().trim().min(2).optional()
      }),
    []
  )

  const mutation = useMutation({
    ...postContactFormMutation(),
    onMutate: () => {
      setFormError(null)
      setFormSuccess(null)
    },
    onSuccess: (res) => {
      if (!res?.status) {
        setFormError(res?.message || 'Request failed')
        toast.error(res?.message || 'Request failed')
        return
      }

      setName('')
      setEmail('')
      setTopic('')
      setMessage('')
      setFormSuccess(res?.message || 'Submitted')
      toast.success(res?.message || 'Submitted')
    },
    onError: () => {
      setFormError('Request failed')
      toast.error('Request failed')
    }
  })

  const isSubmitting = mutation.isPending
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && topic !== '' && message.trim().length > 0

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    const parsed = schema.safeParse({
      name,
      email,
      type: topic,
      message,
      locale
    })

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Invalid form')
      return
    }

    mutation.mutate(parsed.data)
  }

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
                      {contact?.phone}
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
                      {contact?.email}
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
                      {contact?.address}
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

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm leading-6 text-[#1d212a]">
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="min-h-[120px] w-full resize-none rounded-lg border border-[#b5b8bb] px-4 py-3 text-sm text-[#14171a] outline-none placeholder:text-[#889097] focus:border-[#0f477d]"
                      placeholder={t('contact.messagePlaceholder')}
                    />
                  </div>

                  {formError ? (
                    <p className="px-1 text-sm leading-6 text-red-600">{formError}</p>
                  ) : null}
                  {formSuccess ? (
                    <p className="px-1 text-sm leading-6 text-emerald-600">{formSuccess}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#0f477d] px-6 text-base font-medium leading-6 text-white disabled:cursor-not-allowed disabled:bg-[#889097] disabled:text-[#dadee2]"
                  >
                    {isSubmitting ? 'Sending...' : t('contact.submit')}
                  </button>
                </form>
              </div>

              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-xl bg-[#e6eff6]">
                {contact?.map && <iframe
                  title="Map"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={contact?.map}
                />}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

