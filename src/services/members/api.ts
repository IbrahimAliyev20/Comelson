import { get } from '@/lib/api'
import {  ActivityResponse, ApiResponse, CountryResponse, MemberResponse } from '@/types/types'

const getCountries = async (locale: string) => {
  const response = await get<ApiResponse<CountryResponse[]>>('/countries', {
    params: { locale }
  })
  return response
}

const getActivities = async (locale: string) => {
  const response = await get<ApiResponse<ActivityResponse[]>>('/activities', {
    params: { locale }
  })
  return response
}

const getMembers = async (locale: string, ) => {
  const response = await get<ApiResponse<MemberResponse[]>>('/members', {
    params: { locale }
  })
  return response
}

const getMember = async (locale: string, slug: string) => {
  const response = await get<ApiResponse<MemberResponse>>(`/member/${slug}`, {
    params: { locale }
  })
  return response
}


export { getCountries, getActivities, getMembers, getMember }
