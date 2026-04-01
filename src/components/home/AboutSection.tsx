import Image from "next/image";
import {  ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import Container from "@/components/shared/container";
import { Link } from "@/i18n/navigation";

export default async function AboutSection() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#F8FAFC] pt-16 pb-16 md:pt-[90px] md:pb-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:gap-8 xl:gap-16">
          <div className="flex w-full max-w-[585px] flex-col gap-8">
            <h2 className="text-balance text-3xl font-semibold leading-tight text-[#14171a] md:text-[40px] md:leading-[56px]">
              <span>{t("aboutTitlePrefix")} </span>
              <span className="text-[#6b6e71]">{t("aboutTitleAccent")}</span>
            </h2>
            <div className="flex flex-col gap-3">
              <p className="max-w-[557px] text-base font-normal leading-6 text-[#64717c]">
                {t("aboutBody")}
              </p>
              <Link
                href="/about"
                className="inline-flex h-12 w-fit items-center justify-center gap-4 rounded-2xl py-3 text-base font-medium leading-6 text-[#0f477d] transition-opacity hover:opacity-80"
              >
                {t("aboutCta")}
                <ArrowRight className="size-6 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center gap-5 sm:flex-row sm:justify-end lg:w-auto lg:gap-5">
            <div className="flex w-full max-w-[360px] flex-col items-end gap-5">
              <div className="relative h-[200px] w-full overflow-hidden rounded-xl sm:h-[220px] md:h-[240px]">
                <Image
                  src="/images/abouthome1.jpg"
                  alt=""
                  width={360}
                  height={240}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>
              <div className="relative h-[180px] w-full max-w-[312px] overflow-hidden rounded-xl sm:h-[200px] md:h-[208px]">
                <Image
                  src="/images/abouthome3.jpg"
                  alt=""
                  width={312}
                  height={208}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 640px) 100vw, 312px"
                />
              </div>
            </div>
            <div className="relative h-[280px] w-full max-w-[262px] overflow-hidden rounded-xl sm:h-[300px] md:h-[334px]">
              <Image
                src="/images/abouthome2.jpg"
                alt=""
                width={262}
                height={334}
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 100vw, 262px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
