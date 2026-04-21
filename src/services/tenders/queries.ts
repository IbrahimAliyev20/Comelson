import { queryOptions } from '@tanstack/react-query'

import { getTender, getTenders, type GetTendersParams } from './api'

export interface GetTendersQueryInput extends GetTendersParams {
  locale: string
}

export interface GetTenderQueryInput {
  locale: string
  id: number
}

const getTendersQuery = (input: GetTendersQueryInput) => {
  const {
    locale,
    page,
    per_page,
    search,
    category_id,
    is_active,
    date_from,
    date_to,
  } = input
  return queryOptions({
    queryKey: [
      'tenders',
      locale,
      page ?? 1,
      per_page ?? null,
      search ?? '',
      category_id ?? null,
      is_active ?? null,
      date_from ?? null,
      date_to ?? null,
    ] as const,
    queryFn: () =>
      getTenders(locale, {
        page,
        per_page,
        ...(search ? { search } : {}),
        ...(typeof category_id === 'number' ? { category_id } : {}),
        ...(typeof is_active === 'number' ? { is_active } : {}),
        ...(date_from ? { date_from } : {}),
        ...(date_to ? { date_to } : {}),
      }),
  })
}

const getTenderQuery = (input: GetTenderQueryInput) => {
  const { locale, id } = input
  return queryOptions({
    queryKey: ['tenders', 'detail', locale, id] as const,
    queryFn: () => getTender(locale, id),
  })
}

export { getTendersQuery, getTenderQuery }
