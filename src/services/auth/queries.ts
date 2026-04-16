import { queryOptions } from '@tanstack/react-query'

import { getProfile } from './api'
import { authKeys } from './keys'

/** GET /auth/profile — Bearer token (client `access_token` cookie) */
const getProfileQuery = () =>
  queryOptions({
    queryKey: authKeys.profile(),
    queryFn: () => getProfile(),
    staleTime: 60_000,
  })

export { getProfileQuery }
