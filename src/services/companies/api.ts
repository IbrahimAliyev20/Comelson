import { del, get, postForm } from '@/lib/api'
import type {
  ApiResponse,
  CompanyResponse,
  CreateCompanyPayload,
  PaginatedApiResponse,
} from '@/types/types'

export interface GetCompaniesParams {
  page?: number
  per_page?: number
}

export interface PostCompanyVariables {
  locale: string
  body: CreateCompanyPayload
}

export interface UpdateCompanyVariables {
  locale: string
  id: number
  body: CreateCompanyPayload
}

export interface DeleteCompanyVariables {
  locale: string
  id: number
}

function buildCreateCompanyFormData(body: CreateCompanyPayload): FormData {
  const fd = new FormData()
  fd.append('name', body.name)
  fd.append('voen', body.voen)
  fd.append('category_id', String(body.category_id))
  fd.append('country_id', String(body.country_id))
  fd.append('description', body.description)
  fd.append('phone', body.phone)
  fd.append('email', body.email)
  fd.append('address', body.address)
  fd.append('website', body.website)
  fd.append('instagram', body.instagram)
  fd.append('facebook', body.facebook)
  fd.append('linkedin', body.linkedin)
  if (body.logo) {
    fd.append('logo', body.logo)
  }
  if (body.profil) {
    fd.append('profil', body.profil)
  }
  return fd
}

const getCompanies = async (locale: string, params?: GetCompaniesParams) => {
  return get<PaginatedApiResponse<CompanyResponse>>('/companies', {
    params: { locale, ...params },
  })
}

const getCompany = async (locale: string, id: number) => {
  return get<ApiResponse<CompanyResponse>>(`/companies/${id}`, {
    params: { locale },
  })
}

const postCompany = async ({ locale, body }: PostCompanyVariables) => {
  const formData = buildCreateCompanyFormData(body)
  return postForm<ApiResponse<CompanyResponse>>('/companies', formData, {
    params: { locale },
  })
}

const updateCompany = async ({ locale, id, body }: UpdateCompanyVariables) => {
  const formData = buildCreateCompanyFormData(body)
  return postForm<ApiResponse<CompanyResponse>>(`/companies/${id}`, formData, {
    params: { locale },
  })
}

const deleteCompany = async ({ locale, id }: DeleteCompanyVariables) => {
  return del<ApiResponse<null>>(`/companies/${id}`, {
    params: { locale },
  })
}

export {
  buildCreateCompanyFormData,
  deleteCompany,
  getCompanies,
  getCompany,
  postCompany,
  updateCompany,
}
