import { deleteTender, postTender, updateTender } from './api'

export const postTenderMutation = () =>
  ({
    mutationKey: ['tenders', 'create'] as const,
    mutationFn: postTender,
  }) as const

export const updateTenderMutation = () =>
  ({
    mutationKey: ['tenders', 'update'] as const,
    mutationFn: updateTender,
  }) as const

export const deleteTenderMutation = () =>
  ({
    mutationKey: ['tenders', 'delete'] as const,
    mutationFn: deleteTender,
  }) as const
