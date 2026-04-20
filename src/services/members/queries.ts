import { queryOptions } from '@tanstack/react-query'

import { getActivities, getAllCountries, getMember, getMembers } from './api'

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


const getMembersQuery = (locale: string) => {
    return queryOptions({
        queryKey: ["members", locale],
        queryFn: () => getMembers(locale),
    });
}

const getMemberQuery = (locale: string, slug: string) => {
    return queryOptions({
        queryKey: ["member", locale, slug],
        queryFn: () => getMember(locale, slug),
    });
}

export { getCountriesQuery, getActivitiesQuery, getMembersQuery, getMemberQuery };