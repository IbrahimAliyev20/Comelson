import Image from 'next/image'

import Container from '@/components/shared/container'

interface GenericPageHeroSectionProps {
  image: string
  title: string
  description: string
}

export default function GenericPageHeroSection({
  image,
  title,
  description
}: GenericPageHeroSectionProps) {
  return (
    <section
      id="page-hero"
      className="relative w-full overflow-hidden bg-[#061c34]"
    >
      <div className="relative  w-full h-[340px] md:h-[420px]">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[rgba(6,28,52,0.48)]" aria-hidden />
      </div>

      <div className="absolute inset-0 flex items-center">
        <Container>
          <div className="w-full max-w-[585px]">
            <div className="flex flex-col gap-4 sm:gap-6">
              <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-[40px] sm:leading-[56px] md:text-[48px] md:leading-[64px]">
                {title}
              </h1>
              <p className="text-sm leading-6 text-[#d8dfea] sm:text-base">
                {description}
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
