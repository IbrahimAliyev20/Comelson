import { get } from '@/lib/api'
import { ApiResponse, SliderResponse } from '@/types/types'

const getSliders = async (locale: string) => {
  const response = await get<ApiResponse<SliderResponse[]>>('/sliders', {
    params: { locale }
  })
  return response
}
export { getSliders }