/** Auth <main>: mobilde uşaq tam hündürlük alır (CTA aşağı yapışa bilər), md+ mərkəzləşmə. */
export const authMainMobileStickyFooter =
  'items-stretch justify-center py-6 sm:py-8 md:items-center'

/** Səhifə sütunu: mobilde parent hündürlüyünü doldurur, md+ təbii hündürlük. */
export const authPageColumn =
  'flex h-full min-h-0 w-full max-w-[498px] flex-col md:h-auto'

/** Form: mobilde 2 blok (yuxarı/aşağı) üçün `justify-between`. */
export const authFormFlexGrow =
  'flex min-h-0 flex-1 flex-col justify-between md:flex-none md:justify-start'

/** Yuxarı blok: məzmun yığılır, boşluq `justify-between` ilə idarə olunur. */
export const authUpperBlockGrow =
  'flex min-h-0 flex-col md:flex-none'

/** Əsas düymə (+ istəyə görə alt link): mobilde aşağı blok, safe-area. */
export const authMobileCtaCluster =
  'flex flex-col items-center gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 md:gap-9 md:pb-0 md:pt-0'

/** Tək əsas düymə (şifrə bərpası, OTP və s.): mobilde aşağı blok, safe-area. */
export const authMobileStickySubmit =
  'w-full pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:pb-0 md:pt-0'
