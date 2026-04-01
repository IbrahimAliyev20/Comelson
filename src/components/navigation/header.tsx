"use client";

import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSelector from "../shared/language-selector";
import { heroNavigationItems, navigationItems } from "@/utils/static";
import Container from "../shared/container";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const isHero = pathname === "/";
  const [heroScrolled, setHeroScrolled] = useState(false);

  const showHeroGlass = isHero && !heroScrolled;

  useEffect(() => {
    if (!isHero) {
      setHeroScrolled(false);
      return;
    }

    function updatePastHero() {
      const hero = document.getElementById("home-hero");
      if (!hero) {
        setHeroScrolled(false);
        return;
      }
      const { bottom } = hero.getBoundingClientRect();
      setHeroScrolled(bottom <= 0);
    }

    updatePastHero();
    window.addEventListener("scroll", updatePastHero, { passive: true });
    window.addEventListener("resize", updatePastHero, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePastHero);
      window.removeEventListener("resize", updatePastHero);
    };
  }, [isHero]);

  return (
    <header
      className={cn(
        "w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-200",
        isHero && "fixed top-0 left-0 right-0 z-50",
        showHeroGlass
          ? "border-b border-white/10 bg-white/[0.08] backdrop-blur-[24px]"
          : isHero
            ? "border-b border-[#F1F2F6] bg-white/95 shadow-sm backdrop-blur-md"
            : "relative border-b border-[#F1F2F6] bg-white"
      )}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between",
            showHeroGlass ? "py-4" : "py-[16px]"
          )}
        >
          <div className="flex min-w-0 items-center gap-8 lg:gap-[90px]">
            <Link href="/" className="shrink-0">
              <Image
                src="/images/Logo.svg"
                alt="Comelson"
                width={158}
                height={52}
                priority
                className="h-9 w-auto md:h-[52px]"
              />
            </Link>

            {isHero ? (
              <nav
                className="hidden lg:flex items-center gap-5"
                aria-label="Primary"
              >
                {heroNavigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 text-sm font-normal leading-5 transition-colors hover:opacity-80",
                      showHeroGlass
                        ? "text-white"
                        : "text-[#14171A] hover:text-[#14171A]"
                    )}
                  >
                    {t(`heroNav.${item.key}`)}
                    {item.hasDropdown ? (
                      <ChevronDown
                        className={cn(
                          "size-4",
                          showHeroGlass ? "opacity-90" : "opacity-80"
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "font-medium text-text-primary transition-colors hover:text-[#14171A]",
                      pathname === item.href ? "text-[#14171A]" : ""
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-4 lg:gap-6">
            <LanguageSelector variant={showHeroGlass ? "onDark" : "default"} />
            {isHero ? (
              <>
                <div
                  className={cn(
                    "hidden h-6 w-px sm:block",
                    showHeroGlass ? "bg-[#565759]" : "bg-[#e5e6e5]"
                  )}
                  aria-hidden
                />
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-4 rounded-2xl bg-[#0f477d] px-6 py-3 text-base font-medium leading-6 text-white transition-opacity hover:opacity-90"
                >
                  {t("headerCta")}
                </Link>
              </>
            ) : (
              <Link href="/login" aria-label="Account">
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
