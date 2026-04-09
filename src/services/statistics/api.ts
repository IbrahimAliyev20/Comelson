import { get } from '@/lib/api'
import { ApiResponse, StatisticsResponse } from '@/types/types'

const getStatistics = async (locale: string) => {
  const response = await get<ApiResponse<StatisticsResponse[]>>('/statistics', {
    params: { locale }
  })
  return response
}
export { getStatistics }