import { get, post } from '@/lib/api'
import { ApiResponse, ContactResponse, SocialMediaResponse } from '@/types/types'

const getContact = async (locale: string) => {
  const response = await get<ApiResponse<ContactResponse>>('/contact', {
    params: { locale }
  })
  return response
}
const getSocialMedia = async (locale: string) => {
  const response = await get<ApiResponse<SocialMediaResponse[]>>('/social-media', {
    params: { locale }
  })
  return response
}

type ContactFormPayload = {
  name: string
  email: string
  type: string
  message: string
  locale?: string
}

const postContactForm = async (payload: ContactFormPayload) => {
  const response = await post<ApiResponse<null>>('/contact-form', payload, {
    params: payload.locale ? { locale: payload.locale } : undefined
  })

  return response
}

export { getContact, getSocialMedia, postContactForm }