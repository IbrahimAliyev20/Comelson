import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import Container from '@/components/shared/container'
import { Link } from '@/i18n/navigation'
import { eventsList } from '@/utils/events-data'

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = eventsList.find((x) => x.slug === slug)
  if (!event) notFound()

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (host ? `${forwardedProto ?? 'https'}://${host}` : '')
  const pageUrl = `${baseUrl}/events/${event.slug}`

  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedText = encodeURIComponent(event.title)

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${event.title} ${pageUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  } as const

  const picked = eventsList.filter((x) => x.slug !== slug).slice(0, 2)

  return (
    <section className="bg-[#f8fafc] pb-16 pt-10 sm:pb-24 sm:pt-12">
      <Container>
        <div className="rounded-2xl border border-[#eaf1fa] bg-white p-6 sm:p-10">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 sm:gap-12">
            <nav className="flex items-center gap-1 text-xs leading-4">
              <Link href="/events" className="text-[#6b6e71] hover:underline">
                Tədbirlər və Forumlar
              </Link>
              <span className="text-[#6b6e71]">/</span>
              <span className="line-clamp-1 font-medium text-[#32393f]">
                {event.title}
              </span>
            </nav>

            <div className="flex flex-col gap-7">
              <h1 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                {event.title}
              </h1>

              <div className="relative h-[260px] w-full overflow-hidden rounded-2xl sm:h-[420px] md:h-[480px]">
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  priority
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                    <Image
                      src="/icons/calendar-event.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden
                    />
                    <span className="text-sm leading-5">Dərc edildi:</span>
                    <span className="text-sm leading-5">{event.publishedDate}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#dadee2] bg-white px-2.5 py-2 text-sm leading-5 text-[#1d212a]">
                    <span className="text-sm leading-5">Paylaş:</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        className="hover:opacity-70"
                        href={shareUrls.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                      >
                        <Image src="/icons/brand-whatsapp.svg" alt="WhatsApp" width={16} height={16} />
                      </a>
                      <a
                        className="hover:opacity-70"
                        href={shareUrls.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Telegram"
                      >
                        <Image src="/icons/brand-telegram.svg" alt="Telegram" width={16} height={16} />
                      </a>
                      <a
                        className="hover:opacity-70"
                        href={shareUrls.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <Image src="/icons/brand-facebook.svg" alt="Facebook" width={16} height={16} />
                      </a>
                      <a
                        className="hover:opacity-70"
                        href={shareUrls.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                      >
                        <Image src="/icons/brand-x.svg" alt="X" width={16} height={16} />
                      </a>
                    </div>
                  </div>
                </div>

                <Link
                  href={event.registrationHref}
                  className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[#0f477d] px-6 text-sm font-medium leading-5 text-white transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Qeydiyyatdan keç
                </Link>
              </div>
            </div>

            <article className="flex flex-col gap-6">
              <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[40px] sm:leading-[56px]">
                Tədbir haqqında
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-6 text-[#6b6e71] sm:text-base">
                {event.about.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </article>

            <div className="flex flex-col gap-6 pt-2">
              <p className="text-balance text-2xl font-semibold leading-tight text-[#6b6e71] sm:text-[40px] sm:leading-[56px]">
                <span>{`Sizin üçün `}</span>
                <span className="text-[#14171a]">Seçdiklərimiz</span>
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {picked.map((x) => (
                  <Link
                    key={x.id}
                    href={`/events/${x.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-[#eaf1fa] bg-[#fafdff] px-2 pb-5 pt-2"
                  >
                    <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[320px]">
                      <Image
                        src={x.imageSrc}
                        alt={x.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 484px"
                      />
                    </div>

                    <div className="flex flex-col gap-3 px-2">
                      <div className="flex items-center gap-[5px] text-[#6b6e71]">
                        <Image
                          src="/icons/calendar-event.svg"
                          alt=""
                          width={20}
                          height={20}
                          aria-hidden
                        />
                        <span className="text-base leading-6">{x.date}</span>
                      </div>
                      <p className="line-clamp-2 text-xl font-semibold leading-7 text-[#14171a]">
                        {x.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
