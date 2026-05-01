import { getTranslations } from "next-intl/server";
import Image from "next/image";

import Container from "@/components/shared/container";
import LogoLoop from "@/components/LogoLoop";
import { MemberResponse, SliderResponse } from "@/types/types";
import HeroSlider from "@/components/sections/home/HeroSlider";
import type { LogoItem } from "@/components/LogoLoop";
import { Link } from "@/i18n/navigation";

function isRemoteImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

export default async function HeroHomeSection({
  sliders,
  members,
}: {
  sliders: SliderResponse[] | undefined;
  members: MemberResponse[] | undefined;
}) {
  const t = await getTranslations("home");
  const partnerLogos: LogoItem[] = (members ?? [])
    .flatMap((member, index) => {
      const src = member.logo_url?.trim() || "";
      if (!src) return [];
      const alt = member.company?.trim() || member.name?.trim() || `Partner logo ${index + 1}`;
      const href = `/members/${member.slug}`;

      return [
        {
          node: (
            <Link
              href={href}
              aria-label={alt}
              className="inline-flex items-center rounded focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2"
            >
              <Image
                src={src}
                alt={alt}
                width={160}
                height={48}
                draggable={false}
                unoptimized={isRemoteImage(src)}
                className="block h-(--logoloop-logoHeight) w-auto object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
              />
            </Link>
          ),
          title: alt,
        } satisfies LogoItem,
      ];
    });

  return (
    <section
      id="home-hero"
      className="relative min-h-[560px] w-full overflow-hidden md:min-h-[720px] lg:min-h-screen"
    >
      <Container className="relative z-10 flex min-h-[560px] flex-col pb-8 pt-[90px] md:min-h-[720px] md:pb-6 md:pt-[116px] lg:min-h-screen lg:pb-8 lg:pt-[148px]">
        <HeroSlider
          slides={sliders ?? []}
          fallback={{
            title: t("heroTitle"),
            description: t("heroSubtitle"),
            cta: t("heroCta")
          }}
        >
          <div className="mt-4 flex w-full flex-col gap-8 md:mt-auto md:gap-6 lg:gap-[60px]">
            <div className="h-px w-full bg-[#7e7e7e]" />
            <div className="flex flex-col gap-6 sm:gap-6 md:gap-7 lg:flex-row lg:items-center lg:gap-12">
              <p className="max-w-[180px] shrink-0 text-sm leading-6 text-[#d8dfea] sm:text-base md:max-w-[220px] lg:w-[117px]">
                {t("partnersLabel")}
              </p>
              {partnerLogos.length > 0 ? (
                <div className="min-w-0 flex-1 overflow-hidden  [&_img]:opacity-90">
                  <LogoLoop
                    logos={partnerLogos}
                    speed={90}
                    gap={32}
                    logoHeight={48}
                    fadeOut
                    fadeOutColor="rgb(6, 28, 52)"
                    ariaLabel={t("partnersLabel")}
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
