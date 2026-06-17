import { queryOptions } from '@tanstack/react-query'

import {
  getActivities,
  getAllCountries,
  getMember,
  getMembers,
  type GetMembersParams,
} from './api'

const getCountriesQuery = (locale: string) => {
  return queryOptions({
    queryKey: ['countries', 'all', locale] as const,
    queryFn: () => getAllCountries(locale),
  })
}


const getActivitiesQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["activities", locale],
        queryFn: () => getActivities(locale),
    });
}


const getMembersQuery = (locale: string, params?: GetMembersParams) => {
    const { country_id, category_id, search } = params ?? {}
    return queryOptions({
        queryKey: [
            "members",
            locale,
            country_id ?? null,
            category_id ?? null,
            search ?? '',
        ] as const,
        queryFn: () =>
            getMembers(locale, {
                ...(typeof country_id === 'number' ? { country_id } : {}),
                ...(typeof category_id === 'number' ? { category_id } : {}),
                ...(search ? { search } : {}),
            }),
    });
}

const getMemberQuery = (locale: string, slug: string) => {
    return queryOptions({
        queryKey: ["member", locale, slug],
        queryFn: () => getMember(locale, slug),
    });
}

export { getCountriesQuery, getActivitiesQuery, getMembersQuery, getMemberQuery };