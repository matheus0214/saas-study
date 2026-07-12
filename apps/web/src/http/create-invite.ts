import type { Role } from '@saas/auth'

import { api } from './api-client'

type CreateInvitieRequest = {
  email: string
  role: Role
  org: string
}

export async function createInvite({
  email,
  role,
  org,
}: CreateInvitieRequest): Promise<void> {
  await api.post(`organizations/${org}/invities`, {
    json: {
      email,
      role,
    },
  })
}
