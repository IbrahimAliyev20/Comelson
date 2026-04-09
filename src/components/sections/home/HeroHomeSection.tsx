import { getTranslations } from "next-intl/server";

import Container from "@/components/shared/container";
import LogoLoop from "@/components/LogoLoop";
import { FormLogoResponse, SliderResponse } from "@/types/types";
import HeroSlider from "@/components/sections/home/HeroSlider";
import type { LogoItem } from "@/components/LogoLoop";

export default async function HeroHomeSection({ sliders, formLogo }: { sliders: SliderResponse[] | undefined, formLogo: FormLogoResponse[] | undefined }) {
  const t = await getTranslations("home");
  const partnerLogos: LogoItem[] = (formLogo ?? []).map((item, index) => ({
    src: item.image,
    alt: `Partner logo ${index + 1}`,
    href: item.link.startsWith("http://") || item.link.startsWith("https://")
      ? item.link
      : `https://${item.link}`,
    width: 160,
    height: 48,
  }));

  return (
    <section
      id="home-hero"
      className="relative min-h-[560px] w-full overflow-hidden md:min-h-[820px] lg:min-h-screen"
    >
      <Container className="relative z-10 flex min-h-[560px] flex-col pb-14 pt-[90px] md:min-h-[820px] md:pb-8 md:pt-[136px] lg:min-h-screen lg:pb-8 lg:pt-[148px]">
        <HeroSlider
          slides={sliders ?? []}
          fallback={{
            title: t("heroTitle"),
            description: t("heroSubtitle"),
            cta: t("heroCta")
          }}
        >
          <div className="mt-1 flex w-full flex-col gap-4 md:mt-auto md:gap-10 lg:gap-[60px]">
            <div className="h-px w-full bg-[#7e7e7e]" />
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:flex-row lg:items-center lg:gap-12">
              <p className="max-w-[180px] shrink-0 text-sm leading-6 text-[#d8dfea] sm:text-base lg:w-[117px]">
                {t("partnersLabel")}
              </p>
              {partnerLogos.length > 0 ? (
                <div className="min-w-0 flex-1 overflow-hidden [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-90">
                  <LogoLoop
                    logos={partnerLogos}
                    speed={90}
                    gap={32}
                    logoHeight={28}
                    fadeOut
                    fadeOutColor="rgb(6, 28, 52)"
                    ariaLabel={t("partnersLabel")}
                    className="[--logoloop-fadeColor:rgb(6,28,52)] md:[&_img]:max-h-8 lg:[&_img]:max-h-10"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </HeroSlider>
      </Container>
    </section>
  );
}
