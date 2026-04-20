import { get } from '@/lib/api'
import type { CompanyCategoryResponse, PaginatedApiResponse } from '@/types/types'

export type GetCompanyCategoriesParams = {
  page?: number
  per_page?: number
}

/** GET /company-categories — səhifələnmiş cavab */
const getCompanyCategories = async (
  locale: string,
  params?: GetCompanyCategoriesParams
) => {
  return get<PaginatedApiResponse<CompanyCategoryResponse>>(
    '/company-categories',
    {
      params: { locale, ...params },
    }
  )
}

/** Dropdown / filtr üçün bütün kateqoriyalar */
const getAllCompanyCategories = async (
  locale: string
): Promise<CompanyCategoryResponse[]> => {
  const collected: CompanyCategoryResponse[] = []
  let page = 1
  let lastPage = 1
  do {
    const res = await getCompanyCategories(locale, { page, per_page: 100 })
    collected.push(...res.data)
    lastPage = res.meta.last_page
    page += 1
  } while (page <= lastPage)

  // API bəzən eyni `id`-ni təkrar qaytara bilir — React key warning olmasın deyə dedupe.
  const unique = new Map<number, CompanyCategoryResponse>()
  for (const item of collected) {
    if (!unique.has(item.id)) unique.set(item.id, item)
  }
  return Array.from(unique.values())
}

export { getAllCompanyCategories, getCompanyCategories }
