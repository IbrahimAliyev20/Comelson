import { postContactForm } from './api'

export const postContactFormMutation = () => {
  return {
    mutationKey: ['contact-form'] as const,
    mutationFn: postContactForm
  }
}
