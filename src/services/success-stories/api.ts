import { get } from '@/lib/api'
import { ApiResponse, SuccessStoriesResponse } from '@/types/types'

const getSuccessStories = async (locale: string) => {
  const response = await get<ApiResponse<SuccessStoriesResponse[]>>('/success-stories', {
    params: { locale }
  })
  return response
}

const getSuccessStoriesBySlug = async (slug: string) => {
  const response = await get<ApiResponse<SuccessStoriesResponse>>(`/success-stories/${slug}`)
  return response
}   
export { getSuccessStories, getSuccessStoriesBySlug }