import { get } from '@/lib/api'
import { ApiResponse, PartnershipsResponse } from '@/types/types'

const getPartnerships = async (locale: string) => {
  const response = await get<ApiResponse<PartnershipsResponse[]>>('/partnerships', {
    params: { locale }
  })
  return response
}
export { getPartnerships }