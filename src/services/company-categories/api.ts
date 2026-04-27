import { get } from '@/lib/api'
import type { ApiResponse, CompanyCategoryResponse } from '@/types/types'

/** GET /company-categories — pagination yoxdur */
const getCompanyCategories = async (locale: string) => {
  return get<ApiResponse<CompanyCategoryResponse[]>>('/company-categories', {
    params: { locale },
  })
}

/** Dropdown / filtr üçün bütün kateqoriyalar */
const getAllCompanyCategories = async (
  locale: string
): Promise<CompanyCategoryResponse[]> => {
  const res = await getCompanyCategories(locale)
  const collected = res.data ?? []

  // API bəzən eyni `id`-ni təkrar qaytara bilir — React key warning olmasın deyə dedupe.
  const unique = new Map<number, CompanyCategoryResponse>()
  for (const item of collected) {
    if (!unique.has(item.id)) unique.set(item.id, item)
  }
  return Array.from(unique.values())
}

export { getAllCompanyCategories, getCompanyCategories }
