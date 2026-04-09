import { get } from '@/lib/api'
import { SettingsResponse } from '@/types/types'

const getSettings = async (locale: string) => {
  const response = await get<SettingsResponse>('/settings', {
    params: { locale }
  })
  return response
}
export { getSettings }