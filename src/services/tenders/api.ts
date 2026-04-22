import { del, get, post } from '@/lib/api'
import type {
  ApiResponse,
  CreateTenderPayload,
  PaginatedApiResponse,
  PublicTenderDetailData,
  PublicTenderResponse,
  TenderResponse,
} from '@/types/types'

export interface GetTendersParams {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  /** API expects 0/1 */
  is_active?: 0 | 1
  /** YYYY-MM-DD */
  date_from?: string
  /** YYYY-MM-DD */
  date_to?: string
}

export interface GetAllTendersParams {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  /** API expects 0/1 */
  is_active?: 0 | 1
  /** YYYY-MM-DD */
  date_from?: string
  /** YYYY-MM-DD */
  date_to?: string
}

export interface PostTenderVariables {
  locale: string
  body: CreateTenderPayload
}

export interface UpdateTenderVariables {
  locale: string
  id: number
  body: CreateTenderPayload
}

export interface DeleteTenderVariables {
  locale: string
  id: number
}

const getTenders = async (locale: string, params?: GetTendersParams) => {
  return get<PaginatedApiResponse<TenderResponse>>('/tenders', {
    params: { locale, ...params },
  })
}

const getAllTenders = async (locale: string, params?: GetAllTendersParams) => {
  const response = await get<PaginatedApiResponse<PublicTenderResponse>>('/all-tenders', {
    params: { locale, ...params },
  })
  return response
}

const postTender = async ({ locale, body }: PostTenderVariables) => {
  return post<ApiResponse<TenderResponse>>('/tenders', body, {
    params: { locale },
  })
}

const getTender = async (locale: string, id: number) => {
  return get<ApiResponse<TenderResponse>>(`/tenders/${id}`, {
    params: { locale },
  })
}

const getPublicTender = async (locale: string, slug: string) => {
  const response = await get<ApiResponse<PublicTenderDetailData>>(`/tender/${slug}`, {
    params: { locale },
  })
  return response
}

const updateTender = async ({ locale, id, body }: UpdateTenderVariables) => {
  return post<ApiResponse<TenderResponse>>(`/tenders/${id}`, body, {
    params: { locale },
  })
}

const deleteTender = async ({ locale, id }: DeleteTenderVariables) => {
  return del<ApiResponse<null>>(`/tenders/${id}`, {
    params: { locale },
  })
}

export {
  deleteTender,
  getAllTenders,
  getPublicTender,
  getTenders,
  getTender,
  postTender,
  updateTender,
}
