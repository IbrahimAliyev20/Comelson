/** Auth <main>: mobilde uşaq tam hündürlük alır (CTA aşağı yapışa bilər), md+ mərkəzləşmə. */
export const authMainMobileStickyFooter =
  'items-stretch justify-center py-6 sm:py-8 md:items-center'

/** Səhifə sütunu: mobilde parent hündürlüyünü doldurur, md+ təbii hündürlük. */
export const authPageColumn =
  'flex h-full min-h-0 w-full max-w-[498px] flex-col md:h-auto'

/** Form: mobilde qalan boşluğu doldurur ki, alt blok mt-auto ilə düşsün. */
export const authFormFlexGrow =
  'flex min-h-0 flex-1 flex-col md:flex-none'

/** Məzmun sahəsi: yuxarı sıxılır, boşluq şaquli böyümə ilə doldurulur. */
export const authUpperBlockGrow =
  'flex min-h-0 flex-1 flex-col md:flex-none'

/** Əsas düymə (+ istəyə görə alt link): mobilde ekranın altına, safe-area. */
export const authMobileCtaCluster =
  'mt-auto flex flex-col items-center gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 md:mt-0 md:gap-9 md:pb-0 md:pt-0'

/** Tək əsas düymə (şifrə bərpası, OTP və s.): mobilde aşağı yapışır. */
export const authMobileStickySubmit =
  'mt-auto w-full pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:mt-0 md:pb-0 md:pt-0'
