
import { get } from '@/lib/api'
import { EventCategoriesResponse, ApiResponse, EventResponse } from '@/types/types'

const getEventCategories = async (locale: string) => {
  const response = await get<ApiResponse<EventCategoriesResponse[]>>('/event-categories', {
    params: { locale }
  })
  return response
}


const getEvents = async (locale: string, category_id: number) => {
  const response = await get<ApiResponse<EventResponse[]>>('/events', {
    params: { locale, category_id }
  })
    return response
  }

const getEvent = async (locale: string, slug: string) => {
  const response = await get<ApiResponse<EventResponse>>(`/events/${slug}`, {
    params: { locale, slug }
  })
  return response
}

  export { getEventCategories, getEvents, getEvent }
