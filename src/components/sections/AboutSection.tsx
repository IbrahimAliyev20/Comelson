import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function AboutSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-[#f8fafc] pb-16 pt-12 sm:pb-24 sm:pt-12 md:pb-24 md:pt-12">
      <div className="mx-auto w-full max-w-[1040px] px-3 sm:px-4 md:px-0">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
            <div className="shrink-0">
              <div className="h-full w-[3px] rounded-full bg-[#3bbae9]" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:gap-6">
                <h2 className="text-balance text-2xl font-semibold leading-tight text-[#14171a] sm:text-[32px] sm:leading-[44px] md:text-[40px] md:leading-[56px]">
                  {t('aboutPage.whoTitle')}
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#6b6e71] sm:text-base sm:leading-6">
                  {t('aboutPage.whoBody')}
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[240px] w-full overflow-hidden rounded-2xl sm:h-[320px] md:h-[480px] md:rounded-[20px]">
            <Image
              src="/images/abouthome2.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1040px) 100vw, 1040px"
              priority
            />
          </div>

          <div className="flex flex-col gap-10 pt-2">
            <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10">
              <div className="shrink-0">
                <div className="h-full w-[3px] rounded-full bg-[#3bbae9]" aria-hidden />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-6">
                  <h3 className="text-balance text-2xl font-medium leading-tight text-[#14171a] sm:text-[32px] sm:leading-[44px] md:text-[40px] md:leading-[56px]">
                    Şirkətimizin tarixi
                  </h3>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                        2023 — İdeyanın yaranması
                      </p>
                      <p className="text-sm leading-6 text-[#6b6e71] sm:text-base">
                        Comelson Networking-in əsası bizneslər arasında əlaqələrin daha sistemli qurulması ehtiyacından
                        doğdu. Müxtəlif sektorlarda fəaliyyət göstərən şirkətlərin bir platformada toplanması və bir-birini
                        daha rahat tapması əsas ideya kimi formalaşdı. Bu mərhələdə bazar araşdırmaları aparıldı və
                        istifadəçi ehtiyacları analiz edildi. Əsas fokus real problemləri anlamaq və onlara uyğun həll
                        yaratmaq idi. Layihənin ilkin konsepti və strukturu məhz bu mərhələdə müəyyənləşdirildi.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                        2024 — Platformanın qurulması
                      </p>
                      <p className="text-sm leading-6 text-[#6b6e71] sm:text-base">
                        Bu dövrdə platformanın əsas hissələri hazırlanaraq istifadəyə verilib. Şirkət profilləri və
                        katalog sistemi formalaşdırılıb. İlk istifadəçilər platformaya qoşulub və aktiv istifadə başlayıb.
                        Toplanan rəylər əsasında sistemdə təkmilləşdirmələr aparılıb. Platforma addım-addım inkişaf
                        etdirilib.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                        2025 — İmkanların genişlənməsi
                      </p>
                      <p className="text-sm leading-6 text-[#6b6e71] sm:text-base">
                        Platformaya yeni funksiyalar əlavə olunaraq daha geniş imkanlar yaradılıb. Tender bölməsi
                        istifadəyə verilib və şirkətlər üçün yeni əməkdaşlıq yolları açılıb. Eyni zamanda tərəfdaşlıq
                        paketləri təqdim olunub. Platforma artıq daha aktiv biznes mühiti kimi formalaşıb. İstifadəçilər
                        üçün daha çox dəyər yaradan sistem qurulub.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-lg font-medium leading-7 text-[#14171a] sm:text-xl sm:leading-7">
                        Bu gün — Aktiv platforma
                      </p>
                      <p className="text-sm leading-6 text-[#6b6e71] sm:text-base">
                        Bu gün Comelson müxtəlif sahələrdən olan şirkətləri bir araya gətirən aktiv platformadır.
                        İstifadəçilər burada tərəfdaşlar tapır və yeni imkanlar əldə edir. Platforma biznes əlaqələrini
                        qurmaq və inkişaf etdirmək üçün istifadə olunur. Daim yenilənən sistem olaraq inkişaf davam edir.
                        Məqsəd şirkətlər üçün daha faydalı mühit yaratmaqdır.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
