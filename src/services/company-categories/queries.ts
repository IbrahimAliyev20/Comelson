import { queryOptions } from '@tanstack/react-query'

import { getAllCompanyCategories } from './api'

const getCompanyCategoriesQuery = (locale: string) => {
  return queryOptions({
    queryKey: ['company-categories', 'all', locale] as const,
    queryFn: () => getAllCompanyCategories(locale),
  })
}

export { getCompanyCategoriesQuery }
