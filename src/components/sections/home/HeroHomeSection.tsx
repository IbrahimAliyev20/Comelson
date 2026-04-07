import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Container from "@/components/shared/container";
import LogoLoop from "@/components/LogoLoop";
import { Link } from "@/i18n/navigation";

const PARTNER_LOGOS = [
  { src: "/logoloop/logo1.svg", alt: "", width: 105, height: 40 },
  { src: "/logoloop/logo2.svg", alt: "", width: 158, height: 20 },
  { src: "/logoloop/logo3.svg", alt: "", width: 170, height: 39 },
  { src: "/logoloop/logo4.svg", alt: "", width: 168, height: 40 },
  { src: "/logoloop/logo1.svg", alt: "", width: 105, height: 40 },
  { src: "/logoloop/logo2.svg", alt: "", width: 158, height: 20 },
  { src: "/logoloop/logo3.svg", alt: "", width: 170, height: 39 },
  { src: "/logoloop/logo4.svg", alt: "", width: 168, height: 40 },
] as const;

export default async function HeroHomeSection() {
  const t = await getTranslations("home");

  return (
    <section
      id="home-hero"
      className="relative min-h-[560px] w-full overflow-hidden md:min-h-[820px] lg:min-h-screen"
    >
      <Image
        src="/images/herobg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[rgba(6,28,52,0.48)]"
        aria-hidden
      />

      <Container className="relative z-10 flex min-h-[560px] flex-col pb-14 pt-[90px] md:min-h-[820px] md:pb-8 md:pt-[136px] lg:min-h-screen lg:pb-8 lg:pt-[148px]">
        <div className="flex w-full flex-1 flex-col justify-start gap-6 md:justify-between md:gap-14 lg:gap-[72px]">
          <div className="flex max-w-[628px] flex-col gap-7 md:gap-12 lg:gap-[56px]">
            <div className="flex flex-col gap-5 sm:gap-6">
              <h1 className="max-w-[14ch] text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl sm:leading-[1.04] md:max-w-[12ch] md:text-[56px] md:leading-[1.08] lg:max-w-[680px] lg:text-[64px] lg:leading-[80px]">
                {t("heroTitle")}
              </h1>
              <p className="max-w-[620px] text-sm leading-6 text-[#d8dfea] sm:text-base sm:leading-7 md:max-w-[540px] lg:max-w-full lg:leading-6">
                {t("heroSubtitle")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 w-[60%] items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90 sm:h-12 sm:w-fit sm:px-6 sm:text-base lg:h-12 lg:gap-4 lg:px-6"
            >
              {t("heroCta")}
              <ArrowRight className="size-5 shrink-0 sm:size-6" aria-hidden />
            </Link>
          </div>

          <div className="mt-1 flex w-full flex-col gap-4 md:mt-auto md:gap-10 lg:gap-[60px]">
            <div className="h-px w-full bg-[#7e7e7e]" />
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:flex-row lg:items-center lg:gap-12">
              <p className="max-w-[180px] shrink-0 text-sm leading-6 text-[#d8dfea] sm:text-base lg:w-[117px]">
                {t("partnersLabel")}
              </p>
              <div className="min-w-0 flex-1 overflow-hidden [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-90">
                <LogoLoop
                  logos={[...PARTNER_LOGOS]}
                  speed={90}
                  gap={32}
                  logoHeight={28}
                  fadeOut
                  fadeOutColor="rgb(6, 28, 52)"
                  ariaLabel={t("partnersLabel")}
                  className="[--logoloop-fadeColor:rgb(6,28,52)] md:[&_img]:max-h-8 lg:[&_img]:max-h-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 justify-center gap-2 md:hidden"
          aria-hidden
        >
          <span className="h-[3px] w-10 rounded-[1px] bg-white" />
          <span className="h-[3px] w-10 rounded-[1px] bg-white/30" />
          <span className="h-[3px] w-10 rounded-[1px] bg-white/30" />
        </div>

        <div
          className="mt-8 hidden justify-center gap-2 md:flex lg:mt-[32px]"
          aria-hidden
        >
          <span className="h-[3px] w-10 rounded-[1px] bg-white" />
          <span className="h-[3px] w-10 rounded-[1px] bg-white/30" />
          <span className="h-[3px] w-10 rounded-[1px] bg-white/30" />
        </div>
      </Container>
    </section>
  );
}
