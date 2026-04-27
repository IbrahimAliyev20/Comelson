'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import Container from '@/components/shared/container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { postContactFormMutation } from '@/services/contact/mutations'
import { ContactResponse } from '@/types/types'

type TopicKey = 'membership' | 'tender' | 'partnership' | 'support'

type ContactFormValues = {
  name: string
  email: string
  type: TopicKey | ''
  message: string
  locale?: string
}

function extractIframeSrc(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  // Backend sometimes returns a full `<iframe ...></iframe>` HTML string.
  // We only need the `src` URL for a real iframe element.
  const srcMatch = trimmed.match(/\ssrc\s*=\s*"([^"]+)"/i)
  if (srcMatch?.[1]) return srcMatch[1]

  // If backend already returns a URL, accept it.
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return null
}

export default function ContactSection({ contact }: { contact: ContactResponse | undefined }) {
  const t = useTranslations('home')
  const tUi = useTranslations('ui')
  const locale = useLocale()
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const topicKeys = useMemo(
    () => ['membership', 'tender', 'partnership', 'support'] as const,
    []
  )

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2),
        email: z.string().trim().email(),
        type: z
          .union([z.literal(''), z.enum(topicKeys)])
          .refine((v) => v !== '', { message: tUi('contactForm.topicRequired') }),
        message: z.string().trim().min(3, { message: tUi('contactForm.messageMin') }),
        locale: z.string().trim().min(2).optional(),
      }),
    [topicKeys, tUi]
  )

  const { control, register, watch, reset, handleSubmit, formState } =
    useForm<ContactFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: '',
        email: '',
        type: '',
        message: '',
        locale,
      },
    })

  const name = watch('name')
  const email = watch('email')
  const topic = watch('type')
  const message = watch('message')

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

      reset({
        name: '',
        email: '',
        type: '',
        message: '',
        locale,
      })
      setFormSuccess(res?.message || 'Submitted')
      toast.success(res?.message || 'Submitted')
    },
    onError: () => {
      setFormError('Request failed')
      toast.error('Request failed')
    },
  })

  const isSubmitting = mutation.isPending
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    topic !== '' &&
    message.trim().length > 0
  const selectItemCheckedClass =
    'data-[state=checked]:bg-[#e6eff6] data-[state=checked]:text-[#0f477d] data-[state=checked]:[&_svg]:!text-[#0f477d]'
  const fieldLabelClass = 'px-1 text-sm leading-6 text-[#1d212a]'
  const fieldClass =
    'h-12 w-full rounded-[8px] border border-[#ebeff4] bg-[#f4fafd] px-4 text-sm leading-5 text-[#32393f] outline-none placeholder:text-[#6b7277] focus:border-[#d7e6ef] focus:bg-[#f4fafd]'
  const fieldTextareaClass =
    'h-[80px] w-full resize-none rounded-[8px] border border-[#ebeff4] bg-[#f4fafd] px-4 py-[14px] text-sm leading-5 text-[#32393f] outline-none placeholder:text-[#6b7277] focus:border-[#d7e6ef] focus:bg-[#f4fafd]'

  const submit = (values: ContactFormValues) => {
    setFormError(null)
    setFormSuccess(null)
    mutation.mutate({ ...values, locale })
  }

  const submitInvalid = () => {
    setFormError(tUi('contactForm.invalidForm'))
    setFormSuccess(null)
  }

  const mapSrc = useMemo(() => extractIframeSrc(contact?.map), [contact?.map])

  return (
    <section className="bg-[#f8fafc] py-8 md:py-[70px]">
      <Container>
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-6 sm:gap-10">
            <h2 className="text-balance text-2xl font-semibold leading-tight text-[#1d212a] sm:text-[32px] sm:leading-[40px]">
              {t('contact.methodsTitle')}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
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

          <div className="rounded-xl border border-[#eaf1fa] bg-white px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-8 lg:gap-[72px]">
              <div className="w-full max-w-[500px] md:max-w-none md:flex-1">
                <h3 className="mb-6 text-balance text-2xl font-semibold leading-tight text-[#1d212a] sm:mb-8 sm:text-[32px] sm:leading-[40px]">
                  {t('contact.formTitle')}
                </h3>

                <form
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit(submit, submitInvalid)}
                >
                  <div className="flex flex-col gap-2">
                    <label className={fieldLabelClass}>
                      {t('contact.nameLabel')}
                    </label>
                    <input
                      {...register('name')}
                      disabled={isSubmitting}
                      className={fieldClass}
                      placeholder={t('contact.namePlaceholder')}
                    />
                    {formState.errors.name?.message ? (
                      <p className="px-1 text-sm leading-6 text-red-600">
                        {formState.errors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={fieldLabelClass}>
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      disabled={isSubmitting}
                      className={fieldClass}
                      placeholder={t('contact.emailPlaceholder')}
                    />
                    {formState.errors.email?.message ? (
                      <p className="px-1 text-sm leading-6 text-red-600">
                        {formState.errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={fieldLabelClass}>
                      {t('contact.topicLabel')}
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || undefined}
                          onValueChange={(value) =>
                            field.onChange(value as ContactFormValues['type'])
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="h-12 w-full rounded-[8px] border-[#ebeff4] bg-[#f4fafd] px-4 text-sm leading-5 text-[#32393f] focus:border-[#d7e6ef] focus:bg-[#f4fafd] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                            <SelectValue placeholder={t('contact.topicPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-[#ebeff4] bg-white">
                            <SelectItem value="membership" className={selectItemCheckedClass}>
                              {t('contact.topics.membership')}
                            </SelectItem>
                            <SelectItem value="tender" className={selectItemCheckedClass}>
                              {t('contact.topics.tender')}
                            </SelectItem>
                            <SelectItem value="partnership" className={selectItemCheckedClass}>
                              {t('contact.topics.partnership')}
                            </SelectItem>
                            <SelectItem value="support" className={selectItemCheckedClass}>
                              {t('contact.topics.support')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {formState.errors.type?.message ? (
                      <p className="px-1 text-sm leading-6 text-red-600">
                        {formState.errors.type.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={fieldLabelClass}>
                      {t('contact.messageLabel')}
                    </label>
                    <textarea
                      {...register('message')}
                      disabled={isSubmitting}
                      className={fieldTextareaClass}
                      placeholder={t('contact.messagePlaceholder')}
                    />
                    {formState.errors.message?.message ? (
                      <p className="px-1 text-sm leading-6 text-red-600">
                        {formState.errors.message.message}
                      </p>
                    ) : null}
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
                    {isSubmitting ? t('contact.sending') : t('contact.submit')}
                  </button>
                </form>
              </div>

              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-xl bg-[#e6eff6] md:min-h-[420px]">
                {mapSrc ? (
                  <iframe
                    title="Map"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={mapSrc}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
