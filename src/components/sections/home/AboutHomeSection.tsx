import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Container from "@/components/shared/container";
import { Link } from "@/i18n/navigation";
import { stripHtmlToText } from "@/lib/html";
import { AboutResponse } from "@/types/types";

function ImageSlot({
  src,
  alt,
  width,
  height,
  sizes,
}: {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  sizes: string;
}) {
  if (!src) {
    return <div className="h-full w-full bg-[#eef2f6]" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="h-full w-full object-cover"
      sizes={sizes}
    />
  );
}

export default async function AboutHomeSection({ about }: { about: AboutResponse | undefined }) {
  const t = await getTranslations("home");
  const titleText = stripHtmlToText(about?.title ?? "");

  return (
    <section className="bg-[#F8FAFC] py-8 md:py-[60px]">
      <Container>
        <div className="flex flex-col items-start justify-between gap-10 md:gap-12 lg:flex-row lg:gap-8 xl:gap-16">
          <div className="flex w-full flex-col gap-6 md:gap-8 lg:max-w-[585px]">
            <h2 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#14171a] md:text-[40px] md:leading-[48px] lg:leading-[56px]">
              {titleText}
            </h2>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-normal leading-6 text-[#64717c] md:text-base">
                {about?.short_desciption}
              </p>
              <Link
                href="/about"
                className="inline-flex h-11 w-fit items-center justify-center gap-3 rounded-2xl py-2 text-sm font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-80 md:h-12 md:gap-4 md:py-3 md:text-base"
              >
                {t("aboutCta")}
                <ArrowRight className="size-5 shrink-0 md:size-6" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 sm:gap-5 md:items-center lg:w-auto lg:flex-row lg:items-center lg:justify-end lg:gap-5">
            <div className="order-2 grid w-full grid-cols-2 gap-4 sm:gap-5 lg:order-1 lg:flex lg:w-full lg:max-w-[360px] lg:flex-col lg:items-end">
              <div className="relative h-[168px] w-full overflow-hidden rounded-xl sm:h-[220px] md:h-[240px]">
                <ImageSlot
                  src={about?.image_1}
                  alt="Comelson – Əlaqələrin İmkanlara Çevrildiyi Yer"
                  width={360}
                  height={240}
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 360px, 360px"
                />
              </div>
              <div className="relative h-[168px] w-full overflow-hidden rounded-xl sm:h-[200px] md:h-[208px] lg:max-w-[312px]">
                <ImageSlot
                  src={about?.image_3}
                  alt="Comelson – Əlaqələrin İmkanlara Çevrildiyi Yer"
                  width={312}
                  height={208}
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 312px, 312px"
                />
              </div>
            </div>
            <div className="order-1 relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[300px] md:h-[334px] lg:order-2 lg:max-w-[262px]">
              <ImageSlot
                src={about?.image_2}
                alt="Comelson – Əlaqələrin İmkanlara Çevrildiyi Yer"
                width={262}
                height={334}
                sizes="(max-width: 1023px) 100vw, 262px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
