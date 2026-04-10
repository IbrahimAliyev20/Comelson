import { get } from '@/lib/api'
import { ApiResponse, SuccessStoriesResponse } from '@/types/types'

const getSuccessStories = async (locale: string) => {
  const response = await get<ApiResponse<SuccessStoriesResponse[]>>('/success-stories', {
    params: { locale }
  })
  return response
}

const getSuccessStoriesBySlug = async (slug: string, locale: string) => {
  const response = await get<ApiResponse<SuccessStoriesResponse>>(`/success-stories/${slug}`, {
    params: { locale }
  })
  return response
}   
export { getSuccessStories, getSuccessStoriesBySlug }
