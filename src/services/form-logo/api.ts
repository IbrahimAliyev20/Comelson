import { get } from '@/lib/api'
import { FormLogoResponse, ApiResponse } from '@/types/types'

const getFormLogo = async (locale: string) => {
  const response = await get<ApiResponse<FormLogoResponse[]>>('/form-logo', {
    params: { locale }
  })
  return response
}
export { getFormLogo }