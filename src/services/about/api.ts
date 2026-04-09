import { get } from '@/lib/api'
import { AboutResponse, ApiResponse } from '@/types/types'

const getAbout = async (locale: string) => {
  const response = await get<ApiResponse<AboutResponse>>('/about', {
    params: { locale }
  })
  return response
}
export { getAbout }