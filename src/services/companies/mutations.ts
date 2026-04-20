import { deleteCompany, postCompany, updateCompany } from './api'

export const postCompanyMutation = () =>
  ({
    mutationKey: ['companies', 'create'] as const,
    mutationFn: postCompany,
  }) as const

export const updateCompanyMutation = () =>
  ({
    mutationKey: ['companies', 'update'] as const,
    mutationFn: updateCompany,
  }) as const

export const deleteCompanyMutation = () =>
  ({
    mutationKey: ['companies', 'delete'] as const,
    mutationFn: deleteCompany,
  }) as const
