
import { get } from '@/lib/api'
import { EventCategoriesResponse, ApiResponse, EventResponse } from '@/types/types'

const getEventCategories = async (locale: string) => {
  const response = await get<ApiResponse<EventCategoriesResponse[]>>('/event-categories', {
    params: { locale }
  })
  return response
}


const getEvents = async (locale: string) => {
  const response = await get<ApiResponse<EventResponse[]>>('/events', {
    params: { locale }
  })
    return response
  }

const getEvent = async (locale: string, slug: string) => {
  const response = await get<ApiResponse<EventResponse>>(`/event/${slug}`, {
    params: { locale }
  })
  return response
}

  export { getEventCategories, getEvents, getEvent }
