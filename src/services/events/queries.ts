import { queryOptions } from '@tanstack/react-query'

import { getEvent, getEventCategories, getEvents } from './api'


const getEventCategoriesQuery = (locale: string) => {
  return queryOptions({
    queryKey: ['event-categories', locale] as const,
    queryFn: () => getEventCategories(locale),
  })
}

const getEventsQuery = (locale: string, categoryId?: number | null) => {
  return queryOptions({
    queryKey: ['events', locale, categoryId ?? null] as const,
    queryFn: () => getEvents(locale, categoryId),
  })
}


const getEventQuery = (locale: string, slug: string) => {
  return queryOptions({
    queryKey: ['event', locale, slug] as const,
    queryFn: () => getEvent(locale, slug),
  })
}

export { getEventCategoriesQuery, getEventsQuery, getEventQuery }