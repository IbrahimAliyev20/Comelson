import Image from "next/image";
import {  ArrowRight } from "lucide-react";
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
      className="relative min-h-screen w-full overflow-hidden"
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

      <Container className="relative z-10 flex min-h-screen flex-col pb-8 pt-[104px] md:pt-[148px]">
        <div className="flex w-full flex-1 flex-col justify-between gap-14 md:gap-[72px]">
          <div className="flex max-w-[680px] flex-col gap-6">
            <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl md:leading-[80px] lg:text-[64px]">
              {t("heroTitle")}
            </h1>
            <p className="max-w-xl text-base leading-6 text-[#d8dfea]">
              {t("heroSubtitle")}
            </p>
            <Link
              href="/contact"
              className="inline-flex h-12 w-fit items-center justify-center gap-4 rounded-2xl bg-white px-6 py-3 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-90"
            >
              {t("heroCta")}
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </Link>
          </div>

          <div className="flex w-full flex-col gap-10 md:gap-[60px]">
            <div className="h-px w-full bg-[#7e7e7e]" />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
              <p className="shrink-0 text-base leading-6 text-[#d8dfea] lg:w-[117px]">
                {t("partnersLabel")}
              </p>
              <div className="min-w-0 flex-1 [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-90">
                <LogoLoop
                  logos={[...PARTNER_LOGOS]}
                  speed={90}
                  gap={51}
                  logoHeight={40}
                  fadeOut
                  fadeOutColor="rgb(6, 28, 52)"
                  ariaLabel={t("partnersLabel")}
                  className="[--logoloop-fadeColor:rgb(6,28,52)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex justify-center gap-2 md:mt-[32px]"
          aria-hidden
        >
         
        </div>
      </Container>
    </section>
  );
}
