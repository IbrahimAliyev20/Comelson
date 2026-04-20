import { get } from '@/lib/api'
import type {
  ActivityResponse,
  ApiResponse,
  CountryResponse,
  MemberResponse,
  PaginatedApiResponse,
} from '@/types/types'

export type GetCountriesParams = {
  page?: number
  per_page?: number
}

/** GET /countries — səhifələnmiş cavab */
const getCountries = async (
  locale: string,
  params?: GetCountriesParams
) => {
  return get<PaginatedApiResponse<CountryResponse>>('/countries', {
    params: { locale, ...params },
  })
}

/** Dropdown üçün bütün ölkələr (bütün səhifələr birləşdirilir) */
const getAllCountries = async (locale: string): Promise<CountryResponse[]> => {
  const collected: CountryResponse[] = []
  let page = 1
  let lastPage = 1
  do {
    const res = await getCountries(locale, { page, per_page: 100 })
    collected.push(...res.data)
    lastPage = res.meta.last_page
    page += 1
  } while (page <= lastPage)
  return collected
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


export { getActivities, getAllCountries, getCountries, getMember, getMembers }
