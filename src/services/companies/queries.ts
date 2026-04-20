import { queryOptions } from '@tanstack/react-query'

import { getCompanies, getCompany, type GetCompaniesParams } from './api'

export interface GetCompaniesQueryInput extends GetCompaniesParams {
  locale: string
}

export interface GetCompanyQueryInput {
  locale: string
  id: number
}

const getCompaniesQuery = (input: GetCompaniesQueryInput) => {
  const { locale, page, per_page } = input
  return queryOptions({
    queryKey: ['companies', locale, page ?? 1, per_page ?? null] as const,
    queryFn: () => getCompanies(locale, { page, per_page }),
  })
}

const getCompanyQuery = (input: GetCompanyQueryInput) => {
  const { locale, id } = input
  return queryOptions({
    queryKey: ['companies', 'detail', locale, id] as const,
    queryFn: () => getCompany(locale, id),
  })
}

export { getCompaniesQuery, getCompanyQuery }
